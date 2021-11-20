# Installation

The instructions to install IJavascript are platform-dependent and very much
determined by the following dependencies:

- [Node.js](http://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Jupyter notebook](http://jupyter.org/)


## Contents

- [Debian and Ubuntu](#debian-and-ubuntu)
  - [Global installation](#global-installation)
  - [Local installation](#local-installation)
  - [PPA repository](#ppa-repository)
  - [Older versions](#older-versions)
- [macOS](#macos)
- [Windows](#windows)
- [nvm](#nvm)
- [conda](#conda)
- [Other platforms](#other-platforms)


## Debian and Ubuntu

The requirements for recent versions of Debian and Ubuntu are:

```sh
sudo apt-get install nodejs npm jupyter
```

The Jupyter notebook is not yet available in the Debian 8.3 and Ubuntu 16.04 LTS
repositories. Instead, the IPython notebook can be installed:

```sh
sudo apt-get install nodejs-legacy npm ipython ipython-notebook
```

Alternatively, the Jupyter notebook can be installed via `pip` or `Anaconda`.

`pip` installs the latest Jupyter release from the [Python Package
Index](https://pypi.python.org/pypi):

```sh
sudo apt-get install nodejs-legacy npm g++ libzmq3-dev python-dev python-pip
sudo pip install --upgrade jupyter
```

And [Anaconda](http://continuum.io/downloads) provides a data science platform
that distributes both `Jupyter` (by default) and `Node.js` (optionally).
IJavascript can be installed in an Anaconda setup as follows:

```sh
conda install nodejs
npm install -g ijavascript
ijsinstall
```


### Global installation

IJavascript can be installed globally (i.e. for all users in the system) by
running:

```sh
sudo npm install -g ijavascript
sudo ijsinstall --install=global
```


### Local installation

It is also possible to install IJavascript locally, by setting the `npm` prefix
to your home folder:

```sh
npm config set prefix ~
npm install -g ijavascript
ijsinstall
```

Note that the above command will install all the IJavascript executables in the
folder `~/bin/` and the ijavascript package in `~/lib/node_modules`.


### PPA repository

Gordon Ball has set up a [PPA
repository](https://launchpad.net/%7Echronitis/+archive/ubuntu/jupyter) that
builds deb packages for IJavascript and other Jupyter kernels:

```sh
sudo add-apt-repository ppa:chronitis/jupyter
sudo apt update
sudo apt install ijavascript
```


### Older versions

To install IJavascript in older versions of Debian and Ubuntu, `Node.js` needs
upgrading to a recent version. You can do so by running:

```sh
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
```

The instructions for upgrading `Node.js` have been adapted from those found
[here](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions).


## macOS

[Homebrew](http://brew.sh/) and [pip](https://pip.pypa.io/) can be used to
install the dependencies of IJavascript in macOS:

```sh
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install pkg-config node zeromq
sudo easy_install pip
pip install --upgrade pyzmq jupyter
```

Once the dependencies have been installed, `npm` can be used to install
IJavascript as described above in the section for Ubuntu and Debian.

```sh
npm install -g ijavascript
ijsinstall
```

Also note that the build tool `node-gyp` (which is part of Node.js and is used
to compile native modules) requires Python 2.


## Windows

`Jupyter` could be installed following the instructions
[here](http://jupyter.readthedocs.org/en/latest/install.html). I find more
convenient to install a Python distribution such as
[Anaconda](http://continuum.io/downloads). `Anaconda` not only installs
`Jupyter` and its requirements, but also a selection of frequently-used Python
packages.

`Node.js` provides a [Windows installer](https://nodejs.org/download/). However,
the build tool `node-gyp` will not be functional unless one of the recognised
C++ compilers is installed. See [here](https://github.com/TooTallNate/node-gyp)
for more details,
[here](http://www.microsoft.com/en-us/download/details.aspx?id=34673) for Visual
Studio Express 2012 or
[here](https://www.visualstudio.com/products/visual-studio-express-vs) for a
link to Visual Studio Express 2013.


## nvm

`nvm` is a popular Node Version Manager for users to install specific versions
of Node in their own home folder. These types of installations do not require
the use of `sudo` to install global packages, simply run:

```sh
npm install -g ijavascript
ijsinstall
```

Another consideration for `nvm` users is that IJavascript makes use of
[zeromq](https://github.com/zeromq/zeromq.js), a native module that provides
[ZMQ](http://www.zeromq.org/) bindings. Native modules are specific to a Node
version, and thus they need reinstalling whenever the Node version changes.  To
do so, run:

```sh
nvm reinstall-packages
```

## conda

Here is a step-by-step outline of how you can install ijavascript within a conda virtual environment. If you want to install with conda, but do not care about whether ijavascript is only available within a given virtual environment, then most of these steps can be skipped.

Note that in what follows, phrases enclosed in `<` and `>` denote places where you should substitute a value appropriate to your specific setup. If you haven't already created your conda virtual environment, do so now:

```
conda create --name <name of new virtual environment>
conda activate <name of new virtual environment>
conda install nodejs jupyter
```

For `conda` version 4.5.4. and version 1.0.0 of the `jupyter` conda package, the location of Jupyter in the new virtual environment will be `$CONDA_PREFIX/etc/jupyter`. This motivates the following commands:

```
cd $CONDA_PREFIX/etc
mkdir -p ./jupyter/nbdata ./conda/activate.d ./conda/deactivate.d
touch ./conda/activate.d/env_vars.sh ./conda/deactivate.d/env_vars.sh
```

Now use a text editor to make the contents of `$CONDA_PREFIX/etc/conda/activate.d/env_vars.sh` be the following:

```
#!/bin/bash
export JUPYTER_DATA_DIR=$CONDA_PREFIX/etc/jupyter/nbdata
export JUPYTER_CONFIG_DIR=$CONDA_PREFIX/etc/jupyter/nbconfig
```

and then use a text editor to make the contents of `$CONDA_PREFIX/etc/conda/deactivate.d/env_vars.sh` be the following:

```
#!/bin/bash
unset JUPYTER_DATA_DIR
unset JUPYTER_CONFIG_DIR
```

Exit and then re-enter the new virtual environment:

```
conda deactivate
conda activate <name of new virtual environment>
```

and then finally install ijavascript within the virtual environment:

```
npm install -g ijavascript
ijsinstall
```
Now ijavascript should not only be installed in your new virtual environment, but also be accessible _only_ from that virtual environment.

**Notes:**

1.  In the above, one should use `#!/bin/bash` only if one's shell is BASH, but `#!/bin/sh` if one's shell is Bourne shell, or `#!/bin/zsh` if one's shell is ZSH, etc.
2. Setting the value of Jupyter's configuration path (`JUPYTER_CONFIG_DIR`) isn't strictly necessary. However it will allow you to make changes to Jupyter's settings within that virtual environment without those changes propagating outside of the environment.
3. Exiting and re-entering the new virtual environment ensures that the script `env_vars.sh` actually gets called. Otherwise, there won't be any change to the values of the environment variables, and the kernel spec of ijavascript will be installed somewhere else besides the local Jupyter config folder we created above.
4. If you don't care about restricting ijavascript to a particular virtual environment, the following will work:

```
conda install nodejs
conda install jupyter
npm install -g ijavascript
ijsinstall
```

## Other platforms

For other platforms, instructions to install the IJavascript dependencies may be
found at:
- http://nodejs.org/download/
- http://jupyter.readthedocs.org/en/latest/install.html
- http://zeromq.org/intro:get-the-software
