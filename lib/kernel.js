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
var zmq = require("zmq");

var sm = require("./sm.js"); // Javascript sessions
var Message = require("./jp.js").Message; // IPython/Jupyter protocol

/**
 * @class
 * @classdesc Implements a Javascript kernel for an IPython notebook.
 * @param {Object} ipythonConfig Configuration provided by IPython.
 * @param {module:sm~Config} smConfig Javascript session configuration.
 */
function Kernel(ipythonConfig, smConfig) {
    /**
     * Configuration provided by IPython
     * @member {Object}
     */
    this.config = ipythonConfig;

    /**
     * HeartBeat socket
     * @member {module:zmq~Socket}
     */
    this.hbSocket = zmq.createSocket("rep");

    /**
     * IOPub socket
     * @member {module:zmq~Socket}
     */
    this.iopubSocket = zmq.createSocket("pub");

    /**
     * Shell socket
     * @member {module:zmq~Socket}
     */
    this.shellSocket = zmq.createSocket("router");

    /**
     * Control socket
     * @member {module:zmq~Socket}
     */
    this.controlSocket = zmq.createSocket("router");

    /**
     * Javascript session
     * @member {module:sm~Session}
     */
    this.sm = new sm.Session(smConfig);

    /**
     * Collection of message handlers that links a message type with the method
     * handling the response
     * @member {Object.<String, Function>}
     * @see {@link module:handler_v4}
     */
    this.handlers = require("./handlers_v4.js");

    var address = "tcp://" + this.config.ip + ":";

    this.hbSocket.bind(address + this.config.hb_port);
    this.hbSocket.on("message", onHBMessage.bind(this));

    this.iopubSocket.bind(address + this.config.iopub_port);

    this.shellSocket.bind(address + this.config.shell_port);
    this.shellSocket.on("message", onShellMessage.bind(this));

    this.controlSocket.bind(address + this.config.control_port);
    this.controlSocket.on("message", onControlMessage.bind(this));

    function onShellMessage() {
        var msg = new Message(
            arguments,
            this.config.signature_scheme.slice("hmac-".length),
            this.config.key
        );

        if (!msg.signatureOK) return;

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

    function onControlMessage() {
        var msg = new Message(
            arguments,
            this.config.signature_scheme.slice("hmac-".length),
            this.config.key
        );

        if (!msg.signatureOK) return;

        if (msg.header.msg_type === "shutdown_request") {
            this.handlers.shutdown_request.call(this, msg);
        } else {
            // Ignore unimplemented msg_type requests
            console.warn("KERNEL: CONTROL: Unhandled message type:", msg_type);
        }
    }

    function onHBMessage(message) {
        this.hbSocket.send(message);
    }
}

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

    this.sm.kill("SIGTERM", function(code, signal) {
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

    this.sm.restart("SIGTERM", restartCB);
};

/**
 * @callback RestartCB
 * @param {?Number} code   Exit code from session server if exited normally
 * @param {?String} signal Signal passed to kill the session server
 * @description Callback run after the session server has been restarted
 * @see {@link Kernel.restart}
 */

// Parse command arguments
if (process.argv.length !== 4) {
    console.warn(
        "Usage: node kernel.js session_working_directory connection_file"
    );
    throw new Error("Error: Wrong number of arguments");
}

var smConfig = {
    cwd: process.argv[2],
};

var ipythonConfig = JSON.parse(fs.readFileSync(process.argv[3]));

// Start up the kernel
var kernel = new Kernel(ipythonConfig, smConfig);

// Interpret a SIGINT signal as a request to interrupt the kernel
process.on("SIGINT", function() {
    if (DEBUG) console.log("KERNEL: Interrupting kernel");

    // TODO(NR) Implement kernel interruption
    kernel.restart();
});
