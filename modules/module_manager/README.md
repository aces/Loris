# Module Manager

## Purpose

The Module Manager is intended to be a place for administrators
to view and configured modules which are installed on the LORIS
instance.

## Intended Users

The module is used by administrators to configure modules in
LORIS.

## Scope

The module only displays and configures modules that are already
installed (populated in the module table).

NOT in scope:

The module manager does not install new modules.

## Permissions

The `module_manager_view` permission allows a user to
view the list of modules, and the `module_manager_edit`
allows the user to modify the state of installed modules.

## Configurations

The module manager gets a list of modules from the `modules`
database table. This table must first be populated (usually by
using the `tools/manage_modules.php` script).

## Interactions with LORIS

Deactivating a module may have effects throughout LORIS
such as being removed from the LORIS menu, or removing
widgets from other modules. The exact interactions between
modules caused by activating/deactivating a module are
module specific.
