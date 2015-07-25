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
var exec = require("child_process").exec;
var fs = require("fs");
var os = require("os");
var path = require("path");
var spawn = require("child_process").spawn;
var util = require("util");

var usage = (
    "IJavascript Notebook\n" +
    "\n" +
    "Usage:\n" +
    "\n" +
    "    ijs <options>\n" +
    "\n" +
    "The recognised options are:\n" +
    "\n" +
    "    --ijs-debug                   enable debug log level\n" +
    "    --ijs-help                    show this help\n" +
    "    --ijs-install=[local|global]  install IJavascript kernel\n" +
    "    --ijs-install-kernel          same as --ijs-install=local\n" +
    "                                  (for backwards-compatibility)\n" +
    "    --ijs-working-dir=path  set Javascript session working directory\n" +
    "                            (default = current working directory)\n" +
    "    --version               show IJavascript version\n" +
    "\n" +
    "and any other options recognised by the IPython notebook; run:\n" +
    "\n" +
    "    ipython notebook --help\n" +
    "\n" +
    "for a full list.\n"
);

/**
 * @typedef Context
 *
 * @property            context
 * @property {Object}   context.packageJSON   Contents of npm package.json
 * @property            context.args
 * @property {String[]} context.args.kernel   Command arguments to run kernel
 * @property {String[]} context.args.ipython  Command arguments to run IPython
 * @property            context.flag
 * @property {Boolean}  context.flag.debug         --ijs-debug
 * @property {String}   [context.flag.install]     --ijs-install=[local|global]
 * @property {String}   [context.flag.cwd]         --ijs-working-dir=path
 * @property            context.path
 * @property {String}   context.path.node     Path to Node.js shell
 * @property {String}   context.path.root     Path to IJavascript root folder
 * @property {String}   context.path.kernel   Path to IJavascript kernel
 * @property {String}   context.path.specDir  Path to kernel spec folder
 * @property {String}   context.path.specFile Path to kernel spec file
 * @property            context.version
 * @property {String}   context.version.ijs      IJavascript version
 * @property {String}   context.version.ipython  IPython version
 * @property {String}   context.version.protocol Jupyter protocol version
 */

/**
 * Script context
 * @type Context
 */
var context = initContext();

parseCommandArgs(context);

// Determine IPython version and start the IPython notebook accordingly
exec("ipython --version", function(error, stdout, stderr) {
    if (error) {
        console.error("Error running `ipython --version`");
        console.error(error.toString());
        if (stderr) console.error(stderr.toString());
        if (DEBUG) console.log("CONTEXT:", context);
        process.exit(1);
    }

    context.version.ipython = stdout.toString().trim();

    var major = parseInt(context.version.ipython.split(".")[0]);
    if (isNaN(major)) {
        console.error(
            "Error parsing IPython version:",
            context.version.ipython
        );
        if (DEBUG) console.log("CONTEXT:", context);
        process.exit(1);
    }

    if (major < 3) {
        if (context.flag.install) {
            console.error(util.format(
                "Error: IPython v%s cannot install kernel specs",
                context.version.ipython
            ));
            if (DEBUG) console.log("CONTEXT:", context);
            process.exit(1);
        }

        context.args.kernel.push(
            "--protocol=" + (context.version.protocol || "4.1")
        );
        context.args.ipython.push(util.format(
            "--KernelManager.kernel_cmd=['%s']",
            context.args.kernel.join("', '")
        ));

        spawnIPython(context);

    } else {
        context.args.kernel.push(
            "--protocol=" + (context.version.protocol || "5.0")
        );

        registerSpecAndSpawnIPython(context);
    }
});

function initContext() {
    var context = {
        path: {
            node: process.argv[0],
            root: path.dirname(path.dirname(fs.realpathSync(process.argv[1]))),
        },
    };

    context.path.kernel = path.join(context.path.root, "lib", "kernel.js");
    context.path.specDir = path.join(context.path.root, "spec", "javascript");
    context.path.specFile = path.join(context.path.specDir, "kernel.json");

    context.packageJSON = JSON.parse(
        fs.readFileSync(path.join(context.path.root, "package.json"))
    );

    context.version = {
        ijs: context.packageJSON.version,
    };

    return context;
}

function parseCommandArgs(context) {
    context.args = {
        kernel: [
            context.path.node,
            context.path.kernel,
        ],
        ipython: [
            "ipython",
            "notebook",
        ],
    };

    context.flag = {};
    process.argv.slice(2).forEach(function(e) {
        if (e === "--ijs-debug") {
            context.flag.debug = DEBUG = true;
            context.args.kernel.push("--debug");

        } else if (e === "--ijs-help") {
            console.log(usage);
            process.exit(0);

        } else if (e.lastIndexOf("--ijs-install=", 0) === 0) {
            context.flag.install = e.slice(14);
            if (context.flag.install !== "local" &&
                context.flag.install !== "global") {
                console.error(
                    util.format("Error: Unknown flag option '%s'\n", e)
                );
                console.error(usage);
                process.exit(1);
            }

        } else if (e === "--ijs-install-kernel") {
            context.flag.install = "local";

        } else if (e.lastIndexOf("--ijs-working-dir=", 0) === 0) {
            context.flag.cwd = fs.realpathSync(e.slice(18));

        } else if (e.lastIndexOf("--ijs-", 0) === 0) {
            console.error(util.format("Error: Unknown flag '%s'\n", e));
            console.error(usage);
            process.exit(1);

        } else if (e.lastIndexOf("--KernelManager.kernel_cmd=", 0) === 0) {
            console.warn(util.format("Warning: Flag '%s' skipped", e));

        } else if (e === "--version") {
            console.log(context.packageJSON.version);
            process.exit(0);

        } else {
            context.args.ipython.push(e);
        }
    });

    if (context.flag.cwd) {
        context.args.kernel.push("--session-working-dir=" + context.flag.cwd);
    }
    context.args.kernel.push("{connection_file}");
}

function registerSpecAndSpawnIPython(context) {
    // Create a spec file for the IJavascript kernel
    var spec = {
        argv: context.args.kernel,
        display_name: "Javascript (Node.js)",
        language: "javascript",
    };
    fs.writeFileSync(context.path.specFile, JSON.stringify(spec));

    // Register spec folder
    var cmd = "ipython kernelspec install --replace " + context.path.specDir;
    if (context.flag.install !== "global") {
        cmd += "  --user";
    }
    exec(cmd, function(error, stdout, stderr) {
        if (error) {
            console.error(util.format(
                "Error running `%s`", cmd
            ));
            console.error(error.toString());
            if (stderr) console.error(stderr.toString());
            if (DEBUG) console.log("CONTEXT:", context);
            process.exit(1);
        }

        spawnIPython(context);
    });
}

function spawnIPython(context) {
    if (DEBUG) console.log("CONTEXT:", context);

    if (context.flag.install) {
        return;
    }

    var cmd = context.args.ipython[0];
    var args = context.args.ipython.slice(1);
    var ipython = spawn(cmd, args, {
        stdio: "inherit"
    });

    // Relay SIGINT onto ipython
    process.on("SIGINT", function() {
        ipython.emit(signal);
    });
}
