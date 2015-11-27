#!/usr/bin/env node

/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2015, Nicolas Riesco and others as credited in the AUTHORS file
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 */

var DEBUG = false;

var console = require("console");
var fs = require("fs");
var path = require("path");
var util = require("util");

// Parse command arguments
var config = {
    nel: {
        cwd: process.cwd(),
    },
};

var usage = (
    "Usage: node kernel.js " +
    "[--debug] " +
    "[--hide-undefined] " +
    "[--protocol=Major[.minor[.patch]]] " +
    "[--session-working-dir=path] " +
    "[--startup-script=path] " +
    "connection_file"
);

var FLAG_DEBUG = "--debug";
var FLAG_HIDE_UNDEFINED = "--hide-undefined";
var FLAG_PROTOCOL = "--protocol=";
var FLAG_CWD = "--session-working-dir=";
var FLAG_STARTUP_SCRIPT = "--startup-script=";
try {
    process.argv.slice(2).forEach(function(arg) {
        if (arg === FLAG_DEBUG) {
            DEBUG = true;

        } else if (arg === FLAG_HIDE_UNDEFINED) {
            config.hideUndefined = true;

        } else if (arg.slice(0, FLAG_PROTOCOL.length) === FLAG_PROTOCOL) {
            config.protocolVersion = arg.slice(FLAG_PROTOCOL.length);

        } else if (arg.slice(0, FLAG_CWD.length) === FLAG_CWD) {
            config.nel.cwd = arg.slice(FLAG_CWD.length);

        } else if (
            arg.slice(0, FLAG_STARTUP_SCRIPT.length) === FLAG_STARTUP_SCRIPT) {
            config.startupScript = arg.slice(FLAG_STARTUP_SCRIPT.length);

        } else if (!config.connection) {
            config.connection = fs.readFileSync(arg);

        } else {
            throw new Error("Error: too many arguments");
        }
    });

    if (!config.connection) {
        throw new Error("Error: missing connection_file");
    }
    config.connection = JSON.parse(config.connection);

} catch (e) {
    console.error("ARGV:", process.argv);
    console.error(usage);
    throw e;
}

global.DEBUG = DEBUG;

var Session = require("nel").Session; // Javascript session
var Message = require("jmp").Message; // IPython/Jupyter protocol message
var Socket = require("jmp").Socket; // IPython/Jupyter protocol socket
var zmq = require("jmp").zmq; // ZMQ bindings

/**
 * @class
 * @classdesc Implements a Javascript kernel for IPython/Jupyter.
 * @param           config
 * @param {Object}  config.connection      Connection configuration provided by
 *                                         IPython/Jupyter.
 *
 * @param {Boolean} config.hideUndefined   Flag to hide undefined results
 *
 * @param {module:nel~Config} config.nel   Javascript session configuration.
 *
 * @param {String}  config.protocolVersion IPython/Jupyter protocol version.
 *
 * @param {String}  config.startupScript   Path to a Javascript file to be run
 *                                         on session startup. Path to a folder
 *                                         also accepted, in which case all the
 *                                         Javascript files in the folder will
 *                                         be run.
 */
function Kernel(config) {
    /**
     * Configuration provided by IPython
     * @member {Object}
     */
    this.connectionConfig = config.connection;
    var scheme = this.connectionConfig.signature_scheme.slice("hmac-".length);
    var key = this.connectionConfig.key;

    /**
     * HeartBeat socket
     * @member {module:zmq~Socket}
     */
    this.hbSocket = zmq.createSocket("rep");

    /**
     * IOPub socket
     * @member {module:jmp~Socket}
     */
    this.iopubSocket = new Socket("pub", scheme, key);

    /**
     * Shell socket
     * @member {module:jmp~Socket}
     */
    this.shellSocket = new Socket("router", scheme, key);

    /**
     * Control socket
     * @member {module:jmp~Socket}
     */
    this.controlSocket = new Socket("router", scheme, key);

    /**
     * Flag to hide undefined results
     * @member {Boolean}
     */
    this.hideUndefined = config.hideUndefined;

    /**
     * Javascript session
     * @member {module:nel~Session}
     */
    this.session = new Session(config.nel);

    /**
     * Path to a Javascript file to be run on session startup. Path to a folder
     * also accepted, in which case all the Javascript files in the folder will
     * be run.
     * @member {String}
     */
    this.startupScript = config.startupScript;

    /**
     * Number of visible execution requests
     * @member {Number}
     */
    this.executionCount = 0;

    /**
     * Last execute request (to which stdin, stdout and stderr streams are sent)
     * @member {?module:jmp~Message}
     */
    this.lastExecuteRequest = null;

    /**
     * IPython/Jupyter protocol version
     * @member {String}
     */
    this.protocolVersion = config.protocolVersion;
    var majorVersion = parseInt(this.protocolVersion.split(".")[0]);

    /**
     * Collection of message handlers that links a message type with the method
     * handling the response
     * @member {Object.<String, Function>}
     * @see {@link module:handler_v4}
     * @see {@link module:handler_v5}
     */
    this.handlers = (majorVersion <= 4) ?
        require("./handlers_v4.js") :
        require("./handlers_v5.js");

    this._bindSockets();

    this._initSession();
}

/**
 * Bind kernel sockets and hook listeners
 *
 * @private
 */
Kernel.prototype._bindSockets = function() {
    var address = "tcp://" + this.connectionConfig.ip + ":";

    this.hbSocket.bind(address + this.connectionConfig.hb_port);
    this.hbSocket.on("message", onHBMessage.bind(this));

    this.iopubSocket.bind(address + this.connectionConfig.iopub_port);

    this.shellSocket.bind(address + this.connectionConfig.shell_port);
    this.shellSocket.on("message", onShellMessage.bind(this));

    this.controlSocket.bind(address + this.connectionConfig.control_port);
    this.controlSocket.on("message", onControlMessage.bind(this));

    function onHBMessage(message) {
        this.hbSocket.send(message);
    }

    function onShellMessage(msg) {
        if (!msg.signatureOK) {
            console.error(
                "KERNEL: Bad message signature: %s", util.inspect(msg)
            );
            return;
        }

        var msg_type = msg.header.msg_type;
        if (this.handlers.hasOwnProperty(msg_type)) {
            msg.respond(this.iopubSocket, 'status', {
                execution_state: 'busy'
            });

            try {
                this.handlers[msg_type].call(this, msg);
            } catch (e) {
                console.error(
                    "KERNEL: Exception in %s handler: %s", msg_type, e.stack
                );
            }

            msg.respond(this.iopubSocket, 'status', {
                execution_state: 'idle'
            });
        } else {
            // Ignore unimplemented msg_type requests
            console.warn(
                "KERNEL: SHELL_SOCKET: Unhandled message type:", msg_type
            );
        }
    }

    function onControlMessage(msg) {
        if (!msg.signatureOK) {
            console.error(
                "KERNEL: Bad message signature: %s", util.inspect(msg)
            );
            return;
        }

        if (msg.header.msg_type === "shutdown_request") {
            this.handlers.shutdown_request.call(this, msg);
        } else {
            // Ignore unimplemented msg_type requests
            console.warn("KERNEL: CONTROL: Unhandled message type:", msg_type);
        }
    }
};

/**
 * Initialise session
 *
 * @private
 */
Kernel.prototype._initSession = function() {
    this._relayStandardStreams();
    this._runStartupScripts();
};

/**
 * Hook listeners to relay the standard streams onto the IOPub socket
 *
 * @private
 */
Kernel.prototype._relayStandardStreams = function() {
    var majorVersion = parseInt(this.protocolVersion.split(".")[0]);

    var onStdout = (majorVersion <= 4) ? onStdoutV4 : onStdoutV5;
    var onStderr = (majorVersion <= 4) ? onStderrV4 : onStderrV5;
    this.session.stdout.on("data", onStdout.bind(this));
    this.session.stderr.on("data", onStderr.bind(this));

    function onStdoutV4(data) {
        if (DEBUG) console.log("KERNEL: STDOUT: ", data.toString());

        if (this.lastExecuteRequest) {
            this.lastExecuteRequest.respond(
                this.iopubSocket,
                "stream", {
                    name: "stdout",
                    data: data.toString(),
                }
            );
        }
    }

    function onStderrV4(data) {
        if (DEBUG) console.log("KERNEL: STDERR: ", data.toString());

        if (this.lastExecuteRequest) {
            this.lastExecuteRequest.respond(
                this.iopubSocket,
                "stream", {
                    name: "stderr",
                    data: data.toString(),
                }
            );
        }
    }

    function onStdoutV5(data) {
        if (DEBUG) console.log("KERNEL: STDOUT: ", data.toString());

        if (this.lastExecuteRequest) {
            this.lastExecuteRequest.respond(
                this.iopubSocket,
                "stream", {
                    name: "stdout",
                    text: data.toString(),
                }
            );
        }
    }

    function onStderrV5(data) {
        if (DEBUG) console.log("KERNEL: STDERR: ", data.toString());

        if (this.lastExecuteRequest) {
            this.lastExecuteRequest.respond(
                this.iopubSocket,
                "stream", {
                    name: "stderr",
                    text: data.toString(),
                }
            );
        }
    }
};

/**
 * Run startup scripts
 *
 * @private
 */
Kernel.prototype._runStartupScripts = function() {
    var startupScripts;

    if (this.startupScript) {
        var stats = fs.lstatSync(this.startupScript);
        if (stats.isDirectory()) {
            var dir = this.startupScript;
            startupScripts = fs.readdirSync(dir).filter(function(filename) {
                var ext = filename.slice(filename.length - 3).toLowerCase();
                return ext === ".js";
            }).sort().map(function(filename) {
                return path.join(dir, filename);
            });

        } else if (stats.isFile()) {
            startupScripts = [this.startupScript];

        } else {
            startupScripts = [];
        }
    }

    if (DEBUG) console.log("KERNEL: STARTUP: " + startupScripts);

    startupScripts.forEach((function(script) {
        var code;

        try {
            code = fs.readFileSync(script).toString();
        } catch (e) {
            var msg = "KERNEL: STARTUP: Cannot read '" + script + "'";
            if (DEBUG) console.log(msg);
            return;
        }

        var task = {
            action: "run",
            code: code,
            onSuccess: function() {
                var msg = "KERNEL: STARTUP: '" + script + "' run successfuly";
                if (DEBUG) console.log(msg);
            },
            onError: function() {
                var msg = "KERNEL: STARTUP: '" + script + "' failed to run";
                if (DEBUG) console.log(msg);
            },
        };
        this.session.run(task);
    }).bind(this));
};

/**
 * Destroy kernel
 *
 * @param {DestroyCB} [destroyCB] Callback run after the session server has been
 *                                killed and before closing the sockets
 */
Kernel.prototype.destroy = function(destroyCB) {
    if (DEBUG) console.log("KERNEL: Being destroyed");

    // TODO(NR) Handle socket `this.stdin` once it is implemented
    this.controlSocket.removeAllListeners();
    this.shellSocket.removeAllListeners();
    this.iopubSocket.removeAllListeners();
    this.hbSocket.removeAllListeners();

    this.session.kill("SIGTERM", function(code, signal) {
        if (destroyCB) {
            destroyCB(code, signal);
        }

        this.controlSocket.close();
        this.shellSocket.close();
        this.iopubSocket.close();
        this.hbSocket.close();
    }.bind(this));
};

/**
 * @callback DestroyCB
 * @param {?Number} code   Exit code from session server if exited normally
 * @param {?String} signal Signal passed to kill the session server
 * @description Callback run after the session server has been killed and before
 * the sockets have been closed
 * @see {@link Kernel.destroy}
 */

/**
 * Restart kernel
 *
 * @param {RestartCB} [restartCB] Callback run after the session server has been
 *                                restarted
 */
Kernel.prototype.restart = function(restartCB) {
    if (DEBUG) console.log("KERNEL: Being restarted");

    this.session.restart("SIGTERM", (function() {
        this._initSession();
        if (restartCB) {
            restartCB();
        }
    }).bind(this));
};

/**
 * @callback RestartCB
 * @param {?Number} code   Exit code from session server if exited normally
 * @param {?String} signal Signal passed to kill the session server
 * @description Callback run after the session server has been restarted
 * @see {@link Kernel.restart}
 */

// Start up the kernel
var kernel = new Kernel(config);

// Interpret a SIGINT signal as a request to interrupt the kernel
process.on("SIGINT", function() {
    if (DEBUG) console.log("KERNEL: Interrupting kernel");

    // TODO(NR) Implement kernel interruption
    kernel.restart(function() {
        if (kernel.lastExecuteRequest) {
            kernel.lastExecuteRequest.respond(kernel.iopubSocket, 'status', {
                execution_state: 'idle'
            });
        }
    });
});
