# Instrument Manager

## Purpose

The instrument manager is intended to view and manage instrument
metadata for a LORIS instance as well as provide a centralized place
to install instruments created from the instrument builder without
backend access.

It provides overview of the "health" of the various MySQL instrument
tables and whether or not they are in sync with the instrument as it
exists on the filesystem or not. However, the checks are only possible
for LINST (instrument builder) instruments, as the appropriate state
of database tables can not easily be statically determined for PHP
instruments.

## Intended Users

The instrument manager is intended to be used by study or LORIS
administrators to view and edit the instruments installed on a given
LORIS instance.

## Scope

Only the instrument metadata is managed by the instrument manager.

It does not concern itself with data collection or analysis,
which are the responsibility of the instruments themselves, nor does
it concern itself with the creation of instruments which is the
responsibility of the `instrument_builder` module or PHP programmer. 
The test battery is also managed separately directly from the database.

## Permissions

Viewing the `instrument_manager` module requires the user to have one of the 
following permissions:
* `instrument_manager_read`
* `instrument_manager_write`

Currently, only users with the `superuser` permission can install instruments.

## Configurations

For basic access to the module, no configuration is required.

In order to enable the ability to upload instruments, PHP must be
able to write to the `project/instruments` and `project/tables_sql`
directories (to write the instrument itself, and instrument table
patch respectively.)

In order to automatically source the SQL patch and fully configure
LINST instruments, the LORIS `quatUser` and `quatPassword` configuration
must be set to a user which has the MySQL `CREATE TABLE` permission.
