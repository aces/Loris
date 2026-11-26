We use the following checklist as a guideline for code review. Please make sure any pull request you send addresses the following issues.

## Checklist

- [ ] 1.  Does it pass Travis CI? (Green checkmark)
- [ ] 2.  Do database calls use prepared statements?
- [ ] 3.  Does PHPCS appear to have been run? (If a new file, was it run through phpcs and added to travis.yml to ensure no regressions?)
- [ ] 4.  Are there automated tests for new code/modules? (And added to travis.yml so that they're autorun.)
- [ ] 5.  Is there any CSS/Javascript/PHP/HTML intertwined or are they all separated?
- [ ] 6.  Are there any schema patches? If so, is both the default schema modified and a patch for existing projects provided?
- [ ] 7.  Are the comments reasonable/understandable?
- [ ] 8.  Are the variable names meaningful? In the proper scope?
- [ ] 9.  Does the logic/structure make sense?
- [ ] 10. Are inheritance/classes/etc used appropriately, or is everything thrown into one class when it should be separated (don't be NDB_BVL_Instrument)?
- [ ] 11. Is there any copy/pasted code or are things in functions where possible?
- [ ] 12. Are functions short (ideally within one page unless there's a good reason not to be?)
- [ ] 13. Are the commit messages meaningful, atomic, and rebased/squashed into a clean tree?
- [ ] 14. Is the pull request appropriately named (starting with Module name or Core) and appropriately tagged? (Milestone, tags...)
- [ ] 15. Is the comment on the pull request meaningful and does it have all the information someone external would need to understand it? 
- [ ] 16. Are there any other implications for existing projects that need to be documented or addressed? (E.g. tags in config.xml. Pull request comments should reflect instructions to go into Release notes.)
- [ ] 17. Is there any potential impact on critical scripts in the tools/ directory?
- [ ] 18. Are things done in a backwards compatible manner where possible?
