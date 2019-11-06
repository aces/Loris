# Configuration

## Purpose

The configuration module is intended to provide a frontend for the
configuration of a LORIS instance that has already been installed.

## Intended Users

The module is intended to be used by study administrators who need
a front end interface for configuring LORIS for their study.

## Scope

The configuration module should only allow the configuration of
study configuration, not LORIS installation parameters.

## Permissions

The permission named `config` (Edit configuration settings) is required in order to 
access this module.

## Configurations

None

## Interactions with LORIS

Describing the interactions of every configuration option that can
be managed through the configuration module is beyond the scope of
this document.

However, the module mostly edits the LORIS MySQL `Config` table,
which nearly every LORIS page interacts with through the `NDB_Config`
class.

Separate subpages manage the `project`, `subproject`, and
`project_subproject_rel` tables for an administrator to be able to
manage projects in LORIS without backend MySQL access.
