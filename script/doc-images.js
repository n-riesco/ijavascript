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

var fs = require("fs");
var path = require("path");
var spawn = require("child_process").spawn;

var config = {
    sourceDir: "doc",
    targetDir: path.join("doc", "output"),
    folderName: "images",
};
config.sourcePath = path.join(config.sourceDir, config.folderName);
config.targetPath = path.join(config.targetDir, config.folderName);

if (!fs.existsSync(config.sourcePath)) {
    console.warn("Error: folder " + config.sourcePath + " doesn't exist");
    process.exit(1);
}

if (!fs.existsSync(config.targetPath)) {
    fs.mkdirSync(config.targetPath);
}

var cmd;
var args;
if (process.platform === "win32") {
    cmd = "XCOPY";
    args = [
        path.join(config.sourcePath, "*.*"),
        config.targetPath,
        "/I",
        "/E",
        "/Y",
    ];
} else {
    cmd = "cp";
    args = [
        "-r",
        config.sourcePath,
        config.targetDir,
    ];
}
spawn(cmd, args, {
    stdio: "inherit",
}).on("close", function(code) {
    if (code !== 0) {
        process.exit(code);
    }
});
