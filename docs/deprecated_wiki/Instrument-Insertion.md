**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[DEVELOPER'S INSTRUMENT GUIDE|Developer's Instrument Guide]]** > **[[INSTRUMENT INSERTION|Instrument Insertion]]**

***

> This page covers how to create and install PHP instrument forms in LORIS.
> For linst forms, please refer to the [[Behavioural Database]].

***

> NOTE: $TABLE_NAME$: table name as appears in DB (e.g General_Health_Physical_Activity)

> $TABLE_FULL_NAME$: readable version of table name to display on the site (e.g Physical Activity) 

## Insert into test_names table
```php
/**
* All instruments must appear in this table
* Survey instruments should set IsDirectEntry to 1
*/
INSERT INTO test_names (Test_name, Full_name, Sub_group) VALUES ('$TABLE_NAME$', '$TABLE_FULL_NAME$', '1');
```

## Populate the test_subgroups table
```php
/**
* Test subgroups are used to group or categorize instruments within a timepoint’s list of instruments.
* This must be updated manually. 
*/
```

See example: [[How to populate test_subgroups|Behavioural-Database#3-populate-test_names-and-test_subgroups-tables]]

## Populate instrument_subtests
```php
/**
* Represents all pages associated with the instrument
* One page instruments do not need records in this table
* Each additional page requires one insertion
*/
INSERT INTO instrument_subtests (Test_name, Subtest_name, Description, Order_number) VALUES ('$TABLE_NAME$', '$TABLE_NAME$_page1', "Page 1", 1);
```

## Populate test_battery
```php
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
* `firstVisit` should be set to ‘`Y`’ if a particular instrument should always be part of all candidates’ first registered visit or ‘`N`’ if it should never be part of any candidate’s first visit
* This column overrides the `visit_label` entry, even if the latter is not `NULL`
* `Instr_order` allows for ordering instruments within a battery
* If any value is `NULL`, the remaining values will not be taken into consideration and the order of the tests will be as shown in the table
* Survey instruments should not be inserted into this table as they are created manually


## Run Scripts
```php
// Run scripts to parse PHP and generate SQL file with table identifying your instrument
cd /var/www/loris/tools
ls ../project/instruments/NDB_BVL_Instrument_$TEST_NAME$.class.inc | php lorisform_parser.php
cat ip_output.txt | php generate_tables_sql.php
```

## Source SQL
```SQL
-- Create/recreate the instrument table from the MySQL console
DROP TABLE IF EXISTS $TABLE_NAME$;
source /var/www/loris/project/tables_sql/$TABLE_NAME$.sql;
```
## [Clean Flag Table](#clean-flag-table)

```SQL
-- Clean up table associated records in the flag table from the MySQL console
-- Repopulate the flag table afterwards using a script (see below)

DELETE FROM flag WHERE Test_name="$TABLE_NAME$";
```

## Populating Instrument Forms After Battery Change
If you are modifying your test battery or an instrument form, you may wish to populate this instrument for timepoints for which data entry is already in progress. To add an instrument form to a timepoint whose visit stage has already been started, run [assign_missing_instruments.php or fix_timepoint_date.php](https://github.com/aces/Loris/wiki/Instrument-Scripts) -- located in the tools/ directory.

Depending on the use case, either of these scripts will add the instrument to any relevant timepoints according to the contents of the test_battery table.

## [Populate Examiners Table](#populate-examiners)
Populate examiners table with all personnel likely to administer any questionnaires/tests for each study site. This is a pre-requisite to beginning instrument data entry, as data forms will not save without selecting an examiner.

**[[NEXT: (4) Testing and Troubleshooting|Instrument-Testing-and-Troubleshooting]]**

----
See also:
* [[XIN Rules]]
* [[Instrument Groups]]
* [[Instrument Scoring]]
* [[Loris Dictionary]]