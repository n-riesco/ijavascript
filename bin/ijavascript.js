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

var uuid = require("node-uuid");

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
    "    --ijs-hide-undefined          do not show undefined results\n" +
    "    --ijs-install=[local|global]  install IJavascript kernel\n" +
    "    --ijs-install-kernel          same as --ijs-install=local\n" +
    "                                  (for backwards-compatibility)\n" +
    "    --ijs-protocol=version  set protocol version, e.g. 4.1\n" +
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
 * @property            context.path
 * @property {String}   context.path.node     Path to Node.js shell
 * @property {String}   context.path.root     Path to IJavascript root folder
 * @property {String}   context.path.kernel   Path to IJavascript kernel
 * @property {String}   context.path.images   Path to IJavascript images folder
 * @property {Object}   context.packageJSON   Contents of npm package.json
 * @property            context.flag
 * @property {Boolean}  context.flag.debug    --ijs-debug
 * @property {String}   context.flag.install  --ijs-install=[local|global]
 * @property {String}   context.flag.cwd      --ijs-working-dir=path
 * @property            context.args
 * @property {String[]} context.args.kernel   Command arguments to run kernel
 * @property {String[]} context.args.frontend Command arguments to run frontend
 * @property            context.protocol
 * @property {String}   context.protocol.version      Protocol version
 * @property {Integer}  context.protocol.majorVersion Protocol major version
 * @property            context.frontend
 * @property {String}   context.frontend.version      Frontend version
 * @property {Integer}  context.frontend.majorVersion Frontend major version
 */

/**
 * Script context
 * @type Context
 */
var context = {
    path: {},
    packageJSON: undefined,
    flag: {},
    args: {},
    protocol: {},
    frontend: {},
};

setPaths(context);
readPackageJson(context);
parseCommandArgs(context);
setFrontendInfoAsync(context, function() {
    setProtocol(context);

    if (DEBUG) console.log("CONTEXT:", context);

    installKernelAsync(context, function() {
        if (!context.flag.install) {
            spawnFrontend(context);
        }
    });
});

function setPaths(context) {
    context.path.node = process.argv[0];
    context.path.root = path.dirname(path.dirname(
        fs.realpathSync(process.argv[1])
    ));
    context.path.kernel = path.join(context.path.root, "lib", "kernel.js");
    context.path.images = path.join(context.path.root, "images");
}

function readPackageJson(context) {
    context.packageJSON = JSON.parse(
        fs.readFileSync(path.join(context.path.root, "package.json"))
    );
}

function parseCommandArgs(context) {
    context.args.kernel = [
        context.path.node,
        context.path.kernel,
    ];
    context.args.frontend = [
        "ipython",
        "notebook",
    ];

    process.argv.slice(2).forEach(function(e) {
        if (e === "--ijs-debug") {
            context.flag.debug = DEBUG = true;
            context.args.kernel.push("--debug");

        } else if (e === "--ijs-help") {
            console.log(usage);
            process.exit(0);

        } else if (e === "--ijs-hide-undefined") {
            context.args.kernel.push("--hide-undefined");

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

        } else if (e.lastIndexOf("--ijs-protocol=", 0) === 0) {
            context.protocol.version = e.slice(15);
            context.protocol.majorVersion = parseInt(
                context.protocol.version.split(".", 1)[0]
            );

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
            context.args.frontend.push(e);
        }
    });

    if (context.flag.cwd) {
        context.args.kernel.push("--session-working-dir=" + context.flag.cwd);
    }

    context.args.kernel.push("{connection_file}");
}

function setFrontendInfoAsync(context, callback) {
    exec("ipython --version", function(error, stdout, stderr) {
        if (error) {
            console.error("Error running `ipython --version`");
            console.error(error.toString());
            if (stderr) console.error(stderr.toString());
            if (DEBUG) console.log("CONTEXT:", context);
            process.exit(1);
        }

        context.frontend.version = stdout.toString().trim();
        context.frontend.majorVersion = parseInt(
            context.frontend.version.split(".")[0]
        );
        if (isNaN(context.frontend.majorVersion)) {
            console.error(
                "Error parsing IPython version:",
                context.version.frontend
            );
            if (DEBUG) console.log("CONTEXT:", context);
            process.exit(1);
        }

        if (callback) {
            callback();
        }
    });
}

function setProtocol(context) {
    if (!context.protocol.version) {
        if (context.frontend.majorVersion < 3) {
            context.protocol.version = "4.1";
            context.protocol.majorVersion = 4;
        } else {
            context.protocol.version = "5.0";
            context.protocol.majorVersion = 5;
        }
    }

    context.args.kernel.push("--protocol=" + context.protocol.version);

    if (context.frontend.majorVersion < 3) {
        context.args.frontend.push(util.format(
            "--KernelManager.kernel_cmd=['%s']",
            context.args.kernel.join("', '")
        ));
    }

    if (context.frontend.majorVersion < 3 &&
        context.protocol.majorVersion >= 5) {
        console.warn("Warning: Protocol v5+ requires IPython v3+");
    }
}

function installKernelAsync(context, callback) {
    if (context.frontend.majorVersion < 3) {
        if (context.flag.install) {
            console.error(
                "Error: Installation of kernel specs requires IPython v3+"
            );
        }

        if (callback) {
            callback();
        }

        return;
    }

    // Create temporary spec folder
    var tmpdir = makeTmpdir();
    var specDir = path.join(tmpdir, "javascript");
    fs.mkdirSync(specDir);

    // Create spec file
    var specFile = path.join(specDir, "kernel.json");
    var spec = {
        argv: context.args.kernel,
        display_name: "Javascript (Node.js)",
        language: "javascript",
    };
    fs.writeFileSync(specFile, JSON.stringify(spec));

    // Copy logo files
    var logo32Src = path.join(context.path.images, "logo-32x32.png");
    var logo32Dst = path.join(specDir, "logo-32x32.png");
    var logo64Src = path.join(context.path.images, "logo-64x64.png");
    var logo64Dst = path.join(specDir, "logo-64x64.png");
    copyAsync(logo32Src, logo32Dst, function() {
        copyAsync(logo64Src, logo64Dst, function() {

            // Install kernel spec
            var cmd = "ipython kernelspec install --replace " + specDir;
            if (context.flag.install !== "global") {
                cmd += "  --user";
            }
            exec(cmd, function(error, stdout, stderr) {

                // Remove temporary spec folder
                fs.unlinkSync(specFile);
                fs.unlinkSync(logo32Dst);
                fs.unlinkSync(logo64Dst);
                fs.rmdirSync(specDir);
                fs.rmdirSync(tmpdir);

                if (error) {
                    console.error(util.format("Error running `%s`", cmd));
                    console.error(error.toString());
                    if (stderr) console.error(stderr.toString());
                    if (DEBUG) console.log("CONTEXT:", context);
                    process.exit(1);
                }

                if (callback) {
                    callback();
                }
            });
        });
    });
}

function spawnFrontend(context) {
    var cmd = context.args.frontend[0];
    var args = context.args.frontend.slice(1);
    var frontend = spawn(cmd, args, {
        stdio: "inherit"
    });

    // Relay SIGINT onto the frontend
    var signal = "SIGINT";
    process.on(signal, function() {
        frontend.emit(signal);
    });
}

function makeTmpdir(maxAttempts) {
    maxAttempts = maxAttempts ? maxAttempts : 10;
    var attempts = 0;

    var tmpdir;
    while (!tmpdir) {
        attempts++;
        try {
            tmpdir = path.join(os.tmpdir(), uuid.v4());
            fs.mkdirSync(tmpdir);
        } catch (e) {
            if (attempts >= maxAttempts)
                throw e;
            tmpdir = null;
        }
    }

    return tmpdir;
}

function copyAsync(src, dst, callback) {
    var readStream = fs.createReadStream(src);
    var writeStream = fs.createWriteStream(dst);
    if (callback) {
        readStream.on("end", callback);
    }
    readStream.pipe(writeStream);
}
