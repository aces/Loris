# Contributing to Loris

We'd love to have you contribute to Loris. The first thing you should do
before contributing is probably sign up for the [LORIS developers' mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev).

Your next step before issuing a pull request is to review our [Coding Standards](https://github.com/aces/Loris/blob/minor/docs/CodingStandards).

You can also learn about our code review process by perusing our [Code Review Checklist](https://github.com/aces/Loris/wiki/Code-Review-Checklist) in the [LORIS Wiki](https://github.com/aces/Loris/wiki). These will be some of the factors we'll consider when reviewing your code.

## Development branches

You should base your pull requests on one of the following branches depending on the kind of change you are making:

 - **Bug Fixes**
   - Branch: `bugfix`
   - Label: _[branch] bugfix_
   - Content: Generally these changes do not require SQL scripts and are concise with the sole objective to correct on single problem in the code.

 - **Minor Changes** and **Small Features**
   - Branch: `minor`
   - Label: _[branch] minor_
   - Content: Features affecting self-contained components such as modules. Additions to Libraries, API or modules that do not change and function signatures. 

 - **Major Changes**, **Non Backwards-Compatible Changes** and **Large Features**
   - Branch: `major`
   - Label: _[branch] major_
   - Content: Any change modifying a function signature in a library class. Features require extensive LORIS-wide testing. New complex systems and features spanning across multiple modules and libraries. Deprecated functions clean-up.

For more information about making well-organized pull requests, please read our in-depth Wiki page, ["Contributing to the Code"](https://github.com/aces/Loris/wiki/Contributing-to-the-Code).


## Some Things To Keep In Mind

* If your changes require any table modifications, don't forget to modify the
  `SQL/0000*.sql` file(s) with your changes for new installs, and also
  include a patch for existing projects to apply to get your changes of which
  should be placed in the corresponding `SQL/VERSIONNUMBER/` directory.
* Include a test for any new module in the `modules/MODULENAME/test/`
  directory. You can look at other modules for examples of how to write tests.
  If you have questions, feel free to mail the mailing list.
* Add your new automated tests to TravisCI in the `.travis.yml`. 
* Make sure you run PHP codesniffer using the standards file in
  `docs/LorisCS.xml` before sending any pull request, otherwise the automated tests will fail.
* Try and make all changes backwards-compatible with existing installations. If you must change something
  in a non-backwards-compatible way, document it in your pull request description and
  tag it with ![](https://via.placeholder.com/15/d4c5f9/000000?text=+) **Caveat for Existing Projects** so that we know that the change needs to be mentioned in release notes. 

## Getting Started

If you're looking for ideas for a way to contribute but don't know where to begin, here are some ideas to get you started:

* You can browse some of our public [Issues](https://github.com/aces/Loris/issues). Issues tagged with (https://via.placeholder.com/15/0e8a16/000000?text=+) **Beginner Friendly** are good ones to tackle if you are new to LORIS development.
* You can run PHP CodeSniffer on modules that haven't had it run yet.
* You can help improve our documentation if you find any parts of it confusing or
  lacking.
* You can track down bugs by browsing the application and reviewing the PHP error log.
