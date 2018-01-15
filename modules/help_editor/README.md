# Help Editor

## Purpose

The help editor module provides a menu to view and edit online help
for LORIS.

## Intended Users

The help editor is intended to be used by data coordinating staff
to write the help content for instruments that are part of their
LORIS instance, but not part of the core LORIS install.

## Scope

Only instrument help text is intended to be edited. Module help
text for modules that are part of LORIS should come from the markdown
files which are in the module's `help/` directory.

## Permissions

The `context_help` permission is required to access the help editor
module.

## Configurations

None.

## Interactions with LORIS

The ajax script used by all LORIS page's inline help to load content
is part of the Help Editor module. This should likely be revisited in
the future.
