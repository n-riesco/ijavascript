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

var log;
if (DEBUG) {
    var console = require("console");
    log = function log() {
        process.stderr.write("KERNEL: ");
        console.error.apply(this, arguments);
    };
} else {
    try {
        log = require("debug")("KERNEL:");
    } catch (err) {
        log = function noop() {};
    }
}

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
 * Send `status_busy` message
 *
 * @param {module:jmp~Message} request Request message
 * @this Kernel
 */
function status_busy(request) {
    request.respond(this.iopubSocket, 'status', {
        execution_state: 'busy'
    });
}

/**
 * Send for `status_idle` message
 *
 * @param {module:jmp~Message} request Request message
 * @this Kernel
 */
function status_idle(request) {
    request.respond(this.iopubSocket, 'status', {
        execution_state: 'idle'
    });
}

/**
 * Handler for `kernel_info_request` messages
 *
 * @param {module:jmp~Message} request Request message
 * @this Kernel
 */
function kernel_info_request(request) {
    status_busy.call(this, request);

    request.respond(
        this.shellSocket,
        "kernel_info_reply", {
            "language": "javascript",
            "language_version": nodeVersion,
            "protocol_version": protocolVersion,
        }, {},
        protocolVersion.join(".")
    );

    status_idle.call(this, request);
}

/**
 * Handler for `execute_request` messages
 *
 * @param {module:jmp~Message} request Request message
 * @this Kernel
 */
function execute_request(request) {
    this.session.execute(request.content.code, {
        onSuccess: onSuccess.bind(this),
        onError: onError.bind(this),
        beforeRun: beforeRun.bind(this),
        afterRun: afterRun.bind(this),
        onStdout: onStdout.bind(this),
        onStderr: onStderr.bind(this),
    });

    function beforeRun() {
        status_busy.call(this, request);

        this.executionCount++;

        request.respond(
            this.iopubSocket,
            "pyin", {
                execution_count: this.executionCount,
                code: request.content.code,
            }
        );
    }

    function afterRun() {
        status_idle.call(this, request);
    }

    function onSuccess(result) {
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

        if (!result.mime) {
            return;
        }

        if (this.hideUndefined &&
            result.mime["text/plain"] === "undefined") {
            return;
        }

        request.respond(
            this.iopubSocket,
            "pyout", {
                execution_count: this.executionCount,
                data: result.mime,
                metadata: {},
            }
        );
    }

    function onError(result) {
        request.respond(
            this.shellSocket,
            "execute_reply", {
                status: "error",
                execution_count: this.executionCount,
                ename: result.error.ename,
                evalue: result.error.evalue,
                traceback: result.error.traceback,
            }
        );

        request.respond(
            this.iopubSocket,
            "pyerr", {
                execution_count: this.executionCount,
                ename: result.error.ename,
                evalue: result.error.evalue,
                traceback: result.error.traceback,
            }
        );
    }

    function onStdout(data) {
        request.respond(
            this.iopubSocket,
            "stream", {
                name: "stdout",
                data: data,
            }
        );
    }

    function onStderr(data) {
        request.respond(
            this.iopubSocket,
            "stream", {
                name: "stderr",
                data: data,
            }
        );
    }
}

/**
 * Handler for `complete_request` messages
 *
 * @param {module:jmp~Message} request Request message
 * @this Kernel
 */
function complete_request(request) {
    this.session.complete(request.content.line, request.content.cursor_pos, {
        beforeRun: beforeRun.bind(this),
        onSuccess: onSuccess.bind(this),
        onError: onError.bind(this),
        afterRun: afterRun.bind(this),
    });
    return;

    function beforeRun() {
        status_busy.call(this, request);
    }

    function afterRun() {
        status_idle.call(this, request);
    }

    function onSuccess(result) {
        var content = {
            "matches": result.completion.list,
            "matched_text": result.completion.matchedText,
            "status": "ok",
        };
        request.respond(this.shellSocket, "complete_reply", content);
    }

    function onError(result) {
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
    this.session.inspect(request.content.oname, request.content.oname.length, {
        beforeRun: beforeRun.bind(this),
        onSuccess: onSuccess.bind(this),
        onError: onError.bind(this),
        afterRun: afterRun.bind(this),
    });
    return;

    function beforeRun() {
        status_busy.call(this, request);
    }

    function afterRun() {
        status_idle.call(this, request);
    }

    function onSuccess(result) {
        var content = {
            oname: request.content.oname,
            found: true,
            ismagic: false,
            isalias: false,
        };

        if (result.inspection) {
            content.string_name = result.inspection.string;

            if (result.inspection.list) {
                if (result.inspection.list.length >= 1) {
                    content.type_name = result.inspection.list[0];
                } else {
                    content.type_name = result.inspection.type;
                }

                if (result.inspection.list.length >= 2) {
                    content.base_name = result.inspection.list[1];
                }
            }

            if (result.inspection.length) {
                content.length = result.inspection.length;
            }

            content.docstring = (
                result.inspection.type + ": " + result.inspection.string
            );
        }

        if (result.doc) {
            content.namespace = "builtin";
            content.docstring = result.doc.description;
            if (result.doc.usage) {
                content.definition = result.doc.usage;
            }
        }

        request.respond(this.shellSocket, "object_info_reply", content);
    }

    function onError(result) {
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
    status_busy.call(this, request);

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

    status_idle.call(this, request);
}
