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

DEBUG = false;

var assert = require("assert");
var console = require("console");
var crypto = require("crypto");
var exec = require("child_process").exec;
var fs = require("fs");
var os = require("os");
var path = require("path");
var spawn = require("child_process").spawn;
var util = require("util");
var uuid = require("node-uuid");

var jmp = require("jmp");
var zmq = jmp.zmq;

var TIMEOUT = 1500; // ms
function onTimeout() {
    throw new Error("Timeout error");
}

/**
 * @callback Task
 * @param {Context} context
 * @description Run a task using context and after completion invoke next task
 */

/**
 * @typedef Context
 *
 * @property          context
 *
 * @property {Task[]} context.tests          List of tests
 * @property {Task[]} context.createContext  Tasks to create context resources
 * @property {Task[]} context.destroyContext Tasks to release context resources
 *
 * @property {Error}  context.lastUncaughtException Last uncaught exception
 *
 * @property {String} context.ipythonVersion
 * @property {String} context.protocolVersion Jupyter protocol version
 *
 * @property {String} context.nodePath           Path to node
 * @property {String} context.rootPath           Path to IJavascript folder
 * @property {String} context.testsPath          Path to tests folder
 * @property {String} context.connectionFilePath Path to kernel connection file
 *
 * @property          context.connectionFile Kernel connection file
 * @property {String} context.connectionFile.transport     Transport protocol
 *                                                         (e.g. "tcp")
 * @property {String} context.connectionFile.ip            IP address
 *                                                         (e.g. "127.0.0.1")
 * @property {String} context.connectionFile.signature_scheme
 *                                                         Signature scheme
 *                                                         (e.g. "hmac-sha256")
 * @property {String} context.connectionFile.key           Hashing key
 *                                                         (e.g. uuid.v4())
 * @property {Integer} context.connectionFile.hb_port      HeartBeat port
 * @property {Integer} context.connectionFile.shell_port   Shell port
 * @property {Integer} context.connectionFile.stdin_port   Stdin port
 * @property {Integer} context.connectionFile.iopub_port   IOPub port
 * @property {Integer} context.connectionFile.control_port Control port
 *
 * @property {module:jmp~Socket} context.controlSocket Control socket
 * @property {module:jmp~Socket} context.hbSocket      HearBeat socket
 * @property {module:jmp~Socket} context.iopubSocket   IOPub socket
 * @property {module:jmp~Socket} context.shellSocket   Shell socket
 * @property {module:jmp~Socket} context.stdinSocket   Stdin socket
 *
 * @property {module:child_process~ChildProcess} context.kernelProcess
 *                                                     Kernel process
 *
 * @property {Integer} context.hbCount HeartBeat counter
 */

var context = {
    createContext: [
        getProtocolVersion,
        setupContext,
    ],
    tests: [
        testHeartBeat,
        testKernelInfoRequest,
        testHeartBeat,
    ],
    destroyContext: [
        destroyContext,
    ],
};

startRun(context);

/**
 * @type Task
 * @description Start running tasks
 */
function startRun(context) {
    process.on('uncaughtException', onUncaughtException);

    nextTask(context);

    function onUncaughtException(err) {
        if (context.lastUncaughtException) {
            console.error(context.lastUncaughtException.message);
            console.error(context.lastUncaughtException.stack);
        }

        context.lastUncaughtException = err;

        // Exit if no tasks are left in context.destroyContext
        if (!context.destroyContext || context.destroyContext.length <= 0) {
            process.removeListener("uncaughtException", onUncaughtException);
            throw context.lastUncaughtException;
        }

        delete context.createContext;
        delete context.tests;
        nextTask(context);
    }
}

/**
 * @type Task
 * @description This function is called by each task to invoke next task
 */
function nextTask(context) {
    var task;

    if (context.createContext && context.createContext.length > 0) {
        task = context.createContext.shift();
    } else if (context.tests && context.tests.length > 0) {
        task = context.tests.shift();
    } else if (context.destroyContext && context.destroyContext.length > 0) {
        task = context.destroyContext.shift();
    } else if (context.lastUncaughtException) {
        throw context.lastUncaughtException;
    } else {
        return;
    }

    task(context);
}

/**
 * @type Task
 * @description Get Jupyter procotol version
 *
 */
function getProtocolVersion(context) {
    console.log("Getting IPython version");

    exec("ipython --version", function(error, stdout, stderr) {
        context.ipythonVersion = stdout.toString().split(os.EOL, 1)[0];

        var major = parseInt(context.ipythonVersion.split(".", 1)[0]);
        if (stderr || isNaN(major)) {
            console.error("Error running `ipython --version`");
            if (stdout) console.out(stdout);
            if (stderr) console.error(stderr);
            process.exit(1);
        }

        context.protocolVersion = major < 3 ? "4.1" : "5.0";

        nextTask(context);
    });
}

/**
 * @type Task
 * @description Setup sockets and kernel spec file
 *
 */
function setupContext(context) {
    console.log("Setting up context");

    // Set file paths
    context.nodePath = process.argv[0];
    context.rootPath = path.dirname(path.dirname(
        fs.realpathSync(process.argv[1])
    ));
    context.testsPath = path.join(context.rootPath, "tests");
    context.connectionFilePath = path.join(context.testsPath, "conn.json");
    context.kernelPath = path.join(context.rootPath, "lib", "kernel.js");

    // Setup test sockets
    var transport = "tcp";
    var ip = "127.0.0.1";
    var address = transport + "://" + ip + ":";
    var scheme = "sha256";
    var key = crypto.randomBytes(256).toString('base64');

    context.connectionFile = {
        transport: transport,
        ip: ip,
        signature_scheme: "hmac-" + scheme,
        key: key,
    };

    var socketNames = ["hb", "shell", "stdin", "iopub", "control"];
    var socketTypes = ["req", "dealer", "dealer", "sub", "dealer"];
    for (var i = 0, attempts = 0; i < socketNames.length; attempts++) {
        var socketName = socketNames[i];
        var socketType = socketTypes[i];
        var socket = (true || socketName === "hb") ?
            new zmq.Socket(socketType) :
            new jmp.Socket(socketType, scheme, key);
        var port = Math.floor(1024 + Math.random() * (65536 - 1024));

        try {
            socket.connect(address + port);
            context[socketName + "Socket"] = socket;
            context.connectionFile[socketName + "_port"] = port;
            i++;
        } catch (e) {
            console.error(e.stack);
        }

        if (attempts >= 100) {
            throw new Error("can't bind to any local ports");
        }
    }

    // Create connection file
    fs.writeFileSync(
        context.connectionFilePath,
        JSON.stringify(context.connectionFile)
    );

    // Spawn kernel
    var cmd = context.nodePath;
    var args = [
        context.kernelPath,
        "--protocol=" + context.protocolVersion,
        context.connectionFilePath,
    ];
    if (DEBUG) args.push("--debug");
    var config = {
        stdio: "inherit"
    };
    context.kernelProcess = spawn(cmd, args, config);

    nextTask(context);
}

/**
 * @type Task
 * @description Destroy context
 */
function destroyContext(context) {
    console.log("Destroy context");

    // Close sockets
    context.controlSocket.close();
    context.hbSocket.close();
    context.iopubSocket.close();
    context.shellSocket.close();
    context.stdinSocket.close();

    // Kill kernel
    context.kernelProcess.kill("SIGTERM");

    // Delete spec file
    fs.unlinkSync(context.connectionFilePath);

    nextTask(context);
}

/**
 * @type Task
 * @description Test kernel heart beats
 */
function testHeartBeat(context) {
    console.log("Testing kernel heart beats");

    context.hbCount = 0;
    for (var i = 0; i < 10; i++) {
        context.hbSocket.send();
        context.hbCount++;
    }

    function onHeartBeat() {
        context.hbCount--;
    }
    context.hbSocket.on("message", onHeartBeat);

    setTimeout(function() {
        context.hbSocket.removeListener("message", onHeartBeat);

        assert.strictEqual(
            context.hbCount, 0,
            "testHeartBeats: " + context.hbCount + " missed heart beats"
        );

        nextTask(context);
    }, TIMEOUT);
}

/**
 * @type Task
 * @description Tests kernel_info_request
 */
function testKernelInfoRequest(context) {
    console.log("Testing kernel_info_request");

    // Create request
    var username = "user";
    var session = uuid.v4();
    var version = context.protocolVersion;

    var msg_id = uuid.v4();
    var msg_type = "kernel_info_request";

    var request = new jmp.Message();
    request.idents = [];
    request.header = {
        "msg_id": msg_id,
        "username": username,
        "session": session,
        "msg_type": msg_type,
        "version": version,
    };
    request.parent_header = {};
    request.metadata = {};
    request.content = {};

    // Send request
    context.shellSocket.send(encode(
        request,
        context.connectionFile.signature_scheme.slice(5),
        context.connectionFile.key
    ));

    // Set timeout
    var timeout = setTimeout(onTimeout, TIMEOUT);

    // Listen to response
    context.shellSocket.on("message", onResponse);

    function onResponse() {
        var response = new jmp.Message(arguments);

        assert(response.signatureOK, "Error: invalid signature");

        assert.strictEqual(
            response.header.msg_type,
            "kernel_info_reply",
            "Error in msg_type: " + response.msg_type
        );

        assert.deepEqual(
            response.metadata, {},
            "Error: missing metadata"
        );

        var major = parseInt(context.ipythonVersion.split(".", 1)[0]);
        if (major < 3) {
            var protocolVersion = context.protocolVersion.split(".").map(
                function(v) {
                    return parseInt(v);
                }
            );
            assert.deepEqual(
                response.content.protocol_version,
                protocolVersion,
                "Error in content.protocol_version: " +
                util.inspect(response.content)
            );

            assert.strictEqual(
                response.content.language,
                "javascript",
                "Error in content.language: " + util.inspect(response.content)
            );

            var nodeVersion = process.versions.node.split('.').map(function(v) {
                return parseInt(v, 10);
            });

            assert.deepEqual(
                response.content.language_version,
                nodeVersion,
                "Error in content.language_version: " +
                util.inspect(response.content)
            );
        } else {
            assert.strictEqual(
                response.content.protocol_version,
                context.protocolVersion,
                "Error in content.protocol_version: " +
                util.inspect(response.content)
            );

            assert.strictEqual(
                response.content.implementation,
                "ijavascript",
                "Error in content.implementation: " +
                util.inspect(response.content)
            );

            assert.strictEqual(
                response.content.implementation_version,
                "5.0.0",
                "Error in content.implementation_version: " +
                util.inspect(response.content)
            );
        }

        // Clear listeners
        context.shellSocket.removeListener("message", onResponse);

        // Clear timeout
        clearTimeout(timeout);

        // Call next test
        nextTask(context);
    }

    function encode(message, scheme, key) {
        var idents = message.idents;
        var header = JSON.stringify(message.header);
        var parent_header = JSON.stringify(message.parent_header);
        var metadata = JSON.stringify(message.metadata);
        var content = JSON.stringify(message.content);

        var signature = '';
        if (key) {
            var hmac = crypto.createHmac(scheme, key);
            hmac.update(header);
            hmac.update(parent_header);
            hmac.update(metadata);
            hmac.update(content);
            signature = hmac.digest("hex");
        }

        var response = idents.concat([
            "<IDS|MSG>", // delimiter
            signature,
            header,
            parent_header,
            metadata,
            content,
        ]);

        return response;
    }
}
