See also:
* [[Updating your LORIS]]
* [[How to make a LORIS module]]
* [[Guide to Loris React components]]
* [[Developer's Instrument Guide]]
* [[About superuser]]

## The project/ directory

The project/ directory is designed to house project-specific code and some data such as documents.  This includes instrument forms, instrument table schemas, and any customizations to other pages or modules in the Loris codebase.  
The project/ folder and its subdirectories are created by the install script, which also installs the _config.xml_ file there.

[[Instrument forms|Behavioural-Database]] (_.linst_ or php) should be stored under project/instruments/ and their table schemas (.sql) should be stored under project/tables_sql/ 

## Backing up project/

* Important: Commit your project/ directory and its contents to a separate private repo - e.g. on GitHub
* Equally Important: Exclude all data and the _config.xml_ file (which contains a database credential) stored under project/ from commits/backups to your online repo (such as on GitHub).  Back up this data and the config file elsewhere on another server, using a cronjob. 

## Tracking changes

It is highly recommended to keep a Readme file under the project/ directory tracking all your project's customizations. This practice will help developers and also be useful at Release upgrade time, when merging any module updates in the codebase with your custom code.

## Modifying and overriding code under the project/ directory

Code stored under project/modules/ and project/libraries/ and project/templates/ **will override** the file of the same name found in the same path under Loris root php/librariies/
* /var/www/loris/project/libraries/_filename.class.inc_ will override /var/www/loris/php/libraries/_filename.class.inc_)

## Module override

For projects wishing to customize existing modules, the recommended best practice is to copy _all_ module code from $lorisroot/modules/_module_name_/* to a new project/modules/ subdirectory (project/modules/_module_name_/* ) and modify code there.  
This will use the project/ override functionality of Loris.  These changes should be added and committed to your project-specific private repo. 

----
See also:
* [Coding Standards](https://github.com/aces/Loris/blob/master/docs/CodingStandards.md) from the last release
* [[How to make a LORIS module]]
* [[Guide to Loris React components]]
* [[Developer's Instrument Guide]]