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
    object_info_request: object_info_request,
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
 * @param {module:jmp~Message} request Request message
 * @this Kernel
 */
function kernel_info_request(request) {
    request.respond(
        this.shellSocket,
        "kernel_info_reply", {
            "language": "javascript",
            "language_version": nodeVersion,
            "protocol_version": protocolVersion,
        },
        protocolVersion.join(".")
    );
}

/**
 * Handler for `execute_request` messages
 *
 * @param {module:jmp~Message} request Request message
 * @this Kernel
 */
function execute_request(request) {
    // Ensure stdin, stdout and stderr streams are sent to this request
    this.lastExecuteRequest = request;

    var task = {
        action: "run",
        code: request.content.code,
        beforeRun: beforeRun.bind(this),
        afterRun: afterRun.bind(this),
        onSuccess: onSuccess.bind(this),
        onError: onError.bind(this)
    };
    this.session.run(task);

    function beforeRun(session) {
        this.executionCount++;
        request.respond(
            this.iopubSocket,
            "pyin", {
                execution_count: this.executionCount,
                code: request.content.code,
            }
        );
    }

    function afterRun(session) {}

    function onSuccess(session) {
        request.respond(
            this.shellSocket,
            "execute_reply", {
                status: "ok",
                execution_count: this.executionCount,
                payload: [], // TODO(NR) payload not implemented,
                user_variables: {}, // TODO(NR) user_variables not implemented,
                user_expressions: {}, // TODO(NR) user_expressions not implemented,
            }
        );

        if (this.hideUndefined &&
            session.result.mime["text/plain"] === "undefined") {
            return;
        }

        request.respond(
            this.iopubSocket,
            "pyout", {
                execution_count: this.executionCount,
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
                execution_count: this.executionCount,
                ename: session.result.error.ename,
                evalue: session.result.error.evalue,
                traceback: session.result.error.traceback,
            });

        request.respond(
            this.iopubSocket,
            "pyerr", {
                execution_count: this.executionCount,
                ename: session.result.error.ename,
                evalue: session.result.error.evalue,
                traceback: session.result.error.traceback,
            });
    }
}

/**
 * Handler for `complete_request` messages
 *
 * @param {module:jmp~Message} request Request message
 * @this Kernel
 */
function complete_request(request) {
    this.session.complete(
        request.content.line,
        request.content.cursor_pos,
        onSuccess.bind(this),
        onError.bind(this)
    );
    return;

    function onSuccess(session) {
        var content = {
            "matches": session.result.completion.list,
            "matched_text": session.result.completion.matchedText,
            "status": "ok",
        };
        request.respond(this.shellSocket, "complete_reply", content);
    }

    function onError(session) {
        var content = {
            "matches": [],
            "matched_text": request.content.text,
            "status": "ok",
        };
        request.respond(this.shellSocket, "complete_reply", content);
    }
}

/**
 * Handler for `object_info_request` messages
 *
 * @param {module:jmp~Message} request Request message
 * @this Kernel
 */
function object_info_request(request) {
    this.session.inspect(
        request.content.oname,
        request.content.oname.length,
        onSuccess.bind(this),
        onError.bind(this)
    );
    return;

    function onSuccess(session) {
        var content = {
            oname: request.content.oname,
            found: true,
            ismagic: false,
            isalias: false,
        };

        if (session.result.inspection) {
            content.string_name = session.result.inspection.string;

            if (session.result.inspection.list) {
                if (session.result.inspection.list.length >= 1) {
                    content.type_name = session.result.inspection.list[0];
                } else {
                    content.type_name = session.result.inspection.type;
                }

                if (session.result.inspection.list.length >= 2) {
                    content.base_name = session.result.inspection.list[1];
                }
            }

            if (session.result.inspection.length) {
                content.length = session.result.inspection.length;
            }

            content.docstring = (
                session.result.inspection.type +
                ": " +
                session.result.inspection.string
            );
        }

        if (session.result.doc) {
            content.namespace = "builtin";
            content.docstring = session.result.doc.description;
            if (session.result.doc.usage) {
                content.definition = session.result.doc.usage;
            }
        }

        request.respond(this.shellSocket, "object_info_reply", content);
    }

    function onError(session) {
        var content = {
            oname: request.content.oname,
            found: false,
        };
        request.respond(this.shellSocket, "object_info_reply", content);
    }
}

/**
 * Handler for `shutdown_request` messages
 *
 * @param {module:jmp~Message} request Request message
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
