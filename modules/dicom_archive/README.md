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
not directly inspect files on the filesystem. However, DICOM 
files can be downloaded through the frontend and inspected on a 
user's system.


## Permissions

*In the interest of backward compatibility, permission behaviour varies slightly 
based on the `useAdvancedPermissions` configuration*

Any of the following permissions grants access to the module.

`dicom_archive_view_allsites`: 
 - If `useAdvancedPermissions` is disabled, this permission gives access 
 to all DICOMs in the database (backward compatible with projects not requiring a 
 session ID to be defined).
 - If `useAdvancedPermissions` is enabled, this permission gives access to 
 all DICOMs as long as they are associated to a session and the session is affiliated
 to a project that the user is affiliated with. When combined with 
 `dicom_archive_nosessionid`, user gets access to their projects' data as well as 
 DICOMs with no session ID associated.

`dicom_archive_view_ownsites`: 
 - If `useAdvancedPermissions` is disabled, this permission gives access 
 to all DICOMs as long as they are associated to a session and the session is affiliated
 to a site that the user is affiliated with. When combined with 
 `dicom_archive_nosessionid`, user gets access to their sites' data as well as 
 DICOMs with no session ID associated.
 - If `useAdvancedPermissions` is enabled, this permission gives access to 
 all DICOMs as long as they are associated to a session and the session is affiliated
 to both a site and a project that the user is affiliated with. When combined with 
 `dicom_archive_nosessionid`, user gets access to their sites' and projects' data as well as 
 DICOMs with no session ID associated.

Note that if you have access to the module, you will always see DICOMS uploaded by 
your own user regardless of their site and project affiliation.

## Configurations

#### Database Configurations

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

The `useAdvancedPermissions` configuration enables more advanced Site and 
Project access control (Although Site permissions are enabled without this 
configuration, "all sites" gives access to DICOMS with no Session ID if this 
configuration is turned off). If enabled, users accessing the module can only see 
DICOMs where a session ID has been found and are thus linked to the site and project 
of the session AND the site and project match the user's. Access to DICOMs with no 
session is granted by the `dicom_archive_nosessionid` permission (see permissions section)

#### Install Configurations

For downloading large DICOM files, it may be necessary to increase the 
 value of the `memory_limit` configuration option within `php.ini`.
 

## Interactions with LORIS

The tarchive tables used by the DICOM archive must be populated by
the imaging `dicomTar.pl` script before there is any data in the module.

The menu for the DICOM Archive module links to the imaging browser
module, for scans which have been successfully inserted. Clicking on this link
will download a copy of the DICOM tar file. Note that the `PatientName` field is
prepended to the downloaded file though it is not stored this way on the server.
