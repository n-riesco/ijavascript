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
var crypto = require("crypto");
var fs = require("fs");
var util = require("util");
var uuid = require("node-uuid");
var zmq = require("zmq");

var sm = require("./sm.js");

var protocolVersion = [4, 1];
// node_version can be left as str in protocol v5
var nodeVersion = process.versions.node.split('.').map(function(v) {
    return parseInt(v, 10);
});

/**
 * @class
 * @classdesc Implements a Javascript kernel for an IPython notebook.
 *
 * The methods defined in the [[prototype]] of this class implement the
 * response to the corresponding message in the IPython protocol.
 *
 * @param {Object} ipythonConfig Configuration provided by IPython.
 */
function Kernel(ipythonConfig) {
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
     * Javascript session manager
     * @member {module:sm~Manager}
     */
    this.sm = new sm.Manager();

    /**
     * Callback listening on the Shell socket
     */
    function _onMessage() {
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
    this.shellSocket.on("message", _onMessage.bind(this));

    this.iopubSocket.bind(address + this.config.iopub_port);

    this.hbSocket.bind(address + this.config.hb_port);
    this.hbSocket.on("message", function(message) {
        this.hbSocket.send(message);
    });
}

/**
 * Kernel info request
 *
 * @param {Message} request Request message
 */
Kernel.prototype.kernel_info_request = function(request) {
    request.respond(
        this.shellSocket,
        "kernel_info_reply", {
            "language": "javascript",
            "language_version": nodeVersion,
            "protocol_version": protocolVersion,
        });
};

/**
 * Execute request
 *
 * @param {Message} request Request message
 */
Kernel.prototype.execute_request = function(request) {
    function beforeRun(session) {
        session.executionCount++;
        request.respond(
            this.iopubSocket,
            "pyin", {
                execution_count: session.executionCount,
                code: request.content.code,
            }
        );
    }

    function afterRun(session) {
        if (session.result.stdout) {
            request.respond(
                this.iopubSocket,
                "stream", {
                    name: "stdout",
                    data: session.result.stdout,
                }
            );
        }

        if (session.result.stderr) {
            request.respond(
                this.iopubSocket,
                "stream", {
                    name: "stderr",
                    data: session.result.stderr,
                }
            );
        }
    }

    function onSuccess(session) {
        request.respond(
            this.shellSocket,
            "execute_reply", {
                status: "ok",
                execution_count: session.executionCount,
                payload: [], // TODO(NR) payload not implemented,
                user_variables: {}, // TODO(NR) user_variables not implemented,
                user_expressions: {}, // TODO(NR) user_expressions not implemented,
            }
        );

        request.respond(
            this.iopubSocket,
            "pyout", {
                execution_count: session.executionCount,
                data: session.result.mime,
                metadata: {},
            }
        );
    }

    function onError(session) {
        request.respond(
            this.shellSocket,
            "execute_reply", {
                status: "error",
                execution_count: session.executionCount,
                ename: session.result.error.ename,
                evalue: session.result.error.evalue,
                traceback: session.result.error.traceback,
            });

        request.respond(
            this.iopubSocket,
            "pyerr", {
                execution_count: session.executionCount,
                ename: session.result.error.ename,
                evalue: session.result.error.evalue,
                traceback: session.result.error.traceback,
            });
    }

    var task = {
        action: "run",
        code: request.content.code,
        beforeRun: beforeRun.bind(this),
        afterRun: afterRun.bind(this),
        onSuccess: onSuccess.bind(this),
        onError: onError.bind(this)
    };
    this.sm.run(request.header.session, task);
};

/**
 * RegExp for whitespace
 * @member {RegExp}
 * @private
 */
Kernel._whitespace = /\s/;

/**
 * RegExp for a simple identifier in Javascript
 * @member {RegExp}
 * @private
 */
Kernel._simpleIdentifier = /[_$a-zA-Z][_$a-zA-Z0-9]*$/;

/**
 * RegExp for a complex identifier in Javascript
 * @member {RegExp}
 * @private
 */
Kernel._complexIdentifier = /[_$a-zA-Z][_$a-zA-Z0-9]*(?:[_$a-zA-Z][_$a-zA-Z0-9]*|\.[_$a-zA-Z][_$a-zA-Z0-9]*|\[".*"\]|\['.*'\])*$/;

/**
 * Complete request
 *
 * @param {Message} request Request message
 */
Kernel.prototype.complete_request = function(request) {
    // Split an expression into:
    //   {
    //     scope:        "foo",
    //     leftOp:       "['",
    //     property:     "bar", // text to filter matches
    //     rightOp:      "']",  // text to append to each match
    //     matched_text: "foo['bar",
    //   }
    //
    // Valid expressions:
    //   (blank line)
    //   foo
    //   foo.bar
    //   foo.["bar
    //   foo.['bar
    // also deep expressions are valid:
    //   a.b.c
    //   a["b"].c
    //   a['b'].c
    //   ...
    //
    // Notes:
    // - The current algorithm is unable to determine what the local scope is,
    //   and thus, it is excluded when building the list of matches.
    // - The current algorithm is unable to evaluate expressions with
    //   parenthesis.
    function parseExpression(line, cursor_pos) {
        var expression = line.slice(0, cursor_pos);
        if (!expression ||
            Kernel._whitespace.test(expression[expression.length - 1])) {
            return {
                matched_text: "",
                scope: "",
                leftOp: "",
                property: "",
                rightOp: "",
            };
        }

        var property;
        var re = Kernel._simpleIdentifier.exec(expression);
        if (re === null) {
            property = "";
        } else {
            property = re[0];
            expression = expression.slice(0, re.index);
        }

        var leftOp;
        var rightOp;
        if (expression[expression.length - 1] === '.') {
            leftOp = ".";
            rightOp = "";
            expression = expression.slice(0, expression.length - 1);
        } else if (
            (expression[expression.length - 2] === '[') &&
            (expression[expression.length - 1] === '"')
        ) {
            leftOp = "[\"";
            rightOp = "\"]";
            expression = expression.slice(0, expression.length - 2);
        } else if (
            (expression[expression.length - 2] === '[') &&
            (expression[expression.length - 1] === '\'')
        ) {
            leftOp = "['";
            rightOp = "']";
            expression = expression.slice(0, expression.length - 2);
        } else {
            return {
                matched_text: line.slice(expression.length, cursor_pos),
                scope: "",
                leftOp: "",
                property: property,
                rightOp: "",
            };
        }

        var scope;
        re = Kernel._complexIdentifier.exec(expression);
        if (re) {
            scope = re[0];
            return {
                matched_text: line.slice(re.index, cursor_pos),
                scope: scope,
                leftOp: leftOp,
                property: property,
                rightOp: rightOp,
            };
        } else if (!leftOp) {
            scope = "";
            return {
                matched_text: line.slice(expression.length, cursor_pos),
                scope: scope,
                leftOp: leftOp,
                property: property,
                rightOp: rightOp,
            };
        }

        // Not implemented
        return null;
    }

    // parse expression
    var expression = parseExpression(
        request.content.line,
        request.content.cursor_pos
    );
    if (DEBUG) console.log("COMPLETE: expression", expression);

    if (expression === null) {
        onError.apply(this);
        return;
    }

    // define a task to build the list of matches
    var task;
    if (expression.scope === "") {
        task = {
            action: "getAllPropertyNames",
            code: "global",
            onSuccess: (function(session) {
                // list of reserved words (ecma-262)
                var matches = [
                    // keywords
                    "break", "case", "catch", "continue", "debugger", "default",
                    "delete", "do", "else", "finally", "for", "function", "if",
                    "in", "instanceof", "new", "return", "switch", "this",
                    "throw", "try", "typeof", "var", "void", "while", "with",
                    // future reserved words
                    "class", "const", "enum", "export", "extends", "import",
                    "super",
                    // future reserved words in strict mode
                    "implements", "interface", "let", "package", "private",
                    "protected", "public", "static", "yield",
                    // null literal
                    "null",
                    // boolean literals
                    "true", "false"
                ];

                // append global properties
                matches = matches.concat(session.result.names);

                onSuccess.call(this, matches);
            }).bind(this),
            onError: onError.bind(this)
        };
    } else {
        // get instance properties
        task = {
            action: "getAllPropertyNames",
            code: expression.scope,
            onSuccess: (function(session) {
                onSuccess.call(this, session.result.names);
            }).bind(this),
            onError: onError.bind(this)
        };
    }
    this.sm.run(request.header.session, task);
    return;

    function onSuccess(matches) {
        // filter matches
        if (expression.property) {
            matches = matches.filter(function(elt) {
                return elt.lastIndexOf(expression.property, 0) === 0;
            });
        }

        // append expression.rightOp to each match
        var left = expression.scope + expression.leftOp;
        var right = expression.rightOp;
        if (left || right) {
            matches = matches.map(function(elt) {
                return left + elt + right;
            });
        }

        var content = {
            matches: matches,
            matched_text: expression.matched_text,
            status: "ok",
        };
        request.respond(this.shellSocket, "complete_reply", content);
    }

    function onError() {
        var content = {
            matches: [],
            matched_text: request.content.text,
            status: "ok",
        };
        request.respond(this.shellSocket, "complete_reply", content);
    }
};

/**
 * @class
 * @classdesc Implements an IPython message.
 *
 * @param {argsArray} [requestArguments] argsArray of the callback listening on
 * the {@link Kernel#shellSocket Shell socket}. See {@link Kernel~_onMessage}.
 * @param {string}    [scheme=sha256]    Hashing scheme
 * @param {string}    [key=""]           Hashing key
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
        this.parse(requestArguments);
    }
}

/**
 * Parse a request
 *
 * @param {argsArray} requestArguments argsArray of the callback listening on
 * the {@link Kernel#shellSocket Shell socket}. See {@link Kernel~_onMessage}.
 */
Message.prototype.parse = function(requestArguments) {
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

/**
 * Send a response
 *
 * @param {module:zmq~Socket} socket Socket over which the response is sent
 * @param {string} messageType Type of message as specified by IPython protocol
 * @param {object} content     Response content as specified by IPython protocol
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

// Parse command arguments
var ipythonConfig;
process.argv.slice(2).forEach(function(arg) {
    if (arg.lastIndexOf("-", 0) === 0) {
        console.warn("Warning: Argument '%s' skipped", arg);
    } else {
        ipythonConfig = JSON.parse(fs.readFileSync(arg));
    }
});

if (!ipythonConfig) throw new Error("Error: Missing connection file");

// Start up the kernel
new Kernel(ipythonConfig);
