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
var path = require("path");
var spawn = require("child_process").spawn;
var util = require("util");

var usage = (
    "iJavascript Notebook\n" +
    "\n" +
    "Usage:\n" +
    "\n" +
    "    ijs <options>\n" +
    "\n" +
    "The recognised options are:\n" +
    "\n" +
    "    --ijs-debug             enable debug log level\n" +
    "    --ijs-help              show this help\n" +
    "    --ijs-working-dir=path  set working directory for Javascript sessions\n" +
    "                            (default = current working directory)\n" +
    "\n" +
    "and any other options recognised by the IPython notebook; run:\n" +
    "\n" +
    "    ipython notebook --help\n" +
    "\n" +
    "for a full list.\n"
);

var config = {
    nodePath: process.argv[0],
    ijsPath: fs.realpathSync(process.argv[1]),
};
config.rootPath = path.dirname(path.dirname(config.ijsPath));
config.kernelPath = path.join(config.rootPath, "lib", "kernel.js");
config.kernelArgs = [config.nodePath, config.kernelPath];
config.ipythonArgs = ["notebook"];

// Parse command arguments
process.argv.slice(2).forEach(function(e) {
    if (e.lastIndexOf("--KernelManager.kernel_cmd=", 0) === 0) {
        console.warn(util.format("Warning: Flag '%s' skipped", e));
    } else if (e.lastIndexOf("--ijs-debug", 0) === 0) {
        config.kernelArgs.push("--debug");
    } else if (e.lastIndexOf("--ijs-working-dir=", 0) === 0) {
        config.cwd = fs.realpathSync(e.slice(18));
    } else if (e.lastIndexOf("--ijs-help", 0) === 0) {
        console.warn(usage);
        process.exit(0);
    } else if (e.lastIndexOf("--ijs-", 0) === 0) {
        console.warn(util.format("Error: Unrecognised flag '%s'\n", e));
        console.warn(usage);
        process.exit(1);
    } else {
        config.ipythonArgs.push(e);
    }
});

config.cwd = config.cwd || process.cwd();

config.kernelArgs.push(config.cwd);
config.kernelArgs.push("{connection_file}");

config.ipythonArgs.push(util.format(
    "--KernelManager.kernel_cmd=['%s']",
    config.kernelArgs.join("', '")
));

// Run IPython notebook
var ipython = spawn("ipython", config.ipythonArgs, {
    stdio: "inherit"
});

// Relay SIGINT onto ipython
var signal = "SIGINT";
process.on(signal, function() {
    ipython.emit(signal);
});
