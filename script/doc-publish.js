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
var fs = require("fs");
var spawn = require("child_process").spawn;

var usage = (
    "Publish gh-pages\n" +
    "\n" +
    "Usage:\n" +
    "\n" +
    "    gh-pages <folder> <repository>\n" +
    "\n" +
    "    To commit <folder> to the gh-pages branch in <repository>\n" +
    "\n" +
    "Example:\n" +
    "\n" +
    "    gh-pages doc/output https://github.com/n-riesco/ijavascript\n" +
    "\n"
);

// Parse command arguments
if (process.argv.length != 4) {
    console.warn(usage);
    process.exit(1);
}

var config = {
    cwdPath: process.cwd(),
    nodePath: process.argv[0],
    cmdPath: process.argv[1],
    folder: process.argv[2],
    repository: process.argv[3],
};

// Set working directory
try {
    process.chdir(config.folder);
} catch (e) {
    console.warn("Error: couldn't access folder " + config.folder);
    process.exit(1);
}

// Run git script
var scriptGitInit = [
    ["git", "init"],
    ["git", "remote", "add", "origin", config.repository],
    ["git", "pull", "origin", "gh-pages:master"],
    ["git", "branch", "-m", "master", "gh-pages"],
    ["git", "branch", "-u", "origin/gh-pages"],
];
var scriptGitUpdate = [
    ["git", "add", "."],
    ["git", "commit", "-m", "Update"],
    ["git", "push"],
];
var script = fs.existsSync(".git") ?
    scriptGitUpdate :
    scriptGitInit.concat(scriptGitUpdate);

var counter = 0;

function scripter() {
    if (counter >= script.length) {
        return;
    }

    var scriptLine = script[counter++];

    var command = scriptLine[0];
    var args = scriptLine.slice(1);

    spawn(command, args, {
        stdio: "inherit"
    }).on("close", function(code) {
        if (code !== 0) {
            process.exit(code);
        }
        scripter();
    });
}

scripter();
