# Contributing to Loris

We'd love to have you contribute to Loris. The first thing you should do
before contributing is probably sign up for the [LORIS developers' mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev).

## Code Contributions

If you'd like to contribute code, here are some things to keep in mind.

* If your changes require any table modifications, don't forget to modify the
  SQL/0000-00-00-schema.sql file with your changes for new installs, and also
  include a patch for existing projects to apply to get your changes.
* Include a test for any new module in the modules/MODULENAME/test/
  directory. You can look at other modules for examples of how to write tests.
  If you have questions, feel free to mail the mailing list.
* Add your new tests to get auto-run by Travis in the travis.yml to make sure that
  other people don't accidentally break your module.
* Try and make sure you run PHP codesniffer using the standards file in
  docs/LorisCS.xml before sending any pull request, otherwise the Loris tests may
  fail and we won't be able to merge your pull request.
* Keep in mind that people are currently using Loris and try and make any changes
  backwards-compatible with existing installations. If you must change something
  in a non-backwards compatible way, document it in your pull request description and
  tag it with "Caveat For Existing Projects" so that we know that the change needs
  to be mentioned in release notes.

## Ways To Get Started

If you're looking for ideas for a way to contribute but don't know where to get
started, some ideas to get you started:

* You can run PHP CodeSniffer on modules that haven't had it run yet.
* You can go through modules and convert any old SQL statements to prepared
  statements
* You can go through modules and remove old PEAR exception handling (PEAR::isError
  calls) since we now use PHP5 exceptions
* You can help improve our documentation if you find any parts of it confusing or
  lacking
* You can try and track down any bugs
