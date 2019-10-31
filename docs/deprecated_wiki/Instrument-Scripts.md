The instrument-relevant scripts can be found in the tools/ directory. They should be run from inside the tools directory.

```cd /var/www/loris/tools```

##assign_missing_instruments.php
This script adds any missing instruments from the expected battery for all candidates, either at a particular timepoint or all timepoints. This should be run after a change in the test_battery table. 
```
// prints instruments detected missing from candidate timepoints for all instruments
php assign_missing_instruments.php
// adds the  instruments detected missing from candidate timepoints for all instruments
php assign_missing_instruments.php confirm
```

##fix_timepoint_date_problems.php

This tool can be used add a missing instrument to a candidate’s behavioural battery.
It is also used to correct date issues in a candidate profile.
This should be run to add a single instrument to a session.
```
// to fix dates (when fixing stage dates, sessionID must be specified)
php fix_timepoint_date_problems.php fix_date <candID> <newCorrectDate> <dob/edc>
php fix_timepoint_date_problems.php fix_date <candID> <newCorrectDate> <screening/visit> <sessionID>
// when diagnosing a problem (if only CandID is specified, all timepoints are diagnosed
php fix_timepoint_date_problems.php diagnose <candID> [<sessionID>]
php fix_timepoint_date_problems.php diagnose <candID> [<newCorrectDate> <dob/edc/>]
php fix_timepoint_date_problems.php diagnose <candID> [<sessionID> <newCorrectDate> <screening/visit>]
// to fix bvl battery (run only once the dates are fixed)
php fix_timepoint_date_problems.php add_instrument  <candID> <sessionID> <test_name>
```

## generate_tables_sql_and_testNames.php
This script creates the SQL build file from the ip_output.txt file created by quickform_parser.php that is then used to create the instrument table. The script also inserts relevant entries into the test_names and instrument_subtests tables. Note: test_battery and test_subgroups need to be handled manually. You can find the SQL file in project/tables_sql/. This script should be run after quickform_parser.php.
```
ls ../project/instruments/NDB_BVL_Instrument_$TEST_NAME$.class.inc | php generate_tables_sql_and_testNames.php
```

##score_instrument.php
This tool scores an instrument with a working score() function. This should be run after a scoring algorithm has changed, to view mass scoring results, or to debug the scoring.
```
// scores all records of an instrument that belong to an active timepoint 
// whose data entry is complete and administration <> None
php score_instrument <test_name> all
// scores the record for one instrument belonging to one candidate session
php score_instrument <test_name> one <candID> <sessionID>
quickform_parser.php
This script parses the PHP file into a staging file ip_out.txt that can be used by data_dictionary_builder.php and generate_tables_sql_and_testNames.php. This should be run after an instrument is finished being coded.
ls ../project/instruments/NDB_BVL_Instrument_$TEST_NAME$.class.inc | php quickform_parser.php
```
