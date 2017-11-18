# Contributing to IJavascript

First of all, thank you for taking the time to contribute.

Here, you will find relevant information for contributing to this project.

## Issue tracker

Please, feel free to use the [issue
tracker](https://github.com/n-riesco/ijavascript/issues) to report any problems
you encounter or any enhancements you would like to see implemented. To
facilitate the process of fixing a problem, please, include the following
information in your report:

- IJavascript version. Please, run the command:

  ```sh
  ijs --version
  ```

## Code contributions

- Pull requests will be distributed under the terms in the LICENSE file. Hence,
  before accepting any pull requests, it is important that the copyright holder
  of a pull request acknowledges their consent. To express this consent, please,
  ensure the AUTHORS file has been updated accordingly.

- If your contribution is more than a few lines, please, open an issue in the
  [issue tracker](https://github.com/n-riesco/nel/issues).

- This package uses Mocha for testing. The tests are located in folder
  `test/` and to run them:

  ```sh
  npm test
  ```

## Coding guidelines

- Do not change the coding style and ensure new code follows the coding style
  already present. In particular, for this project:

  - use Javascript naming conventions; i.e.
    lowerCamelCaseForVariablesAndPackages, UpperCamelCaseForClasses and
    UPPERCASE_FOR_CONSTANTS.

  - 4-space indent

  - collapsed brackets

  - no space inside parentheses

  - ...

- Do not introduce new dependencies unless previously agreed.

- Do not break backwards-compatibility unless previously agreed.

- The Jupyter Messaging Protocol uses underscores (`_`) in their the naming
  convention (as recommended in
  [PEP8](https://www.python.org/dev/peps/pep-0008/)). For these names, I find
  more readable to keep the original naming (although, if possible limited to a
  local scope).

- The source code is annotated using [JSDoc](https://github.com/jsdoc3/jsdoc).
  Run the command:

  ```sh
  npm run doc
  ```

  to generate the JSDoc documentation in folder `doc`.
