# Dicom Archive

## Purpose

The DICOM Archive module provides a front end to view the metadata
about DICOM studies and series that have been registered in the
LORIS database via the first step of the imaging pipeline (using
`dicomTar.pl`). Protocol checks and QC are performed later on and not
represented in this module.

## Intended Users

The DICOM Archive is primarily used by DCC staff who are investigating
the status of imaging pipeline scripts.

## Scope

The DICOM Archive shows DICOM tar metadata. It does not provide a
way to visualize scans or view metadata of other data formats. It
provides a frontend to the `tarchive_*` tables in LORIS, but does
not directly inspect files on the filesystem.

## Permissions

The permission `dicom_archive_view_allsites` is required to access
the DICOM Archive module.

## Configurations

The `patientNameRegex`, `LegoPhantomRegex`, and `LivingPhantomRegex`
configuration variables provide regular expressions to ensure that
the DICOM has been properly anonymized. If at least one of these
isn't matched, the Patient Name is displayed as "INVALID - HIDDEN".
By default, when the regex is blank (such as in a default LORIS
install), all patient names are shown.

The `patientIDRegex` configuration has a similar purpose for the
Patient ID column.

The `showTransferStatus` configuration option is obsolete and should
not be used, but determines if a first "Transfer Status" column
appears in the menu table.

## Interactions with LORIS

The tarchive tables used by the DICOM archive must be populated by
the imaging `dicomTar.pl` script before there is any data in the module.

The menu for the DICOM Archive module links to the imaging browser
module, for scans which have been successfully inserted.
