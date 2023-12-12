# Data Dictionary

## Purpose

The dictionary module is used for viewing and modifying the
LORIS data dictionary for installed and active modules.

## Scope

The module displays and manages the data dictionary for modules
which provide a dictionary, and allows users to override the
descriptions provided.

It does not provide a way to enter new fields into the data dictionary,
doing so requires updating or creating a new module which provides
a dictionary.

## Permission

The `data_dict_view` permission allows the user to view the LORIS
data dictionary.

The `data_dict_edit` permission allows the user to both view, and
modify the description of, rows in the data dictionary.

## Configuration

None

## Notes

The field names should be unique (see interactions below).

Instruments must implement the getDataDictionary method. The
`LorisFormDictionaryImpl` trait can be used to implement the
dictionary in the same way that the `data_dictionary_builder`
script populates the `parameter_type` table for the `data_dict`
module. However, this is done on a heuristic best-effort basis.
Data can be described more accurately described by implementing
the function manually.

## Interactions with LORIS

The `dictionary` module uses the same override descriptions as
the `data_dict` module so that users do not need to modify the
description twice as the dictionary is migrated to being managed
by modules. This means that the name of fields should be unique
across LORIS until the `data_dict` module is retired.

Modules such as the data query module may use this module as
an API to get a list of fields to be displayed and determine
their scope, cardinality, and (possibly overriddens) description for
context sensitive display purposes.
