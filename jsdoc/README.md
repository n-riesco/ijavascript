IJavascript is an `npm` package that provides:
- a Javascript kernel for the [Jupyter](http://jupyter.org/) console and
  notebook, the [Hydrogen](https://atom.io/packages/hydrogen) Atom plugin, the
  [nteract](https://github.com/nteract/nteract) frontend, ...
- and a command, `ijs`, to install the kernel and invoke the Jupyter notebook.

IJavascript shares a significant portion of code with the CoffeeScript kernel,
[jp-coffeescript](https://github.com/n-riesco/jp-coffeescript) and the Babel
kernel, [jp-babel](https://github.com/n-riesco/jp-babel).

This overview is comprised of two sections. A section to describe the purpose of
the main files in this project. Followed by another section to describe the
purpose of the main classes.

# Main Files

`bin/ijavascript.js`  
    Script to install the IJavascript kernel and/or launch the Jupyter
    dashboard.

`lib/kernel.js`  
    IJavascript kernel.

`lib/handlers_v4.js`  
    Kernel methods to handle messages of protocol v4.

`lib/handlers_v5.js`  
    Kernel methods to handle messages of protocol v5.

# Main Classes

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
