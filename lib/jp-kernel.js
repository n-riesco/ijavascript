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
module.exports = Kernel;

var console = require("console");
var fs = require("fs");
var path = require("path");

var Session = require("nel").Session; // Javascript session
var Message = require("jmp").Message; // IPython/Jupyter protocol message
var Socket = require("jmp").Socket; // IPython/Jupyter protocol socket
var zmq = require("jmp").zmq; // ZMQ bindings


// Setup logging helpers
var log;
var dontLog = function dontLog() {};
var doLog = function doLog() {
    process.stderr.write("KERNEL: ");
    console.error.apply(this, arguments);
};

if (process.env.DEBUG) {
    global.DEBUG = true;

    try {
        doLog = require("debug")("KERNEL:");
    } catch (err) {}
}

log = global.DEBUG ? doLog : dontLog;


/**
 * Kernel configuration.
 *
 * @typedef Config
 *
 * @property {object}  connection      Frontend connection file
 *
 * @property {string}  cwd             Session current working directory
 *
 * @property {boolean} debug           Enable debug mode
 *
 * @property {boolean} hideUndefined   Do not show undefined results
 *
 * @property {object}  kernelInfoReply Content of kernel_info_reply message
 *
 * @property {string}  protocolVersion Message protocol version
 *
 * @property {StartupCB}
 *                     startupCallback Callback invoked at session startup.
 *                                     This callback can be used to setup a
 *                                     session; e.g. to register a require
 *                                     extensions.
 *
 * @property {string}  startupScript   Path to a script to be run at startup.
 *                                     Path to a folder also accepted, in which
 *                                     case all the scripts in the folder will
 *                                     be run.
 *
 * @property {?module:nel~Transpiler}
 *                     transpile       If defined, this function transpiles the
 *                                     request code into Javascript that can be
 *                                     run by the Node.js session.
 */


/**
 * Callback run at session startup (this callback can be used to setup the
 * kernel session; e.g. to register a require extensions).
 *
 * @callback StartupCB
 *
 * @this Kernel
 */


/**
 * @class
 * @classdesc Implements a Javascript kernel for IPython/Jupyter.
 * @param {Config}  config  Kernel configuration
 */
function Kernel(config) {
    if (config.debug) {
        log = doLog;
        global.DEBUG = true;
    }

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
     * Content of kernel_info_reply message
     * @member {object}
     */
    this.kernelInfoReply = config.kernelInfoReply;

    /**
     * Javascript session
     * @member {module:nel~Session}
     */
    this.session = new Session({
        cwd: config.cwd,
        transpile: config.transpile,
    });

    /**
     * Callback run at session startup (this callback can be used to setup the
     * kernel session; e.g. to register a require extensions).
     * @member {StartupCB}
     */
    this.startupCallback = config.startupCallback;

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
        var msg_type = msg.header.msg_type;
        if (this.handlers.hasOwnProperty(msg_type)) {
            try {
                this.handlers[msg_type].call(this, msg);
            } catch (e) {
                console.error(
                    "KERNEL: Exception in %s handler: %s", msg_type, e.stack
                );
            }
        } else {
            // Ignore unimplemented msg_type requests
            console.warn(
                "KERNEL: SHELL_SOCKET: Unhandled message type:", msg_type
            );
        }
    }

    function onControlMessage(msg) {
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
    if (this.startupCallback) {
        this.startupCallback();
    }

    this._runStartupScripts();
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
    } else {
        startupScripts = [];
    }

    log("startupScript: " + startupScripts);

    startupScripts.forEach((function(script) {
        var code;

        try {
            code = fs.readFileSync(script).toString();
        } catch (e) {
            log("startupScript: Cannot read '" + script + "'");
            return;
        }

        this.session.execute(code, {
            onSuccess: function onSuccess() {
                log("startupScript: '" + script + "' run successfuly");
            },
            onError: function onError() {
                log("startupScript: '" + script + "' failed to run");
            }
        });
    }).bind(this));
};

/**
 * Destroy kernel
 *
 * @param {DestroyCB} [destroyCB] Callback run after the session server has been
 *                                killed and before closing the sockets
 */
Kernel.prototype.destroy = function(destroyCB) {
    log("Destroying kernel");

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
    log("Restarting kernel");

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
