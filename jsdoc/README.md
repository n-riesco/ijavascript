# Source Code Overview

This overview starts with a section to describe the purpose of the main files in
this project. Followed by another section to describe the purpose of the most
important classes. The overview finishes with a section to help create a kernel
for other languages. To this end, the final section describes the interface
implemented by [package `NEL`](https://github.com/n-riesco/nel).

[jp-babel](https://github.com/n-riesco/jp-babel) and
[jp-coffeescript](https://github.com/n-riesco/jp-coffeescript) are examples of
kernels that have modified the `NEL` package and reused the code in IJavascript.

## Main Files

`bin/ijavascript.js`  
    Script to install the IJavascript kernel and/or launch the notebook
    dashboard.

`lib/kernel.js`  
    IJavascript kernel.

`lib/handlers_v4.js`  
    Kernel methods to handle messages of protocol v4.

`lib/handlers_v5.js`  
    Kernel methods to handle messages of protocol v5.

## Main Classes

`Kernel`  
    IJavascript kernel. The constructor of this class is passed an object with
    the configuration. See [the documentation generated using
    JSDoc](Kernel.html#Kernel) for more details.

`nel~Session`  
    The class `nel~Session` is used to launch a Node.js session and make
    execution, inspection and completion requests.

`jmp~Socket`  
    ZMQ socket that transparently encodes/decodes Jupyter-protocol messages. See
    [the documentation generated using
    JSDoc](http://n-riesco.github.io/jmp/module-jmp-Socket.html) for more
    details.

`jmp~Message`  
    Jupyter-protocol Message. See [the documentation generated using
    JSDoc](http://n-riesco.github.io/jmp/module-jmp-Message.html) for more
    details.

## Overview of the interface between `Kernel` and `nel~Session`

(This section corresponds to `NEL v0.1`. The interface will be simplified in
`NEL v0.2`.)

To develop a kernel for another language, a new `NEL` package that implements
the following interface with the `Kernel` class should be developed:  

`nel~Task`  
    This object represents an execution, completion or inspection request. See
    [the documentation generated using
    JSDoc](http://n-riesco.github.io/nel/module-nel.html#~Task) for more
    details.

`nel~Session.run`  
    Method to make execution requests. See [the documentation generated using
    JSDoc](http://n-riesco.github.io/nel/module-nel-Session.html#run) for more
    details.

`nel~Session.complete`  
    Method to make completion requests. See [the documentation generated using
    JSDoc](http://n-riesco.github.io/nel/module-nel-Session.html#complete) for
    more details.

`nel~Session.inspect`  
    Method to make inspection requests. See [the documentation generated using
    JSDoc](http://n-riesco.github.io/nel/module-nel-Session.html#inspect) for
    more details.

`nel~Session.kill`  
    Method to kill the session. See [the documentation generated using
    JSDoc](http://n-riesco.github.io/nel/module-nel-Session.html#kill) for more
    details.

`nel~Session.restart`  
    Method to restart the session. See [the documentation generated using
    JSDoc](http://n-riesco.github.io/nel/module-nel-Session.html#restart) for
    more details.

`nel~Session.result`  
    This property stores the results of an action. See [the documentation
    generated using
    JSDoc](http://n-riesco.github.io/nel/module-nel-Session.html#result) for
    more details.

`nel~Session.stdin`  
    A writable stream that represents the session `stdin`. See [the
    documentation generated using
    JSDoc](http://n-riesco.github.io/nel/module-nel-Session.html#stdin).

`nel~Session.stdout`  
    A readable stream that represents the session `stdout`. See [the
    documentation generated using
    JSDoc](http://n-riesco.github.io/nel/module-nel-Session.html#stdout).

`nel~Session.stderr`  
    A readable stream that represents the session `stderr`. See [the
    documentation generated using
    JSDoc](http://n-riesco.github.io/nel/module-nel-Session.html#stderr).

