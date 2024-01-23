# CHANGELOG

- ***When adding content to this document, make sure to create a section for each module 
if the changes only impact a single module and that section does not already exist in
the document. When changes affect the entire software, make sure to add them in the 
core section.***

- ***When possible please provide the number of the pull request(s) containing the 
changes in the following format: PR #1234***

## LORIS 26.0 (Release Date: ????-??-??)
### Core
#### Features
- Add OpenID Connect authorization support to LORIS (PR #8255)

#### Bug Fixes
- Fix examiner site display (PR #8967)
- bvl_feedback updates in real-time (PR #8966)
- DoB and DoD format respected in candidate parameters (PR #9001)

## LORIS 25.0 (Release Date: ????-??-??)
### Core
#### Features
- Added new interface intended to be used for querying module data from PHP (PR #8215) 
- Added the NOT NULL constraint on Project Name (PR #8295)
- Added ability to display images in issue tracker tickets (PR #8346)
- Migrated instrument permissions from config.xml to database and added the ability
  to manage instrument permissions in the frontend from the `instrument_manager`
  module. (PR #8302)
- new postinstall script that automatically installs /project and eeg-browser additional npm dependencies 
  when `make` or `npm ci` is executed (PR #8244)

#### Updates and Improvements
- Upgrade react to version 18 (PR #8188)
- Rename subproject to Cohort (PR #7817, applied changes in LORIS-MRI PR #882)
- Create new CohortData and CohortController classes to use as data access model 
  and transfer object (PR #7817)
- BVL Feedback widget only shows notifications for the users sites / projects (PR #7848)
- Add Date status change value in session table (PR #8350)
- Fixed the Candidate Age at Death field label and Data Dictionary item for LINST instruments (PR #8362)
- Allow clearing a previously entered consent status in candidate parameters (PR #7772)
- Add code sanitizer before dangerouslySetInnerHTML is used in login to protect against XSS attacks (PR #7491)
- npm package freeze with versionning of `package-lock.json` and switch from `npm install` to `npm ci` (PR #8224)
- New imaging config to set:
  - createVisit
  - a default project (default_project) used if createVisit or createCandidate is set to true, or for phantom scans
  - a default cohort (default_cohort) used if createVisit is set to true (PR #8384)
- Help and help editor reactification (PR #8309)

#### Bug Fixes
- Fix a Fatal error on the Genomic Browser tabs (PR #8468)

### Modules

#### API
- Modified in v0.0.4-dev the candidate instrument data format returned by a GET request or
provided as the body of a PUT/PATCH request. The values of all fields are now defined by
the `Data` key instead of `$InstrumentName` (PR #7857)
- Fix Candidate endpoint error:
The candidates/{CanID} endpoint throws a fatal error if a missing but valid (format pass validation) CanID is provided (PR #8417)


#### Candidate Parameters
- Added date restriction for consent withdrawal so that withdrawal date cannot be earlier
than the given consent response date (PR #8298)

#### EEG Browser
- Visualization:
  - Electrode 2D montage: detect if the coordinate space is in the ALS orientation to convert to RAS (nose up)
  - Use the optimal signal sampling that fulfills number of chunk displayed < MAX_VIEWED_CHUNKS
  - Fixes UI panels open/close glitches (PR #8238)
  - Upgrade codebase to Typescript 4.0 syntax (PR #8211)
  - New config (GUI/useEEGBrowserVisualizationComponents) to enable the EEG visualization (PR #8263)
  - Annotations: HED tags support (PR #8236)
- Added a SQL table to save any additional task events property data imported through BIDS files (PR #8237)
  - Added method to extract from BIDS files in LORIS-MRI (LORIS-MRI PR #873)
- Added SQL tables to save coordinate system data imported through BIDS files (PR #8242)
  - Added method to extract from BIDS files in LORIS-MRI (LORIS-MRI PR #885)
- Fix a few issues with EEGLAB set/fdt files:
  - Download link broken
  - Incorrect placement, it should be logically after the .set file (PR #8323)
- Download All files fails when no annotations exists (PR #8323)
- Clean dependency tree and fix security issues (PR #8486)

#### Instrument Builder
- Fixed display order of select options that were previously ordered alphabetically.
Now the options correctly display in order of how they are defined in the instrument. (PR #8361)

#### Instruments
- Added `postMortem` functionality for LINST instruments, fixing display of 'Candidate Age at Death' when `postMortem` is set to true (PR #8362)
- Added/modified documentation for configuring 'Candidate Age at Death' field display in instruments (PR #8362)

#### Issue Tracker
- Modified username (i.e. user ID) to full names throughout the main table, edit form and history sections (PR #8451)

#### EEG uploader
- New module (PR #8409)

#### Dashboard
- Reactification (PR #8476)

#### MRI violation
- Reactification (PR #7473)
- Fixes links to BrainBrowser from the MRI violations module (PR #8392)
- Remove MRI violation module tabs (PR #8399)
- Fix multiple rows for file protocol violations not resolvable (PR #8661)
- Fix hashing algorithm for `violations_resolved` table's `hash` column (PR #8664)

#### Statistics
- Reactification (PR #8476)

### Tools
- Fix CouchDB_MRI_Importer.php script for PHP > 8.0 (PR #8369) 

### Clean Up
- Fixed inconsistency in candidate consent data and history in Raisinbread (PR #8297)
- Removed references to `participant_accounts` `Email` column in Raisinbread,
SQL schema, and automated testing (PR #8313)

### Notes For Existing Projects
- API: Modified in v0.0.4-dev the candidate instrument data format returned by a GET request or
provided as the body of a PUT/PATCH request. The values of all fields are now defined by
the `Data` key instead of `$InstrumentName` (PR #7857)
- Run the script `tools/single_use/update_violations_resolved_hashes.sql.php` to update hashes
  for the `violations_resolved` table according to the new hashing nomenclature. Not doing so 
  will result in duplication of data in the `violations_resolved` table when users update
  a resolution status for a violation.

### Notes For Developers
- Require jsodc comments to have correct `@return` and `@param` values in javascript (PR #8266)
- Disable ESLint on build (prod instances) (PR #8229)



## LORIS 24.1 (Release Date: 2022-10-05)
### Core
#### Updates and Improvements
- Addition of `PhaseEncodingDirection` and `EchoNumber` columns to the `mri_protocol`
  and `mri_protocol_violated_scans` tables to allow for better discrimination between some
  MRI sequences.
- Addition of `PhaseEncodingDirection` and `EchoNumber` columns to the `files`, `files_qcstatus`
  and `feedback_mri_comments` tables to ensure uniqueness keys for specific GE sequences for
  which the `SeriesUID/EchoTime` combination is not enough (PR #8152).
- Addition of `image_type`, `PhaseEncodingDirection` and `EchoNumber` fields to the tables
  present in the "Could not identify scan" page of the MRI violation module (PR #8156)
- Modification of the list of headers displayed in the image panel headers table (PR #8157)
#### Bug Fixes
- Bug fix to the imaging uploader so that when clicking on an upload row, the row is
  highlighted and the proper log is being displayed in the log viewer (PR #8154)
- Remove SNR label from the image panel of the imaging browser when no SNR values can
  be found for the image (PR #8155)
- Add the missing download buttons for BVAL, BVEC and JSON files that comes with BIDS/NIfTI
  dataset/images. In addition, the "Download MINC" button has been renamed to a more generic
  label "Download Image" (PR #8159)
- Fix ConfigurationException bug (PR #8107)
- Fix PHP fatal error when running the LORIS installation script (PR #8108)
- Add psr/log to composer (PR #8109)
- Fixed broken DB calls in `assign_missing_instruments` and `instruments` (PR #8162)
- Add support for PHP 8.1 (PR #7989)
- Fix Project tab of Configuration module to give correct errors, and prevent saving without Alias (PR #8349)
### Modules
#### API
- Ability to use PSCID instead of the CandID in the candidates API (PR #8138)

## LORIS 24.0 (Release Date: 2022-03-24)
### Core
#### Features
- Data tables may now stream data as they're loading rather than waiting
  until all data has loaded. (PR #6853)
- Added support for Amazon S3 (PR #7963)
- Added ability for scripts to bulk load instrument data (PR #6869)
- New data dictionary framework and module (PR #6936)
- New classes to describe a data dictionary (PR #6938)

#### Updates and Improvements
- Module-specific permissions added for Survey Accounts, Imaging Behavioural
Quality Control, and Behavioural Quality Control. (PR #6041)
- Addition of a new `account_request_date` in `users` table that will be used when
requesting a new account and will be displayed in the User Accounts module (PR #6191)
- Candidate's age can be retrieved from the Candidate class in days, months, or years (PR #5945)
- Addition of `autoSelect` property to React `SelectElement` allows for auto-selection of 
only available select option (PR #6156)
- An `AcquisitionDate` field has been added to the `files` table (PR #6892)
- Field `Data_entry_completion_status` given its own column in flag, and renamed to 
`Required_elements_completed` (PR #6876)
- Addition of `changeProject` and `resetProject` helper functions to the 
`LorisIntegrationTest` class to help test project permissions (PR #6912)
- Unit tests added for the `NDB_BVL_Instrument`, `NDB_Page`, `NDB_Factory`, 
`User`, and `UserPermissions` libraries (PR #6819, PR #6804, PR #6776, PR #6765)
- The name of a Standard Date field in a LINST instrument must now end with the 
string `_date`. Otherwise, a LORIS exception is thrown. There is no restriction 
on the naming format of a Basic Date or `MonthYear` field. (PR #6923) 
- React Form Select Element now has the ability to set an option in the element 
as a disabled option. (PR #7306)
- Pending accounts in Dashboard now includes DCC users (PR #7054)
- Cohort filter added to Behavioural QC module (PR #7430)
- Addition of `date_format` as a DataType in ConfigSettings (PR #6719)
- Addition of new tables to store PET HRRT data (PR #6142)
- Modification of the `parameter_file` table's `Value` field type to `longtext` (PR #7392)
- Addition of 4 configuration settings for the minc2bids converter (PR #7488)
- A PSR3 compatible logging interface was added (PR #7509)
- Multiple classes of errors flagged by `phan` are now fixed (multiple PRs)
- A `LorisInstance` class was added to represent an installed LORIS instance (PR #6118)
- Validation for `DateElement` (JS). (PR #7266)
- Session `Current_stage` default value changed for `Not Started` (PR #7102)
- Permissions were reorganized and categorized in the user accounts module (PR #7327)
- The `EchoTime` field has been added to the following tables: `MRICandidateErrors`, 
and `mri_violations_log`. `EchoTime` is necessary to distiguish MINC files for 
multi-echo aquisitions (PR #7515).
- The `Center_name` field in the `mri_protocol` table has been replaced by `CenterID` 
from the `psc` table. The default value of `CenterID` is `NULL`. Previously, the 
default for `Center_name` was `AAAA` or `ZZZZ`. (PR #7525)
- The statistics displayed in the dashboard was changed to only show the data relevant to the user's site(s). (PR #8132)

#### Bug Fixes
- A LINST instrument Date field name now appears correctly (not truncated) on the 
instrument if it includes the string `_date`. (PR #6923)
- A subtest with only static and/or static score fields (i.e. no values to submit) 
can be saved with no errors so that the instrument scoring script can be called. (PR #7124)
- When a superuser edits another user, the labels for each permission is correctly 
displayed (PR #7451) 
- The imaging insertion pipeline (LORIS-MRI scripts) now starts automatically if you have the imaging uploader 
auto-launch set to `true` and your current upload overwrites an existing file (PR #7084).
- Script `CouchDB_MRI_Importer` now computes the correct names from the data dictionary 
entries associated to MRI comments (PR #7082). 
- Candidate library now allows a null sex in the select() function to accommodate 
scanner candidates. This prevents an error from being thrown in the candidate parameters module. (PR #7058)
- Fix public pages with missing title (PR #7121)
- Fix "Go to main page" broken link (PR #7258)
- Download CSV fix to remove duplicates and entries that partially match the filtering criteria (PR #7242)
- Partially fix instrument escaping issues by reloading instrument and its data upon successful save (PR #7776)
- Fix recognition of null sessionID in NDB_BVL_Instrument (PR #8031)
- Fix delete_candidate.php / delete_timepoint.php failing because of json instruments / instruments with different table name than test_name (PR #8070)
- Fix bug where server_processes_manager had a timeout (PR #8071)
- Candidate profile page loads with only the visits listed that a user has access to 
if a candidate has some visits that the user should not see. Fixes error where page was not loading for this use case (PR #8072)

### Modules
#### API
- Creation of a new version of the API under development (v0.0.4-dev) (PR #6944)
- Deletion of support for the oldest version of the API (v0.0.2) (PR #6944)
- Adding `GET /sites` endpoint to list available sites in version 0.0.4-dev.
- Addition of a PATCH request for `/candidates/$CandID/$VisitLabel` to start next 
stage when the payload contains a "Visit" stage with "In Progress" as Status, 
when the current status of the Visit stage is "Not Started". (PR #7479)
- Handle characters that must be urlencoded (such as a space) in the API path for 
visit labels and projects. (PR #7478 & #7463)
- Markdown API documentation was moved into the module docs directory (PR #6151)
#### API Documentation (**New Module**)
- New module mostly intended for developers, this module provides a user 
interface to inspect and try LORIS modules API.
#### Behavioural QC
- Fix a fatal error if the datatable is filtered with "All instruments" (PR #6945)
- Fix for the Instrument filter to keep track of the selected value (PR #6945)
#### BrainBrowser
- Now uses Loris API to download imaging files (PR #7824)
#### Candidate Parameters
- Consents may now be grouped in UI of consent tab (PR #6042, PR #6044)
- Fix to prevent titles cut off (PR #6731)
#### Candidate Profile
- New integration test class to test project permissions (PR #6912)
#### Configuration
- Addition of configuration settings for the DICOM to BIDS insertion pipeline (PR #7937)
- Addition of configuration settings for the MINC to BIDS converter script (PR #7488)
#### Conflict Resolver
- Changes are now saved automatically, one by one. Once a conflict is resolved
the cell that contains the input field will glow green. It is possible to change
the resolved conflicts to a new value until the page is refreshed. (PR #7558)
- This module's API is now described in a Open API Specification file (schema.yml) 
that can be loaded in the new API Documentation module.
- Change the display of multi select values from "value1{@}value2" to "value1, value2"
 in the Correct Answer column of Unresolved and Resolved Conflicts. (PR #7239)
#### Create timepoint
- Fix a reindexing of the languages array which caused a database insert error. (PR #7145)
- Reorganization of the fields on the page to a more logical order, clean up of 
inefficient code and conditional display of select options based on previous selections (PR #7825)
#### Data Dictionary
- Changed instrument filter to multiselect  (PR #7040)
#### DQT
- The dataquery module user interface has been completely redesigned. (PR #6908)
#### EEG Browser
- Signal Visualization, Events and Electrode map (PR #7387)
- Site/Project/cohort filters only displays entries user has permission for. (PR #7400)
- Addition of tables in the SQL schema, a filter on the main page of the module, and a download button 
on the session page to support new annotation features (PR #7345)
- New integration test class added to this module (PR #6922)
#### Genomic Browser
- CNV/CPG records added for candidates to view and test the CNV and Methylation tabs in the Genomic Browser (PR #6900)
#### Help Editor
- Cleaned up the deprecated column `Parent Topic` (PR #7025)
#### Imaging Uploader
- Fixed a bug that would prevent the imaging uploader from starting automatically even if you had the imaging uploader
auto-launch set to true and your current upload overwrote an existing file (PR #7084)
- Use Loris API to view files (PR #7816)
#### Instrument Builder
- Fix for error 'Max value must be larger than min value' when clicking 'Add Row'. (PR #6810)
#### Instruments
- General help text added for instrument data entry (PR #6902)
- Fix to avoid select with required option in group fields to display as multiselect (PR #7254)
- Fixes to insert JSON instruments (PR #7155)
#### Issue Tracker
- Readability of comments and history was improved. (PR #6138)
- Update validation to allow `NULL` Site (For All Sites issues) (#6526)
- Fixing redirect and error reporting when creating a new issue (PR #7323)
- Show inactive users in the list of assignees as a disabled option. If the 
inactive user had already been previously assigned the issue, the disabled option 
appears but cannot be reselected. Inactive users can no longer be assigned new 
issues. (PR #7306)
#### Login
- Add option to toggle visibility on password input types. (PR #6210, #7043)
#### Media
- Fix to display the file name when editing a file (PR #7381)
#### Publication
- Display all filterable columns in datatable (#7277)
- Fix for file deletion (PR #7284)
#### User Accounts
- Fix a false positive validation error when a new LORIS user is added with "Make 
user name match email address" and "Generate new password". (PR #6803)
- Fix to allow a superuser to create new users with customizable permissions. (#6770)
- Indicate required fields (#6617)
- Fix to show superuser the labels of each permission when editing a user (PR #7451)

### Tools
- Fix fatal errors in `delete_candidate.php` tool. (PR #6805, #7275)
- Fix fatal errors in `fix_candidate_age.php` (PR #7546)
- New tool `generate_candidate_externalids.php` to fill external IDs for all 
candidates where a NULL value is found. (PR #7095)
- New tool `populate_visits.php` to back-populate visits from the `config.xml`, 
`session` table and `Visit_Windows` table into the `visit` and `visit_project_cohort_rel` (#7663)
- Deprecation of the `populate_visit_windows.php` tool in favour of `populate_visits.php` (#7663)
- Fixes a bug in the way that the data dictionary entries associated to MRI comments were named in the CouchDB database (PR #7082).


### Clean Up
- Removal of unused variables and unnecessary branching from `getBattery()` and 
`getBatteryVerbose()` functions (PR #7167)
- Removal of the `violated_scans_edit` permission (PR #6747)
- Removal for the need of the `VisitLabel` section of the `config.xml` file. All 
visit configurations and their association to projects are now in the database.
The visits can be removed from the `config.xml` file after running the 
`populate_visits.php` script only. (#7663 & #7729)
- Removal of references to Reliability module in Raisinbread (PR #6895)
- Raisinbread visit stage inconsistency changed (PR #6896)
- HRRT patch sourced to Raisinbread (PR #6897)
- Improved consistency of RB data: field UploadLocation of table mri_upload now has an appropriate value (PR #7086)
- The default value of the `ScannerID` field of the `mri_protocol` table is now 
`NULL` instead of `0`. This means that if a protocol is valid on all the study's 
scanners, then `ScannerID` of the protocol should be set to `NULL` (PR #7496)


### Notes For Existing Projects
- The `RegistrationProjectID` column of the candidate table and the `ProjectID` column of the session table 
in the database are no longer nullable. This means that a value must be set in these fields BEFORE running 
the release SQL patch or it will fail.
- New function `Candidate::getSubjectForMostRecentVisit` replaces `Utility::getCohortIDUsingCandID`, 
adding the ability to determine which cohort a candidate belongs to given their most recent visit.
- LINST instrument class was modified to implement the `getFullName()` and `getSubtestList()`
functions thus making entries in the `test_names` and `instrument_subtests` tables 
unnecessary for LINST instruments (PR #7169)
- The script `tools/single_use/remove_publication_users_edit_perm_rel_duplicates.php`
should be run before upgrading LORIS. 
- The `Data_entry_completion_status` column of instrument tables has been migrated 
to its own column in the `flag` table, and renamed to `Required_elements_completed`. After script 
`Set_Required_elements_completed_flag.php` is run, projects will need to delete the 
`Data_entry_completion_status` column of instrument tables. This can be accomplished 
by running `Remove_Data_entry_completion_status_instr_column.php`, and then sourcing 
the patch generated by this script. (PR #6876)
- If `_setDataEntryCompletionStatus`, `_determineDataEntryCompletionStatus`, and/or 
`updateDataEntryCompletionStatus` are called in any overrides, make sure to replace 
all instances with their newly named counterparts, `_setRequiredElementsCompletedFlag`, 
`_determineRequiredElementsCompletedFlag`, `updateRequiredElementsCompletedFlag`. (PR #6876)
- Deprecation of `begintable` and `endtable` elements in LINST instruments (PR #7183)
- Deletion of `dateTimeFields` and `monthYearFields` variables in instrument class. 
All references to these variables should be removed from project instruments. (PR #7183)
- Visit definitions is no longer done in the `config.xml`. An importer tool (`populate_visits.php`) is 
available to import the current setup into the `visit` table of the database. 
Make sure the visits displayed after these changes are what you expect. 
The visits can be removed from the `config.xml` file after the importer tool is run. (#7663 & #7729)
- There is a new abstract `getDataDictionary()` function in the instrument class 
for the new data dictionary framework. This is already implemented for LINST instruments, 
and existing instruments using `LorisForm` can use the `\LorisFormDictionaryImpl` 
trait to extract it in the same way as `lorisform_parser.php` did for the old `datadict` module.
- The name of a Standard Date field in a LINST instrument must now end with the 
string `_date`. Otherwise, a LORIS exception is thrown. There is no restriction 
on the naming format of a Basic Date or MonthYear field. (PR #6923) 
- Run `tools/single_use/Remove_duplicate_examiners.php` to remove duplicate 
examiners that may have been created before bugfix. Make sure to run this script 
_before_ running the `SQL/New_patches/2021-09-28-Unique_examiners.sql`. (PR #7462)
- Deletion of support for the oldest version of the API (v0.0.2) (PR #6944)
- Refer to instructions for clean up scripts meant to remove unused data in the `SQL/Archive/24.0/Cleanup` directory


### Notes For Developers
- Eslint warnings cleanup (Various PRs)
- JQuery cleanup (Various PRs)
- PHPCS enabled for tools/ and test/ (Various PRs)
- Auto fix PHPCS (npm run lintfix:php) (#6825)




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
- Fix duplicate examiners created / examiners overwritten (PR #7462)
- Prevent horizontal scroll on all modules (PR #6531)
- Fix to prevent help boxes to float over the page content when scrolling (PR #6721)

### Modules 

#### Candidate Profile
- New module created to provide dashboard of a single candidate's data across all modules. (Various PRs)

##### Issue Tracker
- The issue_tracker module now has the feature of uploading attachments to new or existing issues. (PR #5394)
- All sites now appear in the dropdown for site, not only study sites. (PR #6135)
- Status filter converted to a multiselect field. The Active Issues tab now displays Status filter: All except Closed. (PR #6529)
- Module filter fix to remove [object Object] entries. (PR #6522)
- Priority filter Low option added. (PR #6609)
- Fix to decode issue descriptions with special characters (&<>) (PR #6643)
- Add help text on Create/Edit Issue (PR #6600)

#### Battery Manager
- New module created to manage the entries in the `test_battery` table of the database.
This allows projects to modify their instrument battery without requiring backend access. (PR #4221)
 
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

#### Login
- Pwd Expiry: Password validation for rejection if matching user's email or username
or not matching password confirmation. (PR #6615, #6705, #6611)

#### Statistics
- Fix to prevent Notice error logs (PR #6720) 
- Projects filter only displays projects user has permission for. (PR #6706)

#### Genomic Browser
- In Profile and SNP screens, display cohort title instead of id. (PR #6633)

#### Survey
- Fix Notice error logs and infinite redirect. (PR #6644)

#### User Accounts
- Fix typo in user_accounts_multisite permission name. (PR #6656)

#### DQT
- Improve the visibility of some dropdown elements (PR #6602)
- ADD delete the saved query feature (PR #8078)

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
- Run `tools/single_use/Remove_duplicate_examiners.php` to remove duplicate examiners that may have been created before bugfix. Make sure to run this script _before_ running the `SQL/New_patches/2021-09-28-Unique_examiners.sql`. (PR #7462)

### Notes For Developers
- The tool `phpstan` has been added to our automated test suite. (PR #4928)
- Config files for static analysis have been moved to the `test/` directory. (PR #5871)
- Dashboard was refactored to turn panels into module widgets. (PR #5896)
- Add CSSGrid component type (PR #6090)
- React Form Select Element now has the ability to set an option in the element as a disabled option. (PR #7306)
