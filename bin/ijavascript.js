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
var exec = require("child_process").exec;
var fs = require("fs");
var os = require("os");
var path = require("path");
var spawn = require("child_process").spawn;
var util = require("util");

var uuid = require("node-uuid");

var usage = [
    "IJavascript Notebook",
    "",
    "Usage:",
    "",
    "    ijs <options>",
    "",
    "The recognised options are:",
    "",
    "    --help                        show IJavascript and notebook help",
    "    --ijs-debug                   enable debug log level",
    "    --ijs-help                    show IJavascript help",
    "    --ijs-hide-undefined          do not show undefined results",
    "    --ijs-install=[local|global]  install IJavascript kernel",
    "    --ijs-install-kernel          same as --ijs-install=local",
    "                                  (for backwards-compatibility)",
    "    --ijs-protocol=version        set protocol version, e.g. 4.1",
    "    --ijs-show-undefined          show undefined results",
    "    --ijs-startup-script=path     run script on startup",
    "                                  (path can be a file or a folder)",
    "    --ijs-working-dir=path        set session working directory",
    "                                  (default = current working directory)",
    "    --version                     show IJavascript version",
    "    --versions                    show IJavascript and library versions",
    "",
    "and any other options recognised by the Jupyter notebook; run:",
    "",
    "    jupyter notebook --help",
    "",
    "for a full list.",
].join("\n");


// Setup logging helpers
var DEBUG;

var log;
var dontLog = function dontLog() {};
var doLog = function doLog() {
    process.stderr.write("IJS: ");
    console.error.apply(this, arguments);
};

if (process.env.DEBUG) {
    DEBUG = true;

    try {
        doLog = require("debug")("IJS:");
    } catch (err) {}
}

log = DEBUG ? doLog : dontLog;


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
 * @property {String}   context.flag.startup  --ijs-startup-script=path
 * @property            context.args
 * @property {String[]} context.args.kernel   Command arguments to run kernel
 * @property {String[]} context.args.frontend Command arguments to run frontend
 * @property            context.protocol
 * @property {String}   context.protocol.version      Protocol version
 * @property {Integer}  context.protocol.majorVersion Protocol major version
 * @property            context.frontend
 * @property {Error}    context.frontend.error        Frontend error
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
setJupyterInfoAsync(context, function() {
    setProtocol(context);

    installKernelAsync(context, function() {
        log("CONTEXT:", context);

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
        "jupyter",
        "notebook",
    ];

    process.argv.slice(2).forEach(function(e) {
        if (e === "--help") {
            console.log(usage);
            context.args.frontend.push(e);

        } else if (e === "--ijs-debug") {
            DEBUG = true;
            log = doLog;

            context.flag.debug = true;
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

        } else if (e === "--ijs-show-undefined") {
            context.args.kernel.push("--show-undefined");

        } else if (e.lastIndexOf("--ijs-startup-script=", 0) === 0) {
            context.flag.startup = fs.realpathSync(e.slice(21));

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

        } else if (e === "--versions") {
            console.log("ijavascript", context.packageJSON.version);
            console.log("jmp", getPackageVersion("jmp"));
            console.log("nel", getPackageVersion("nel"));
            console.log("node-uuid", getPackageVersion("node-uuid"));
            process.exit(0);

        } else {
            context.args.frontend.push(e);
        }
    });

    if (context.flag.startup) {
        context.args.kernel.push("--startup-script=" + context.flag.startup);
    }

    if (context.flag.cwd) {
        context.args.kernel.push("--session-working-dir=" + context.flag.cwd);
    }

    context.args.kernel.push("{connection_file}");
}

function getPackageVersion(packageName) {
    var packagePath = path.dirname(require.resolve(packageName));
    var packageJSON = JSON.parse(
        fs.readFileSync(path.join(packagePath, "package.json"))
    );
    return packageJSON.version;
}

function setJupyterInfoAsync(context, callback) {
    exec("jupyter --version", function(error, stdout, stderr) {
        if (error) {
            context.frontend.error = error;
            setIPythonInfoAsync(context, callback);
            return;
        }

        context.args.frontend[0] = "jupyter";
        context.frontend.version = stdout.toString().trim();
        context.frontend.majorVersion = parseInt(
            context.frontend.version.split(".")[0]
        );
        if (isNaN(context.frontend.majorVersion)) {
            console.error(
                "Error parsing Jupyter version:",
                context.version.frontend
            );
            log("CONTEXT:", context);
            process.exit(1);
        }

        if (callback) {
            callback();
        }
    });
}

function setIPythonInfoAsync(context, callback) {
    exec("ipython --version", function(error, stdout, stderr) {
        if (error) {
            if (context.frontend.error) {
                console.error("Error running `jupyter --version`");
                console.error(context.frontend.error.toString());
            }
            console.error("Error running `ipython --version`");
            console.error(error.toString());
            log("CONTEXT:", context);
            process.exit(1);
        }

        context.args.frontend[0] = "ipython";
        context.frontend.version = stdout.toString().trim();
        context.frontend.majorVersion = parseInt(
            context.frontend.version.split(".")[0]
        );
        if (isNaN(context.frontend.majorVersion)) {
            console.error(
                "Error parsing IPython version:",
                context.version.frontend
            );
            log("CONTEXT:", context);
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
        console.warn("Warning: Protocol v5+ requires Jupyter v3+");
    }
}

function installKernelAsync(context, callback) {
    if (context.frontend.majorVersion < 3) {
        if (context.flag.install) {
            console.error(
                "Error: Installation of kernel specs requires Jupyter v3+"
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
    var logoDir = path.join(context.path.images, "nodejs");
    var logo32Src = path.join(logoDir, "js-green-32x32.png");
    var logo32Dst = path.join(specDir, "logo-32x32.png");
    var logo64Src = path.join(logoDir, "js-green-64x64.png");
    var logo64Dst = path.join(specDir, "logo-64x64.png");
    copyAsync(logo32Src, logo32Dst, function() {
        copyAsync(logo64Src, logo64Dst, function() {

            // Install kernel spec
            var args = [
                context.args.frontend[0],
                "kernelspec install --replace",
                specDir,
            ];
            if (context.flag.install !== "global") {
                args.push("--user");
            }
            var cmd = args.join(" ");
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
                    log("CONTEXT:", context);
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
