**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[INSTRUMENT CODING GUIDE|Instrument Coding Guide]]**

## DEPRECATED - SEE [[DEVELOPER'S INSTRUMENT GUIDE|Developer's Instrument Guide]]

***

- [Code the instrument in PHP](#code-the-instrument-in-php)
- [Generate the MySQL table](#generate-the-mysql-table)
- [Populate instrument metadata tables](#populate-instrument-metadata-tables)
- [Register any Examiners](#register-any-examiners)
- [Testing your instrument](#testing-your-instrument)
- [Update bug tracker](#update-bug-tracker)

***

A clinical/psychometric/behavioural instrument should likely be coded manually in PHP if it involves:  
- dependencies between fields (rules)
- special data formats or restricted types
- scoring
- look-up tables (t-scores etc)
- age-dependencies in administering the instrument

      > Note: scripts may generate PHP Notice messages, which is normal and should not affect output.

1. ### Code the instrument in PHP

   As an example: follow along with NDB_BVL_Instrument_TEMPLATE.class.inc or NDB_BVL_Instrument_mri_parameter_form.class.inc from docs/instruments/ directory. 

   Copy and rename the file into your project/instruments/ directory, and ensure it is apache-readable.  
   Edit the contents of the file to replace all template placeholders such `TEST_NAME`, `<TEST_NAME>`, `<INSTRUMENT TITLE>` and `<FIRST QUESTION OF EACH PAGE>`.  Note that `TEST_NAME` within the file must match the `TEST_NAME` in the file name. 

   An example of an uploader instrument (*.linst file) can also be found in the docs/instruments directory.

   1. For a single-page instrument, include all questions in main() and delete functions _page[1-9]{}. If the instrument has multiple pages, add QuickForm elements inside functions _page[1-9].

   2. Wrappers are included in NDB_BVL_Instrument.class.inc e.g. `addTextElement()`, `addYesNoElement()`, `addTextAreaElement()`. See <http://pear.php.net/> for Quickform documentation. Many wrappers also use XinRegisterRule.

   3. Element names must be lowercase and fewer than 64 characters (e.g. q07_mother_maiden_name). Never use hyphens - confused with MySQL minus sign. Element names "_status" are reserved for select boxes accompanying text fields

   4. Use `addDateElement` wrapper for dates. Modify dateTimeFields array to include all date elements for proper conversion to database date/timestamp format.

   5. For multiple-select elements, use `_selectMultipleElements` array

   6. To ensure instrument completeness for all pages, modify `_requiredElements()` array to include 'Examiner' field and first question of each page, e.g. `$this->_requiredElements=array('Examiner', 'q1', 'q19', 'q37', 'q55'));` Array items must be entered to mark instrument as 'Complete'

   7. It may be desirable to exclude certain instrument columns from the Conflict Resolver module, such as Comment fields. These fields should be added to the instrument class array `_doubleDataEntryDiffIgnoreColumns` within the instrument php file.  By default, the base class already excludes the following fields: `CommentID`, `UserID`, `Testdate`, `Window_Difference`, `Candidate_Age`, `Data_entry_completion_status`

   8. Any date elements used should be added to the dateTimeFields array (so that they will be converted between HTML_Quickform and MySQL formats automagically).
   
   9. Any multiple select elements should be added to the _selectMultipleElements array.  This way they will be transferred between the database and the QuickForm smoothly.

   10. Note: elements on a single page are required to have unique names. This applies to all elements including groups and labels. 

2. ### Populate instrument metadata tables

   1. **Test names:**

      ```
      INSERT INTO test_names (Test_name, Full_name, Sub_group) VALUES ('$test', '$name', '1');
      ```

   2. **Test subgroups:** Tests are organized into one or more Test Subgroups.

      ```
      INSERT INTO test_subgroups (ID,Subgroup_name) VALUES (1,'Subgroup_name');
      ```

   3. **Instrument subtests:** For pagination of large forms, Subtest_name field must match the page name as defined in the instrument php code (inside case statement for '$this->page'). Be sure to enter every page of the instrument as it will affect the parsing of the instrument.

      ```
      INSERT INTO instrument_subtests(Test_name, Subtest_name, Description, Order_number) VALUES ('$test', '$test_page1', '$page_title', 1);
      INSERT INTO instrument_subtests(Test_name, Subtest_name, Description, Order_number) VALUES ('$test', '$test_page2', '$page_title', 2);
      ```

      > **Note:** The Description field content is displayed in the sidebar of Loris during data entry. Short concise names are recommended (i.e. Page 1, instrument acronyms and page number, page titles, ...).

   4. **Test battery:** Insert a record to define the test battery for any given candidate:

      ```
      INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label, CenterID) VALUES ('$test', '1', '99999', 'Y', 'Visit', '1', '2', NULL);
      ```

      > **Note:** In the test_battery table, CenterID and VisitLabel can be unspecified e.g. CenterID = NULL if test is administered across all sites.  Each instrument must have (minimum) one entry per Subproject/cohort.

   **Please see [[Behavioural Database Setup page|Behavioural-Database]] for further steps to complete instrument setup.** 

3. ### Generate the MySQL table

   > **Caveat:** this will overwrite the staging file tools/ip_output.txt - this file is also typically used to generate the Data Dictionary.

   > Note that the path is assumed to be var/www/loris however your own path may be var/www/`<project-name>`, depending on your setup. 

   Your php instrument file should be placed in the project/instruments/ directory.  Ensure the file is apache-readable (e.g. chmod a+r).

   ```bash
   cd /var/www/loris/tools
   find ../project/instruments/NDB_BVL_Instrument_$TESTNAME.class.inc | php quickform_parser.php 

   find ../project/instruments/NDB_BVL_Instrument_$TESTNAME.class.inc | php generate_tables_sql.php
   ```

   In MySQL, source the file that was generated above in project/tables_sql:

   ```bash
   cd /var/www/loris/project/tables_sql/ 
   log into the mysql database back-end, then:
   > source tables_sql/$TESTNAME.sql
   ```

   Your table is now loaded into the LORIS database schema.

4. ### Register any Examiners

   See the [[populate examiners table|Behavioural-Database#populate-examiners-table]] section.

5. ### Testing your instrument

   Register or select a DCC candidate whose timepoint/age/cohort will match the instrument test battery criteria.

   If a new timepoint is created for this purpose, the instrument should appear automatically.

   For pre-existing timepoints, see the [[guide|LORIS scripts in the tools/ directory#assign_missing_instrumentsphp]] to run the assign_missing_instruments script which will update the populated instruments.

   When testing the instrument, enter sample data of different kinds, test each field and logic constraints.

   In general, for troubleshooting php code, the <showDatabaseQueries> flag in config.xml can be toggled to '1' or '0' to show or hide MySQL queries. This is _never_ advised for production instances, but can be very useful for debugging on a sandbox installation.

6. ### Update bug tracker

   It is recommended to add a category to your bug tracker utility (e.g. Mantis) for reports on this instrument.