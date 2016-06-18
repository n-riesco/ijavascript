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

DEBUG = !!process.env.DEBUG;;

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

var TIMEOUT = 2500; // ms
function onTimeout() {
    throw new Error("Timeout error");
}

/**
 * @callback    Task
 * @param       {TestFixture} context
 * @description Run a task using context and after completion invoke next task
 */

/**
 * @class     TestFixture
 * @classdesc Context for running a collection of tests
 * @param {Task[]} beforeFixture Tasks to setup the context
 * @param {Task[]} tests         Tasks to run the tests
 * @param {Task[]} afterFixture  Tasks to release the context
 */
function TestFixture(beforeFixture, tests, afterFixture) {
    /**
     * @member      {Task[]} beforeFixture
     * @description Tasks to setup the context
     */
    this.beforeFixture = beforeFixture;

    /**
     * @member      {Task[]} tests
     * @description Tasks to run the tests
     */
    this.tests = tests;

    /**
     * @member      {Task[]} afterFixture
     * @description Tasks to release the context
     */
    this.afterFixture = afterFixture;

    /**
     * @member      {Error}  lastUncaughtException
     * @description Last uncaught exception
     */
    this.lastUncaughtException = null;

    /**
     * @member      {MessagingTestEngine}  mte
     * @description Messaging test engine
     */
    this.mte = new MessagingTestEngine();
}

/**
 * @method      start
 * @description Start test fixture
 */
TestFixture.prototype.start = function() {
    // Capture uncaught exceptions to ensure the test fixture doesn't exit
    // before running all the tasks in `this.afterFixture`.
    process.on('uncaughtException', onUncaughtException.bind(this));

    this.nextTask();

    function onUncaughtException(err) {
        this.lastUncaughtException = err;

        console.error(this.lastUncaughtException.message);
        console.error(this.lastUncaughtException.stack);

        // Exit if no tasks are left in context.destroyContext
        if (!this.afterFixture || this.afterFixture.length <= 0) {
            process.removeListener("uncaughtException", arguments.callee);
            throw this.lastUncaughtException;
        }

        this.finish();
    }
};
/**
 * @method      finish
 * @description Finish test fixture
 */
TestFixture.prototype.finish = function() {
    this.beforeFixture = null;
    this.tests = null;

    this.nextTask();
};

/**
 * @method      nextTask
 * @description Run next task
 */
TestFixture.prototype.nextTask = function() {
    var task;

    if (this.beforeFixture && this.beforeFixture.length > 0) {
        task = this.beforeFixture.shift();
    } else if (this.tests && this.tests.length > 0) {
        task = this.tests.shift();
    } else if (this.afterFixture && this.afterFixture.length > 0) {
        task = this.afterFixture.shift();
    } else if (this.lastUncaughtException) {
        throw this.lastUncaughtException;
    } else {
        return;
    }

    task(this);
};

/**
 * @class     MessagingTestEngine
 * @classdesc Engine to send messaging requests and test responses
 */
function MessagingTestEngine() {
    /**
     * @member          version
     * @member {String} version.ipython  IPython version
     * @member {String} version.protocol IPython/Jupyter protocol version
     */
    this.version = {};

    /**
     * @member          path
     * @member {String} path.node           Path to node
     * @member {String} path.root           Path to IJavascript folder
     * @member {String} path.test           Path to test folder
     * @member {String} path.connectionFile Path to kernel connection file
     * @member {String} path.testMessages   Path to file with test messages
     * @member {String} path.testMessagesV4 Path to file with test messages v4
     * @member {String} path.testMessagesV5 Path to file with test messages v5
     * @member {String} path.kernel         Path to IJavascript kernel
     */
    this.path = {};

    /**
     * @member           connectionFile
     * @member {String}  connectionFile.transport    Transport protocol
     *                                               (e.g. "tcp")
     * @member {String}  connectionFile.ip           IP address
     *                                               (e.g. "127.0.0.1")
     * @member {String}  connectionFile.signature_scheme
     *                                               Signature scheme
     *                                               (e.g. "hmac-sha256")
     * @member {String}  connectionFile.key          Hashing key
     *                                               (e.g. uuid.v4())
     * @member {Integer} connectionFile.hb_port      HeartBeat port
     * @member {Integer} connectionFile.shell_port   Shell port
     * @member {Integer} connectionFile.stdin_port   Stdin port
     * @member {Integer} connectionFile.iopub_port   IOPub port
     * @member {Integer} connectionFile.control_port Control port
     */
    this.connectionFile = {};

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
     * @member         messageBuffer
     * @member {Array} messageBuffer.control Control messages
     * @member {Array} messageBuffer.iopub   IOPub messages
     * @member {Array} messageBuffer.shell   Shell messages
     * @member {Array} messageBuffer.stdin   Stdin messages
     */
    this.messageBuffer = {
        control: [],
        iopub: [],
        shell: [],
        stdin: [],
    };

    /**
     * @member      {module:child_process~ChildProcess} kernelProcess
     * @description Kernel process
     */
    this.kernelProcess = null;

    /**
     * @member      {?MessagingTestEngine~MessagingTest} _test
     * @description Current messaging test (null if none)
     * @private
     */
    this._test = null;
}

/**
 * @typedef     {Object} MessagingTestEngine~MessagingTest
 * @description A messaging test (request and response messages and/or tests)
 * @property    {String}                               description
 *                                                     Test description
 * @property    {MessagingTestEngine~RequestMessage}   request
 *                                                     Request message
 * @property    {MessagingTestEngine~ResponseTest[]}   responses
 *                                                     Response tests
 * @property    {Function}                             callback
 *                                                     Invoked when tests
 *                                                     complete
 * @property    {Integer}                              timeoutID
 *                                                     Timeout ID
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
 * @returns     {Boolean} True if observedResponse was reply to request message
 */

/**
 * @method      initAsync
 * @description Initialise the messaging test engine
 * @param       {Function} callback
 */
MessagingTestEngine.prototype.initAsync = function(callback) {
    this._initPaths();
    this._initVersionsAsync((function() {
        this._initSockets();
        this._initKernel();
        if (DEBUG) console.log("MTE:", this);
        callback();
    }).bind(this));
};

/**
 * @method      dispose
 * @description Dispose the messaging test engine
 * @param       {Function} callback
 */
MessagingTestEngine.prototype.dispose = function() {
    this._disposeKernel();
    this._disposeSockets();
};

/**
 * @method      _initPaths
 * @description Set up paths
 * @private
 */
MessagingTestEngine.prototype._initPaths = function() {
    console.log("Setting up paths");

    this.path.node = process.argv[0];
    this.path.root = path.dirname(path.dirname(
        fs.realpathSync(process.argv[1])
    ));
    this.path.test = path.join(this.path.root, "test");
    this.path.connectionFile = path.join(this.path.test, "conn.json");
    this.path.testMessages = path.join(this.path.test, "messages.json");
    this.path.testMessagesV4 = path.join(this.path.test, "messages_v4.json");
    this.path.testMessagesV5 = path.join(this.path.test, "messages_v5.json");
    this.path.kernel = path.join(this.path.root, "lib", "kernel.js");
};

/**
 * @method      _initVersionsAsync
 * @description Get Jupyter/IPython version
 * @param       {Function} callback
 * @private
 */
MessagingTestEngine.prototype._initVersionsAsync = function(callback) {
    console.log("Getting Jupyter/IPython version");

    process.argv.slice(2).forEach((function(arg) {
        if (arg.lastIndexOf("--protocol=", 0) === 0) {
            this.version.protocol = arg.slice(11);
        }
    }).bind(this));

    if (this.version.protocol) {
        callback();
        return;
    }

    exec("ipython --version", (function(error, stdout, stderr) {
        this.version.ipython = stdout.toString().split(os.EOL, 1)[0];

        var major = parseInt(this.version.ipython.split(".", 1)[0]);
        if (stderr || isNaN(major)) {
            console.error("Error running `ipython --version`");
            if (stdout) console.out(stdout);
            if (stderr) console.error(stderr);
            process.exit(1);
        }

        this.version.protocol = major < 3 ? "4.1" : "5.0";

        callback();
    }).bind(this));
};

/**
 * @method      _initSockets
 * @description Setup ZMQ sockets and message listeners
 * @private
 */
MessagingTestEngine.prototype._initSockets = function() {
    console.log("Setting up ZMQ sockets");

    var transport = "tcp";
    var ip = "127.0.0.1";
    var address = transport + "://" + ip + ":";
    var scheme = "sha256";
    var key = crypto.randomBytes(256).toString('base64');

    this.connectionFile = {
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
            this.connectionFile[socketName + "_port"] = port;
            this.socket[socketName] = socket;
            i++;
        } catch (e) {
            console.error(e.stack);
        }

        if (attempts >= 100) {
            throw new Error("can't bind to any local ports");
        }
    }

    this.socket.iopub.subscribe("");

    console.log("Setting up message listeners");

    Object.getOwnPropertyNames(this.messageBuffer).forEach(
        (function(socketName) {
            this.socket[socketName].on("message", (function(message) {
                var msg_type = message.header.msg_type;
                if (DEBUG) console.log("Received", msg_type, "on", socketName);

                this.messageBuffer[socketName].push(message);

                this._runIfPossible();
            }).bind(this));
        }).bind(this)
    );
};

/**
 * @method      _initKernel
 * @description Setup IJavascript kernel
 * @private
 */
MessagingTestEngine.prototype._initKernel = function() {
    console.log("Setting up IJavascript kernel");

    // Create connection file
    fs.writeFileSync(
        this.path.connectionFile,
        JSON.stringify(this.connectionFile)
    );

    // Spawn kernel
    var cmd = this.path.node;
    var args = [
        this.path.kernel,
        "--protocol=" + this.version.protocol,
        this.path.connectionFile,
    ];
    if (DEBUG) args.push("--debug");
    var config = {
        stdio: "inherit"
    };
    this.kernelProcess = spawn(cmd, args, config);
};

/**
 * @method      _disposeKernel
 * @description Dispose IJavascript kernel
 * @private
 */
MessagingTestEngine.prototype._disposeKernel = function() {
    console.log("Dispose IJavascript kernel");

    // Kill kernel
    if (this.kernelProcess) {
        this.kernelProcess.kill("SIGTERM");
    }

    // Delete connection file
    try {
        fs.unlinkSync(this.path.connectionFile);
    } catch (e) {
        console.error(e.message);
    }
};

/**
 * @method      _disposeSockets
 * @description Dispose ZMQ sockets
 * @private
 */
MessagingTestEngine.prototype._disposeSockets = function() {
    console.log("Dispose ZMQ sockets");

    this.socket.control.close();
    this.socket.hb.close();
    this.socket.iopub.close();
    this.socket.shell.close();
    this.socket.stdin.close();
};

/**
 * @method      run
 * @description Run a messaging test
 * @param       {MessagingTestEngine~MessagingTest} test
 */
MessagingTestEngine.prototype.run = function(test) {
    this._test = test;

    console.log("Testing " + this._test.description);

    // clear message buffers
    var buffer = this.messageBuffer;
    Object.getOwnPropertyNames(buffer).forEach(
        function(socketName) {
            buffer[socketName].length = 0;
        }
    );

    // set timeout
    this._test.timeoutID = setTimeout(onTimeout, TIMEOUT);

    // send request
    var request = this._test.request;
    var socketName = Object.getOwnPropertyNames(request)[0];
    var message = request[socketName];

    request[socketName] = MessagingTestEngine.sendMessage(
        message,
        this.socket[socketName],
        this.connectionFile.signature_scheme.slice(5),
        this.connectionFile.key,
        this.version.protocol
    );
};

/**
 * @method      _runIfPossible
 * @description Run test if possible
 * @private
 */
MessagingTestEngine.prototype._runIfPossible = function() {
    // Exit if there are no tests
    if (!this._test) {
        return;
    }

    // Invoke callback if there are no response tests left
    if (this._test.responses.length === 0) {
        clearTimeout(this._test.timeoutID);

        var callback = this._test.callback;
        this._test = null;
        callback();

        return;
    }

    // Get next response test
    var response = this._test.responses[0];
    var responseSocketName = Object.getOwnPropertyNames(response)[0];
    var responseTest = response[responseSocketName];

    // Exit if there are no messages to test in the appropriate buffer
    if (this.messageBuffer[responseSocketName].length === 0) {
        if (DEBUG) console.log("Waiting for messages on", responseSocketName);
        //console.trace();
        return;
    }

    // Get first observed message and remove it from buffer
    var observedMessage = this.messageBuffer[responseSocketName].shift();
    var observed_msg_id = observedMessage.parent_header.msg_id;

    // Get request message
    var request = this._test.request;
    var requestSocketName = Object.getOwnPropertyNames(request)[0];
    var requestMessage = request[requestSocketName];
    var request_msg_id = requestMessage.header.msg_id;

    // If the observed message ID doesn't match the request, try next message
    if (observed_msg_id !== request_msg_id) {
        this._runIfPossible();
        return;
    }

    // Run response test
    var isMatchedResponse;

    if (typeof(responseTest) === "function") {
        isMatchedResponse = responseTest(observedMessage);
    } else {
        var observed_msg_type = observedMessage.header.msg_type;
        var expected_msg_type = responseTest.header.msg_type;

        isMatchedResponse = (observed_msg_type === expected_msg_type);

        if (isMatchedResponse) {
            MessagingTestEngine.checkMessage(
                observedMessage, responseTest, this._test.description
            );
        }
    }

    // If the response was matched, remove response test from queue
    if (isMatchedResponse) {
        if (DEBUG) console.log("Passed response test on", responseSocketName);
        this._test.responses.shift();
    }

    // Continue testing
    this._runIfPossible();
};

/**
 * @method      checkMessage
 * @description Run any message tests queued in the buffers
 * @param       {MessagingTestEngine~Message} observed    Observed message
 * @param       {MessagingTestEngine~Message} expected    Expected message
 * @param       {String}                      description Test description
 * @static
 */
MessagingTestEngine.checkMessage = function(observed, expected, description) {
    if (typeof(expected) !== 'object') {
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

        MessagingTestEngine.checkMessage(
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
    if (DEBUG) console.log("Sending " + message.header.msg_type);

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

/**
 * @type Task
 * @description Initialise the messaging test engine
 */
function initMTE(context) {
    context.mte.initAsync(function() {
        context.nextTask();
    });
}

/**
 * @type Task
 * @description Dispose the messaging test engine
 */
function disposeMTE(context) {
    context.mte.dispose();
    context.nextTask();
}

/**
 * @type Task
 * @description Test kernel heart beats
 */
function testHeartBeat(context) {
    console.log("Testing kernel heart beats");

    var timeout = setTimeout(onTimeout, TIMEOUT);

    var hbCount = 0;
    for (var i = 0; i < 10; i++) {
        context.mte.socket.hb.send();
        hbCount++;
    }

    context.mte.socket.hb.on("message", onHeartBeat);

    function onHeartBeat() {
        hbCount--;

        if (hbCount === 0) {
            clearTimeout(timeout);
            context.mte.socket.hb.removeListener("message", arguments.callee);
            context.nextTask();
        }
    }
}

/**
 * @type Task
 * @description Tests messaging protocol
 */
function testMessagingProtocol(context) {
    console.log("Testing messaging protocol");

    // Load test cases
    var testCases = JSON.parse(
        fs.readFileSync(context.mte.path.testMessages)
    );

    var major = parseInt(context.mte.version.protocol.split(".", 1)[0]);
    if (major < 5) {
        testCases = testCases.concat(JSON.parse(
            fs.readFileSync(context.mte.path.testMessagesV4)
        ));
    } else {
        testCases = testCases.concat(JSON.parse(
            fs.readFileSync(context.mte.path.testMessagesV5)
        ));
    }

    // For each test case, create and queue a task
    context.tests = testCases.map(makeTask).concat(context.tests);

    // Run next task in the queue
    context.nextTask();

    function makeTask(testCase) {
        return function(context) {
            testCase.callback = function() {
                context.nextTask();
            };

            context.mte.run(testCase);
        };
    }
}

/**
 * @type Task
 * @description Tests kernel_info_request
 */
function testKernelInfoRequest(context) {
    var description = "kernel_info_request (more thorough test)";
    var request = {
        shell: {
            header: {
                msg_type: "kernel_info_request",
                version: context.mte.version.protocol,
            }
        }
    };
    var responses = [{
        shell: messagingTest
    }];
    var callback = function() {
        context.nextTask();
    };

    context.mte.run({
        description: description,
        request: request,
        responses: responses,
        callback: callback,
    });

    function messagingTest(response) {
        if (response.header.msg_type !== "kernel_info_reply") {
            return false;
        }

        assert.deepEqual(
            response.metadata, {},
            "Error: no metadata"
        );

        var major = parseInt(context.mte.version.protocol.split(".", 1)[0]);
        if (major < 5) {
            var protocolVersion = context.mte.version.protocol.split(".").map(
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
                context.mte.version.protocol,
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

        return true;
    }
}

var beforeFixture = [
    initMTE,
];

var tests = [
    testHeartBeat,
    testMessagingProtocol,
    testKernelInfoRequest,
    testHeartBeat,
];

var afterFixture = [
    disposeMTE,
];

var fixture = new TestFixture(beforeFixture, tests, afterFixture);
fixture.start();
