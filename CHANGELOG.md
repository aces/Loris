# CHANGELOG

- ***When adding content to this document, make sure to create a section for each module 
if the changes only impact a single module and that section does not already exist in
the document. When changes affect the entire software, make sure to add them in the 
core section.***

- ***When possible please provide the number of the pull request(s) containing the 
changes in the following format: PR #1234***

##LORIS 24.0 (Release Date: ??)
### Core
#### Features
- Data tables may now stream data as they're loading rather than waiting
  until all data has loaded. (PR #6853)

#### Updates and Improvements
- Module-specific permissions added for Survey Accounts, Imaging Behavioural
Quality Control, and Behavioural Quality Control. (PR #6041)
- Addition of a new `account_request_date` in `users` table that will be used when
requesting a new account and will be displayed in the User Accounts module (PR #6191)
- Candidate's age can be retrieved from the Candidate class in days, months, or years (PR #5945)
- Addition of autoSelect prop to React SelectElement allows for auto-selection of only available select option (PR #6156)
- An `AcquisitionDate` field has been added to the `files` table (PR #6892)
#### Bug Fixes
- *Add item here*
### Modules
#### Help Editor
- Cleaned up the deprecated column `Parent Topic` (PR #7025)
#### Issue Tracker
- Readability of comments and history was improved. (PR #6138)
#### API
- Creation of a new version of the API under development (v0.0.4-dev) (PR #6944)
- Deletion of support for the oldest version of the API (v0.0.2) (PR #6844)
#### Candidate Parameters
- Consents may now be grouped in UI of consent tab (PR #6042, PR #6044)
### Clean Up
- *Add item here*
### Notes For Existing Projects
- *Add item here*
### Notes For Developers
- *Add item here*


## LORIS 23.0.0 (Release Date: 2020-06-12)

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
- Dashboard study progression section performance improvement (PR #5887)

#### Bug Fixes
- Fix edge-case that gave a confusing error message when changing password (PR #5956)
- Fix bug where examiner form field was incorrectly hidden (PR #6085)
- Fix special character double escaping in instruments (PR #6223)

### Modules 
#### Candidate Profile
- New module created to provide dashboard of a single candidate's data across all
  modules. (Various PRs)

##### Issue Tracker
- The issue_tracker module now has the feature of uploading attachments to new or existing issues. (PR #5394)
- All sites now appear in the dropdown for site, not only study sites. (PR #6135)

#### Battery Manager
- New module created to manage the entries in the `test_battery` table of the database.
This allows projects to modify their instrument battery without requiring backend access.
 (PR #4221)
 
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
- Add filters to data release module. (PR #5224)

#### MRI Violations
- Add support for multiple MRI protocols (PR #4321)

### Clean Up
- New tool for detection of multiple first visits for a candidate (prevents a database
exception). It is recommended to run this tool for existing projects (PR #5270)
- Heroku postdeploy script cleanup (PR #5275)
- Vagrantfile Deprecation (PR #5319)
- The `data_integrity_flag` module was removed. (PR #5824)

### Notes For Existing Projects
- PHP should be upgraded to 7.3 to before upgrading LORIS.
- For dev instances, php7.3-curl is now a required dependency.
- Legacy Quickform instruments may have issues due to code changes (PR #4928)
- Customized entries in the `LorisMenu` and `LorisMenuPermissions` tables need to be 
transferred to the new module table and handled accordingly. (PR #5839)
- Change of name from `quatUser` and `quatPassword` to `adminUser` and `adminPassword` (PR #5785)
- The `data_integrity_flag` module was removed. Projects still using the module should
copy the code into the override directory and re-add the necessary SQL to add it to 
the list of modules.(PR #5824)
- New tool for detection of multiple first visits for a candidate (prevents a database
exception). It is recommended to run this tool for existing projects (PR #5270)
- New tool for automatically adding modules to the modules table. This tool should 
be used by projects having custom modules not in LORIS. (PR #5913)
- Duplicate filenames in the data release module will cause an error when downloading. Make sure to remove all filename duplications before upgrading to this version. (PR #6461)
- New tool for detecting and reporting the presence of double escaped special characters in the database instruments (PR #6477)

### Notes For Developers
- The tool `phpstan` has been added to our automated test suite. (PR #4928)
- Config files for static analysis have been moved to the `test/` directory. (PR #5871)
- Dashboard was refactored to turn panels into module widgets. (PR #5896)
- Add CSSGrid component type (PR #6090)
