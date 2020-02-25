# Contributing to Loris

We'd love to have you contribute to Loris. The first thing you should
do before contributing is probably sign up for the [LORIS developers'
mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev).

Your next step before issuing a pull request is to review our
[Coding Standards](./docs/CodingStandards.md). If you are doing
front-end development you should also check out our [React
guidelines](./docs/React.README.md).

You can also learn about our code
review process by perusing our [Code Review
Checklist](https://github.com/aces/Loris/wiki/Code-Review-Checklist)
in the [LORIS Wiki](https://github.com/aces/Loris/wiki). These will be
some of the factors we'll consider when reviewing your code.

## Development branches

For the most part, changes to the codebase should be sent to the `master`
branch, which is the default.

Small bug fixes for a given version of LORIS should be sent to the branch named
for that version. For example, fixing a bug in LORIS version 22 should be sent
to the `22.0-release` branch.

## Pull Request Title and Description

To make it easier for reviewers to locate pull requests with which they have
expertise, we request that new pull requests follow a few conventions.

#### Title

The title should begin with square brackets enclosing the name of the
module that you are changing followed by a brief description.

e.g. This is a well-formed title. 

> [Imaging Uploader / Server Process Manager] Fix invalid upload state

If you are instead editing the `Core` libraries or the `tools` directory,
etc., you can supply these values in place of a module name.

There should be plenty of other examples in the list of pull requests
in the main code repository.

#### Description

When opening a pull request on GitHub you will see a pull request
template. Please fill out each heading with detailed information on your
code changes, suggested testing instructions, and links to open GitHub
issues and/or Redmine tickets (if applicable).

## Some Things To Keep In Mind

* If your changes require any table modifications:
    1. Review our [SQL standard](./docs/SQLModelingStandard.md).
    2. Modify the `SQL/0000*.sql` file(s) with your changes. These patches
    are applied during the LORIS install.  
    3. Include a patch to be used by existing projects. These should go in the 
    `SQL/New_patches/` directory.
    4. For SQL patches that are _optional_ (e.g. those that perform some 
            cleanup), place them in `SQL/Cleanup_patches/`.
    5. The files for our test database (Raisinbread) must be updated if they were modified.
        Detailed instructions for this step can be found [here](https://github.com/aces/Loris/tree/minor/raisinbread#exporting-rb).
* Include a test for any new module in the `modules/MODULENAME/test/`
  directory. You can look at other modules for examples of how to
  write tests.
* Before sending any pull request, make sure you run our static analysis tools 
locally. More information can be found in the automated testing guide. 
* Try and make all changes backwards-compatible with existing installations.  
* If you must change something in a non-backwards-compatible way - or if it 
would affect the data or custom code of a study - document this in your pull 
request description and tag it with **Caveat for Existing Projects**. 
This helps us to document our release notes.
* You can run the command `make checklanguage` to ensure that documentation
you've contributed contains language that is friendly and accessible.

If you're unsure about any of the above, feel free to ask us for
clarification via the mailing list.

# Git Best Practices
- Any changes should be done on a branch based on the current development branch and contain only the changes which are applicable for that branch. (ie don't merge master back into your branch, and don't include commits that are unrelated) so that if someone merges the branch into their repository, they only get that branch's changes.
- Commits should be atomic (self contained) and contain only the changes described by the commit message. The commit message should be a sentence that describes the goal of the change as a whole.
- Avoid changing unrelated code in the same commit, even if it is an improvement.
We prefer that you create two separate pull requests A and B rather than add a
'quick bonus fix' to pull request A.
- ALWAYS do a diff before committing (after doing "git add file1 file2" when you're planning on doing git commit, you can use git diff --staged to see a diff of what will be committed). Ensure that nothing unexpected is included.

## Getting Started

If you're looking for ideas for a way to contribute but don't know where
to begin, here are some ideas to get you started:

* You can browse some of our public
[Issues](https://github.com/aces/Loris/issues). Issues tagged with **Beginner
Friendly** are good ones to tackle if you are new to LORIS development.
* You can help improve our documentation if you find any parts of it
confusing or lacking.
* You can track down bugs by browsing the application and reviewing the
PHP error log.
