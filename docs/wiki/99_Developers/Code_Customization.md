# Code customization
## The project/ directory

The `project/` directory is designed to house project-specific code and some data such as documents.  This includes instrument forms, instrument table schemas, and any customizations to other pages or modules in the Loris codebase.  
The `project/` folder and its subdirectories are created by the install script, which also installs the `config.xml` file there.

Instrument forms (.linst or php) should be stored under `project/instruments/` and their table schemas (.sql) should be stored under `project/tables_sql/`

## Backing up project/

**IMPORTANT:** Commit your project/ directory and its contents to a separate private repo - e.g. on GitHub

**EQUALLY IMPORTANT:** Exclude all data and the config.xml file (which contains a database credential) stored under project/ from commits/backups to your online repo (such as on GitHub). Back up this data and the config file elsewhere on another server, using a cronjob. 

## Tracking changes

It is highly recommended to keep a Readme file under the project/ directory tracking all your project's customizations. This practice will help developers and also be useful at Release upgrade time, when merging any module updates in the codebase with your custom code.

## Modifying and overriding code under the project/ directory

Code stored under `project/libraries/` will override the file of the same name found in the same path under `php/libraries/` i.e. `project/libraries/_filename.class.inc_` will override `php/libraries/_filename.class.inc_`.

**NOTE:** It is strongly not recommended to override LORIS library classes unless absolutely necessary. Overrides on libraries can cause upgrade issues and long term bugs and come at a great maintenance and overhead costs.*

Template stored under `project/templates/` will override the file of the same name found in the same path under `smarty/templates/`.

## Module override

For projects wishing to customize existing modules, the recommended best practice is to copy *all* module code from `modules/_module_name_/*` to `project/modules/_module_name_/*` and modify code there.  
This will use the `project/` override functionality of Loris.  These changes should be added and committed to your project-specific private repo. 

## Manage additional npm dependencies

To add new npm packages to your project, you can create a package.json file in `project/` by running `npm init`. Any dependencies in this file will be automatically installed under `project/` when make or npm ci/npm install is run from loris root.

## Webpack compilation

Modules overriden js files will automatically compile and replace the file they intend to modify. On the other hand, new js files will need to be registered in order to be compiled with `npm run compile`. To register, for example, a new React components located in `project/modules/_new_module_name_/jsx/_react_component_.js` you can create `project/webpack-project.config.js` with the following template:

```
const entry = {
  '_new_module_name_': [
    '_react_component_',
  ],
};

module.exports = entry;
```
