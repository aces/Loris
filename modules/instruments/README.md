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

Accessing instruments requires the `data_entry` permission. Individual 
instruments may require their own additional access permissions.

Deleting instrument data requires the `Send to DCC` permission, in addition
to the `InstrumentResetting` configuration being enabled (see Configurations).

## Configurations

The `NDB_BVL_Instrument` class must be coded and put in the
`project/instruments` directory, or a linst file must be created
and put in the `project/instruments`.

Individual instruments may contain their own configurations (such
as requiring tables to be created or lookup tables.)

The `InstrumentResetting` configuration in the Configuration module
controls whether the 'Delete instrument data' button is visible on
the left pane. When set to 'Yes', and the user has the `Send to DCC`
permission, the button will be displayed allowing users to clear
an instrument's data.

If the instrument is administered after the candidate's death,
the `postMortem` variable can be set to true within the
`NDB_BVL_Instrument` class or the `postmortem` tag set to true
within the linst instrument meta file. This configuration
determines which candidate age is displayed as part of the
metadata fields: `Candidate Age (Months)` or
`Candidate Age at Death (Months)`.

## Interactions with LORIS

The survey module uses instruments of the same format as data entry
instruments, but does not load through this module.

`bvl_feedback` threads for an instrument may be created on this
module.

### Dashboard Widget

The total `Incomplete forms` will be shown inside the Dashboard widget, 
named "My Tasks" and with a link redirecting to statistics/statistics_site.
