# Code Review Guide

## Creating a good pull request

The [CONTRIBUTING](../../../CONTRIBUTING.md) document on GitHub explains how to author a good pull requests.
If you follow these guidelines, we'll be better able to review and merge your code.

## The Code Review Process
When our team reviews pull requests we are evaluating whether the changed code
accomplishes its intentions, provides a good basis for future work, and correponds
to our style guidelines.

### When can a pull request be merged?
We require 3 things to be true before a pull request can be merged:

1. The code must pass our automated tests.
2. The code must be manually tested by a member of our team. When the code has
been confirmed by manual tests, the reviewer should add the `Passed Manual Tests`
label on GitHub.
3. The pull request must have an 'Approved' review status.

This document will help you to understand how to get your code to be Approved.

## Checklist 

In addition to what's listed in the CONTRIBUTING document, here are some things we are
looking for when deciding whether to Approve your pull request.

- [ ] Do database calls use prepared statements?
- [ ] Have new tests been added?
- [ ] Is CSS/Javascript/PHP/HTML code separated into their own files?
- [ ] Have database changes been reflected in the schema, a new patch, and
in Raisinbread?
- [ ] Are the comments reasonable/understandable?
- [ ] Are the variable names meaningful? In the proper scope?
- [ ] Does the logic/structure make sense? Is it as efficient as possible?
- [ ] Are inheritance/classes/etc used appropriately?
- [ ] Is there an effort to limit code duplication?
- [ ] Are functions concise and clear?
- [ ] Is the pull request appropriately named (starting with Module name or Core) and appropriately labelled?
- [ ] Is the comment on the pull request meaningful and informative, even to someone with limited knowledge of the code?
- [ ] Are there any other implications for existing projects that need to be documented or addressed? 
- [ ] Are changes made in a backward compatible manner (where possible)?
- [ ] Has relevant documentation been updated?
- [ ] Is the code written with thought given to how it can be maintained and extended? Is it written elegantly, without "hacks"?
- [ ] Is it [PSR7](https://www.php-fig.org/psr/psr-7/) compliant?
- [ ] Where possible, is new frontend code written using ReactJS rather than Smarty templates?

If you are unsure on any of these points, we encourage you to ask questions and
do your best. We'll help to clarify any issues as they arise.
