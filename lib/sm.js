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
 * var session = new sm.Session();
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
 *     code: "var msg = 'Hello, World!';",
 *     beforeRun: beforeRun,
 *     afterRun: afterRun,
 *     onSuccess: onSuccess,
 *     onError: onError,
 * };
 * session.run(task);
 * // Output:
 * // { mime: { 'text/plain': 'undefined' } }
 * // 1
 *
 * task.code = "msg;";
 * session.run(task);
 * // Output:
 * // { mime: { 'text/plain': '\'Hello, World!\'' } }
 * // 2
 *
 * task.code = "console.log(msg);";
 * session.run(task);
 * process.stdout.write(session.stdout.read());
 * // Output:
 * // { mime: { 'text/plain': 'undefined' } }
 * // 3
 * // Hello, World!
 *
 * task.code = "console.warn(msg);";
 * session.run(task);
 * process.stderr.write(session.stderr.read());
 * // Output:
 * // { mime: { 'text/plain': 'undefined' } }
 * // 4
 * // Hello, World!
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
 * // }
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
 * // }
 *
 * task.action = "run";
 * task.code = "var obj = {};";
 * task.beforeRun = beforeRun;
 * task.afterRun = afterRun;
 * session.run(task);
 * // Output:
 * // { mime: { 'text/plain': 'undefined' } }
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
 * // }
 *
 * task.action = "run";
 * task.code = "$$html$$ = \"<div style='background-color:olive;width:50px;height:50px'></div>\";";
 * task.beforeRun = beforeRun;
 * task.afterRun = afterRun;
 * session.run(task);
 * // Output:
 * // { mime: { 'text/html': '<div style=\'background-color:olive;width:50px;height:50px\'></div>' } }
 * // 7
 *
 * task.action = "run";
 * task.code = "$$svg$$ = \"<svg><rect width=80 height=80 style='fill: orange;'/></svg>\";";
 * task.beforeRun = beforeRun;
 * task.afterRun = afterRun;
 * session.run(task);
 * // Output:
 * // { mime: { 'image/svg+xml': '<svg><rect width=80 height=80 style=\'fill: orange;\'/></svg>' } }
 * // 8
 *
 */
module.exports = {
    Session: Session,
};

var DEBUG = global.DEBUG || false;

var spawn = require("child_process").spawn;
var fs = require("fs");
var path = require("path");

var doc = require("./mdn.js"); // Documentation for Javascript builtins

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
     * A writeable stream that represents the session stdin
     * @member {module:stream~Writable}
     */
    this.stdin = this._server.stdin;

    /**
     * A readable stream that represents the session stdout
     * @member {module:stream~Readable}
     */
    this.stdout = this._server.stdout;

    /**
     * A readable stream that represents the session stderr
     * @member {module:stream~Readable}
     */
    this.stderr = this._server.stderr;

    /**
     * True after calling {@link module:sm~Session.kill}, otherwise false
     * @member {Boolean}
     * @private
     */
    this._killed = false;

    this._server.on("message", Session.prototype._onMessage.bind(this));
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
 *                                             the list of constructors,
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
 * @property {String}   mime."text/plain" Result in plain text
 * @property {String}   mime."text/html"  Result in HTML format
 *
 * @property            [error]           Defined only for failed "run" actions
 * @property {String}   error.ename       Error name
 * @property {String}   error.evalue      Error value
 * @property {String[]} error.traceback   Error traceback
 *
 * @property {String[]} [names]           Defined only for successful
 *                                        "getAllPropertyNames" actions. It
 *                                        contains an array with all the
 *                                        property names of the result of
 *                                        evaluating a piece of Javascript code.
 *
 * @property            [completion]      Defined only for successful calls to
 *                                        {@link module:sm~Session#complete}.
 * @property {String[]} completion.list   Array of completion possibilities
 * @property {String}   completion.code   Javascript code to be completed
 * @property {Integer}  completion.cursorPos
 *                                        Cursor position within
 *                                        `completion.code`.
 * @property {String}   completion.matchedText
 *                                        Text within `completion.code` that has
 *                                        been matched.
 * @property {Integer}  completion.cursorStart
 *                                        Position of the start of
 *                                        `completion.matchedText` within
 *                                        `completion.code`.
 * @property {Integer}  completion.cursorEnd
 *                                        Position of the end of
 *                                        `completion.matchedText` within
 *                                        `completion.code`.
 *
 * @property            [inspection]      Defined only for successful "inspect"
 *                                        actions or successful calls to {@link
 *                                        module:sm~Session#inspect}. It
 *                                        provides a description of the object
 *                                        resulting of evaluating a piece of
 *                                        Javascript code or a Javascript
 *                                        expression.
 * @property {String}   inspection.code   Javascript code to be inspected
 * @property {Integer}  inspection.cursorPos
 *                                        Cursor position within
 *                                        `inspection.code`.
 * @property {String}   inspection.matchedText
 *                                        Text within `inspection.code` that has
 *                                        been matched as an expression.
 * @property {String}   inspection.string String representation
 * @property {String}   inspection.type   Javascript type
 * @property {String[]} [inspection.constructorList]
 *                                        List of constructors (not defined for
 *                                        `null` or `undefined`).
 * @property {Integer}  [inspection.length]
 *                                        Length property
 *
 * @property            [doc]             Defined only for calls to {@link
 *                                        module:sm~inspect} that succeed to
 *                                        find documentation for a Javascript
 *                                        expression.
 * @property {String}   doc.description   Description
 * @property {String}   [doc.usage]       Usage
 * @property {String}   doc.url           Link to the documentation source
 *
 * @see {@link module:sm~Session#result}
 */

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
 * List of Javascript reserved words (ecma-262)
 * @member {RegExp}
 * @private
 */
var javascriptKeywords = [
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

/**
 * Complete a Javascript expression
 *
 * @param {String}          code       Javascript code
 * @param {Number}          cursorPos  Cursor position within `code`
 * @param {module:sm~RunCB} onSuccess  Called if no errors occurred
 * @param {module:sm~RunCB} onError    Called if an error occurred
 */
Session.prototype.complete = function(code, cursorPos, onSuccess, onError) {
    var expression = parseExpression(code, cursorPos);
    if (DEBUG) console.log("SM: COMPLETE: expression", expression);
    if (expression === null) {
        onError(this);
    }

    var task = {
        action: "getAllPropertyNames",
        code: (expression.scope === "") ? "global" : expression.scope,
        onSuccess: function(session) {
            var matchList = session.result.names;

            // append list of reserved words
            if (expression.scope === "") {
                matchList = matchList.concat(javascriptKeywords);
            }

            // filter matches
            if (expression.selector) {
                matchList = matchList.filter(function(e) {
                    return e.lastIndexOf(expression.selector, 0) === 0;
                });
            }

            // append expression.rightOp to each match
            var left = expression.scope + expression.leftOp;
            var right = expression.rightOp;
            if (left || right) {
                matchList = matchList.map(function(e) {
                    return left + e + right;
                });
            }

            // find range of text that should be replaced
            var cursorStart;
            var cursorEnd;
            if (matchList.length > 0) {
                var shortestMatch = matchList.reduce(function(p, c) {
                    return p.length <= c.length ? p : c;
                });

                cursorStart = code.indexOf(expression.matchedText);
                cursorEnd = cursorStart;
                var cl = code.length;
                var ml = shortestMatch.length;
                for (var i = 0; i < ml && cursorEnd < cl; i++, cursorEnd++) {
                    if (shortestMatch.charAt(i) !== code.charAt(cursorEnd)) {
                        break;
                    }
                }
            } else {
                cursorStart = cursorPos;
                cursorEnd = cursorPos;
            }

            // return completion results to the callback
            session.result = {
                completion: {
                    list: matchList,
                    code: code,
                    cursorPos: cursorPos,
                    matchedText: expression.matchedText,
                    cursorStart: cursorStart,
                    cursorEnd: cursorEnd,
                },
            };
            onSuccess(session);
        },
        onError: onError,
    };
    this.run(task);
};

/**
 * Inspect a Javascript expression
 *
 * @param {String}          code       Javascript code
 * @param {Number}          cursorPos  Cursor position within `code`
 * @param {module:sm~RunCB} onSuccess  Called if no errors occurred
 * @param {module:sm~RunCB} onError    Called if an error occurred
 */
Session.prototype.inspect = function(code, cursorPos, onSuccess, onError) {
    var expression = parseExpression(code, cursorPos);
    if (DEBUG) console.log("SM: INSPECT: expression:", expression);

    var documentation;

    if (!expression.scope) {
        documentation = getDocumentation(expression.matchedText);
        inspectObject.call(this);
    } else {
        inspectScope.call(this);
    }

    return;

    function inspectObject() {
        var task = {
            action: "inspect",
            code: expression.matchedText,
            onSuccess: function(session) {
                session.result.inspection.code = code;
                session.result.inspection.cursorPos = cursorPos;
                session.result.inspection.matchedText = expression.matchedText;

                if (documentation) {
                    session.result.doc = documentation;
                }

                onSuccess(session);
            },
            onError: onError,
        };
        this.run(task);
    }

    function inspectScope() {
        var task = {
            action: "inspect",
            code: expression.scope,
            onSuccess: (function(session) {
                // Find documentation by searching the chain of constructors
                var constructorList = session.result.inspection.constructorList;
                if (constructorList) {
                    for (var i in constructorList) {
                        var constructorName = constructorList[i];
                        documentation = getDocumentation(
                            constructorName +
                            ".prototype." +
                            expression.selector
                        );
                        if (documentation) {
                            break;
                        }
                    }
                }

                inspectObject.call(this);
            }).bind(this),
            onError: onError,
        };
        this.run(task);
    }
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
 * Javascript expression
 *
 * @typedef Expression
 *
 * @property {String} matchedText Matched expression, e.g. `foo["bar`
 * @property {String} scope       Scope of the matched property, e.g. `foo`
 * @property {String} leftOp      Left-hand-side selector operator, e.g. `["`
 * @property {String} selector    Stem of the property being matched, e.g. `bar`
 * @property {String} rightOp     Right-hand-side selector operator, e.g. `"]`
 *
 * @see {@link module:sm~parseExpression}
 * @private
 */

/**
 * Parse a Javascript expression
 *
 * @param {String} code       Javascript code
 * @param {Number} cursorPos  Cursor position within `code`
 *
 * @returns {module:sm~Expression}
 *
 * @todo Parse expressions with parenthesis
 * @private
 */
function parseExpression(code, cursorPos) {
    var expression = code.slice(0, cursorPos);
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
            matchedText: code.slice(expression.length, cursorPos),
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
            matchedText: code.slice(re.index, cursorPos),
            scope: scope,
            leftOp: leftOp,
            selector: selector,
            rightOp: rightOp,
        };
    } else if (!leftOp) {
        scope = "";
        return {
            matchedText: code.slice(expression.length, cursorPos),
            scope: scope,
            leftOp: leftOp,
            selector: selector,
            rightOp: rightOp,
        };
    }

    // Not implemented
    return null;
}

/**
 * Javascript documentation
 *
 * @typedef Documentation
 *
 * @property {String} description Description
 * @property {String} [usage]     Usage
 * @property {String} url         Link to documentation source
 * @private
 */

/**
 * Get Javascript documentation
 *
 * @param {String} name Javascript name
 *
 * @returns {?module:parser~Documentation}
 * @private
 */
function getDocumentation(name) {
    var builtinName = name;
    if (builtinName in doc) {
        return doc[builtinName];
    }

    builtinName = name.replace(/^[a-zA-Z]+Error./, "Error.");
    if (builtinName in doc) {
        return doc[builtinName];
    }

    builtinName = name.replace(/^[a-zA-Z]+Array./, "TypedArray.");
    if (builtinName in doc) {
        return doc[builtinName];
    }

    return null;
}
