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

/** @module sm
 *
 * @description Module `sm` provides a Javascript session manager. A Javascript
 * session can be used to run Javascript code within `node.js`, pass the result
 * to a callback function and even capture its `stdout` and `stderr` streams.
 *
 * @example
 *
 * // Example of usage
 * var sm = require("./sm.js");
 * var session = new Session();
 *
 * // Callback called before running the Javascript code.
 * var beforeRun = function (session) {
 *     session.executionCount++;
 * };
 * // Callback called after running the Javascript code.
 * var afterRun = function (session) {
 *     console.log(session.executionCount);
 * };
 * // Callback called only if no errors occurred.
 * var onSuccess = function (session) {
 *     console.log(session.result);
 * };
 * // Callback called only if errors occurred.
 * var onError = function (session) {
 *     console.log(session.result);
 * };
 *
 * var task = {
 *     action: "run",
 *     code: "var msg = `Hello, World!`;",
 *     beforeRun: beforeRun,
 *     afterRun: afterRun,
 *     onSuccess: onSuccess,
 *     onError: onError,
 * };
 * session.run(task);
 * // Output:
 * // { mime:
 * //    { 'text/plain': 'undefined',
 * //      'text/html': '<pre>undefined</pre>' },
 * //   stdout: null,
 * //   stderr: null }
 * // 1
 *
 * task.code = "msg;";
 * session.run(task);
 * // Output:
 * // { mime:
 * //    { 'text/plain': '\'Hello, World!\'',
 * //      'text/html': '<pre>&#39;Hello, World!&#39;</pre>' },
 * //   stdout: null,
 * //   stderr: null }
 * // 2
 *
 * task.code = "console.log(msg);";
 * session.run(task);
 * // Output:
 * // { mime:
 * //    { 'text/plain': 'undefined',
 * //      'text/html': '<pre>undefined</pre>' },
 * //   stdout: 'Hello, World!\n',
 * //   stderr: null }
 * // 3
 *
 * task.code = "console.warn(msg);";
 * session.run(task);
 * // Output:
 * // { mime:
 * //    { 'text/plain': 'undefined',
 * //      'text/html': '<pre>undefined</pre>' },
 * //   stdout: null,
 * //   stderr: 'Hello, World!\n' }
 * // 4
 *
 * task.code = "throw new Error('This is a test!');";
 * session.run(task);
 * // Output:
 * // { error:
 * //    { ename: 'Error',
 * //      evalue: 'This is a test!',
 * //      traceback:
 * //       [ 'Error: This is a test!',
 * //         '    at evalmachine.<anonymous>:1:7',
 * //         '    at run ([eval]:116:19)',
 * //         '    at onMessage ([eval]:63:41)',
 * //         '    at process.EventEmitter.emit (events.js:98:17)',
 * //         '    at handleMessage (child_process.js:318:10)',
 * //         '    at Pipe.channel.onread (child_process.js:345:11)' ] },
 * //   stdout: null,
 * //   stderr: null }
 * // 5
 *
 * task.action = "inspect";
 * task.code = "msg";
 * task.beforeRun = undefined;
 * task.afterRun = undefined;
 * session.run(task);
 * // Output:
 * // { string: 'Hello, World!',
 * //   type: 'String',
 * //   constructorList: [ 'String', 'Object' ],
 * //   length: 13,
 * //   stdout: null,
 * //   stderr: null }
 *
 * task.action = "run";
 * task.code = "var obj = {};";
 * task.beforeRun = beforeRun;
 * task.afterRun = afterRun;
 * session.run(task);
 * // Output:
 * // { mime:
 * //    { 'text/plain': 'undefined',
 * //      'text/html': '<pre>undefined</pre>' },
 * //   stdout: null,
 * //   stderr: null }
 * // 6
 *
 * task.action = "getAllPropertyNames";
 * task.code = "obj";
 * task.beforeRun = undefined;
 * task.afterRun = undefined;
 * session.run(task);
 * // Output:
 * // { names:
 * //    [ '__defineGetter__',
 * //      '__defineSetter__',
 * //      '__lookupGetter__',
 * //      '__lookupSetter__',
 * //      'constructor',
 * //      'hasOwnProperty',
 * //      'isPrototypeOf',
 * //      'propertyIsEnumerable',
 * //      'toLocaleString',
 * //      'toString',
 * //      'valueOf' ],
 * //   stdout: null,
 * //   stderr: null }
 *
 */
module.exports.Session = Session;

var DEBUG = global.DEBUG || false;

var spawn = require("child_process").spawn;
var fs = require("fs");
var path = require("path");

// File paths
var paths = {
    node: process.argv[0],
    thisFile: fs.realpathSync(module.filename),
};
paths.thisFolder = path.dirname(paths.thisFile);
paths.client = paths.thisFile;
paths.server = path.join(paths.thisFolder, "sm_server.js");

/**
 * Javascript session configuration.
 *
 * @typedef Config
 *
 * @property {String} cwd Session current working directory
 *
 * @see {@link module:sm~Session}
 */

/**
 * @class
 * @classdesc Implements a Javascript session
 * @param {module:sm~Config} [smConfig] Javascript session configuration.
 */
function Session(smConfig) {
    /**
     * Number of execution requests
     * @member {number}
     */
    this.executionCount = 0;

    /**
     * Last result
     * @member {module:sm~Result}
     */
    this.result = undefined;

    /**
     * Task currently being run (`null` if none)
     * @member {?module:sm~Task}
     * @private
     */
    this._task = null;

    /**
     * Task most recently run (`null` if none)
     * @member {?module:sm~Task}
     * @private
     */
    this._lastTask = null;

    /**
     * Queue of tasks to be run
     * @member {module:sm~Task[]}
     * @private
     */
    this._tasks = [];

    /**
     * Session configuration
     * @member {module:sm~Config}
     * @private
     */
    this._config = smConfig || {};
    this._config.stdio = ["pipe", "pipe", "pipe", "ipc"];

    /**
     * Server that runs the code requests for this session
     * @member {module:child_process~ChildProcess}
     * @private
     */
    this._server = spawn(Session._command, Session._args, this._config);

    /**
     * True after calling {@link module:sm~Session.kill}, otherwise false
     * @member {Boolean}
     * @private
     */
    this._killed = false;

    this._server.on("message", Session.prototype._onMessage.bind(this));
    this._server.stdout.on("data", Session.prototype._onStdout.bind(this));
    this._server.stderr.on("data", Session.prototype._onStderr.bind(this));
}

/**
 * Path to node executable
 * @member {String}
 * @private
 */
Session._command = paths.node;

/**
 * Arguments passed onto the node executable
 * @member {String[]}
 * @private
 */
Session._args = ["--eval", fs.readFileSync(paths.server)]; // --eval workaround

/**
 * Combination of a piece of code to be run within a session and all the
 * associated callbacks.
 *
 * @typedef Task
 *
 * @property {string}              action      Type of task:
 *                                             "run" to evaluate a piece of code
 *                                             and return the result;
 *                                             "getAllPropertyNames" to evaluate
 *                                             a piece of code and return all
 *                                             the property names of the result;
 *                                             "inspect" to inspect an object
 *                                             and return information such as
 *                                             constructor, parentConstructor,
 *                                             string representation, length...
 * @property {string}              code        Code to evaluate
 * @property {module:sm~RunCB}     [beforeRun] Called before the code
 * @property {module:sm~RunCB}     [afterRun]  Called after the code
 * @property {module:sm~RunCB}     onSuccess   Called if no errors occurred
 * @property {module:sm~RunCB}     onError     Called if an error occurred
 *
 * @see {@link module:sm~Session#run}
 */

/**
 * @callback RunCB
 * @param {module:sm~Session} session Session
 * @description Session Callback
 * @see {@link module:sm~Task}
 */

/**
 * Result of running a piece of code within a session.
 *
 * @typedef Result
 *
 * @property            [mime]            Defined only for successful "run"
 *                                        actions
 * @property {string}   mime."text/plain" Result in plain text
 * @property {string}   mime."text/html"  Result in HTML format
 * @property            [error]           Defined only for failed "run" actions
 * @property {string}   error.ename       Error name
 * @property {string}   error.evalue      Error value
 * @property {string[]} error.traceback   Error traceback
 * @property {string[]} [names]           Defined only for "getAllPropertyNames"
 *                                        actions. It contains an array with all
 *                                        the property names of the result of
 *                                        evaluating a piece of code.
 *
 * @see {@link module:sm~Session#result}
 */

/**
 * Callback to forward stdout from the session server
 *
 * @param data Stdout output
 * @private
 */
Session.prototype._onStdout = function(data) {
    if (this._lastTask) {
        this._lastTask.onStdout(data === null ? null : data.toString());
    }
};

/**
 * Callback to forward stderr from the session server
 *
 * @param data Stderr output
 * @private
 */
Session.prototype._onStderr = function(data) {
    if (this._lastTask) {
        this._lastTask.onStderr(data === null ? null : data.toString());
    }
};
/**
 * Callback to handle messages from the session server
 *
 * @param {module:sm~Result} message Result of last execution request
 * @private
 */
Session.prototype._onMessage = function(message) {
    if (DEBUG) console.log("SM: MESSAGE", message);

    this.result = message;

    if (message.hasOwnProperty("error")) {
        this._task.onError(this);
    } else {
        this._task.onSuccess(this);
    }

    if (this._task.afterRun) {
        this._task.afterRun(this);
    }

    // Are there any tasks left on the queue?
    if (this._tasks.length > 0) {
        this._runNow(this._tasks.pop());
    } else {
        this._task = null;
    }
};

/**
 * Run a task
 *
 * @param {module:sm~Task} task Task to be run
 */
Session.prototype.run = function(task) {
    if (DEBUG) console.log("SM: RUN:", task);
    if (this._killed) {
        return;
    }
    if (this._task === null) {
        this._runNow(task);
    } else {
        this._runLater(task);
    }
};

/**
 * Run a task now
 *
 * @param {module:sm~Task} task Task to be run
 * @private
 */
Session.prototype._runNow = function(task) {
    this._task = task;
    this._lastTask = task;
    if (this._task.beforeRun) {
        this._task.beforeRun(this);
    }

    this._server.send([this._task.action, this._task.code]);
};

/**
 * Run a task later
 *
 * @param {module:sm~Task} task Task to be run
 * @private
 */
Session.prototype._runLater = function(task) {
    this._tasks.push(task);
};

/**
 * Kill session
 *
 * @param {?String}             [signal="SIGTERM"] Signal passed to kill the
 *                                                 session server
 * @param {module:sm~KillCB}    [killCB]           Callback run after the
 *                                                 session server has been
 *                                                 killed
 */
Session.prototype.kill = function(signal, killCB) {
    this._killed = true;
    this._server.removeAllListeners();
    this._server.kill(signal || "SIGTERM");
    this._server.on("exit", (function(code, signal) {
        if (killCB) {
            killCB(code, signal);
        }
    }).bind(this));
};

/**
 * @callback KillCB
 * @param {?Number} code   Exit code from session server if exited normally
 * @param {?String} signal Signal passed to kill the session server
 * @description Callback run after the session server has been killed
 * @see {@link module:sm~Session#kill}
 */

/**
 * Restart session
 *
 * @param {?String}             [signal="SIGTERM"] Signal passed to kill the old
 *                                                 session
 * @param {module:sm~RestartCB} [restartCB]        Callback run after restart
 */
Session.prototype.restart = function(signal, restartCB) {
    this.kill(signal || "SIGTERM", (function(code, signal) {
        Session.call(this, this._config);
        if (restartCB) {
            restartCB(code, signal);
        }
    }).bind(this));
};

/**
 * @callback RestartCB
 * @param {?Number} code   Exit code from old session if exited normally
 * @param {?String} signal Signal passed to kill the old session
 * @description Callback run after restart
 * @see {@link module:sm~Session#restart}
 */
