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

## Configurations

The `NDB_BVL_Instrument` class must be coded and put in the
`project/instruments` directory, or a linst file must be created
and put in the `project/instruments`.

Individual instruments may contain their own configurations (such
as requiring tables to be created or lookup tables.)

If the instrument is administered after the candidate's death,
the `postMortem` variable can be set to true within the
`NDB_BVL_Instrument` class or the `postmortem` tag set to true
within the linst instrument meta file. This configuration
determines which candidate age is displayed as part of the
metadata fields: `Candidate Age (Months)` or
`Candidate Age at Death (Months)`.

## Multi-lingual support
Instrument labels are added in JSON files with the language code as a key. A default JSON labels file is included in `modules/instruments/language_labels/instrument_library_labels.json` which includes English and French for labels referenced in NDB_BVL_Instruments.class.inc. To add more languages to be supported by a project's instruments, first add the language to the `language` table. Next, copy the `instrument_library_labels.json` file to `project/instruments/language_labels/instrument_library_labels.json` with a new key for the additional language, and all of the same labels translated into the additional language. This new file should be tracked on the project's repository.

Multilingual support is only available for PHP instrument at the moment. To have a multilingual instrument, the translated test name should be inserted into `test_names_multilingual` linked to the appropriate language ID. The function `$this->getLangLabel('key')` can be used anywhere in the instrument to display translated labels. A JSON file must be created in the same format as `modules/instruments/language_labels/instrument_library_labels.json` and put into the `project/instruments/language_labels/` directory with the following naming convention: <test_name>.json

## Interactions with LORIS

The survey module uses instruments of the same format as data entry
instruments, but does not load through this module.

`bvl_feedback` threads for an instrument may be created on this
module.

### Dashboard Widget

The total `Incomplete forms` will be shown inside the Dashboard widget, 
named "My Tasks" and with a link redirecting to statistics/statistics_site.
