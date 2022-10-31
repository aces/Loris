## Installation

The steps for installing a LORIS instrument depend on the instrument format 
chosen (**PHP** or **LINST**) and the data storage type selected (**SQL** table 
or **JSON**). This document details different installation options for all types 
of instruments. 

### OPTION 1: SQL Table Storage
#### LINST Instruments - The Instrument Manager 
**The Instrument Manager** module is available to users with the appropriate 
permissions. This module allows front-end users to upload LINST instruments into 
the web browser which will then be automatically installed. This module only 
functions with LINST instruments which are set to use a dedicated SQL table in 
the database. 

Follow the steps below in order to use the Instrument Manager for your instrument.

  1. Navigate to the Instrument Manager module under the **Admin** menu.
  2. Navigate to the upload tab within the module
  3. Choose browse and select the file you have saved from the Instrument Builder 
  (the file must have a `.linst` extension)
  4. Click "Install" to submit your instrument.

After installing your instrument, you can load it in a timepoint to test it. For 
instructions on populating instruments in a timepoint navigate directly to the 
[Test Battery](./07_clinical_test_battery.md) section directly or continue 
following the documentation.

> _**Note:** The instrument manager requires some special configurations to 
>function properly. Make sure to read the module's [spec sheet](../../../../modules/instrument_manager/README.md) 
>before attempting your first instrument install._

#### PHP Instruments
**PHP instruments** behave slightly differently than LINST instruments and 
require more manual steps for installation. In order to be able to generate the 
SQL table for PHP instruments, they must first be parsed. The LORIS codebase 
includes a tool under the `tools/` directory called the `lorisform_parser.php` 
allowing for a PHP instrument to be parsed into an intermediary serialized format 
and automatically stored in the `tools/ip_output.txt` file.

The intermediary state is necessary for the generation of the SQL `CREATE TABLE` 
patch which, in turn, is necessary for the install process when using dedicated 
SQL table storage. In order to get from the intermediary serialized format to an 
SQL table, the `generate_tables_sql.php` tool is then used on the `ip_output.txt` file.

Follow the steps below to install a new PHP instrument.

  1. Move your newly created instrument `NDB_BVL_Instrument_TEST_NAME.class.inc` 
  into the `project/instruments/` directory.
  2. Navigate to the LORIS `tools/` directory.
  3. Run the instrument through the `lorisform_parser.php` to parse the PHP 
  instrument into the intermediary serialed format.
  		```
  		ls ../project/instruments/NDB_BVL_Instrument_TEST_NAME.class.inc | php lorisform_parser.php
  		```
  4. Run the `generate_tables_sql.php` tool to converted the serialized format 
  into an SQL `CREATE TABLE` SQL patch. The patch will be created in the `project/` 
  directory by default.
  		```
  		php generate_tables_sql.php
  		```
  5. Source the newly generated SQL patch `project/TEST_NAME.sql` into your SQL 
  database to create the table.
  6. Register the instrument in the `test_names` table of the database by running 
  the following command. Make sure to replace the `'TEST_NAME'` value with the 
  actual test name used in your instrument. 
  
  	```
  	INSERT INTO test_names (Test_name,Sub_group) SELECT 'TEST_NAME', ID FROM test_subgroups WHERE Subgroup_name='Instruments';
  	```
  	
  > _**Note:** The `Sub_group` entry in the query above is necessary for the 
  > instrument registration. See the [Instrument Grouping](#instrument-grouping) 
  > section below for additional details._
  		
By completing these steps the instrument should be installed and ready to be 
assigned to a battery; only instruments assigned to a behavioural test battery 
are available for data entry For more information about test batteries, navigate 
to the [Test Battery](./07_clinical_test_battery.md) section directly or continue 
following the documentation.

> _**Note:** Each PHP tool mentioned above contains documentation at the top of 
>the file in case additional details are required._


### OPTION 2: JSON Data Storage
**PHP and LINST instruments using JSON data storage** do not require a dedicated 
SQL table on the database thus making their installation much simpler. Once your 
instrument is finalized, save it and move it to the `project/instruments/` directory 
(this is the same location the Instrument Manager stores installed instruments). 
Once the instrument is in the correct location, you must add it manually to the 
`test_names` table of the database to register it. The following query can be used 
as a template for the registration.
  
 ```
  	INSERT INTO test_names (Test_name,Sub_group) SELECT 'TEST_NAME', ID FROM test_subgroups WHERE Subgroup_name='Instruments';
 ```
> _**Note:** The `Sub_group` entry in the query above is necessary for the 
>instrument registration. See See the [Instrument Grouping](#instrument-grouping) 
>section below for additional details._
  		
By completing these steps the instrument should be installed and ready to be 
assigned to a battery; only instruments assigned to a behavioural test battery 
are available for data entry For more information about test batteries, navigate 
to the [Test Battery](./07_clinical_test_battery.md) section directly or continue 
following the documentation.

> _**Note:** The `TEST_NAME` value in the SQL statement must match exactly the 
>LINST file name  without the extension or the `testname` value in PHP instruments 
>(i.e. The `TEST_NAME` value for `bmi.linst` is `bmi`)._

## Instrument Grouping

In the interest of organization, LORIS allows for instruments to be categorized 
on the User interface when displayed in the web browser. This categorization 
is made possible by the `test_subgroups` database table. Instruments are then 
assigned to categories and sorted accordingly on the user's interface. 

New entries can be added to the `test_subgroups` table to create new categories
 and instruments can be assigned a category by updating the `Sub_group` column 
 in the `test_names` table with the desired `ID` from the `test_subgroups` table.




