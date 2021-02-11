# Scripts in Tools/ directory
> Note: scripts may generate PHP Notice messages, which is normal and should not affect output.

**See Also**:  CouchDB* loading scripts -> [Loading the Data Querying Tool](https://github.com/aces/Loris/wiki/Data-Querying-Tool#loading-the-data-query-tool)

### assign_missing_instruments.php

Adds instruments to test battery for candidates after timepoints have already been started and populated. By default this script will only print (but not add) instruments detected missing from candidate timepoints according to the current test battery definitions. Add the command-line argument “confirm” to populate these missing instruments in the database.

### delete_candidate.php

This script deletes all DB table entries for one candidate.

To run:

```php
php delete_candidate.php delete_candidate CandID PSCID [confirm] [tosql]
```

### detect_conflicts.php

**General description:** Detects double data entry conflicts missing from the `conflicts_unresolved` database table. 

**Usage:**
- Detect conflicts for a specific instrument:
`php detect_conflicts.php -i [instrument]`
- Detect conflicts for a specific instrument and visit/timepoint:
`php detect_conflicts.php -i [instrument] -t [timepoint]`
- Detect conflicts for a all instrument:
`php detect_conflicts.php -r [instrument/all] [-y to confirm]`
- Detect and insert conflicts into conflicts_unresovled table: use flag -c
`php detect_conflicts.php -c -i [instrument]`
- To update (remove and re-insert) conflicts into conflicts_unresovled table: use flag -m
`php detect_conflicts.php -m -i [instrument]`

### fix_timepoint_date_problems.php

**General description:** This script diagnoses and corrects the date problems in a candidate's profile and adds missing instruments to the behavioural battery. It can also be used to adds an instrument for a candidate, for a specific visit.

**The procedure to correct the problems is:** 
- run script with command-line argument `fix_date` to UPDATE the date fields in the candidate/session table (as needed)
- run script with command-line argument `diagnose` to get the difference in batteries
- run script with command-line argument `add_instrument` to add missing instruments, and create new feedback

**Ways to use this script:**
- to get a help screen run: `php fix_timepoint_date_problems.php help`
- to fix dates (when fixing stage dates, sessionID must be specified)
  - `php fix_timepoint_date_problems.php diagnose <candID> [<sessionID>]`
  - `php fix_timepoint_date_problems.php diagnose <candID> [<newCorrectDate> <dob/edc/>]`
  - `php fix_timepoint_date_problems.php diagnose <candID> [<sessionID> <newCorrectDate> <screening/visit>]`
- to fix behavioural battery (run only once the dates are fixed). This adds an instrument to a candidate's visit/session.
  - `php fix_timepoint_date_problems.php add_instrument  <candID> <sessionID> <test_name>`

### generate_tables_sql.php

This script takes the ip_output.txt file generated from quickform_parser.php and outputs an sql build file for the table of each instrument it finds in the ip_output.txt file. These sql files are output to the tables_sql/ subdirectory.

To run:

```php
php generate_tables_sql.php [-D]
// [-D]: Adds DROP TABLE statement to output query
```

### populate_visit_windows.php

This script populates the Visit_Windows table based on the config.xml. This should usually be run on a one time basis, and then the Visit_Windows table should be kept up to date manually, though the script will only insert new visits, so it can be run multiple times if need be.

The Visit_Windows table should be kept up to date so that places that don't have access to the config.xml (ie. the MRI pipeline scripts) can still check if a visit is valid. It's also used by the Utility::getVisits utility function in PHP, so if the table is not up to date some drop downs may not appear correctly.

To run:

```php
php populate_visit_windows.php
```

### quickform_parser.php

This parses all of the instruments and generates a staging file (`ip_output.txt`) which can be used by `data_dictionary_builder.php` and `generate_tables_sql.php`. You can also run the script for a single instrument at a time.

To run:

```php
// For all instruments:

find ../project/instruments/ | php quickform_parser.php

// For a single instrument (replace INSTRUMENTFILE with the correct filename):

find ../project/instruments/INSTRUMENTFILE | php quickform_parser.php
```

### score_instrument.php

This tools scores any registered instrument that was built using the NDB_BVL_Instrument class and that has a working score() method. It can be used to score all sessions of a given instrument, or one specific instrument for one candidate, at one session.

**To score all instances of an instrument again:**

The 'all' argument scores all records of an instrument that belong to an active timepoint and whose data entry is completed and administration is not 'None'.

To run:

```php
// replace <test_name> with the instrument you would like to score

score_instrument.php <test_name> all
``` 

The non-administered records' scores have to be reset in the DB - this tool does not manage them

**To score for a single candidate:**

```php
// replace <test_name> with the instrument you would like to score
// replace <candID> with the ID of the candidate
// replace <sessionID> with the ID of the session

score_instrument.php <test_name> one <candID> <sessionID>
```