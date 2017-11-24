# IJavascript source code overview

IJavascript provides a Javascript kernel for the [Jupyter
project](http://jupyter.org/). Its code is currently split into 3 `npm`
packages: [ijavascript](https://www.npmjs.com/package/ijavascript),
[nel](https://www.npmjs.com/package/nel) and
[jmp](https://www.npmjs.com/package/jmp).

## Package `ijavascript`

IJavascript provides the command, `ijs`, which is a link to `bin/ijavascript.js`
and is used to install the Javascript kernel and invoke the Jupyter notebook.

The Javascript kernel is implemented in `lib/kernel.js` by means of the `Kernel`
class. The CoffeeScript kernel,
[jp-coffeescript](https://github.com/n-riesco/jp-coffeescript), and the Babel
kernel, [jp-babel](https://github.com/n-riesco/jp-babel), share a significant
amount of the code with `lib/kernel.js`. To facilitate the reuse of this shared
code, the `Kernel` class will be moved into its own `npm` package in the near
future.

The `Kernel` class depends on the `npm` packages, `nel` and `jmp`.

## Package `nel`

The `nel` package defines `Session`, a class that upon instantiation starts a
small `Node.js` server, `lib/nel_server.js`. The `Session` instance and
`lib/nel_server.js` communicate by means of an IPC channel. The `Session`
instance sends `lib/nel_server.js` three strings per request: `action`, `code`
and `id`. `action` is a string that determines the type of request: execution,
completion or inspection. `code` is a string with the Javascript code to be
executed, completed or inspected. And `id` is a string that identifies the
request.  `lib/nel_server.js` responds to the request with either a
[SuccessResult](http://n-riesco.github.io/nel/module-nel.html#~SuccessResult) or
an [ErrorResult](http://n-riesco.github.io/nel/module-nel.html#~ErrorResult).
Each response contains the property `id` set to the request `id`, so that the
`Session` instance can invoke the callbacks associated with the request.

The interface between the classes `Kernel` and `Session` is documented
[here](http://n-riesco.github.io/nel/module-nel-Session.html).

## Package `jmp`

The `jmp` package is wrapper around the package `node-zmq` that transparently
encodes/decodes Jupyter-protocol messages over a ZMQ socket. See the
JSDoc-generated documentation [here](http://n-riesco.github.io/jmp) for further
details.
