# Contributing to Loris

We'd love to have you contribute to Loris. The first thing you should do
before contributing is probably sign up for the [LORIS developers' mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev).

## Development branches

The master branch is reserved for stable releases.
Your current version number can be found in the VERSION file under the LORIS root.

Pull requests should be based on and sent to a specific development branch according to the [Loris Wiki: Contributing to the Code](https://github.com/aces/Loris/wiki/Contributing-to-the-Code) guidelines  

## Code Contributions

If you'd like to contribute code, here are some things to keep in mind.

* If your changes require any table modifications, don't forget to modify the
  SQL/0000*.sql file(s) with your changes for new installs, and also
  include a patch for existing projects to apply to get your changes of which
  should be placed in the corresponding SQL/VERSIONNUMBER/ directory.
* Include a test for any new module in the modules/MODULENAME/test/
  directory. You can look at other modules for examples of how to write tests.
  If you have questions, feel free to mail the mailing list.
* Add your new tests to get auto-run by Travis in the .travis.yml to make sure that
  other people don't accidentally break your module.

* Try and make sure you run PHP codesniffer using the standards file in
  docs/LorisCS.xml before sending any pull request, otherwise the Loris tests may
  fail and we won't be able to merge your pull request.
  

  * Check out our Coding Standards in the [docs/ directory](https://github.com/aces/Loris/tree/master/docs) and also our [Code Review Checklist](https://github.com/aces/Loris/wiki/Code-Review-Checklist) in the [GitHub Wiki](https://github.com/aces/Loris/wiki) and the Pull Request guidelines Readme in this directory. 
  
* Keep in mind that many projects using Loris so try to make any changes
  backwards-compatible with existing installations. If you must change something
  in a non-backwards-compatible way, document it in your pull request description and
  tag it with "Caveat For Existing Projects" so that we know that the change needs
  to be mentioned in release notes. 
* Choosing a branch: see [Contributing to the Code](https://github.com/aces/Loris/wiki/Contributing-to-the-Code) for full guidelines. 
  Non-backwards-compatible changes should be sent
  to the `major` branch (e.g. 18.* -> 19.0), while backwards-compatible changes should
  be sent to the `minor` branch (e.g. 18.0.* -> 18.1), and backwards-compatible bug
  fixes should be sent to `bugfix` branch (e.g. 18.1.0 -> 18.1.1)

## Ways To Get Started

If you're looking for ideas for a way to contribute but don't know where to get
started, some ideas to get you started:

* You can browse some of our public [Issues](https://github.com/aces/Loris/issues)
* You can run PHP CodeSniffer on modules that haven't had it run yet.
* You can help improve our documentation if you find any parts of it confusing or
  lacking
* You can try and track down any bugs
