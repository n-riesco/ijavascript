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

var assert = require("assert");
var fs = require("fs");
var path = require("path");

var MessagingTestEngine = require("./mte");

describe("A Kernel instance", function() {
    describe("using protocol v4.1", function() {
        var mte = new MessagingTestEngine("4.1");

        before(function(done) {
            mte.init(done);
        });

        after(function() {
            mte.dispose();
        });

        testHeartBeat(mte);
        testKernelInfoRequest(mte);
        testMessagingProtocol(mte);
        testHeartBeat(mte);
    });

    describe("using protocol v5.0", function() {
        var mte = new MessagingTestEngine("5.0");

        before(function(done) {
            mte.init(done);
        });

        after(function() {
            mte.dispose();
        });

        testHeartBeat(mte);
        testKernelInfoRequest(mte);
        testMessagingProtocol(mte);
        testHeartBeat(mte);
    });
});

function testHeartBeat(mte) {
    it("has heart beats", function(done) {
        var hbCount = 10;

        mte.socket.hb.on("message", onHeartBeat);

        mte.socket.hb.send();

        function onHeartBeat() {
            hbCount--;

            if (hbCount > 0) {
                mte.socket.hb.send();
            } else {
                mte.socket.hb.removeListener("message", arguments.callee);
                done();
            }
        }
    });
}

function testKernelInfoRequest(mte) {
    var description = "kernel_info_request (content test)";

    it("replies correctly to " + description, function(done) {
        var request = {
            shell: {
                header: {
                    msg_type: "kernel_info_request",
                    version: mte.version.protocol,
                }
            }
        };

        var responses = testKernelInfoReply;

        var testCase = {
            description: description,
            request: request,
            responses: responses,
            done: done,
        };
        mte.run(testCase);
    });

    function testKernelInfoReply(response, socketName) {
        if (socketName !== "shell") {
            return true;
        }

        if (response.header.msg_type !== "kernel_info_reply") {
            return true;
        }

        assert.deepEqual(
            response.metadata, {},
            "Error: no metadata"
        );

        var kernelInfoReply;
        var nodeVersion;
        var protocolVersion;
        var ijsVersion;
        var majorVersion = parseInt(mte.version.protocol.split(".")[0]);
        if (majorVersion <= 4) {
            nodeVersion = process.versions.node.split(".")
                .map(function(v) {
                    return parseInt(v, 10);
                });
            protocolVersion = mte.version.protocol.split(".")
                .map(function(v) {
                    return parseInt(v, 10);
                });
            kernelInfoReply = {
                "language": "javascript",
                "language_version": nodeVersion,
                "protocol_version": protocolVersion,
            };
        } else {
            nodeVersion = process.versions.node;
            protocolVersion = mte.version.protocol;
            ijsVersion = JSON.parse(
                fs.readFileSync(path.join(mte.path.root, "package.json"))
            ).version;
            kernelInfoReply = {
                "protocol_version": protocolVersion,
                "implementation": "ijavascript",
                "implementation_version": ijsVersion,
                "language_info": {
                    "name": "javascript",
                    "version": nodeVersion,
                    "mimetype": "application/javascript",
                    "file_extension": ".js",
                },
                "banner": (
                    "IJavascript v" + ijsVersion + "\n" +
                    "https://github.com/n-riesco/ijavascript\n"
                ),
                "help_links": [{
                    "text": "IJavascript Homepage",
                    "url": "https://github.com/n-riesco/ijavascript",
                }],
            };
        }
        assert.deepEqual(
            response.content, kernelInfoReply,
            "Error: bad content"
        );

        return false;
    }
}

function testMessagingProtocol(mte) {
    var testCases = JSON.parse(fs.readFileSync(mte.path.testMessages));

    var major = parseInt(mte.version.protocol.split(".", 1)[0]);
    if (major < 5) {
        testCases = testCases.concat(JSON.parse(
            fs.readFileSync(mte.path.testMessagesV4)
        ));
    } else {
        testCases = testCases.concat(JSON.parse(
            fs.readFileSync(mte.path.testMessagesV5)
        ));
    }

    var wait = 0;
    testCases.forEach(function(testCase) {
        it("replies correctly to " + testCase.description, function(done) {
            testCase.done = done;

            wait += 0;
            setTimeout(function() {
                mte.run(testCase);
            }, wait);
        });
    });
}
