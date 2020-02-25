# Code Review Guide

## Creating a good pull request

The CONTRIBUTING document on GitHub explains how to author a good pull requests.
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

- [ ] 1.  Do database calls use prepared statements?
- [ ] 2.  Have new tests been added?
- [ ] 3.  Is CSS/Javascript/PHP/HTML code separated into their own files?
- [ ] 4.  Have database changes been reflected in the schema, a new patch, and
in Raisinbread?
- [ ] 5.  Are the comments reasonable/understandable?
- [ ] 6.  Are the variable names meaningful? In the proper scope?
- [ ] 7.  Does the logic/structure make sense? Is it as efficient as possible?
- [ ] 8.  Are inheritance/classes/etc used appropriately?
- [ ] 9.  Is there an effort to limit code duplication?
- [ ] 10. Are functions concise and clear?
- [ ] 11. Are the commit messages meaningful, atomic, and rebased/squashed into a clean tree?
- [ ] 12. Is the pull request appropriately named (starting with Module name or Core) and appropriately labelled?
- [ ] 13. Is the comment on the pull request meaningful and informative, even to someone with limited knowledge of the code?
- [ ] 14. Are there any other implications for existing projects that need to be documented or addressed? 
- [ ] 15. Are changes made in a backward compatible manner (where possible)?
- [ ] 16. Has relevant documentation been updated?
- [ ] 17. Is the code written with thought given to how it can be maintained and extended? Is it written elegantly, without "hacks"?

If you are unsure on any of these points, we encourage you to ask questions and
do your best. We'll help to clarify any issues as they arise.
