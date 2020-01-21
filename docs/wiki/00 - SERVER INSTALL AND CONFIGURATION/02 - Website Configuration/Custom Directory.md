# Custom Directory

The `custom/` directory contains files that override the core functionality of
LORIS. This can include custom modules and instruments that you can modify
independently of the main source code of the LORIS repository.

All files in this directory will be ignored by git and will not be committed
to our repository if you push changes. The directory contains highly sensitive
information (see below) and so these files should not be shared outside of your
administrative team.

## LORIS configuration file (config.xml)
The file `custom/config.xml` will be created during the install process.
It contains several important configuration settings for your LORIS instance,
including credentials for the database. For this reason, this file must be kept
private.

## Module and Library Overrides

You can modify existing LORIS modules by adding them to the `custom/` folder.
If the path `custom/modules/` exists, LORIS module code can be placed here
and should be usable in LORIS as long as it follows the format of other modules.

For example if you wanted to make changes to the `data_release` module, you can
copy the source code `modules/data_release/` to `custom/modules/data_release`.
Any code in this directory will override (replace) the core LORIS module.

The same can be done for new modules you create yourself.

By placing custom code in this directory instead of modifying the source code
directly, you will be able to track and manage your custom code independent
of updates to the source code.

The same can be done with LORIS core libraries by copying code from
`php/libraries/` to `custom/libraries/`.

## Instruments
TODO
