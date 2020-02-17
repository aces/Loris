# Creating a Module

## Overview

A Loris module consists of a group of pages that perform a specific function or assist with a specific task. In Loris, all active modules are shown as submenu items in the main menu on top of the page. Examples of modules include `Document Repository`, `Candidate List (Access Profiles)`, `Imaging Browser` ...


## Directory structure

1. Create a new folder corresponding to your module name under `modules/`. 
This name should be short and descriptive. 
The name must use only lowercase alphanumeric characters and underscores, e.g. `document_repository`.
For the remainder of this document we will assume your new module is named `my_new_module`.

2. Create remaining folders inside the module according to the following tree structure:

```
│
├── css/        // CSS files used by the module
│
├── help/       // Help text that is displayed to users
│
├── js/         // Compiled React files that are served to the browser
│
├── jsx/        // Original React files (JSX)
│
├── php/        // PHP classes
│
├── test/       // Test Plan and Integration Tests for the current module
│
├── README.md   // Brief description of what the module is and what it does
| 
├── .gitignore  // Local files to exclude from git. Should contain compiled JS files: `js/*`
│
```

The filepaths below will reference these directories.

_Older modules may contain other folders such as `templates/` and `ajax/`. These folders are deprecated and should
not be used for new modules._

### PHP Files

The following files are required for the module to load in LORIS:

* A PHP file called "module": `php/module.class.inc`.
* A PHP file with the same name as the module: `php/my_new_module.class.inc`.

The remaining PHP files will depend heavily on the kind of module you are creating. The most basic types
of LORIS modules are "Menu Filters" and "Forms".

#### Menu Filters

This is a type of module that displays a table of data with options to filter the values of this table.

The correct way to create a menu filter is to include additional classes that represent the idea of a
row in the table displayed to a user. This differs from a row in the database itself; for example, a row in the 
menu filter module may represent a joining of columns across many database tables.

If you are creating a Menu Filter module, your class `php/my_new_module.class.inc` should extend
the class `\DataFrameworkMenu`.

[See this file for an example](../../../modules/dicom_archive/php/dicom_archive.class.inc).

##### Data Instance
You should create a class `php/mynewmodulerow.class.inc` to represent a Menu Filter row. This will
provide basic structure for the row and include permission flags that can restrict data to users
affiliated with a given Site or Project.


[See this file for an example](../../../modules/dicom_archive/php/dicomarchiverow.class.inc).

##### Row Provisioner.
This file should be accompanied by a class `php/mynewmodulerowprovisioner.class.inc`. This file should
contain the SQL statement used to query the database for data that will be consolidated into a
Menu Filter row.

[See this file for an example](../../../modules/dicom_archive/php/dicomarchiverowprovisioner.class.inc).

#### Forms

This type of module represents an HTML form and is used to submit data to the back-end.

### JavaScript files

Modern LORIS modules use ReactJS to present data. The content of these files will vary significantly
depending on what functionality you want to provide. The best way to learn about creating JavaScript
for a new module is by studying the code of an existing module that is similar to what you are
trying to design.

Be sure to familiarize yourself with our [ReactJS guidelines](./ReactJS Guidelines.md).

### SQL Files

New modules must be inserted into the database. You must create new permissions for the module and insert
an entry for your new module within the `modules` table in LORIS.

#### Module permissions

You must define new permissions for the module. These are used to limit users to specific actions with the module.

Permissions are defined in the `permissions` table in LORIS and should be separated into view and edit permissions in most cases.

In our example, you would create two new permissions: `my_new_module_view` and `my_new_module_edit`. Your PHP code within
`php/my_new_module.class.inc` will define what these permissions allow a user to do using the `hasAccess()` function. 

To add new permissions, append them to the list of existing permissions found in `SQL/0000-00-01-Permission.sql`. (This file is found in your LORIS root directory, not within the module subdirectory.)

#### Modules table

All modules must be listed in the file `SQL/0000-00-02-Modules.sql`. 

Include a new entry in this file by adding to the list of existing modules.

#### Creating a patch

The files referenced above will be run automatically for new LORIS installations. In addition to these files,
you msut create a "patch" file that existing LORIS instances can run in order to use your new module.

Create a file `SQL/New_patches/$date_AddMyNewModule.sql`. This file should contain the same commands you added
to `SQL/0000-00-01-Permission.sql` and `SQL/0000-00-02-Modules.sql`.

### Accessing the module

The new module must be included in the modules table 
Once you created the modules as described above, go to `$LORIS$/$ModuleName$` to see your newly created page

### Testing

Your module must contain a file `test/TestPlan.md` that enumerates a sequence of action that a developer can
follow to test all functionality of your module.

#### Automated Testing

We strongly encourage that new modules include integration tests. These must be written in the file
`test/my_new_moduleTest.php`.

### Documentation

A new module must contain a `README.md` file that briefly describes the functionality of the module.
Examples can be found in any existing module.

It must also contain help text that will be displayed to users. In contrast to the README, this should
be written in a friendly and non-technical tone. Please see the [Help Text Style Guide](./Help Style Guide.md).

### Issuing a pull request

A pull request containing a new module `my_new_module` will lmust contain the following 

#### Required new files:

* `modules/my_new_module/help/my_new_module.md` -- Front-end help text for users
* `modules/my_new_module/jsx/...` -- File(s) containing ReactJS code
* `modules/my_new_module/js/` -- Empty, will contain compiled JS locally
* `modules/my_new_module/php/module.class.inc` -- Defining module metadata, widgets, and basic permissions
* `modules/my_new_module/php/my_new_module.class.inc` -- Containing core back-end functionality
* `modules/my_new_module/php/...` -- Additional PHP files as needed
* `modules/my_new_module/test/TestPlan.md` -- An exhaustive list of steps to test functionality
* `modules/my_new_module/README.md` -- Technical summary of module
* `modules/my_new_module/.gitignore` -- Defines local files to be ignored by git; usually contains `js/*`
* e.g. `SQL/New_patches/$date_Add-New-Module.sql` -- SQL statements to modify an existing LORIS to be compatible with the new module.

## Required modifications to existing files
* `SQL/0000-00-02-Permission.sql` -- Adding new permissions for your module
* `SQL/0000-00-02-Modules.sql` -- Containing an entry for the new module

## Optional new files
* `modules/my_new_module/css/...` -- Custom CSS file(s)
* `modules/my_new_module/test/my_new_moduleTest.php` -- Integration tests
