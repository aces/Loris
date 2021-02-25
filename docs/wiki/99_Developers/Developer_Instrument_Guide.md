# Developer's Instrument Guide

> This guide reflects a typical workflow and best practices used by Loris developers at the MNI. Some specifics such as git workflow steps may not apply to all projects and implementations.

## Should this instrument be coded? (PHP vs. LINST)
1. An instrument should likely be coded manually in PHP if it involves:
   * dependencies between fields
   * special data formats or restricted types
   * special scoring
   * look-up Norm tables (t-scores etc)
   * age-dependencies in administering the instrument
2. Has it been coded before? Current instruments list

## Developer Workflow
### Before getting started...
1. Get the entire PDF or paper copy, including any “lookup” tables used for scoring/normalization.
2. Find out: Which sections of the questionnaire should be included or omitted? Typically, administrative details included on the original form can be ignored, but instructions that will be helpful for the examiner might be included.
3. Decide: How will all your fields map to the element types allowed by Loris form
4. Find out: Does your instrument require certification? Are there certified examiners? Should users be certified as examiners for this instrument using the Examiner module?
### Get Started!
1. Create a new git branch based off the up-to-date branch for your project-specific repo.
2. Create an instrument in the project/instruments/ directory.
3. Insert the Instrument.
4. Front-end testing.
5. Push branch and create pull request to your project-specific repo. Assign relevant tags and tester.
6. Update any management documents and/or add a category to your bug tracker utility.

## How to code an instrument

> As an example: follow along with `NDB_BVL_Instrument_TEMPLATE.class.inc` or `NDB_BVL_Instrument_mri_parameter_form.class.inc` from [docs/instruments/ directory](https://github.com/aces/Loris/tree/main/docs/instruments).

1. Make a copy of the template instrument (from docs/instruments/ directory) in your project/instruments/ directory, and ensure it is apache-readable.
2. Rename it to “NDB_BVL_$TEST_NAME$.class.inc”
3. Edit the contents of the file to replace all template placeholders such `TEST_NAME`, `<TEST_NAME>`, `<INSTRUMENT TITLE>` and `<FIRST QUESTION OF EACH PAGE>`. Note that `TEST_NAME` within the file must match the `TEST_NAME` in the file name; this will also be the name of the MySQL table for this instrument.
4. Add pages (if necessary). For a single-page instrument, include all questions in main() and delete functions _page[1-9]{}. If the instrument has multiple pages, add QuickForm elements inside functions _page[1-9].
5. Add questions to each page using `$this->addType()` wrappers or use `$this->createType()` wrappers (in case of table/groups). Wrappers are included in NDB_BVL_Instrument.class.inc e.g. `addTextElement()`, `addYesNoElement()`, `addTextAreaElement()`. See http://pear.php.net/ for Quickform documentation. Many wrappers also use XinRegisterRule.
* Element names must be lowercase and fewer than 64 characters (e.g. `q07_mother_maiden_name`). Never use hyphens, as it is confused with the MySQL minus sign. Element names `*_status` are reserved for select boxes accompanying text fields.
* Use `addDateElement` wrapper for dates. Modify `dateTimeFields` array to include all date elements for proper conversion to database date/timestamp format.
* Any date elements used should be added to the `dateTimeFields` array (so that they will be converted between HTML_Quickform and MySQL formats automagically).
Any multiple select elements should be added to the `_selectMultipleElements` array. This way they will be transferred between the database and the QuickForm smoothly.
* For question dependencies, use XIN Rules.
* For formatting questions into tables, see Instrument Groups.
6. To ensure instrument completeness for all pages, modify `_requiredElements()` array to include 'Examiner' field and first question of each page, e.g. `$this->_requiredElements=array('Examiner', 'q1', 'q19', 'q37', 'q55'));` These array items must be entered to mark instrument as 'Complete'
* To ensure completion of multi-select elements, see Validating Multi-Selects
7. It may be desirable to exclude certain instrument columns from the Conflict Resolver module, such as Comment fields. These fields should be added to the instrument class array `_doubleDataEntryDiffIgnoreColumns` within the instrument php file. By default, the base class already excludes the following fields: `CommentID`, `UserID`, `Testdate`, `Window_Difference`, `Candidate_Age`, `Data_entry_completion_status`
8. For scoring functionality, implement scoring through a separate script or a function within the instrument class.
```php
<?php
// Basic Instrument structure
class NDB_BVL_Instrument_$TABLE_NAME$ extends NDB_BVL_Instrument
{

    function setup($commentID, $page)
    {
        // Update the testName and tableName
        // Update dateTimeFields, _selectMultipleElements, _requiredElements,
        // _doubleDataEntryDiffIgnoreColumns arrays
    }	

    function _setupForm()
    {
        // Update preg_match function for multi-paged instruments
    }

    function _main()
    {
        // First page of instrument
    }

    function _page1()
    {
        // Another page
    }

    function _page2()
    {
        // Another page
    }
	
} 
```

## Instrument Insertion
> This section covers how to create and install PHP instrument forms in LORIS. For linst forms, please refer to the Behavioural Database.

> NOTE: $TABLE_NAME$: table name as appears in DB (e.g General_Health_Physical_Activity)

> $TABLE_FULL_NAME$: readable version of table name to display on the site (e.g Physical Activity)

### Insert into test_names table
```SQL
/**
* All instruments must appear in this table
* Survey instruments should set IsDirectEntry to 1
*/
INSERT INTO test_names (Test_name, Full_name, Sub_group) VALUES ('$TABLE_NAME$', '$TABLE_FULL_NAME$', '1');
```
### Populate the test_subgroups table
```SQL
/**
* Test subgroups are used to group or categorize instruments within a timepoint’s list of instruments.
* This must be updated manually. 
*/
```
See example: How to populate test_subgroups

### Populate instrument_subtests
```SQL
/**
* Represents all pages associated with the instrument
* One page instruments do not need records in this table
* Each additional page requires one insertion
*/
INSERT INTO instrument_subtests (Test_name, Subtest_name, Description, Order_number) VALUES ('$TABLE_NAME$', '$TABLE_NAME$_page1', "Page 1", 1);
```
### Populate test_battery
```SQL
/**
* A battery is the list of instruments and their order during a visit
* A different cohort could have a different order
* Insert a record to add the instrument to the test battery for any relevant cohort, study site, and/or visit
* Instruments in the battery automatically get populated when a visit is started
*
* This must be done manually, depending on the needs of the study
*/
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Stage, SubprojectID, Visit_label) VALUES ('$TABLE_NAME$', 0, 0, 'Visit', '2', '$VISIT_LABEL$'); 

// OR

INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label, CenterID, firstVisit, instr_order) VALUES ('$test', '1', '99999', 'Y', 'Visit', '1', 'V1', NULL, NULL, 1);
```
* If minimum and maximum days do not matter, setting `AgeMinDays` and `AgeMaxDays` to `0` is recommended
* `CenterID` should be set to `NULL` if administered across all sites
* `VisitLabel` should be set to `NULL` if administered across all visits
* `firstVisit` should be set to `‘Y’` if a particular instrument should always be part of all candidates’ first registered visit or `‘N’` if it should never be part of any candidate’s first visit
* This column overrides the `visit_label` entry, even if the latter is not `NULL`
* `Instr_order` allows for ordering instruments within a battery
* If any value is `NULL`, the remaining values will not be taken into consideration and the order of the tests will be as shown in the table
* Survey instruments should not be inserted into this table as they are created manually
### Run Scripts
```sh
// Run scripts to parse PHP and generate SQL file with table identifying your instrument
cd /var/www/loris/tools
ls ../project/instruments/NDB_BVL_Instrument_$TEST_NAME$.class.inc | php lorisform_parser.php
cat ip_output.txt | php generate_tables_sql.php
```
### Source SQL
``` SQL
-- Create/recreate the instrument table from the MySQL console
DROP TABLE IF EXISTS $TABLE_NAME$;
source /var/www/loris/project/tables_sql/$TABLE_NAME$.sql;
```
### Clean Flag Table
``` SQL
-- Clean up table associated records in the flag table from the MySQL console
-- Repopulate the flag table afterwards using a script (see below)

DELETE FROM flag WHERE Test_name="$TABLE_NAME$
```
### Populating Instrument Forms After Battery Change
If you are modifying your test battery or an instrument form, you may wish to populate this instrument for timepoints for which data entry is already in progress. To add an instrument form to a timepoint whose visit stage has already been started, run [assign_missing_instruments.php or fix_timepoint_date.php](https://github.com/aces/Loris/tree/main/docs/wiki/99_Developers/Instrument_Scripts.md) -- located in the tools/ directory.

Depending on the use case, either of these scripts will add the instrument to any relevant timepoints according to the contents of the test_battery table.

### Populate Examiners Table
Populate examiners table with all personnel likely to administer any questionnaires/tests for each study site. This is a pre-requisite to beginning instrument data entry, as data forms will not save without selecting an examiner.

## Instrument Testing and Troubleshooting
### Finalizing an Instrument Preparing an instrument for merging includes:
* Running PHPCS on the instrument
* Ensuring the instrument loads on the front-end within the proper visit label and cohorts
* Ensuring data entry and XIN Rules are enforced by the instrument
* Creating a pull request to the project-specific repo

### Testing To test an instrument:

1. Register a DCC candidate
2. Create a timepoint
3. Start its visit stage (date must be within test_battery-defined age range)
4. Enter sample data, testing each field's type and logic constraints

> Loris 16.0 and prior: For sandbox debugging purposes, ensure the following section appears in config.xml, and toggle to show (1) or hide (0) MySQL queries in the browser. This feature may interfere with JavaScript running in the page, and is not recommended for use in production instances.
```
  <gui>
       <showDatabaseQueries>0</showDatabaseQueries>
   </gui>
```
Troubleshooting If you run into an error where “Date of Administration” format is wrong when saving the first page, try cleaning the flag table.