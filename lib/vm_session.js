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

module.exports = VMSession;

var DEBUG = false;

var spawn = require("child_process").spawn;
var fs = require("fs");
var path = require("path");

var paths = {
    node: process.argv[0],
    thisFile: fs.realpathSync(process.argv[1]),
};
paths.thisFolder = path.dirname(paths.thisFile);
paths.client = paths.thisFile;
paths.server = path.join(paths.thisFolder, "vm_server.js");

// arguments for spawn
var command = paths.node;
var args = ["--eval", fs.readFileSync(paths.server)]; // --eval workaround
var options = {
    cwd: process.env.HOME || process.env.USERPROFILE,
    stdio: [process.stdin, process.stdout, process.stderr, "ipc"],
};

/**
 * Class to handle a VM session that defines global.
 *
 * @constructor
 */
function VMSession() {
    this.session = spawn(command, args, options);
    this.task = null; // task currently being run (null if none) 
    this.tasks = []; // queue of tasks to be run
    this.executionCount = 0;
    this.result = null; // result of current task

    this.session.on("message", VMSession.prototype._onMessage.bind(this));
}

/**
 * Handle message from VM session server
 *
 * @param {object} message - result of last execution request
 */
VMSession.prototype._onMessage = function(message) {
    if (DEBUG) console.log("VM: _onMessage", message);

    this.result = message;

    if (message.hasOwnProperty("error")) {
        this.task.onError(this);
    } else {
        this.task.onSuccess(this);
    }

    this.task.afterRun(this);

    // Are there any tasks left on the queue?
    if (this.tasks.length > 0) {
        this._runNow(this.tasks.pop());
    } else {
        this.task = null;
    }
};

/**
 * Run a task.
 *
 * @param {string} code - code to run in this VM session
 * @param {callback} beforeRun - callback to be run before the code
 * @param {callback} afterRun - callback to be run after the code
 * @param {callback} onSuccess - callback that handles the output
 * @param {callback} onError - callback that handles errors
 */
VMSession.prototype.run = function(code, beforeRun, afterRun, onSuccess, onError) {
    var task = {
        code: code,
        beforeRun: beforeRun,
        afterRun: afterRun,
        onSuccess: onSuccess,
        onError: onError
    };

    if (this.task === null) {
        this._runNow(task);
    } else {
        this._runLater(task);
    }
};

/**
 * Run a task now.
 *
 * @param task - task to run
 * @param {string} task.code - code to run in this VM session
 * @param {callback} task.beforeRun - callback to be run before the code
 * @param {callback} task.afterRun - callback to be run after the code
 * @param {callback} task.onSuccess - callback that handles the output
 * @param {callback} task.onError - callback that handles errors
 */
VMSession.prototype._runNow = function(task) {
    this.task = task;
    this.executionCount++;
    this.task.beforeRun(this);
    this.session.send(this.task.code);
};

/**
 * Run a task later.
 *
 * @param task - task to run
 * @param {string} task.code - code to run in this VM session
 * @param {callback} task.beforeRun - callback to be run before the code
 * @param {callback} task.afterRun - callback to be run after the code
 * @param {callback} task.onSuccess - callback that handles the output
 * @param {callback} task.onError - callback that handles errors
 */
VMSession.prototype._runLater = function(task) {
    this.tasks.push(task);
};
