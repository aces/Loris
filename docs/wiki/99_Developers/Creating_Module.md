# Creating a Module

## Overview

A Loris module consists of a group of pages that perform a specific
function or assist with a specific task. Examples of modules include
`Document Repository`, `Candidate List (Access Profiles)`, `Imaging
Browser` ...

## Directory structure

Create a new folder corresponding to your module name under `modules/`.
This name should be short and descriptive.  The name should use
only lowercase alphanumeric characters and underscores, e.g.
`document_repository`.  The directory name correponds to the URL
that LORIS will use to load your module.  For the remainder of this
document we will assume your new module is named `my_new_module`.

### PHP Files

The following files are required for the module to load in LORIS:

* A PHP file called "module": `php/module.class.inc`.
* A PHP file with the same name as the module: `php/my_new_module.class.inc`.

The namespace must be set to `LORIS\$modulename` for anything defined
in the PHP directory. Filenames need to be lowercase in order to
be autoloaded. Class names can be any case.

The remaining PHP files will depend heavily on the kind of module
you are creating.

The most common type of LORIS module will extend the class `NDB_Page`
and belong to one of two types: "Menu Filters" and "Forms".


#### Menu Filters

This is a type of page that displays a table of data with options
to filter the values of this table.

The easiest way to create a menu filter is to include classes that
represent the idea of a row in the table displayed to a user. This differs
from a row in the database itself; for example, a row in the menu filter
module may represent a joining of columns across many database tables.

If you are creating a Menu Filter page, your class
`php/my_new_module.class.inc` should extend the class `\DataFrameworkMenu`.

[See this file for an
example](../../../modules/dicom_archive/php/dicom_archive.class.inc).

##### Data Instance

You should create a class `php/mynewmodulerow.class.inc` to represent
a Menu Filter row. This class represents the concept of a row in the
frontend as described above. This provides an entity model for the row
and is used for restricting data access, such as to filter out rows
based on the user's site or project affiliations.

[See this file for an
example](../../../modules/dicom_archive/php/dicomarchiverow.class.inc).

##### Row Provisioner.

The `php/mynewmodulerow.class.inc` file should be accompanied by a
class `php/mynewmodulerowprovisioner.class.inc`. Provisioners
retrieve the data from a data source, and interpret it as the data
instance class described above. They often contain an SQL statement
to retrieve data from the LORIS SQL database. The provisioner should
return an iterator that iterates through all the data that a
user with all permissions would see, and the LORIS data
framework then filters out rows that do no not match the current
user (for instance, because of site restrictions.)


[See this file for an example based on retrieving data from
SQL](../../../modules/dicom_archive/php/dicomarchiverowprovisioner.class.inc).

#### Forms

This type of page represents an HTML form and is used to submit
data to the back-end.

### JavaScript files

Modern LORIS modules use ReactJS to present data. The content of
these files will vary significantly depending on what functionality
you want to provide. The best way to learn about creating JavaScript
for a new module is by studying the code of an existing module that
is similar to what you are trying to design.

Be sure to familiarize yourself with our [ReactJS guidelines](../../React.README.md)
Guidelines.md).


### SQL Files

A pull request to create a new module must contain SQL modifications
in order for LORIS to detect the module and serve it with appropriate
access control.

Please make sure that all SQL changes follow our [SQL code
standards](../../SQLModelingStandard.md).


#### Module permissions

You must define new permissions for the module. These are used to
limit users to specific actions with the module.

Permissions are defined in the `permissions` table in LORIS and
should be separated into view and edit permissions in most cases.

In our example, you would create two new permissions: `my_new_module_view`
and `my_new_module_edit`. Your PHP code within
`php/my_new_module.class.inc` will define what these permissions
allow a user to do using the `hasAccess()` function.

To add new permissions, append them to the list of existing permissions
found in `SQL/0000-00-01-Permission.sql`. (This file is found in
your LORIS root directory, not within the module subdirectory.)

#### Adding/Removing Modules

The script `tools/manage_modules.php` should be run to install new
modules. This will take care of updating the relevant tables in
LORIS that are required for a module to load. It does not manage the
tables used by the module itself, which must be manually created.

#### Creating a patch

The files referenced above will be run automatically for new LORIS
installations. In addition to these files, you must create a "patch"
file that existing LORIS instances can run in order to use your new
module.

Create a file `SQL/New_patches/$date_AddMyNewModule.sql`. This file
should contain the same commands you added to
`SQL/0000-00-01-Permission.sql` and `SQL/0000-00-02-Modules.sql`.

### Interacting with other modules

LORIS includes a system for modules to register functionality to
be included in other modules, known as "widgets". Examples of pages
which display widgets are the dashboard or (new) candidate profile
module which displays a dashboard of all data related to a single
candidate.

Widgets are registered in other modules by implementing the
`getWidgets()` function in the `php/module.class.inc` class of your
module.

Refer to our [widgets documentation](../../ModuleWidgets.md) to see
what types of widgets can currently be registered by your new module.
(If none are implemented, it simply means your module won't be
displayed in any of the dashboards that are intended to show overviews
of data in LORIS, but your module will still be accessible through the
menu.)


### Accessing the module

The new module must be included in the modules table by using the
`manage_modules` script described above. Once you have created the
files above and ran the script, go to `$LORIS$/$ModuleName$` to see
your newly created page.


### Testing

Your module must contain a file `test/TestPlan.md` that enumerates
a sequence of actions that a developer can follow to test all
functionalities of your module.

#### Automated Testing

We strongly encourage that new modules include integration tests.
These must be written in the file `test/my_new_moduleTest.php`.

### Documentation

A new module must contain a `README.md` file that briefly describes
the functionality of the module and serves as a high level technical
specification of what the module is intended to do.  Examples can
be found in any existing module.


The new module must also contain a markdown file under `help/` that will
be displayed to users. In contrast to the README, this should be
written in a friendly and non-technical tone. Please see the [Help
Text Style Guide](../../HelpStyleGuide.md).

### Issuing a pull request

A pull request containing a new module `my_new_module` must contain
the following

#### Required new files:

* `modules/my_new_module/help/my_new_module.md` -- Front-end help text for users
* `modules/my_new_module/jsx/...` -- File(s) containing ReactJS code
* `modules/my_new_module/php/module.class.inc` -- Defining module metadata, widgets, and basic permissions
* `modules/my_new_module/php/my_new_module.class.inc` -- Containing core back-end functionality
* `modules/my_new_module/php/...` -- Additional PHP files as needed
* `modules/my_new_module/test/TestPlan.md` -- An exhaustive list of steps to test functionality
* `modules/my_new_module/README.md` -- Technical summary of module
* `modules/my_new_module/.gitignore` -- Defines local files to be ignored by git; usually contains `js/*`
* e.g. `SQL/New_patches/$date_Add-New-Module.sql` -- SQL statements to modify an existing LORIS instance to be compatible with the new module.

## Required modifications to existing files
* `SQL/0000-00-01-Permission.sql` -- Adding new permissions for your module
* `SQL/0000-00-02-Modules.sql` -- Containing an entry for the new module

## Optional new files
* `modules/my_new_module/css/...` -- Custom CSS file(s)
* `modules/my_new_module/test/my_new_moduleTest.php` -- Integration tests
