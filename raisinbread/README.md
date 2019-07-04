*This directory contains all the files necessary to spawn an instance of the Raisin 
Bread demonstration dataset.*

### Overview
The Raisin Bread (RB) database is an example dataset built for demonstration and 
testing purposes. This dataset should be expanded when new features are added and 
adjusted when existing features are changed or removed. 

The sections below provide some insights into installing, modifying and exporting 
the dataset.

### Installing RB
The RaisinBread data is stored in the form of SQL INSERT statements located in the 
`/raisinbread/RB_files/` directory and grouped by the database table they belong to. 
These statements rely on the pre-existence of the SQL tables and thus the data is 
heavily coupled with the default LORIS schema files located in the `/SQL/` directory.
The RaisinBread dataset also include a few example instruments, these can be found in
the `raisinbread/instruments/` directory along with their respective SQL schemas in 
`raisinbread/instruments/instrument_sql/` and their respective Meta SQL commands in 
`raisinbread/instruments/instrument_sql/Meta/`. 

***Note:** The following instructions assume that the user has already installed a 
functional version of LORIS. It's important to note that the steps below will clear 
all data from the currently active database and replace it with the RaisinBread data.*

***Assumption:** The commands below assume that the MySQL configuration files 
exist and contain a default database, user, host and password. In the event that 
that is not the case, replace all `mysql` commands below by the necessary values 
`mysql -u user -p -h host database_name`*

##### Sourcing SQL
In order to be able to use the RaisinBread dataset, the LORIS SQL schema needs to be 
sourced, followed by the different instrument schemas and finally the actual RB data. 
The commands below assume that the current working directory is the main LORIS root
directory.

```
cat SQL/0000-00-00-schema.sql \
    SQL/0000-00-01-Permission.sql \
    SQL/0000-00-02-Menus.sql \
    SQL/0000-00-03-ConfigTables.sql \
    SQL/0000-00-04-Help.sql \
    SQL/0000-00-05-ElectrophysiologyTables.sql \
    raisinbread/instruments/instrument_sql/aosi.sql \
    raisinbread/instruments/instrument_sql/bmi.sql \
    raisinbread/instruments/instrument_sql/medical_history.sql \
    raisinbread/instruments/instrument_sql/mri_parameter_form.sql \
    raisinbread/instruments/instrument_sql/radiology_review.sql \
    raisinbread/RB_files/*.sql | mysql
```

##### Configuring
In order to be able to load the LORIS front-end while using the RaisinBread dataset 
some configurations are necessary.

1. Copy the `raisinbread/config/config.xml` file into `project/config.xml`
2. Input the correct `<database>` information in the `project/config.xml` file 
3. Change the values of the `Config` table of the SQL database to reflect the 
correct `host`, `url` and `base` values
4. copy the `raisinbread/instruments/` instrument PHP and LINST files to the 
`projects/instruments/` directory

> The password of the `admin` user on the RB database is `demo20!7`


##### Getting the imaging files
MCIN members have automatic access to the imaging files on their dev VM
where the raisinbread dataset is automatically mounted in the `/data-raisinbread` directory.

External users should email the loris-dev mailing list to request a copy of the data.

### Modifying RB
The RaisinBread database should be handled like any other project. The data should 
never be modified directly in the SQL files, the database should be sourced, 
altered and re-exported into SQL files.

When possible, data modifications should be done directly from the LORIS front-end 
or using the LORIS tools. When modifications need to be done directly in SQL, it is 
important to only add clean data.

When implementing a feature that requires SQL modifications, the SQL patch created 
and submitted to the LORIS repository should be run on RaisinBread just like it 
would be run on any project database. The changes should appear in the same pull 
request as the new feature on the LORIS repository.

Any modification to the database will be reflected in the exports, make sure no 
personal information gets accidentally added to the RaisinBread database while you 
are modifying it.


### Exporting RB
The RaisinBread data should be updated with every code change impacting the database. 
To do so, the user needs to source the database before the changes, modify the 
database and then export the data to be submitted back to LORIS in the same pull 
request as the code changes.

##### Contributing back into LORIS
In order to submit changes made to RaisinBread back to LORIS, an export tool was 
created in the `tools/exporters/` directory. The `DB_dump_table_data.php` PHP script 
executes a `mysqldump` command that generates a single SQL file per SQL 
table in the `raisinbread/RB_files/` directory. Each file contains foreign keys 
disabling and enabling, table truncation to clear all existing data and table locking 
to avoid data corruption during sourcing. If the data has been modified between 
sourcing these files and exporting them, the modification will be reported as git 
uncommitted changes and thus they can be verified and submitted to the LORIS repo 
in the same pull request as the code.

Note: when contributing back new imaging files in raisinbread, the file 
RB_parameter_file.sql can become too big due to the complete header being dumped 
in the parameter_file using ParameterTypeID=238. To decrease the size of the 
RB_parameter_file.sql file, run the following query on your mysql and recreate
the RB_parameter_file.sql file.

```
DELETE FROM parameter_file JOIN parameter_type USING (ParameterTypeID) WHERE Name='header';
```

### Troubleshooting

If you are having issues sourcing RB using the single command above, you can try to 
use the following comands sequentially. These commands echo the name of the SQL 
script before running it which helps to identify exactly what SQL statement is failing.

```
for n in /var/www/loris/SQL/0000-*.sql; do echo $n; cat $n | mysql || break; done;
for n in /var/www/loris/raisinbread/instruments/instrument_sql/*.sql; do echo $n; cat $n | mysql || break; done;
for n in /var/www/loris/raisinbread/RB_files/*.sql; do echo $n; cat $n | mysql || break; done;
```