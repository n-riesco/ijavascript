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

(function() {
    var DEBUG = false;

    var util = require("util");
    var vm = require("vm");

    process.on("message", onMessage.bind(this));
    process.on("uncaughtException", onUncaughtException.bind(this));

    function onMessage(request) {
        if (DEBUG) console.log("SM: MESSAGE: REQUEST:", request);

        var action = request[0];
        var code = request[1];

        var response;
        try {
            if (action === "getAllPropertyNames") {
                response = {
                    names: getAllPropertyNames(run(code))
                };
            } else if (action === "inspect") {
                response = {
                    inspection: inspect(run(code))
                };
            } else if (action === "run") {
                global.$$done$$ = sendResult;

                response = formatResult(run(code));

                if (!global.$$done$$ || global.$$async$$) {
                    delete global.$$async$$;
                    return;
                }
            } else {
                throw new Error("Unhandled action request: " + action);
            }
        } catch (e) {
            delete global.$$async$$;
            sendError(e);
            return;
        }
        send(response);
    }

    function onUncaughtException(error) {
        if (DEBUG) console.log("SM: UNCAUGHTEXCEPTION:", error);

        delete global.$$async$$;

        if (global.$$done$$) {
            sendError(error);
        } else {
            console.warn(error.stack);
        }
    }

    function sendResult(result) {
        send(formatResult(result));
    }

    function sendError(error) {
        send(formatError(error));
    }

    function send(message) {
        if (DEBUG) console.log("SM: SEND:", message);
        delete global.$$done$$;
        process.send(message);
    }

    function formatResult(result) {
        var response;

        if (global.$$html$$) {
            response = {
                mime: {
                    "text/html": global.$$html$$,
                },
            };
            delete global.$$html$$;
        }

        if (global.$$jpeg$$) {
            response = {
                mime: {
                    "image/jpeg": global.$$jpeg$$,
                },
            };
            delete global.$$jpeg$$;
        }

        if (global.$$png$$) {
            response = {
                mime: {
                    "image/png": global.$$png$$,
                },
            };
            delete global.$$png$$;
        }

        if (global.$$svg$$) {
            response = {
                mime: {
                    "image/svg+xml": global.$$svg$$,
                },
            };
            delete global.$$svg$$;
        }

        if (global.$$mime$$) {
            response = {
                mime: global.$$mime$$,
            };
            delete global.$$mime$$;
        }

        return response ? response : {
            mime: {
                "text/plain": util.inspect(result),
            }
        };

        function toHtml(obj) {
            return "<pre>" + util.inspect(obj).
            replace(/&/g, '&amp;').
            replace(/</g, '&lt;').
            replace(/>/g, '&gt;').
            replace(/"/g, '&quot;').
            replace(/'/g, '&#39;') + "</pre>";
        }
    }

    function formatError(error) {
        return {
            error: {
                ename: error.name,
                evalue: error.message,
                traceback: error.stack.split("\n"),
            }
        };
    }

    function run(code) {
        return vm.runInThisContext(code);
    }

    function getAllPropertyNames(object) {
        var propertyList = [];

        if (object === undefined) {
            return [];
        }

        if (object === null) {
            return [];
        }

        var prototype;
        if (typeof object === "boolean") {
            prototype = Boolean.prototype;
        } else if (typeof object === "number") {
            prototype = Number.prototype;
        } else if (typeof object === "string") {
            prototype = String.prototype;
        } else {
            prototype = object;
        }

        var prototypeList = [prototype];

        function pushToPropertyList(e) {
            if (propertyList.indexOf(e) === -1) {
                propertyList.push(e);
            }
        }

        while (true) {
            var names;
            try {
                names = Object.getOwnPropertyNames(prototype);
            } catch (e) {
                break;
            }
            names.forEach(pushToPropertyList);

            prototype = Object.getPrototypeOf(prototype);
            if (prototype === null) {
                break;
            }

            if (prototypeList.indexOf(prototype) === -1) {
                prototypeList.push(prototype);
            }
        }

        return propertyList.sort();
    }

    function inspect(object) {
        if (object === undefined) {
            return {
                string: "undefined",
                type: "Undefined",
            };
        }

        if (object === null) {
            return {
                string: "null",
                type: "Null",
            };
        }

        if (typeof object === "boolean") {
            return {
                string: object ? "true" : "false",
                type: "Boolean",
                constructorList: ["Boolean", "Object"],
            };
        }

        if (typeof object === "number") {
            return {
                string: util.inspect(object),
                type: "Number",
                constructorList: ["Number", "Object"],
            };
        }

        if (typeof object === "string") {
            return {
                string: object,
                type: "String",
                constructorList: ["String", "Object"],
                length: object.length,
            };
        }

        var result = {
            string: toString(object),
            type: "Object",
            constructorList: getConstructorList(object),
        };

        if ("length" in object) {
            result.length = object.length;
        }

        return result;

        function toString(object) {
            try {
                return util.inspect(object.valueOf());
            } catch (e) {
                return util.inspect(object);
            }
        }

        function getConstructorList(object) {
            var constructorList = [];

            var prototype = Object.getPrototypeOf(object);
            while (true) {
                try {
                    constructorList.push(prototype.constructor.name);
                } catch (e) {
                    break;
                }
                prototype = Object.getPrototypeOf(prototype);
            }

            return constructorList;
        }
    }
})();
