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

#### Modules 

##### Configuration

- Make sure to update your SQL database with the release patch and to select whether you want the 
imaging pipeline to create a new scanner when an uploaded DICOM dataset was acquired on a new scanner.
Note: 'Yes' was the default behaviour of the imaging pipeline, which is the default set in the release patch.
