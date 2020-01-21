## CHANGELOG

- ***When adding content to this document, make sure to create a section for each module 
if the changes only impact a single module and that section does not already exist in
the document. When changes affect the entire software, make sure to add them in the 
core section.***

- ***When possible please provide the number of the pull request(s) containing the 
changes in the following format: PR #1234***

### LORIS 23.0 (Released: ??)


#### Core
- Menus are now maintained by modules and no longer in the SQL database (PR #5839)
- The custom directory containing the configuration file, module overrides, etc.
has been renamed from `project/` to `custom/` in order to clarify the concept of
a "Project" in LORIS (PR #5944)

#### Modules 
##### module1
