# Creating and installing clinical instruments

**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[BEHAVIOURAL DATABASE|Behavioural Database]]**

1. [Instrument Builder](#1-instrument-builder)
2. [Scoring algorithms](#2-scoring-algorithms)
3. [Populate test_names and test_subgroups tables](#3-populate-test_names-and-test_subgroups-tables)
4. [Populate test_battery table](#4-populate-test_battery-table)
5. [Populate Examiners table](#5-populate-examiners-table)
6. [Testing and Troubleshooting Instruments](#6-testing-and-troubleshooting-instruments)
7. [Double Data Entry](#7-double-data-entry)
8. [Excluding Instruments](#8-excluding-instruments)
9. [Instrument Permissions](#9-instrument-permissions)
10. [Instrument Manager](#10-instrument-manager)

***

This page covers how to create and install simple linst instrument forms in LORIS.

For **PHP forms**, please refer to the [[Developer's Instrument Guide]].

## Introduction to Instruments

The Behavioural Database is the part of LORIS that implements the battery of tests and questionnaires which are administered and used to collect data on participants in a given study. These behavioural, psychological, and clinical tests are known as **instruments** or instrument forms.  

Instrument forms fall into three categories: basic forms, forms with scoring algorithms, and forms populated by uploading data.

The **battery** is a list of which instruments are to be administered on each cohort of participants, and typically varies per timepoint and per study site.  For example, the battery of instruments administered at a participant's first visit (e.g. timepoint V01) may depend on which cohort and study site they belong to.  A participant may be tested on a certain set of instruments if they are in cohort A and from site X, but would be tested on different instruments if they are registered in cohort B at site Y. 

Instruments commonly rate the severity of the symptoms they test through scoring functions. 

## 1) Instrument Builder

The Instrument Builder (Tools menu) enables admin-level users to create simple instrument forms through the LORIS front-end. If your instrument contains one of the following, please follow the [[Developer's Instrument Guide]] for complex forms:
   * Dependencies or rules between fields 

Please note the Instrument Builder works best with Chrome or Firefox.  (Safari and Explorer not recommended.)

###   i. Create the instrument file (`*.linst` format)

To *start a new form*, navigate to the Instrument Builder module and click the Build tab. 

To *load an existing form* for editing, click the Load tab and select a `*.linst` file on your computer.

Each question requires the following fields:
* Question Name (e.g. `handedness_q01_writing`) : this will be the MySQL database fieldname. Please read important notes below.
* Question Text (e.g "Which hand is used for writing?")
...and may require other elements as required. 

#### Notes for using the Instrument Builder
* Do not use apostrophes (') or quotation marks in any field.  
* **Instrument Name**, **Date of Administration**, and **Age at administration** will be added automatically at the top of the instrument form.
* **Question Name** must be unique within the instrument, brief (shorter than 64 characters) and lowercase alphanumeric
    * No spaces or special characters should be used (hyphen, period, apostrophe, quote etc) in any fieldname. Fieldnames cannot be numbers, but can be text containing numbers. Lowercase alphanumeric and underscores are best (e.g. `q01_primary_language`)   
    * Should not end in "_status" or "_date" : these are reserved by select boxes and date fields, respectively.
* **Question Text** describes the item for data entry purposes, and often reflects the source questionnaire directly (e.g. "What is the child’s primary language?")

#### Data types in the Instrument Builder

| Data Type | Description |
| :--- | --- |
| **Header** | Specifies page title or section header. Text appears boldface at page centre. _Note: Instrument Name automatically becomes the header at the top of form._ |
| **Label** | A formatting option to introduce a subset of questions. |
| **Score Field** | Specifies data entry fields. Scored field type must be indicated in "data entry" section. |
| **Textbox** | Used for shorter miscellaneous text answers not covered by other options. |
| **Textarea** | Used for longer inputs such as general comments, etc. |
| **Dropdown** | Dropdown options are added individually by clicking 'Add Row' and cleared by clicking 'Reset'. A `not_answered` option is added automatically. |
| **Multiselect** | A select box allowing multiple options to be chosen. |
| **Date** | Used for creating a date field such as Date of Birth. _(Date of Administration is automatically added for each form -- see above.)_ |
| **Numeric** | Used for creating a numeric field (height, weight, ...) |
| **Blank Line** | "Question Name" and "Question Text" can be left blank to separate page sections. |
| **Page Break** | Used to add a new page. The value entered for "Question Text" will be the name of the new page. |

Click the Add Row button once all field information has been completed. In the preview panel underneath, click to edit any Question Name (in column Database Name (DB)). 

####   Name and Download the instrument

Click on the Save tab -- provide a short name (Filename) for your instrument, and the full title of the instrument (Instrument Name).  
_Important:_ The Filename (aka `$TESTNAME`) should not contain hyphens, apostrophes, spaces, accents or special characters. 

Finally, click the `Save` button to download the `$TESTNAME.linst` file to your computer.  

###   ii. Create and add Instrument tables to database

_Note: scripts may generate PHP Notice messages, which is normal and should not affect output._

Copy the downloaded `$TESTNAME.linst` file from your local computer into `/var/www/loris/project/instruments/` on the LORIS server, and ensure the file is apache-readable (e.g. `chmod a+r`). 

Then generate its MySQL table schema file (`$TESTNAME.sql`):

   ```bash
   cd /var/www/loris/tools
   cat ../project/instruments/$TESTNAME.linst | php generate_tables_sql_and_testNames.php
   ```

In MySQL, source the `*.sql` (or `*.super_sql`) file that was generated above:  

   ```bash
   source ../project/tables_sql/$TESTNAME.sql
   ```

If you get the error message `CREATE command denied`, ensure you have admin privileges. (see #8 [Install Script Inputs](Install-Script#running-the-install-script)). 

_NOTE: Instrument files (`*.linst`, `*sql`) should be committed to a [project-specific git repository](Code-Customization#the-project-directory)._

#### Survey Questionnaires

If your instrument is designed for direct data entry by a participant in your study, identify it as a Survey by setting the _isDirectEntry_ field to _true_ within the _test_names_ table via the MySQL back-end. Study coordinators will then be able to use the front-end Survey module will then be able to create a unique survey key and email the survey to a participant.  This instrument will also appear shaded green in a candidate's Instrument list within each timepoint. 

###   iii. Updating or modifying Instruments - Caveat

In case of any changes to instrument field types, number of fields (add or delete), or field names, repeat steps above, keeping a safe copy of the original `*.sql` file, then run `tools/generate_tables_sql.php`.

**Caveat**: sourcing the `*.sql` file output by this script will _delete_ all previously entered data for this instrument. To avoid losing data, `diff` the original `*.sql` file against the new file and use `ALTER table` statements to implement the desired changes.

If your instrument battery has been modified, please also see [[Re-populating instrument forms after battery changes|https://github.com/aces/Loris/wiki/Behavioural-Database#re-populating-instrument-forms-after-battery-changes]] 

## 2) Scoring algorithms

If an instrument form should include a scoring algorithm, a scoring script can be coded manually to accompany the form.  This scoring script will be executed by Loris automatically when a user saves data entered in the instrument form via their browser.  The script should be stored as an executable file in the `project/instruments/` directory, and the filename must be called `$INSTRUMENT_NAME.score`. 

It can be coded in any scripting language but we suggest using our PHP example below. CommentID is passed as the first argument, after which it selects from Instrument_table, performs calculations and updates using the CommentID. To test your scoring script, run it from the tools directory and provide CommentID. Below is a sample scoring script for BMI calculation - this file can be copied from the [_docs/instruments/_ directory](https://github.com/aces/Loris/blob/master/docs/instruments/bmi.score):

   ```php
#!/usr/bin/php
<?php
/* Test_name Scoring
* Description of the scoring algorithm
* @category Instrument
* @package  Test_name
* @author   Author
* @license  Loris License */
require_once "../tools/generic_includes.php";
require_once "Database.class.inc";
$CommentID = $argv[1];
$db =& Database::singleton();
$query = "SELECT * from 'test_name' WHERE CommentID = :CommentID";
$WhereCriteria = array('CommentID'=>$CommentID);
$result        = $db->pselectRow($query, $WhereCriteria);

$scores = array();

//check unit of measurement
if ($result['unit_of_measurement'] == 'standard') {
    $query_std = "SELECT bmi_value FROM bmi_standard WHERE height_feet =:hgt_feet AND height_inches=:hgt_inches AND weight=:wgt_pounds";
    $Where     =  array('hgt_feet'=>$result['height_feet'], 'hgt_inches'=>$result['height_inches'],
'wgt_pounds'=>$result['weight_pound']);
  
$scores['bmi_value'] = $db->pselectOne($query_std, $Where);   

} else if ($result['unit_of_measurement'] == metric) {$query_metric = "SELECT bmi_value FROM bmi_metric WHERE height_cms=:hgt_cms'' AND weight_kgs=:wgt_kgs";
$Where = array('hgt_cms'=>$result['height_cms'], 'hgt_kgs'=>$result['weight_kgs']);
 $scores['bmi_value'] = $db->pselectOne($query_metric, $Where);}

if ($bmi_value <= 18.5) { $scores['bmi_category'] = 'Underweight';} 
else if ($bmi_value > 18.5 && $bmi_value <= 24.9 ) {$scores['bmi_category'] = 'Normal weight';} 
else if ($bmi_value >= 25 && $bmi_value <= 29.9) {$scores['bmi_category’] = 'Overweight';} 
else if ($bmi_value >= 30) {$scores['bmi_category'] = 'Obesity';}

//save scores
$result = $db->update('test_name', $scores, $WhereCriteria);

?>
```

## 3) Populate test_names and test_subgroups tables 

All instruments _must_ appear in the test_names and test_subgroups tables. 
For all `*.linst` instruments created via the Instrument Builder, sourcing the `*.sql` file takes care of insertion to the `test_names` table.

Test subgroups are used to group/categorize instruments within a timepoint's list of instruments. 
To add a test subgroup and specify its display order: 
   ```bash
   INSERT INTO test_subgroups (Subgroup_name, group_order) VALUES ('Developmental', '1');
   INSERT INTO test_subgroups (Subgroup_name, group_order) VALUES ('Communication', '2');
   INSERT INTO test_subgroups (Subgroup_name, group_order) VALUES ('Medical', '3');
   ```
Next, associate each instrument to a subgroup via the test_names table, Sub_group field. 
E.g. for the Vineland 
   ```bash
   UPDATE test_names SET Sub_group = 
            (SELECT ID FROM test_subgroups WHERE Subgroup_name = 'Developmental')
       WHERE Test_name = 'vabs2' ;
   ```

For multi-page instruments requiring entries in the instrument_subtests table, or complex instruments that require manual PHP coding, please consult the Loris [[Instrument Coding Guide|Instrument Coding Guide]]. 

### 4) Populate test_battery table

Insert a record to add the instrument to the test battery for any given cohort, study site, and/or visit:

```sql
INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label, CenterID, firstVisit, instr_order) 
VALUES ('$test', '1', '99999', 'Y', 'Visit', '1', 'V1', NULL, NULL, 1);
```

* Each instrument must have (minimum) one entry for every relevant subproject (cohort).
* `CenterID` should be set to NULL if a test is administered across all sites.  
* Note that the DCC (Data Coordinating Centre) has `CenterID=1` and can thus be used to define a 'dummy'
 battery for testing out instrument forms on dummy candidate/session records. 
* `VisitLabel` should likewise be NULL if an instrument is administered at all visits
* `firstVisit` is NULL by default; Specify `firstVisit='Y'` if a particular instrument should always be part of all candidates' first registered visit, or `firstVisit='N'` if this form should never be part of any candidate's first visit. Note that this column overrides the visit_label entry even if the latter is not null.
* The instr_order column allows for an ordering of the instruments within a battery. Note that, if any value of that column is NULL in the database, the remaining values will no longer be taken into consideration and the ordering of the tests will be as it shows in the table.
   
#### Re-populating instrument forms after battery changes 
If you are modifying your test battery or an instrument form, you may wish to populate this instrument for timepoints for which data entry is already in progress. 
To add an instrument form to a timepoint whose visit stage has _already been started_, run either [[assign_missing_instruments.php or fix_timepoint_date.php|https://github.com/aces/Loris/wiki/LORIS-scripts-in-the-tools--directory]] -- located in the tools/ directory.  
Depending on the use case, either of these scripts will add the instrument to any relevant timepoints according to the contents of the test_battery table. 

## 5) Populate Examiners 

Add examiners via the Examiners module, to specify all personnel likely to administer any questionnaires or tests for each study site. Edit each examiner to add certifications to administer specific instruments. This is a pre-requisite to beginning instrument data entry, as instrument data forms will not save without selecting a valid examiner.  

## 6) Testing and Troubleshooting Instruments
Follow these steps to test an instrument:
1. Register a DCC candidate
2. Create a timepoint for this candidate
3. Start its visit stage (date must be within test_battery-defined age range)
4. Enter sample data, testing each field's type and logic constraints. 

A front-end user can only create candidates and visits for the site they belong to. Superusers can change a user's site (including their own) under the User Accounts module. 

#### showDatabaseQueries
Toggling the following setting in `config.xml` can help in troubleshooting MySQL statements sent to the database.  Set `<showDatabaseQueries>` to show (`1`) or hide (`0`) MySQL queries at the top of the browser. 

```xml
<gui>
    <showDatabaseQueries>0</showDatabaseQueries>
</gui>
```
This feature does not work in all modules and may interfere with JavaScript running in the page, and should never be used in production instances.

## 7) Double Data Entry

Double Data Entry (DDE) is the practice of requiring users to manually input the same dataset twice in order to reduce the risk of error in data entry. For DDE-designated instruments, a participant's instrument data collection at a given visit cannot be finalized in LORIS unless both the first data entry form and second (double) data entry form are completed.

To enable an instrument for double data entry, in the Configuration module inside the Study panel, use the "Double data entry instruments" section to add instrument names. Be very careful when removing an instrument name from this list, regarding the impact on the integrity of the entire dataset.

Note: by default, all forms will have a Double Data Entry (DDE) duplicate form created in the back end (flag table and instrument table) when the instrument is populated for a session. However, the DDE form link does not appear in the front end and Double Data Entry completion is not enforced unless the instrument is specified as a Double Data Entry instrument via the Configuration module.

Data entry conflicts detected through between the first and second (double) data entry forms are resolved through the [[Conflict Resolver|LORIS-Modules#double-data-entry-dde-and-conflict-resolver-module]]

## 8) Excluding Instruments

   To exclude instruments from the Data Dictionary and Data Query Tool, go to the Configuration module under the "Study" section under "Excluded instruments" and add/select a valid Test Name (e.g. MRI Parameter Form).

## 9) Instrument Permissions

   Access to specific instruments can be controlled by custom permissions, via the back-end file `project/config.xml`

   ```xml
   <instrumentPermissions>
        <!-- By default (false) anyone has permission -->
        <useInstrumentPermissions>false</useInstrumentPermissions>

        <!-- Add one <instrument> tag for each instrument that is
             having its permissions configured. If an instrument
             is missing, the default is for users to have access -->
        <instrument>
            <!-- Instrument name -->
            <Test_name>sampleInstrument</Test_name>
            <!-- Permission required for accessing the instrument.
                 If multiple permissions are added, *any* of them individually 
                 will allow access to the instrument -->
            <permission>sampleInstrumentPermissionName</permission>
        </instrument>
        <instrument>
            <Test_name>sampleInstrument2</Test_name>
            <permission>sampleInstrument2PermissionName</permission>
        </instrument>
    </instrumentPermissions>
   ```

## 10) Instrument Manager

The Instrument Manager module is designed allow the Loris database Admin superuser to upload and install instrument forms (`*.linst` files), and to monitor instrument status in LORIS.  

To enable upload and installation of `*.linst` instrument files created using the Instrument Builder: 

i. **Create a separate MySQL user account with CREATE, SELECT, INSERT, UPDATE and DELETE privileges** on the database. This credential should be stored in `project/config.xml` within the `<database>` tag section as `<dbUser>` and `<dbPassword>` : 
   ```xml
   <database>
        ...
        <dbUser>%USERNAME%</dbUser>
        <dbPassword>%PASSWORD%</dbPassword>
        ...
    </database>
   ```

ii.  **Ensure that the project-specific directories are Apache-writeable**: `project/instruments/` and `project/tables_sql/`

**[[NEXT: (4) Imaging Database|Imaging-Database]]**
