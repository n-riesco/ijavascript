# Contributing to IJavascript

First of all, thank you for taking the time to contribute.

Here, you will find important information for contributing to this project.

## Reporting an issue

Please, feel free to report any issues you encounter or any enhancements you
would like to see implemented. To facilitate the process of fixing an issue,
please, include the following information in your report:

- npm version. Please, run the command:

```sh
npm version
```

- Operating system. In most modern linux distributions, it is enough to run:

```sh
lsb_realease -sd
```

## Sending Pull Requests

- Pull requests will be distributed under the terms in the LICENSE file. Hence,
  before accepting any pull requests, it is important that the copyright holder
  of a pull request acknowledges their consent. To express this consent, please,
  ensure the AUTHORS file has been updated accordingly.

## Coding Guidelines

- For the sake of readability, please, ensure the coding style of your pull
  requests is consistent with this project: lowerCamelCaseNaming,
  CONSTANTS_NAMING, 4-space indent, collapsed brackets... As a guideline, I will
  try to follow the recommendations proposed in the [Google Javascript Style
  Guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml).

- The IPython protocol uses underscores, `_`, in their the naming convention (as
  recommended in [PEP8](https://www.python.org/dev/peps/pep-0008/)). For these
  names, I find more readable to keep the original naming (although, if possible
  limited to a local scope).
