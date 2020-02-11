# Creating a Module

**Note:** If you are looking for information about how to **adapt** or **override a module**, please see [[Code Customization]]❗

---

## Overview 📝

A Loris module consists of a group of pages that perform a specific function or assist with a specific task. In Loris, all active modules are shown as submenu items in the main menu on top of the page. Examples of modules include `Document Repository`, `Candidate List (Access Profiles)`, `Imaging Browser` ...


### 2) Create directory structure

1. Create a new folder corresponding to your module name under `modules/`. 
This name should be short and descriptive. 
The name must use only lowercase alphanumeric characters and underscores, e.g. `document_repository`.
For the remainder of this document we will assume your new module is named `my_first_module`.

2. Create remaining folders inside the module according to the following tree structure:

```
│
├── css/        // CSS files used by the module
│
├── help/       // Help text that is displayed to users
│
├── js/         // Compiled React files (vanilla javascript) that are served to the browser
│
├── jsx/        // Original React files (JSX) - must be compiled
│
├── php/        // PHP classes used to retrieve data from database and display forms
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

### 3) Add required files

The following files are required for the module to load in LORIS:

* A PHP file called "module": `php/module.class.inc`.
* A PHP file with the same name as the module: `php/my_new_module.class.inc`.

### Accessing the module

Once you created the modules as described above, go to `$LORIS$/$ModuleName$` to see your newly created page

>*For more information, see* [[How Loris URLs work]]

### 5) Add module Permissions

You must define new permissions for the module. These are used to limit users to specific actions with the module.

Permissions are defined in the `permissions` table in LORIS and should be separateed into view and edit permissions in most cases.

In our example, you would create two new permissions: `my_new_module_view` and `my_new_module_edit`. Your PHP code within
`php/my_new_module.class.inc` will define what these permissions allow a user to do.


### Testing

Your module must contain a file `test/TestPlan.md` that enumerates a sequence of action that a developer can
follow to test all functionality of your module.

#### Automated Testing

We strongly encourage that new modules include integration tests. These must be written in the file
`test/my_new_moduleTest.php`.

Unit tests should also be provided for the new module. These are stored outside of the modules directory at
`$loris/test/unittests/`. For more information, read the [Unit Testing Guide](../../../test/UnitTestingGuide.md).

### Documentation

A new module must contain a `README.md` file that briefly describes the functionality of the module.
Examples can be found in any existing module.

It must also contain help text that will be displayed to users. In contrast to the README, this should
be written in a friendly and non-technical tone. Please see the [Help Text Style Guide](./Help Style Guide.md).

