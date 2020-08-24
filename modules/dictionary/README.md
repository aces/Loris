# Data Dictionary

## Purpose

The data dictionary module is used for viewing and modifying the
LORIS data dictionary descriptions.

## Scope

The module displays and manages the data dictionary for fields
already stored in the LORIS `parameter_type` table. This table is
generally autopopulated and provides a dictionary for imaging headers
(populated by the imaging pipeline) and behavioural instrument
(populated by the `lorisform_parser.php` script).

It does not provide a way to enter new fields into the data dictionary,
or describe the data dictionary for arbitrary SQL fields which are
not stored in the `parameter_type` table, such as instrument flags
or candidate/session data.

## Permission

The `data_dict_view` permission allows the user to view the LORIS
data dictionary.

The `data_dict_edit` permission allows the user to both view, and
modify the description of, rows in the data dictionary.

## Configuration

The `parameter_type` table must be populated to use this module.
The data comes from two sources:

1. The LORIS imaging pipeline scripts, which must be setup separately
2. The `tools/data_dictionary_builder.php` script, which loads the
   behavioural data dictionary based on the `ip_output.txt` file created
   by `tools/lorisform_parser.php`

## Interactions with LORIS

The content for the data dictionary module comes from the
`parameter_type` table.

Modified entries are saved in the separate `parameter_type_override`
table, and the "data dictionary" used by LORIS is the coalesce of
the two tables, with `parameter_type_override` taking priority.
This allows the `parameter_type` table itself to be regenerated
when instruments change without losing the user modified values.

The data query module uses the customized data dictionary descriptions
from this module.
