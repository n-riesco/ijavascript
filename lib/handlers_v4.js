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

module.exports = {
    kernel_info_request: kernel_info_request,
    execute_request: execute_request,
    complete_request: complete_request,
    shutdown_request: shutdown_request,
};

var DEBUG = global.DEBUG || false;

var console = require("console");

/**
 * IPython protocol version
 * @member {Array.Number}
 * @private
 */
var protocolVersion = [4, 1];

/**
 * Node.js version (can be left as string in protocol v5)
 * @member {Array.Number}
 * @private
 */
var nodeVersion = process.versions.node.split('.').map(function(v) {
    return parseInt(v, 10);
});

/**
 * Handler for `kernel_info_request` messages
 *
 * @param {module:jp~Message} request Request message
 * @this Kernel
 */
function kernel_info_request(request) {
    request.respond(
        this.shellSocket,
        "kernel_info_reply", {
            "language": "javascript",
            "language_version": nodeVersion,
            "protocol_version": protocolVersion,
        });
}

/**
 * Handler for `execute_request` messages
 *
 * @param {module:jp~Message} request Request message
 * @this Kernel
 */
function execute_request(request) {
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
    this.sm.run(task);
}

/**
 * RegExp for whitespace
 * @member {RegExp}
 * @private
 */
var whitespaceRE = /\s/;

/**
 * RegExp for a simple identifier in Javascript
 * @member {RegExp}
 * @private
 */
var simpleIdentifierRE = /[_$a-zA-Z][_$a-zA-Z0-9]*$/;

/**
 * RegExp for a complex identifier in Javascript
 * @member {RegExp}
 * @private
 */
var complexIdentifierRE = /[_$a-zA-Z][_$a-zA-Z0-9]*(?:[_$a-zA-Z][_$a-zA-Z0-9]*|\.[_$a-zA-Z][_$a-zA-Z0-9]*|\[".*"\]|\['.*'\])*$/;

/**
 * Handler for `complete_request` messages
 *
 * @param {module:jp~Message} request Request message
 * @this Kernel
 */
function complete_request(request) {
    /**
     * Parse a Javascript expression
     *
     * @param {String} line       Javascript code
     * @param {Number} cursorPos  Cursor position within `line`
     *
     * @returns          expression             Parsed expression
     * @returns {String} expression.matchedText Matched expression, e.g.
     *                                          `foo["bar`
     * @returns {String} expression.scope       Scope of the property being
     *                                          matched, e.g. `foo`
     * @returns {String} expression.leftOp      Left-hand-side selector
     *                                          operator, e.g. `["`
     * @returns {String} expression.selector    Stem of the property being
     *                                          matched, e.g. `bar`
     * @returns {String} expression.rightOp     Right-hand-side selector
     *                                          operator, e.g. `"]`
     *
     * @todo Parse expressions with parenthesis
     */
    function parseExpression(line, cursorPos) {
        var expression = line.slice(0, cursorPos);
        if (!expression ||
            whitespaceRE.test(expression[expression.length - 1])) {
            return {
                matchedText: "",
                scope: "",
                leftOp: "",
                selector: "",
                rightOp: "",
            };
        }

        var selector;
        var re = simpleIdentifierRE.exec(expression);
        if (re === null) {
            selector = "";
        } else {
            selector = re[0];
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
                matchedText: line.slice(expression.length, cursorPos),
                scope: "",
                leftOp: "",
                selector: selector,
                rightOp: "",
            };
        }

        var scope;
        re = complexIdentifierRE.exec(expression);
        if (re) {
            scope = re[0];
            return {
                matchedText: line.slice(re.index, cursorPos),
                scope: scope,
                leftOp: leftOp,
                selector: selector,
                rightOp: rightOp,
            };
        } else if (!leftOp) {
            scope = "";
            return {
                matchedText: line.slice(expression.length, cursorPos),
                scope: scope,
                leftOp: leftOp,
                selector: selector,
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
    if (DEBUG) console.log("KERNEL: COMPLETE: expression", expression);

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
    this.sm.run(task);
    return;

    function onSuccess(matches) {
        // filter matches
        if (expression.selector) {
            matches = matches.filter(function(elt) {
                return elt.lastIndexOf(expression.selector, 0) === 0;
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
            matched_text: expression.matchedText,
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
}

/**
 * Handler for `shutdown_request` messages
 *
 * @param {module:jp~Message} request Request message
 * @this Kernel
 */
function shutdown_request(request) {
    function respond(code, signal) {
        request.respond(
            this.controlSocket, "shutdown_reply", request.content
        );
    }

    if (request.content.restart) {
        this.restart(respond.bind(this));
    } else {
        this.destroy(respond.bind(this));
    }
}
