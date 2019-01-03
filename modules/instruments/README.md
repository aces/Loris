# Instruments Module

## Purpose

The instruments module is responsible for loading of instruments
which are part of a study for data entry. It provides the routing
to the appropriate instrument class to handle the page which is
being handled.

## Intended Users

This module only does basic routing to pages which are used by data
entry staff.

## Scope

The instruments module only loads existing instruments and provides
data entry. It does not create or manage any metadata for an
instrument.

It also does not manage surveys in any way.

## Permissions

None. Individual instruments may provide their own permissions.

## Configurations

The `NDB_BVL_Instrument` class must be coded and put in the
`project/instruments` directory, or a linst file must be created
and put in the `project/instruments`.

Individual instruments may contain their own configurations (such
as requiring tables to be created or lookup tables.)

## Interactions with LORIS

The survey module uses instruments of the same format as data entry
instruments, but does not load through this module.

`bvl_feedback` threads for an instrument may be created on this
module.
