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

var console = require("console");
var crypto = require("crypto");
var fs = require("fs");
var util = require("util");
var uuid = require("node-uuid");
var vm = require("vm");
var zmq = require("zmq");

var DEBUG = false;

var protocol_version = [4, 1];
// node_version can be left as str in protocol v5
var node_version = process.versions.node.split('.').map(function (v) {
    return parseInt(v, 10);
});

/**
 * Class to implement a javascript kernel for an ipython notebook.
 *
 * The methods defined in the [[prototype]] of this class implement the
 * response to the corresponding message in the ipython protocol.
 *
 * @constructor
 * @param {string} ipythonConfig - the configuration provided by ipython.
 * @param {string} [vmConfig] - the configuration used to create VMs.
 */
function Kernel(ipythonConfig, vmConfig) {
    this.config = ipythonConfig;
    this.vm = new VMFactory(vmConfig);
    this.hbSocket = zmq.createSocket("rep");
    this.iopubSocket = zmq.createSocket("pub");
    this.shellSocket = zmq.createSocket("router");

    function onMessage() {
        var msg = new Message(
            arguments,
            this.config.signature_scheme.slice("hmac-".length),
            this.config.key
        );

        if (!msg.signatureOK) return;

        var msg_type = msg.header.msg_type;
        var prototype = Object.getPrototypeOf(this);
        if (msg_type in prototype) {
            prototype[msg_type].call(this, msg);
        } else {
            // Ignore unimplemented msg_type requests
            console.warn("Unhandled message type:", msg_type);
        }
    }

    var address = "tcp://" + this.config.ip + ":";

    this.shellSocket.bind(address + this.config.shell_port);
    this.shellSocket.on("message", onMessage.bind(this));

    this.iopubSocket.bind(address + this.config.iopub_port);

    this.hbSocket.bind(address + this.config.hb_port);
    this.hbSocket.on("message", function(message) {
        this.hbSocket.send(message);
    });
}


/**
 * Kernel info request.
 *
 * @param {Message} request - request message
 */
Kernel.prototype.kernel_info_request = function(request) {
    request.respond(
        this.shellSocket,
        "kernel_info_reply", {
            "language": "javascript",
            "language_version": node_version,
            "protocol_version": protocol_version,
        });
};

/**
 * Execute request.
 *
 * @param {Message} request - request message
 */
Kernel.prototype.execute_request = function(request) {
    var toString = util.inspect;

    function toHtml(obj) {
        return "<pre>" + util.inspect(obj).
        replace(/&/g, '&amp;').
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;').
        replace(/"/g, '&quot;').
        replace(/'/g, '&#39;') + "</pre>";
    }

    function beforeRun(vmSession) {
        request.respond(
            this.iopubSocket,
            "pyin", {
                execution_count: vmSession.executionCount,
                code: request.content.code,
            }
        );
    }

    function afterRun(vmSession) {}

    function onSuccess(vmSession) {
        request.respond(
            this.shellSocket,
            "execute_reply", {
                status: "ok",
                execution_count: vmSession.executionCount,
                payload: [], // TODO(NR) payload not implemented,
                user_variables: {}, // TODO(NR) user_variables not implemented,
                user_expressions: {}, // TODO(NR) user_expressions not implemented,
            }
        );

        request.respond(
            this.iopubSocket,
            "pyout", {
                execution_count: vmSession.executionCount,
                data: {
                    "text/plain": toString(vmSession.output),
                    "text/html": toHtml(vmSession.output),
                },
                metadata: {},
            }
        );
    }

    function onError(vmSession) {
        request.respond(
            this.shellSocket,
            "execute_reply", {
                status: "error",
                execution_count: vmSession.executionCount,
                ename: vmSession.output.name,
                evalue: vmSession.output.message,
                traceback: vmSession.output.stack.split("\n"),
            });

        request.respond(
            this.iopubSocket,
            "pyerr", {
                execution_count: vmSession.executionCount,
                ename: vmSession.output.name,
                evalue: vmSession.output.message,
                traceback: vmSession.output.stack.split("\n"),
            });
    }

    this.vm.run(
        request.header.session,
        request.content.code,
        beforeRun.bind(this),
        afterRun.bind(this),
        onSuccess.bind(this),
        onError.bind(this)
    );
};


/**
 * Class to handle ipython messages.
 *
 * @constructor
 * @param {string} - hashing scheme
 * @param {string} - key
 * @param {argsArray} requestArguments - arguments sent by a "message" event
 */
function Message(requestArguments, scheme, key) {
    this.idents = undefined;
    this.delimiter = undefined;
    this.signature = undefined;
    this.header = undefined;
    this.parentHeader = undefined;
    this.metadata = undefined;
    this.content = undefined;
    this.blob = undefined;

    this.scheme = scheme || "sha256";
    this.key = key || "";
    this.signatureOK = undefined;

    if (requestArguments !== undefined) {
        this.request(requestArguments);
    }
}

/*
 * Receive a request.
 *
 * @param {argsArray} requestArguments - arguments sent by a "message" event
 */
Message.prototype.request = function(requestArguments) {
    var hmac = crypto.createHmac(this.scheme, this.key);
    hmac.update(requestArguments[3]);
    hmac.update(requestArguments[4]);
    hmac.update(requestArguments[5]);
    hmac.update(requestArguments[6]);
    this.signature = requestArguments[2].toString();
    this.signatureOK = (this.signature === hmac.digest("hex"));

    if (!this.signatureOK) return;

    function toString(value) {
        if (value === undefined || value === null) {
            return value;
        }
        return value.toString();
    }

    function toJSON(value) {
        if (value === undefined || value === null) {
            return value;
        }
        return JSON.parse(value.toString());
    }

    this.idents = toString(requestArguments[0]);
    this.delimiter = toString(requestArguments[1]);

    this.header = toJSON(requestArguments[3]);
    this.parentHeader = toJSON(requestArguments[4]);
    this.metadata = toString(requestArguments[5]);
    this.content = toJSON(requestArguments[6]);
    this.blob = toString(requestArguments[7]);

    if (DEBUG) console.log("REQUEST:", this);
};

/*
 * Send a response.
 *
 * @param {zmq.Socket} socket - over which the response is sent
 * @param {string} messageType - type of message as specified ipython protocol
 * @param {object} content - response content as specified by ipython protocol
 */
Message.prototype.respond = function(socket, messageType, content) {
    var idents = this.idents;
    var delimiter = this.delimiter;
    var header = JSON.stringify({
        msg_id: uuid.v4(),
        username: this.header.username,
        session: this.header.session,
        msg_type: messageType,
    });
    var parentHeader = JSON.stringify(this.header);
    var metadata = JSON.stringify({});
    content = JSON.stringify(content);

    var hmac = crypto.createHmac(this.scheme, this.key);
    hmac.update(header);
    hmac.update(parentHeader);
    hmac.update(metadata);
    hmac.update(content);
    var signature = hmac.digest("hex");

    if (DEBUG) console.log("RESPONSE:", [
        idents, // idents
        delimiter, // delimiter
        signature, // HMAC signature
        header, // header
        parentHeader, // parent header
        metadata, // metadata
        content, // content
    ]);

    socket.send([
        idents, // idents
        delimiter, // delimiter
        signature, // HMAC signature
        header, // header
        parentHeader, // parent header
        metadata, // metadata
        content, // content
    ]);
};


/**
 * Class to manage an collection of VM sessions.
 *
 * Currently, the only option recognised in the configuration dictionary is:
 * {
 *     global: (true|false) // Enable/Disable node.js global (default: false)
 * }
 *
 * @constructor
 * @param {object} [config] - Configuration dictionary
 */
function VMFactory(config) {
    this.config = config || {
        global: false
    };
    this.factory = [];
}

/**
 * Run a task.
 *
 * @param {string} session - session id
 * @param {string} code - code to run
 * @param {callback} beforeRun - callback to be run before the code
 * @param {callback} afterRun - callback to be run after the code
 * @param {callback} onSuccess - callback that handles the output
 * @param {callback} onError - callback that handles errors
 */
VMFactory.prototype.run = function(session, code, beforeRun, afterRun, onSuccess, onError) {
    if (!this.factory.hasOwnProperty(session)) {
        var context;
        if (this.config.global) {
            context = vm.createContext(global);
            require.main = undefined;
            require.cache = {};
            context.require = require;
        } else {
            context = vm.createContext();
        }
        // TODO(NR) Capture stdin, stdout and stderr

        this.factory[session] = {
            context: context,
            executionCount: 0,
            output: null,
        };
    }
    var vmSession = this.factory[session];

    vmSession.executionCount++;
    beforeRun(vmSession);

    try {
        vmSession.output = vm.runInContext(code, vmSession.context);
        onSuccess(vmSession);
    } catch (e) {
        vmSession.output = e;
        onError(vmSession);
    }

    afterRun(vmSession);
};


// Parse command arguments
var ipythonConfig;
var vmConfig = {};
process.argv.slice(2).forEach(function(arg) {
    if (arg === "--enable-global") {
        vmConfig.global = true; // Breaks the operator instanceof within the VM
    } else {
        try {
            ipythonConfig = JSON.parse(fs.readFileSync(arg));
        } catch (e) {
            console.warn("Warning: Argument '%s' skipped", arg);
        }
    }
});

if (!ipythonConfig) throw new Error("Error: Missing connection file");

// Start the kernel up
new Kernel(ipythonConfig, vmConfig);
