<nav style="float: left;
            padding: 2em;
            margin: 0 2em 2em 0;
            border: 1px solid;
            border-radius: 10px;
            text-align: center;">
<h1><img alt="Links" src="images/logo-128x128.png"></h1>
<a href="http://n-riesco.github.io/ijavascript">IJavascript Home Page</a><br>
<a href="http://github.com/n-riesco/ijavascript">IJavascript Repository</a><br>
<a href="http://github.com/n-riesco/jp-babel">jp-babel Repository</a><br>
<a href="http://github.com/n-riesco/jp-coffeescript">jp-coffeescript Repository</a><br>
</nav>


# IJavascript

IJavascript is a Javascript kernel for the [Jupyter
notebook](http://jupyter.org/). The Jupyter notebook combines the creation of
rich-text documents (including equations, graphs and videos) with the execution
of code in a number of programming languages. The execution of code is carried
out by means of a kernel that implements the [Jupyter messaging
protocol](http://jupyter-client.readthedocs.io/en/latest/messaging.html).

The IJavascript kernel executes Javascript code inside a
[Node.js](https://nodejs.org/) session. And thus, it behaves as the Node.js REPL
does, providing access to the Node.js library and to any installed
[npm](https://www.npmjs.com/) modules.

There are kernels available for [Python](http://ipython.org/notebook.html),
[Julia](https://github.com/JuliaLang/IJulia.jl),
[Ruby](https://github.com/minad/iruby),
[Haskell](https://github.com/gibiansky/IHaskell) and [many
other languages](https://github.com/ipython/ipython/wiki/IPython-kernels-for-other-languages).

<div style="clear: both;" />

Here's a sample notebook that makes use of the IJavascript kernel:

![Screenshot: Notebook Hello Sample](images/screenshot-notebook-hello.png)


## Contents

- [Announcements](#announcements)
- [Main Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributions](#contributions)
- [TODO](#todo)

## Announcements

- Starting with IJavascript v5.0.11, it is possible to customise the output of
  an object based on its type. See the documentation on [custom
  output](http://github.com/n-riesco/ijavascript/tree/dev/doc/custom.ipynb) for
  details.
- The use of `$$mimer$$` and `$$defaultMimer$$` to customise output is now
  deprecated.
- To avoid clutter in the global context, the use of `$$async$$`, `$$done$$`,
  `$$mime$$`, `$$html$$`, `$$svg$$`, `$$png$$` and `$$jpeg$$` has also been
  deprecated and replaced with the global object `$$`. For usage, see the
  documentation
  [here](http://github.com/n-riesco/ijavascript/tree/dev/doc/async.ipynb) and
  [here](http://github.com/n-riesco/ijavascript/tree/dev/doc/custom.ipynb).


## Main Features

- Run Javascript code inside a `Node.js` session
- [Hello, World!](http://n-riesco.github.io/ijavascript/doc/hello.ipynb.html)
- [Graphical
  output](http://n-riesco.github.io/ijavascript/doc/graphics.ipynb.html) for
  `HTML`, `SVG`, `PNG`, ...
- [Asynchronous
  output](http://n-riesco.github.io/ijavascript/doc/async.ipynb.html)
- [Autocompletion](http://n-riesco.github.io/ijavascript/doc/complete.md.html):
  press `TAB` to complete keywords and object properties
- [Object
  inspection](http://n-riesco.github.io/ijavascript/doc/inspect.md.html): press
  `Shift-TAB` to inspect an object and show its content or, if available, its
  documentation

There are also a number of experimental features documented
[here](http://github.com/n-riesco/ijavascript/tree/dev/doc):

- [Asynchronous
  output](http://github.com/n-riesco/ijavascript/tree/dev/doc/async.ipynb)
- [Custom
  output](http://github.com/n-riesco/ijavascript/tree/dev/doc/custom.ipynb)


## Installation

IJavascript is distributed as an [npm](https://www.npmjs.com/) package and thus
it requires:

- [Node.js](http://nodejs.org/)
- [npm](https://www.npmjs.com/)

Depending on your use, other [Jupyter tools](http://jupyter.org/) will be
necessary (e.g. Jupyter notebook). Note that IJavascript has been kept
backwards-compatibility with IPython v1, so that it's possible to use the
IPython notebook distributed in Ubuntu 14.04 LTS and Ubuntu 16.04 LTS.

To install IJavascript in Ubuntu 16.04 LTS, run:

```sh
sudo apt-get install nodejs-legacy npm ipython ipython-notebook
sudo npm install -g ijavascript
```

In Windows, [Anaconda](http://continuum.io/downloads) offers a convenient
distribution to install Python and many other packages, such as Jupyter and
IJavascript.

In macOS, [Homebrew](http://brew.sh/) and
[pip](https://pip.pypa.io/en/latest/installing) can be used to install
IJavascript and its prerequisites:

```sh
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install pkg-config node zeromq
sudo easy_install pip
sudo pip install --upgrade pyzmq jupyter
sudo npm install -g ijavascript
```

For other platforms or if you find any problems with the instructions above,
please, refer to the [installation
notes](http://n-riesco.github.io/ijavascript/doc/install.md.html).


## Usage

IJavascript provides 5 executables: `ijsinstall`, `ijsnotebook`, `ijsconsole`,
`ijskernel` and `ijs`. Their purpose and basic use is described in the sections
below. Please, refer to the [usage
notes](http://n-riesco.github.io/ijavascript/doc/usage.md.html) for further
details.


### `ijsinstall`: IJavascript kernel spec installer

'ijsinstall` registers the IJavascript kernel with Jupyter, so that other tools
(e.g. the Jupyter notebook) can invoke it. The following command flags are
recognised:

```
--debug                   enable debug messages
--help                    show this help
--hide-undefined          do not show undefined results
--install=[local|global]  install kernel for current user or globally
--protocol=version        set messaging protocol version, e.g. 5.0
--show-undefined          show undefined results
--spec-path=[none|full]   set whether kernel spec uses full paths
--startup-script=path     run script on kernel startup
                          (path can be a file or a folder)
--version                 show kernel version
--versions                show kernel and library versions
--working-dir=path        set kernel working directory
                          (default = current working directory)
```


### `ijsnotebook`: IJavascript notebook

After running `ijsinstall`, Jupyter notebook users can invoke the Jupyter
notebook as usual. `ijsnotebook` is provided for convenience to users of the
IPython notebook prior to version 3. `ijsnotebook` is a wrapper around
`ipython notebook`. It extends the command flags accepted by `ipython notebook`
with the following:

```
--help                        show IJavascript and notebook help
--ijs-debug                   enable debug messages
--ijs-help                    show this help
--ijs-hide-undefined          do not show undefined results
--ijs-install=[local|global]  install kernel for current user or globally
--ijs-protocol=version        set protocol version, e.g. 5.0
--ijs-show-undefined          show undefined results
--ijs-spec-path=[none|full]   set whether kernel spec uses full paths
--ijs-startup-script=path     run script on startup
                              (path can be a file or a folder)
--ijs-working-dir=path        set kernel working directory
                              (default = current working directory)
--version                     show kernel version
--versions                    show kernel and library versions
```


### `ijsconsole`: IJavascript console

`ijsconsole` is provided for convenience to users as a wrapper around `ipython
console`. The following command flags are recognised:

```
--help                        show IJavascript and notebook help
--ijs-debug                   enable debug messages
--ijs-help                    show this help
--ijs-hide-undefined          do not show undefined results
--ijs-install=[local|global]  install kernel for current user or globally
--ijs-protocol=version        set protocol version, e.g. 5.0
--ijs-show-undefined          show undefined results
--ijs-spec-path=[none|full]   set whether kernel spec uses full paths
--ijs-startup-script=path     run script on startup
                              (path can be a file or a folder)
--ijs-working-dir=path        set kernel working directory
                              (default = current working directory)
--version                     show kernel version
--versions                    show kernel and library versions
```


### `ijskernel`: IJavascript kernel

`ijskernel` is the executable invoked by Jupyter tools (e.g. the notebook) and
that appears in the kernel spec that `ijsintall` creates for IJavascript. You
won't need this command, unless you want to create a custom kernel spec.

```
Usage:
    ijskernel [options] connection_file

Options:
    --debug                           enable debug messages
    --hide-undefined                  do not show undefined results
    --protocol=Major[.minor[.patch]]  set protocol version, e.g. 5.0
    --session-working-dir=path        set session working directory
    --show-undefined                  show undefined results
    --startup-script=path             run script on startup
					  (path can be a file or a folder)
```


### `ijs`: Deprecated CLI

`ijs` is provided for backwards-compatibility. It will be removed in the next
major-version update. Please, use `ijsinstall` or `ijsnotebook` instead.


# Contributions

First of all, thank you for taking the time to contribute. Please, read
[CONTRIBUTING](http://n-riesco.github.io/ijavascript/contributing.html) and use
the [issue tracker](https://github.com/n-riesco/ijavascript/issues) for any
contributions: support requests, bug reports, enhancement requests, pull
requests, submission of tutorials...


# TODO

- Complete the implementation of the Jupyter messaging protocol v4.1
- Complete the implementation of the Jupyter messaging protocol v5.0

See TODO list in packages [jp-kernel](https://github.com/n-riesco/jp-kernel) and
[NEL](https://github.com/n-riesco/jp-kernel) for additional items.
