/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2017, Nicolas Riesco and others as credited in the AUTHORS file
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
var crypto = require("crypto");
var exec = require("child_process").exec;
var fs = require("fs");
var os = require("os");
var path = require("path");
var spawn = require("child_process").spawn;
var util = require("util");


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
 * @property {Boolean}  context.flag.debug          --debug
 * @property {Boolean}  context.flag.hideUndefined  --[hide|show]-undefined
 * @property {String}   context.flag.install        --install=[local|global]
 * @property {String}   context.flag.specPath       --spec-path=[none|full]
 * @property {String}   context.flag.startup        --startup-script=path
 * @property {String}   context.flag.cwd            --working-dir=path
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

function getPackageVersion(packageName) {
    var packagePath = path.dirname(require.resolve(packageName));
    var packageJSON = JSON.parse(
        fs.readFileSync(path.join(packagePath, "package.json"))
    );
    return packageJSON.version;
}

var FLAGS = [{
    excludeIfInstaller: true,
    flag: "help",
    description: "show IJavascript and Jupyter/IPython help",
    parse: function(context, arg) {
        context.args.frontend.push(arg);
    },
    showUsage: true,
}, {
    flag: "version",
    description: "show IJavascript version",
    parse: function(context, arg) {
        console.log(context.packageJSON.version);
    },
    exit: true,
}, {
    flag: "versions",
    description: "show IJavascript and library versions",
    parse: function(context, arg) {
        console.log("ijavascript", context.packageJSON.version);
        console.log("jmp", getPackageVersion("jmp"));
        console.log("jp-kernel", getPackageVersion("jp-kernel"));
        console.log("nel", getPackageVersion("nel"));
        console.log("uuid", getPackageVersion("uuid"));
        console.log("zeromq", getPackageVersion("zeromq"));
    },
    exit: true,
}, {
    prefixedFlag: "debug",
    description: "enable debug log level",
    parse: function(context, arg) {
        DEBUG = true;
        log = doLog;

        context.flag.debug = true;
        context.args.kernel.push(arg);
    },
}, {
    prefixedFlag: "help",
    description: "show IJavascript help",
    parse: function(context, arg) {
    },
    showUsage: true,
    exit: true,
}, {
    prefixedFlag: "hide-execution-result",
    description: "do not show execution results",
    parse: function(context, arg) {
        context.flag.hideExecutionResult = true;
        context.args.kernel.push("--hide-execution-result");
    },
}, {
    prefixedFlag: "hide-undefined",
    description: "do not show undefined results",
    parse: function(context, arg) {
        context.flag.hideUndefined = true;
        context.args.kernel.push("--hide-undefined");
    },
}, {
    prefixedFlag: "install=[local|global]",
    description: "install IJavascript kernel",
    parse: function(context, arg) {
        context.flag.install = getValue(arg);
        if (context.flag.install !== "local" &&
            context.flag.install !== "global") {
            throw new Error(
                util.format("Unknown flag option '%s'\n", arg)
            );
        }
    },
}, {
    deprecated: true,
    prefixedFlag: "install-kernel",
    description:
    "same as --PREFIX-install=local (for backwards-compatibility)",
    parse: function(context, arg) {
        context.flag.install = "local";
    },
}, {
    prefixedFlag: "protocol=version",
    description: "set protocol version, e.g. 4.1",
    parse: function(context, arg) {
        context.protocol.version = getValue(arg);
        context.protocol.majorVersion = parseInt(
            context.protocol.version.split(".", 1)[0]
        );
    },
}, {
    prefixedFlag: "show-undefined",
    description: "show undefined results",
    parse: function(context, arg) {
        context.flag.hideUndefined = false;
        context.args.kernel.push("--show-undefined");
    },
}, {
    prefixedFlag: "spec-path=[none|full]",
    description: "set whether kernel spec uses full paths",
    parse: function(context, arg) {
        context.flag.specPath = getValue(arg);
        if (context.flag.specPath !== "none" &&
            context.flag.specPath !== "full") {
            throw new Error(
                util.format("Unknown flag option '%s'\n", arg)
            );
        }
    },
}, {
    prefixedFlag: "startup-script=path",
    description: "run script on startup (path can be a file or a folder)",
    parse: function(context, arg) {
        context.flag.startup = fs.realpathSync(getValue(arg));
        context.args.kernel.push(
            "--startup-script=" + context.flag.startup
        );
    },
}, {
    prefixedFlag: "working-dir=path",
    description:
    "set session working directory (default = current working directory)",
    parse: function(context, arg) {
        context.flag.cwd = fs.realpathSync(getValue(arg));
        context.args.kernel.push(
            "--session-working-dir=" + context.flag.cwd
        );
    },
}];

function parseCommandArgs(context, options) {
    var flagPrefix = options.flagPrefix || "";

    context.args.kernel = [];
    context.args.frontend = [
        "jupyter",
        "notebook",
    ];

    /* eslint-disable complexity */
    process.argv.slice(2).forEach(function(arg) {
        var matched = false;

        for (var i = 0; i < FLAGS.length; i++) {
            var flagDefinition =  FLAGS[i];

            if (flagDefinition.deprecated && !options.includeDeprecated) {
                continue;
            }

            if (flagDefinition.excludeIfInstaller && options.installer) {
                continue;
            }

            var fullFlag = getFullFlag(flagDefinition, options);
            var flag = getFlag(fullFlag);
            var value = getValue(fullFlag);

            // if arg doesn't match flag definition, continue iterating
            if (value) {
                if (arg.lastIndexOf(flag, 0) !== 0) continue;
            } else {
                if (arg !== flag) continue;
            }

            matched = true;
            flagDefinition.parse(context, arg);
            if (flagDefinition.showUsage) showUsage(options);
            if (flagDefinition.exit) process.exit(0);
            break;
        }

        if (matched) {
            return;

        } else if (options.installer) {
            throw new Error(util.format("Unknown flag '%s'\n", arg));

        } else if (arg.lastIndexOf("--" + flagPrefix + "-", 0) === 0) {
            throw new Error(util.format("Unknown flag '%s'\n", arg));

        } else if (arg.lastIndexOf("--KernelManager.kernel_cmd=", 0) === 0) {
            console.warn(util.format("Warning: Flag '%s' skipped", arg));

        } else {
            context.args.frontend.push(arg);
        }
    });
    /* eslint-enable complexity */

    if (context.flag.specPath === "full") {
        context.args.kernel = [
            context.path.node,
            context.path.kernel,
        ].concat(context.args.kernel);
    } else {
        context.args.kernel = [
            (process.platform === "win32") ? "ijskernel.cmd" : "ijskernel",
        ].concat(context.args.kernel);
    }

    if (!context.flag.hasOwnProperty("hideUndefined")) {
        if (options.showUndefined) {
            context.args.kernel.push("--show-undefined");
        } else {
            context.args.kernel.push("--hide-undefined");
        }
    }

    context.args.kernel.push("{connection_file}");
}

function getFullFlag(flagDefinition, config) {
    return (flagDefinition.flag) ?
        "--" + flagDefinition.flag :
        (config.flagPrefix) ?
            "--" + config.flagPrefix + "-" + flagDefinition.prefixedFlag :
            "--" + flagDefinition.prefixedFlag;
}

function getFlag(arg) {
    var index = arg.indexOf("=");
    return (index === -1) ? arg : arg.slice(0, index + 1);
}

function getValue(arg) {
    var index = arg.indexOf("=");
    return (index === -1) ? "" : arg.slice(index + 1);
}

var PREFIX_RE = /PREFIX/g;

function showUsage(options) {
    var flagPrefix = options.flagPrefix || "";
    var usageHeader = options.usageHeader;
    var usageFooter = options.usageFooter;

    var usage = "";

    if (usageHeader) usage += usageHeader + "\n\n";

    usage += "The recognised options are:\n\n";

    var maxFlagLength = 0;
    var flags = [];
    for (var i = 0; i < FLAGS.length; i++) {
        var flagDefinition = FLAGS[i];

        if (flagDefinition.deprecated && !options.includeDeprecated) {
            continue;
        }

        if (flagDefinition.excludeIfInstaller && options.installer) {
            continue;
        }

        var fullFlag = getFullFlag(flagDefinition, options);

        if (fullFlag.length > maxFlagLength) {
            maxFlagLength = fullFlag.length;
        }

        var description = flagDefinition.description;
        description = description.replace(PREFIX_RE, flagPrefix);

        flags.push({
            fullFlag: fullFlag,
            description: description,
        });
    }

    flags.forEach(function(flag) {
        var fullFlag = flag.fullFlag;
        var description = flag.description;

        var indent = "    ";
        var paddingLength = maxFlagLength - fullFlag.length + 2;
        var padding = (new Array(paddingLength + 1)).join(" ");
        var line = indent + fullFlag + padding + description + "\n";

        usage += line;
    });

    if (usageFooter) usage += "\n" + usageFooter;

    console.log(usage);
}

function setJupyterInfoAsync(context, callback) {
    exec("jupyter --version", function(error, stdout, stderr) {
        if (error) {
            context.frontend.error = error;
            setIPythonInfoAsync(context, callback);
            return;
        }

        context.args.frontend[0] = "jupyter";

        var version;
        var majorVersion;

        // Parse version number before Jupyter 4.5.0
        version = stdout.toString().trim();
        majorVersion = parseInt(version.split(".")[0]);

        if (isNaN(majorVersion)) {
            // Parse version number after Jupyter 4.5.0
            var match = stdout.match(/^jupyter.core\s+: (\d+\.\d+\.\d+)/m);
            if (match) {
                version = match[1];
                majorVersion = parseInt(version.split(".")[0]);
            } else {
                // Failed to parse the output of "jupyter --version"
                console.warn(
                    "Warning: Unable to parse Jupyter version:",
                    stdout
                );
                version = "unknown";
                majorVersion = Infinity;
            }
        }

        context.frontend.version = version;
        context.frontend.majorVersion = majorVersion;

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
                context.frontend.version
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
            context.protocol.version = "5.1";
            context.protocol.majorVersion = 5;
        }
    }

    context.args.kernel.push("--protocol=" + context.protocol.version);

    if (context.frontend.majorVersion < 3) {
        context.args.frontend.push(util.format(
            "--KernelManager.kernel_cmd=['%s']",
            context.args.kernel.join("', '")
        ));
    } else if (context.args.frontend[1] === "console") {
        context.args.frontend.push("--kernel=javascript");
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
        display_name: "JavaScript (Node.js)",
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
            tmpdir = path.join(
                os.tmpdir(),
                crypto.randomBytes(16).toString("hex")
            );
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

module.exports = {
    context: context,
    copyAsync: copyAsync,
    doLog: doLog,
    dontLog: dontLog,
    installKernelAsync: installKernelAsync,
    log: log,
    makeTmpdir: makeTmpdir,
    parseCommandArgs: parseCommandArgs,
    readPackageJson: readPackageJson,
    setIPythonInfoAsync: setIPythonInfoAsync,
    setJupyterInfoAsync: setJupyterInfoAsync,
    setPaths: setPaths,
    setProtocol: setProtocol,
    spawnFrontend: spawnFrontend,
};
