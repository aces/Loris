# Data Dictionary

## Purpose

The data dictionary module is used for viewing and modifying the
LORIS data dictionary.

## Scope

The displays (and depending on permissions) manages the data
dictionary for things already stored in the LORIS `parameter_type`
table. This table is generally autopopulated and provides a dictionary
for imaging headers (populated by the imaging pipeline) and behavioural
instrument (populated by the `lorisform_parser.php` script).

It does not provide a way to enter new things into the data dictionary,
or describe the data dictionary for arbitrary SQL tables which are
not stored in the `parameter_type` table, such as instrument flags
or candidate/session data.

## Permission

The `data_dict_view` permission allows the user to view the LORIS
data dictionary.

The `data_dict_edit` permission allows the user to both view, and
modify the description of, rows in the data dictionary.

## Configuration

None

## Interactions with LORIS

The content for the data dictionary module comes from the
`parameter_type` table, which most often populated for instruments
by the `lorisform_parser.php` script.

Modified entries are saved in the separate the `parameter_type_override`
table, and the "data dictionary" used by LORIS is the coalesce of
the two, with `parameter_type_override` taking priority. This allows
the `parameter_type` table itself to be regenerated when instruments
change without losing the user modified values.
