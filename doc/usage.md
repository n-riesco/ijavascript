# Usage

This documentation illustrates some of the flags supported by the IJavascript
executables. To get the full list of command flags, run:

```sh
ijsinstall --help
```

```sh
ijsnotebook --help
```

```sh
ijsconsole --help
```

```sh
ijskernel --help
```


## Install the IJavascript Kernel Globally

By default, the IJavascript kernel is installed locally; i.e. for the current
user only. To install the kernel for all users, run:

```sh
ijsinstall --install=global
```


## Install the IJavascript Kernel Using Full Paths

By default, `ijsinstall` creates a kernel spec with no paths. For this kernel
spec to work, it is necessary that the executable `ijskernel` is located in one
of the folders listed in the environment variable `PATH` (this is usually the
case when IJavascript was installed by running `npm install -g ijavascript`).

Alternatively, `ijsinstall` can be instructed to create a kernel spec with full
paths:

```sh
ijsinstall --spec-path=full
```

In this case, the full path to `node` and `ijskernel` will be included in the
kernel spec. Note also that in this case if either `node` or `ijskernel` change
their location (e.g. when a new version of node is installed), then the command
`ijsinstall --spec-path=full` would have to be rerun (to create a kernel spec
with the updated paths).


## Set the Kernel Working Folder

The IJavascript kernel, also by default, runs a `Node.js` session in the current
working folder. To run the `Node.js` session in a different folder:

```sh
ijsinstall --working-dir=/path/to/working/dir
```

![Screenshot: Jupyter Notebook
--ijs_working-dir](../images/screenshot-notebook-dir.png)


## Run Startup Scripts

It is possible to run one or more scripts at the startup of an IJavascript
session. This can be useful to preload `npm` packages (e.g.
[d3](https://www.npmjs.com/package/d3) and
[jsdom](https://www.npmjs.com/package/jsdom)).

To preload a script, use the flag `--startup-script=/path/to/script.js`:

```sh
ijsinstall --startup-script=/path/to/script.js
```

For convenience, it is also possible to preload all the Javascript files in a
folder. The execution order is determined by the alphabetical order of their
filenames; i.e.: `50-jsdom.js` before `60-d3-ijavascript-wrapper.js`.

```sh
ijsinstall --startup-script=/path/to/folder
```


## Show/Hide `undefined` results

The IJavascript kernel offers the option to show or hide the result of an
execution request if it is `undefined`.

By default, `ijsnotebook` installs an IJavascript kernel that hides `undefined`
results, whereas `ijsconsole` installs a kernel that shows `undefined` results.

`ijsinstall` and `ijskernel` provide the flags `--hide-undefined` and
`--show-undefined` to controls this behaviour.


## Other Command Flags

`ijsnotebook` and `ijsconsole` are wrappers around `jupyter notebook` and
`jupyter console` that install the IJavascript kernel before opening the
notebook dashboard or a console.

Both `ijsnotebook` and `ijsconsole` accept the same command flags `jupyter
notebook` and `jupyter console` accept.

For example, by default, `jupyter notebook` opens the notebook dashboard in the
current working folder. To open the dashboard in a different folder, run:

```sh
ijsnotebook --notebook-dir=/path/to/another/folder
```

![Screenshot: Jupyter Notebook
--notebook-dir](../images/screenshot-dashboard-dir.png)
