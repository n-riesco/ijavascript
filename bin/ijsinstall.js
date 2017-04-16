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
var util = require("util");

var rc = require("./rc.js");
var context = rc.context;
var copyAsync = rc.copyAsync;
var doLog = rc.doLog;
var dontLog = rc.dontLog;
var getPackageVersion = rc.getPackageVersion;
var installKernelAsync = rc.installKernelAsync;
var log = rc.log;
var makeTmpdir = rc.makeTmpdir;
var readPackageJson = rc.readPackageJson;
var setIPythonInfoAsync = rc.setIPythonInfoAsync;
var setJupyterInfoAsync = rc.setJupyterInfoAsync;
var setPaths = rc.setPaths;
var setProtocol = rc.setProtocol;
var spawnFrontend = rc.spawnFrontend;
var FLAG_DEBUG = rc.FLAG_DEBUG;
var FLAG_HELP = rc.FLAG_HELP;
var FLAG_HIDE_UNDEFINED = rc.FLAG_HIDE_UNDEFINED;
var FLAG_INSTALL = rc.FLAG_INSTALL;
var FLAG_PROTOCOL = rc.FLAG_PROTOCOL;
var FLAG_SHOW_UNDEFINED = rc.FLAG_SHOW_UNDEFINED;
var FLAG_SPEC_PATH = rc.FLAG_SPEC_PATH;
var FLAG_STARTUP_SCRIPT = rc.FLAG_STARTUP_SCRIPT;
var FLAG_VERSION = rc.FLAG_VERSION;
var FLAG_VERSIONS = rc.FLAG_VERSIONS;
var FLAG_WORKING_DIR = rc.FLAG_WORKING_DIR;

var usage = [
    "IJavascript Kernel Installer",
    "",
    "Usage:",
    "",
    "    ijsinstall <options>",
    "",
    "The recognised options are:",
    "",
    "--debug                   show debug messages",
    "--help                    show this help",
    "--hide-undefined          do not show undefined results",
    "--install=[local|global]  install kernel for current user or globally",
    "--protocol=version        set messaging protocol version, e.g. 5.0",
    "--show-undefined          show undefined results",
    "--spec-path=[none|full]   set whether kernel spec uses full paths",
    "--startup-script=path     run script on kernel startup",
    "                          (path can be a file or a folder)",
    "--version                 show kernel version",
    "--versions                show kernel and library versions",
    "--working-dir=path        set kernel working directory",
    "                          (default = current working directory)",
].join("\n");

function parseCommandArgs(context) {
    var unparsedArgs = [];

    context.args.kernel = [];
    context.args.frontend = [
        "jupyter",
        "notebook",
    ];
    context.flag.install = "local";
    context.flag.hideUndefined = true;

    process.argv.slice(2).forEach(function(e) {
        if (e === FLAG_DEBUG) {
            DEBUG = true;
            log = doLog;

            context.flag.debug = true;
            context.args.kernel.push("--debug");

        } else if (e === FLAG_HELP) {
            console.log(usage);
            process.exit(0);

        } else if (e === FLAG_HIDE_UNDEFINED) {
            context.flag.hideUndefined = true;

        } else if (e.lastIndexOf(FLAG_INSTALL, 0) === 0) {
            context.flag.install = e.slice(FLAG_INSTALL.length);
            if (context.flag.install !== "local" &&
                context.flag.install !== "global") {
                console.error(
                    util.format("Error: Unknown flag option '%s'\n", e)
                );
                console.error(usage);
                process.exit(1);
            }

        } else if (e.lastIndexOf(FLAG_PROTOCOL, 0) === 0) {
            context.protocol.version = e.slice(FLAG_PROTOCOL.length);
            context.protocol.majorVersion = parseInt(
                context.protocol.version.split(".", 1)[0]
            );

        } else if (e === FLAG_SHOW_UNDEFINED) {
            context.flag.hideUndefined = false;

        } else if (e.lastIndexOf(FLAG_SPEC_PATH, 0) === 0) {
            context.flag.specPath = e.slice(FLAG_SPEC_PATH.length);
            if (context.flag.specPath !== "none" &&
                context.flag.specPath !== "full") {
                console.error(
                    util.format("Error: Unknown flag option '%s'\n", e)
                );
                console.error(usage);
                process.exit(1);
            }

        } else if (e.lastIndexOf(FLAG_STARTUP_SCRIPT, 0) === 0) {
            context.flag.startup = fs.realpathSync(
                e.slice(FLAG_STARTUP_SCRIPT.length)
            );

        } else if (e === FLAG_VERSION) {
            console.log(context.packageJSON.version);
            process.exit(0);

        } else if (e === FLAG_VERSIONS) {
            console.log("ijavascript", context.packageJSON.version);
            console.log("jmp", getPackageVersion("jmp"));
            console.log("jp-kernel", getPackageVersion("jp-kernel"));
            console.log("nel", getPackageVersion("nel"));
            console.log("uuid", getPackageVersion("uuid"));
            console.log("zeromq", getPackageVersion("zeromq"));
            process.exit(0);

        } else if (e.lastIndexOf(FLAG_WORKING_DIR, 0) === 0) {
            context.flag.cwd = fs.realpathSync(
                e.slice(FLAG_WORKING_DIR.length)
            );

        } else {
            unparsedArgs.push(e);
        }
    });

    if (context.flag.specPath === "full") {
        context.args.kernel = [
            context.path.node,
            context.path.kernel,
        ].concat(context.args.kernel);
    } else {
        context.args.kernel = [
            (process.platform === 'win32') ? 'ijskernel.cmd' : 'ijskernel',
        ].concat(context.args.kernel);
    }

    if (context.flag.startup) {
        context.args.kernel.push("--startup-script=" + context.flag.startup);
    }

    if (context.flag.cwd) {
        context.args.kernel.push("--session-working-dir=" + context.flag.cwd);
    }

    if (context.flag.hideUndefined) {
        context.args.kernel.push("--hide-undefined");
    } else {
        context.args.kernel.push("--show-undefined");
    }

    context.args.kernel = context.args.kernel.concat(unparsedArgs);

    context.args.kernel.push("{connection_file}");
}


setPaths(context);

readPackageJson(context);

parseCommandArgs(context);

setJupyterInfoAsync(context, function() {
    setProtocol(context);

    installKernelAsync(context, function() {
        log("CONTEXT:", context);
    });
});
