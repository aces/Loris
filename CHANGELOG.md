# CHANGELOG

- ***When adding content to this document, make sure to create a section for each module 
if the changes only impact a single module and that section does not already exist in
the document. When changes affect the entire software, make sure to add them in the 
core section.***

- ***When possible please provide the number of the pull request(s) containing the 
changes in the following format: PR #1234***

## LORIS 23.0

### Core
#### Features
- Add configuration option to specify the format in which dates are displayed. (PR #5004)
- Configurable upload directory for data_release and document_repository modules (PR #5815)
- New radio components for forms. (PR #5846)

#### Updates and Improvements
- PHP minimum requirements raised to PHP 7.3 (PR #5723)
- Menus are now maintained by modules and no longer in the SQL database (PR #5839)
- New script created for streamlining instantiation of the Raisinbread demonstration 
database (PR #5260)
- New documentation for file permissions has been added to the README.md file. (PR #5323)
- Study progression performance improvement (PR #5887)

#### Bug Fixes
- Fix edge-case that gave a confusing error message when changing password (PR #5956)
- Fix bug where examiner form field was incorrectly hidden (PR #6085)

### Modules 

#### Battery Manager
- New module created to manage the entries in the test_battery table of the database.
This allows projects to modify their instrument battery without requiring backend access.
 (PR #4221)
 
#### Issue Tracker
- The issue_tracker module now has the feature of uploading attachments to new or existing issues.
 
#### Module Manager
- New module created to manage the status of installed modules. (PR #6015)

#### Electrophysiology Browser
- New module created to view electrophysiology data within LORIS. (PR #5230)

#### Candidate Parameters
- Add tab to view and edit a candidate's date of birth. (PR #4915)
- Add date of death feature for LORIS. Store and calculate age based on a date of 
death for candidates. (PR #4929)

#### Create Timepoint
- Add language parameter when creating a new timepoint for multilingual studies. (PR #4976)
 
#### Data Release
- UI improvements, bugfixes and addition of a filter for searching across release 
files. (PR #5224)


### Clean Up
- New tool for detection of multiple first visits for a candidate (prevents a database
exception). It is recommended to run this tool for existing projects (PR #5270)
- Heroku postdeploy script cleanup (PR #5275)
- Vagrantfile Deprecation (PR #5319)
- The `data_integrity_flag module was removed. (PR #5824)

### Notes For Existing Projects
- PHP should be upgraded to 7.3 to before upgrading LORIS. (PR #5723)
- Legacy Quickform instruments may have issues due to code changes (PR #4928)
- Customized entries in the `LorisMenu` and `LorisMenuPermissions` tables need to be 
transferred to the new module table and handled accordingly. (PR #5839)
- Change of name from `quatUser` and `quatPassword` to `adminUser` and `adminPassword` (PR #5785)
- The `data_integrity_flag module was removed. Projects still using the module should
copy the code into the override directory and re-add the necessary SQL to add it to 
the list of modules.(PR #5824)
- New tool for detection of multiple first visits for a candidate (prevents a database
exception). It is recommended to run this tool for existing projects (PR #5270)
- New tool for automatically adding modules to the modules table. This tool should 
be used by projects having custom modules not in LORIS. (PR #5913)

### Notes For Developers
- Config files for static analysis have been moved to the `test/` directory. (PR #5871)
- Dashboard was refactored to turn panels into module widgets. (PR #5896)
- Add CSSGrid component type (PR #6090)

