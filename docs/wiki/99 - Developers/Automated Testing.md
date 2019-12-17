# Automated Testing


## Overview
We make use of TravisCI and various automated testing tools in order to make sure LORIS is clean, stable, and secure.

We require that any pull request sent to the repository passes our entire suite of automated tests. If the code fails these tests, it cannot be merged as it is likely to break some functionality of the application.

This guide provides a high-level overview of the tools we use for testing. It should help to demystify the process of understanding an automated test report and point the way to possible solutions by linking to the documentation fo the tools we use.

Generally there are two categories of testing, **static** and **dynamic**. The following section breaks down the differences between the two and which tools are used for each.

## Static Tests

**Static tests** analyze the code without running it, checking for consistency between documentation and the source code.

Static tests can be executed by running `make checkstatic` in the LORIS root diretory. This command will also use PHP's default linter (`php -l`) to check for basic syntax errors.

We use the following tools for static testing.

### PHP

#### Phan

> Phan looks for common issues and will verify type compatibility on various operations when type information is available or can be deduced.

We use phan extensively to make sure that PHP code is taking advantage of types to produce stable results.

Phan is configured in LORIS to use as many rules as possible. There are a list of excluded rules which are not evaluated on the codebase. Our goal is to eventually use every phan rule and gradually increase the strictness, and thus stability, of the codebase.

The configuration file for phan, which includes a list of all excluded rules, can be found at `.phan/config.php`.

For information about a specific phan rule, read their [breakdown of all issues types caught by phan](https://github.com/phan/phan/wiki/Issue-Types-Caught-by-Phan).

#### PHP Code Sniffer (PHPCS)

> PHP_CodeSniffer is a set of two PHP scripts; the main phpcs script that tokenizes PHP, JavaScript and CSS files to detect violations of a defined coding standard, and a second phpcbf script to automatically correct coding standard violations. PHP_CodeSniffer is an essential development tool that ensures your code remains clean and consistent.

We use PHPCS to create a consistent coding style for PHP files. It also ensures that documentation is provided for functions and classes.

A list of rules used by LORIS can be found in the file `test/LorisCS.xml`. These rules apply to the majority of the codebase. The `src/` folder in LORIS is configured to use different PHPCS rules that conform to the PSR2 standard. These rules can be found in `test/SrcCS.xml`.

As of this writing, the authors of PHPCS have not created a document that explains each and every rule used by PHPCS. If you have issues with your code and PHPCS, please contact us and we'll try to help.

PHPCS documentation can be found on [their GitHub wiki](https://github.com/squizlabs/PHP_CodeSniffer/wiki).


#### PHP Mess Detector (PHPMD)

Currently PHPMD is used by LORIS to check for unused code, e.g. variables that are declared but never use.

Similar to `phan`, we aim to gradually increase the rules used by PHPMD to make LORIS clean and stable.

The configuration file for PHPMD can be found at `test/LorisPHPMD.xml`.

More information about this tool can be found at [the PHP Mess Detector website](http://phpmd.org/documentation/index.html).

### JavaScript

#### eslint

eslint is used in a similar way to PHPCS, checking for code style and flagging basic syntax errors. 

Configuration files can be located at `.eslintrc.json` and `.eslintignore`.

Further information can be found at [the eslint website](https://eslint.org/docs/rules/).


## Dynamic Tests

**Dynamic testing** includes _unit tests_ and _integration tests_. A unit test is a small chunk of code that executes a function and make sure it does what it's supposed to using fake data. An integration test simulates a person using a web browser and interacting with UI elements, making sure that taking an action on a webpage causes a result that makes sense.

We use Docker to help us simulate a server running LORIS. The installation and usage of Docker testing in LORIS is covered in our [testing README file in the `test/` directory](https://github.com/aces/Loris/blob/master/test/README.md).

### Unit Tests

LORIS uses the [PHPUnit library](https://phpunit.de/) for unit tests.

Unit testing is covered in depth in our [Unit Test Guide](test/UnitTestGuide.md).

Unit test files can be found in the folder `test/unittests/`.

### Integration Tests

Integration tests are done on a per-module basis. Integration tests for a module can be found under the `test/` directory within that modules folder. An example filepath from the LORIS root would be `modules/document_repository/test/document_repositoryTest.php`. 

Integration tests typically will test the basics of a LORIS module, including checking a user's permissions, filtering a table, or navigating the application using links.

Errors with integration tests usually occur when a change is introduced that causes a link in LORIS to break. Issues can also occur when an HTML element is moved or renamed and the corresponding test has not been updated to refer to the new name.

If you have issues with an integration test, please contact us and we'll do our best to help you sort it out. 
