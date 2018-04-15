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

module.exports = MessagingTestEngine;

var assert = require("assert");
var console = require("console");
var crypto = require("crypto");
var fs = require("fs");
var path = require("path");
var util = require("util");
var spawn = require("child_process").spawn;
var uuid = require("uuid");

var jmp = require("jmp");
var zmq = jmp.zmq;

// Setup logging helpers
var log;
var dontLog = function dontLog() {};
var doLog = function doLog() {
    process.stderr.write("IJS: TEST: MTE:");
    console.error.apply(this, arguments);
};

if (process.env.DEBUG) {
    global.DEBUG = true;

    try {
        doLog = require("debug")("IJS: TEST: MTE:");
    } catch (err) {}
}

log = global.DEBUG ? doLog : dontLog;

/**
 * @class     MessagingTestEngine
 * @classdesc Engine to send messaging requests and test responses
 * @param {string} protocolVersion Messaging protocol version
 */
function MessagingTestEngine(protocolVersion) {
    /**
     * @member          version
     * @member {String} version.protocol Messaging protocol version
     */
    this.version = {
        protocol: protocolVersion || "5.0",
    };

    /**
     * @member          path
     * @member {String} path.node           Path to node
     * @member {String} path.root           Path to package folder
     * @member {String} path.test           Path to test folder
     * @member {String} path.connectionFile Path to kernel connection file
     * @member {String} path.testMessages   Path to file with test messages
     * @member {String} path.testMessagesV4 Path to file with test messages v4
     * @member {String} path.testMessagesV5 Path to file with test messages v5
     * @member {String} path.kernel         Path to kernel
     */
    this.path = {};

    /**
     * @member           connection
     * @member {String}  connection.transport    Transport protocol (e.g. "tcp")
     * @member {String}  connection.ip           IP address (e.g. "127.0.0.1")
     * @member {String}  connection.signature_scheme
     *                                           Signature scheme
     *                                           (e.g. "hmac-sha256")
     * @member {String}  connection.key          Hashing key (e.g. uuid.v4())
     * @member {Integer} connection.hb_port      HeartBeat port
     * @member {Integer} connection.shell_port   Shell port
     * @member {Integer} connection.stdin_port   Stdin port
     * @member {Integer} connection.iopub_port   IOPub port
     * @member {Integer} connection.control_port Control port
     */
    this.connection = {};

    /**
     * @member                     socket
     * @member {module:jmp~Socket} socket.control Control socket
     * @member {module:jmp~Socket} socket.hb      HearBeat socket
     * @member {module:jmp~Socket} socket.iopub   IOPub socket
     * @member {module:jmp~Socket} socket.shell   Shell socket
     * @member {module:jmp~Socket} socket.stdin   Stdin socket
     */
    this.socket = {};

    /**
     * @member      {module:child_process~ChildProcess} kernel
     * @description Kernel instance
     */
    this.kernel = null;

    /**
     * @member      {?MessagingTestEngine~MessagingTestCase} _currentTestCase
     * @description Current messaging test (null if none)
     * @private
     */
    this._currentTestCase = null;

    /**
     * @member      {MessagingTestEngine~MessagingTestCase[]} _testCases
     * @description Current messaging test (null if none)
     * @private
     */
    this._testCases = [];

    this._setupPaths();
}

/**
 * @typedef     {Object} MessagingTestEngine~MessagingTestCase
 * @description A messaging test (request and response messages and/or tests)
 * @property    {String}                               description
 *                                                     Test description
 * @property    {MessagingTestEngine~RequestMessage}   request
 *                                                     Request message
 * @property    {MessagingTestEngine~ResponseTest[]}   responses
 *                                                     Response tests
 * @property    {Function}                             done
 *                                                     Callback invoked on test
 *                                                     completion
 */

/**
 * @typedef     {Object} MessagingTestEngine~RequestMessage
 * @description A request message
 * @property    {MessagingTestEngine~Message} [shell]   Shell-socket request
 * @property    {MessagingTestEngine~Message} [stdin]   Stdin-socket request
 * @property    {MessagingTestEngine~Message} [iopub]   IOPub-socket request
 * @property    {MessagingTestEngine~Message} [control] Control-socket request
 */

/**
 * @typedef     {Object} MessagingTestEngine~ResponseTest
 * @description A response test
 * @property    {MessagingTestEngine~Message|MessagingTestEngine~Test} [shell]
 *              The shell-socket expected response or a custom test
 * @property    {MessagingTestEngine~Message|MessagingTestEngine~Test} [stdin]
 *              The stdin-socket expected response or a custom test
 * @property    {MessagingTestEngine~Message|MessagingTestEngine~Test} [iopub]
 *              The IOPub-socket expected response or a custom test
 * @property    {MessagingTestEngine~Message|MessagingTestEngine~Test} [control]
 *              The control-socket expected response or a custom test
 */

/**
 * @typedef     {Object} MessagingTestEngine~Message
 * @description IPython/Jupyter message
 * @property    {Array}   [message.idents]        Identities
 * @property    {Object}  [message.header]        Header
 * @property    {Object}  [message.parent_header] Parent header
 * @property    {Object}  [message.metadata]      Message metadata
 * @property    {Object}  [message.content]       Message content
 */

/**
 * @callback    MessagingTestEngine~Test
 * @description Custom test
 * @param       {MessagingTestEngine~Message} observedResponse
 * @param       {string}                      socketName Socket name
 * @returns     {boolean} True if this test is expecting more responses
 */

/**
 * @method      init
 * @param       {function} done
 * @description Initialise the messaging test engine
 */
MessagingTestEngine.prototype.init = function(done) {
    this._initSockets();
    this._createConnectionFile();
    this._initKernel();

    var socketNames = ["hb", "shell", "iopub", "control"];

    var waitGroup = socketNames.length;
    function onConnect() {
        waitGroup--;
        if (waitGroup === 0) {
            for (var i = 0; i < socketNames.length; i++) {
                this.socket[socketNames[i]].unmonitor();
            }
            if (done) done();
        }
    }

    for (var j = 0; j < socketNames.length; j++) {
        this.socket[socketNames[j]].on("connect", onConnect.bind(this));
        this.socket[socketNames[j]].monitor();
    }
};

/**
 * @method      dispose
 * @description Dispose the messaging test engine
 */
MessagingTestEngine.prototype.dispose = function() {
    this._disposeKernel();
    this._removeConnectionFile();
    this._disposeSockets();
};

/**
 * @method      _setupPaths
 * @description Set up paths
 * @private
 */
MessagingTestEngine.prototype._setupPaths = function() {
    log("Setting up paths");

    this.path.node = process.argv[0];
    this.path.root = path.dirname(path.dirname(__dirname));
    this.path.test = path.join(this.path.root, "test");

    this.path.connectionFile = path.join(
        this.path.test,
        "conn-" + uuid.v4() + ".json"
    );
    this.path.testMessages = path.join(this.path.test, "messages.json");
    this.path.testMessagesV4 = path.join(this.path.test, "messages_v4.json");
    this.path.testMessagesV5 = path.join(this.path.test, "messages_v5.json");
    this.path.kernel = path.join(this.path.root, "lib", "kernel.js");
};

/**
 * @method      _createConnectionFile
 * @description Create connection file
 * @private
 */
MessagingTestEngine.prototype._createConnectionFile = function() {
    log("Creating connection file");

    fs.writeFileSync(
        this.path.connectionFile,
        JSON.stringify(this.connection)
    );
};

/**
 * @method      _removeConnectionFile
 * @description Remove connection file
 * @private
 */
MessagingTestEngine.prototype._removeConnectionFile = function() {
    log("Removing connection file");

    try {
        fs.unlinkSync(this.path.connectionFile);
    } catch (e) {
        console.error(e.message);
    }
};

/**
 * @method      _initSockets
 * @description Setup ZMQ sockets and message listeners
 * @private
 */
MessagingTestEngine.prototype._initSockets = function() {
    log("Setting up ZMQ sockets");

    var transport = "tcp";
    var ip = "127.0.0.1";
    var address = transport + "://" + ip + ":";
    var scheme = "sha256";
    var key = crypto.randomBytes(256).toString("base64");

    this.connection = {
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
        var socket = (socketName === "hb") ?
            new zmq.Socket(socketType) :
            new jmp.Socket(socketType, scheme, key);
        var port = Math.floor(1024 + Math.random() * (65536 - 1024));

        try {
            socket.connect(address + port);
            this.connection[socketName + "_port"] = port;
            this.socket[socketName] = socket;
            i++;
        } catch (e) {
            log(e.stack);
        }

        if (attempts >= 100) {
            throw new Error("can't bind to any local ports");
        }
    }

    this.socket.iopub.subscribe("");

    log("Setting up message listeners");

    Object.getOwnPropertyNames(this.socket).forEach((function(socketName) {
        if (socketName === "hb") {
            return;
        }

        this.socket[socketName].on("message", (function(message) {
            this._onMessage(message, socketName);
        }).bind(this));
    }).bind(this));
};

/**
 * @method      _initKernel
 * @description Setup IJavascript kernel
 * @private
 */
MessagingTestEngine.prototype._initKernel = function() {
    log("Initialising a kernel");

    var cmd = this.path.node;
    var args = [
        this.path.kernel,
        "--protocol=" + this.version.protocol,
        this.path.connectionFile,
    ];
    if (global.DEBUG) args.push("--debug");
    var config = {
        stdio: "inherit"
    };
    log("spawn", cmd, args, config);
    this.kernel = spawn(cmd, args, config);
};

/**
 * @method      _disposeKernel
 * @description Dispose IJavascript kernel
 * @private
 */
MessagingTestEngine.prototype._disposeKernel = function() {
    log("Disposing IJavascript kernel");

    if (this.kernel) {
        this.kernel.kill("SIGTERM");
    }
};

/**
 * @method      _disposeSockets
 * @description Dispose ZMQ sockets
 * @private
 */
MessagingTestEngine.prototype._disposeSockets = function() {
    log("Disposing ZMQ sockets");

    this.socket.control.close();
    this.socket.hb.close();
    this.socket.iopub.close();
    this.socket.shell.close();
    this.socket.stdin.close();
};

/**
 * @method      _onMessage
 * @description Handle kernel message
 * @param       {MessagingTestEngine~Message} message    IPython/Jupyter message
 * @param       {string}                      socketName Socket name
 * @private
 */
MessagingTestEngine.prototype._onMessage = function(message, socketName) {
    log("Received", message, "on", socketName);

    if (!this._currentTestCase) {
        log("No current test case");
        return;
    }

    var request = this._currentTestCase.request;
    var requestSocketName = Object.getOwnPropertyNames(request)[0];
    var requestMessage = request[requestSocketName];
    if (message.parent_header.msg_id !== requestMessage.header.msg_id) {
        log("No matching msg_id");
        return;
    }

    try {
        log("Testing message");
        this._testResponse(message, socketName);
        log("Test passed");
    } catch (err) {
        log("Test failed");
        this._currentTestCase = null;
        log("Deleting remaining tests");

        // Workaround for issue
        // https://github.com/JustinTulloss/zeromq.node/issues/558
        this.socket[socketName]._isFlushingReads = false;
        this.socket[socketName]._flushReads();

        throw err;
    }

    if (this._currentTestCase) {
        log("Remaining tests", this._currentTestCase.responses);
    } else {
        log("No remaining tests");
    }
};

/**
 * @method      run
 * @description Run a test case
 * @param       {MessagingTestEngine~MessagingTestCase} testCase
 */
MessagingTestEngine.prototype.run = function(testCase) {
    if (!this.kernel) {
        throw new Error("no running kernel");
    }

    this._currentTestCase = testCase;

    var request = this._currentTestCase.request;
    var socketName = Object.getOwnPropertyNames(request)[0];
    var message = request[socketName];

    request[socketName] = MessagingTestEngine.sendMessage(
        message,
        this.socket[socketName],
        this.connection.signature_scheme.slice(5),
        this.connection.key,
        this.version.protocol
    );

    log("Running", util.inspect(testCase, {depth: 3}));
};

/**
 * @method      _end
 * @description End the running test case
 * @param       {MessagingTestEngine~MessagingTestCase} testCase
 */
MessagingTestEngine.prototype._end = function() {
    this._currentTestCase.done();
    this._currentTestCase = null;
};

/**
 * @method      _testResponse
 * @description Test response
 * @param       {MessagingTestEngine~Message} observedResponse
 * @param       {string}                      socketName Socket name
 */
MessagingTestEngine.prototype._testResponse = function(message, socketName) {
    var responseTest = this._currentTestCase.responses;
    if (typeof responseTest === "function") {
        var expectingMoreResponses = responseTest(message, socketName);
        if (!expectingMoreResponses) {
            this._end();
        }
        return;
    }

    var responses = responseTest;
    for (var i = 0; i < responses.length; i++) {
        var expectedResponse = responses[i];
        if (!expectedResponse) {
            continue;
        }

        var expectedMessage = expectedResponse[socketName];
        if (!expectedMessage) {
            continue;
        }

        if (message.header.msg_type !== expectedMessage.header.msg_type) {
            continue;
        }

        delete responses[i];

        MessagingTestEngine.compareMessage(
            message, expectedMessage, this._currentTestCase.description
        );

        break;
    }

    // Are there any responses left to test?
    for (var j = 0; j < responses.length; j++) {
        if (responses[j]) {
            return;
        }
    }

    // If there aren't, then end the test case
    this._end();

    return;
};

/**
 * @method      compareMessage
 * @description Check whether a messages matches the expected message
 * @param       {MessagingTestEngine~Message} observed    Observed message
 * @param       {MessagingTestEngine~Message} expected    Expected message
 * @param       {String}                      description Test description
 * @static
 */
MessagingTestEngine.compareMessage = function(observed, expected, description) {
    if (typeof expected !== "object") {
        assert.strictEqual(
            observed,
            expected,
            "Failed test " + description +
            ": Observed = " + observed +
            ": Expected = " + expected
        );
        return;
    }

    // check recursively only the properties present in expected
    Object.getOwnPropertyNames(expected).forEach(function(name) {
        assert(
            observed.hasOwnProperty(name),
            description + ": Missing property '" + name + "'"
        );

        MessagingTestEngine.compareMessage(
            observed[name], expected[name], description
        );
    });
};

/**
 * @method      sendMessage
 * @description Create and send a request message on the specified socket
 * @param {?Object} message                 IPython/Jupyter message
 * @param {Array}   [message.idents]        Identities
 * @param {Object}  [message.header]        Header
 * @param {Object}  [message.parent_header] Parent header
 * @param {Object}  [message.metadata]      Message metadata
 * @param {Object}  [message.content]       Message content
 * @param {module:jmp~Socket} socket        ZMQ socket
 * @param {String}  scheme                  Hashing scheme (e.g. "hmac-sha256")
 * @param {String}  key                     Hashing key
 * @param {String}  [protocolVersion]       IPython/Jupyter protocol version
 *                                          (required if message.header.version
 *                                          is missing)
 * @param {String}  [msg_type]              IPython/Jupyter message type
 *                                          (required if message.header.msg_type
 *                                          is missing)
 *
 * @returns           message               IPython/Jupyter message
 * @returns {Array}   message.idents        Identities
 * @returns {Object}  message.header        Header
 * @returns {Object}  message.parent_header Parent header
 * @returns {Object}  message.metadata      Message metadata
 * @returns {Object}  message.content       Message content
 * @static
 */
MessagingTestEngine.sendMessage = function(
    message, socket, scheme, key, protocolVersion, msg_type
) {
    log("Sending " + message.header.msg_type);

    if (!(message instanceof jmp.Message)) {
        message = new jmp.Message(message);
    }

    if (!message.header.msg_id) {
        message.header.msg_id = uuid.v4();
    }

    if (!message.header.username) {
        message.header.username = "user";
    }

    if (!message.header.session) {
        message.header.session = uuid.v4();
    }

    if (!message.header.msg_type) {
        message.header.msg_type = msg_type;
    }

    if (!message.header.version) {
        message.header.version = protocolVersion;
    }

    socket.send(message);

    return message;
};
