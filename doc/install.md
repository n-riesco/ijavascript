# Installation

The instructions to install IJavascript are platform-dependent and very much
determined by the following dependencies:

- [ZeroMQ](http://zeromq.org/)
- [Node.js](http://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [IPython notebook](http://ipython.org/notebook.html)

## Debian and Ubuntu

In recent distributions Debian and Ubuntu distributions, the IJavascript
dependencies are available from their repositories and can be installed by a
user with administrator rights:

```sh
sudo apt-get install nodejs-legacy npm ipython ipython-notebook libzmq3-dev
```

Note, however, that the versions available in the repositories are fairly old.
If you wish to install the latest stable versions, see the section
for Ubuntu 12.04 further below.


### Global installation

IJavascript can be installed globally (i.e. for all users in the system) by a
user with administrator rights by running:

```sh
sudo npm install -g ijavascript
```

### Local installation

It is possible to install IJavascript locally:

```sh
npm install ijavascript
```

But note that the above command will install the executable `ijs` in the folder
`~/node_modules/.bin/` and you may want to add this folder to your `PATH`:

```sh
echo \"PATH=\"\$HOME/node_modules/.bin:\$PATH\" >> ~/.profile
```

The above change won't take effect until you log out of the current session.

### Ubuntu 12.04

To install IJavascript in Ubuntu 12.04, both `Node.js` and `IPython` need
upgrading to a recent version. You can do so by running:

```sh
sudo apt-get install libzmq-dev python-dev python-pip g++ curl
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs
sudo pip install --upgrade ipython jinja2 tornado jsonschema pyzmq
```

The instructions for upgrading `node.js` have been adapted from those found
[here](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#debian-and-ubuntu-based-linux-distributions).

## OS X

I don't have access to a OS X machine, but I have been told that
[Homebrew](http://brew.sh/) may help with the installation of the IJavascript
dependencies in OS X. I would be grateful if OS X users could confirm the
instructions below work as intended:

```sh
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install pkg-config node zeromq
sudo easy_install pip
sudo pip install -U jupyter  # Refer http://jupyter.readthedocs.org/en/latest/install.html
```

Once the dependencies have been installed, `npm` can be used to install
IJavascript as described above in the section for Ubuntu and Debian.

## Windows

`IPython` could be installed following the instructions at
[ipython.org/install](http://ipython.org/install.html). I find more convenient
to install a Python distribution such as `Anaconda`; see
[here](http://continuum.io/downloads). `Anaconda` not only installs `IPython`
and its requirements, but also a selection of frequently-used Python packages.

`Node.js` provides a [Windows installer](https://nodejs.org/download/). However,
the build tool `node-gyp` will not be functional unless one of the recognised
C++ compilers is installed. See [here](https://github.com/TooTallNate/node-gyp)
for more details,
[here](http://www.microsoft.com/en-us/download/details.aspx?id=34673) for Visual
Studio Express 2012 or
[here](https://www.visualstudio.com/products/visual-studio-express-vs) for a
link to Visual Studio Express 2013.

## Other platforms

For other platforms, instructions to install the IJavascript dependencies may be
found at [nodejs.org/download](http://nodejs.org/download/),
[ipython.org/install](http://ipython.org/install.html) and
[zeromq.org/intro:get-the-software](http://zeromq.org/intro:get-the-software).
