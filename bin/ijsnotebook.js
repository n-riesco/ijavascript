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

var rc = require("./rc.js");
var context = rc.context;
var installKernelAsync = rc.installKernelAsync;
var log = rc.log;
var readPackageJson = rc.readPackageJson;
var parseCommandArgs = rc.parseCommandArgs;
var setJupyterInfoAsync = rc.setJupyterInfoAsync;
var setPaths = rc.setPaths;
var setProtocol = rc.setProtocol;
var spawnFrontend = rc.spawnFrontend;

setPaths(context);

readPackageJson(context);

parseCommandArgs(context, {
    flagPrefix: "ijs",

    usageHeader: [
        "IJavascript Notebook",
        "",
        "Usage:",
        "",
        "    ijsnotebook <options>",
    ].join("\n"),

    usageFooter: [
        "and any other options recognised by the Jupyter notebook; run:",
        "",
        "    jupyter notebook --help",
        "",
        "for a full list.",
    ].join("\n"),
});

setJupyterInfoAsync(context, function() {
    setProtocol(context);

    installKernelAsync(context, function() {
        log("CONTEXT:", context);

        if (!context.flag.install) {
            spawnFrontend(context);
        }
    });
});
