# Usage

To start an IPython notebook session with the IJavascript kernel, simply run:

```sh
ijs
```

This command should open the IPython notebook dashboard in your default web
browser:

![Screenshot: IPython Notebook
Dashboard](../images/screenshot-dashboard-home.png)

## Register IJavascript with the dashboard

Those users running multiple kernels may register IJavascript without opening
the dashboard by running:

```sh
ijs --ijs-install-kernel
```

## Set the dashboard home folder

By default, the dashboard lists the notebooks in the current working folder. The
flag `--notebook-dir=path/to/another/folder` can be used to open the dashboard
at a different folder:

```sh
ijs --notebook-dir=path/to/another/folder
```

![Screenshot: IPython Notebook
--notebook-dir](../images/screenshot-dashboard-dir.png)

## Set the working folder

Also by default, the IJavascript kernel runs a `node.js` session in the current
working folder. The flag `--ijs-working-dir=path/to/another/folder` can be used
to run the `node.js` session at a different folder.

![Screenshot: IPython Notebook
--ijs_working-dir](../images/screenshot-notebook-dir.png)

## Other command flags

Documentation on other flags can be found by running:

```sh
ijs --ijs-help
```

and

```sh
ipython notebook --help-all
```

## Sample notebooks

Here's a sample notebook that makes use of the Javascript kernel:

![Screenshot: Notebook Hello Sample](../images/screenshot-notebook-hello.png)

More examples of use can be found on the [IJavascript
website](https:///n-riesco.github.io/ijavascript/index.html).
