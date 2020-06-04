**[[HOME|Home]]** > **[[TECHNICAL|Technical]]** > **[[How to make a LORIS module]]**

---

1. [Overview](#1-overview)
2. [Create directory structure](#2-create-directory-structure)
3. [Add required files](#3-add-required-files)
4. [Access module in Loris](#4-access-module-in-loris)
5. [Add module Permissions](#5-add-module-permissions)
6. [Add to LorisMenu](#6-add-to-lorismenu)
7. [Add Configuration settings](#7-add-configuration-settings)
8. [Test your module](#8-test-your-module)
9. [Add Documentation](#9-add-documentation)


> **Note:** If you are looking for information about how to **adapt** or **override a module**, please see [[Code Customization]]❗

See also: [Coding Standards from the last release](https://github.com/aces/Loris/blob/master/docs/CodingStandards)

---

### 1) Overview 📝

A Loris module consists of a group of pages that perform a specific function or assist with a specific task. In Loris, all active modules are shown as submenu items in the main menu on top of the page. Examples of modules include ```Document Repository```, ```Candidate List (Access Profiles)```, ```Imaging Browser``` ...

>**Note to contributors:** In order to contribute a new module to Loris, you must first **fork our repository** and checkout a new branch based on the current development branch (currently `17.0-dev`). 
>
After creating your module, push the branch to your fork of `Loris` and create a **pull request** to the current development branch under `aces/Loris`

---

*The following tutorial outlines a set of steps to follow in order to create a new Loris module.*

*Note: This wiki is under construction*


### 2) Create directory structure

1. Create a new folder corresponding to your module name under ```$LORIS$/modules/```
  - **Important**: the name you choose for the module will be used as a descriptive URL to access the module, so it is important to have a short and descriptive name (i.e media)
 - **Note**: module name must use only lowercase alphanumeric characters and underscores (no spaces)
   - i.e `document_repository` 
2. Create remaining folders inside the module according to the following tree structure:

```js
├── ajax/       // PHP files used to make AJAX requests to retrieve information bypassing Loris page router
│
├── css/        // CSS files used by the module
│
├── js/         // Compiled React files (vanilla javascript) that are served to the browser
│
├── jsx/        // Original React files (JSX) - must be compiled
│
├── php/        // PHP classes used to retrieve data from database and display forms
│  
├── templates/  // Smarty files (.tpl) that define page markup (HTML)
│
├── test/       // Test Plan and Integration Tests for the current module
│
├── README.md   // Brief description of what the module is and what it does 
│
```

### 3) Add required files

The most basic version of a module will require a single `php` file to retrieve information from database and a single `.tpl` file to render the page.


**Option 1**: Page with a selection filter

1. `NDB_Menu_Filter_$ModuleName$.class.inc` - usually a main page on a module
2. `menu_$ModuleName$.tpl` - a template associated with `NDB_Menu_Filter_$ModuleName$`

>For an example of this implementation module, see [Media](https://github.com/aces/Loris/tree/master/modules/media)

**Option 2**: Page with a regular form (or a placeholder page)

1. `NDB_Form_$ModuleName$.class.inc` - renders a extends `NDB_Form`
2. `form_$ModuleName$` - a template associated with `NDB_Form_$ModuleName$`

>**Important:** If `NDB_Form_$ModuleName$.class.inc` is used as the entry point for the module, it must contain a function named $ModuleName$ corresponding to the requested URL.
>
>*Example*: Going to `$LORIS$/dashboard/` looks in `dashboard` module, finds `NDB_Form_dashboard.class.inc` class and executes `dashboard()` function.

>For an example of this implementation module, see [Dashboard](https://github.com/aces/Loris/tree/master/modules/dashboard)

Tips: 
* Selection Filters: Don't forget to include code to handle the UseProjects config mode in Loris
* [[Guide to Loris React components]]

### 4) Access module in Loris

Once you created the modules as described above, go to `$LORIS$/$ModuleName$` to see your newly created page

>*For more information, see* [[How Loris URLs work]]

### 5) Add module Permissions

*Under construction*

* View and Edit are our current conventions, for a starting point.  e.g. candidate_parameter_view and candidate_parameter_edit
* Add to default MysQL schema as well as your MySQL patch for existing projects
* also see LorisMenuPermissions.  

### 6) Add to LorisMenu

*Under construction*

LorisMenu and LorisMenuPermissions tables - add to default schema as well as your patch for existing projects.  
* LorisMenuPermissions should match the hasAccess() function in your module


### 7) Add Configuration settings

*Under construction*

### 8) Test your module

* Commit a test plan.  Don't forget to include permission checks/tests
* Write unit and integration tests, and provide sample test data if possible

>*For more information, see* [[LORIS Module Testing]]

### 9) Add Documentation

*Under construction*
* User-facing Help text 
For contributors: 
* Readme within information on how to set up / configure / populate the module.  If any scripts have been included under tools/ to push data to the DQT, mention them here
* Add a page for your module in this Wiki

---

>We welcome your **pull requests** for new modules, please contribute! 💯 
