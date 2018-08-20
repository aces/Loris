# Imaging Uploader

## Purpose

The imaging uploader is intended to allow users to upload, browse, and track 
pipeline insertion progress.


## Intended Users

The primary users are MRI technicians or site coordinators uploading imaging 
scans for registered LORIS candidates and timepoints.

## Scope

The imaging uploader has the following built-in capabilities to facilitate 
timely scan insertion into the LORIS database. Specifically, it allows to browse
uploaded scans using the `Browse` tab, upload imaging scans using the `Upload` 
tab, and track scan insertion status through the `Progress` column and a 
`Log Viewer` which displays in either `Summary` or `Detailed` mode relevant 
feedback messages about insertion success or failure causes.

Uploaded scans can be overwritten if insertion status is `Not Started` or 
`Failed` (i.e. if the `Progress` is neither `In Progress` nor `Success`). 


NOT in scope:

The imaging uploader does NOT read the DICOM files within the uploaded scans. 
As such, it does not check if the files within the uploaded scan are of the 
expected DICOM type, nor whether the  PatientName and/or PatientID DICOM headers 
are properly de-identified according to the LORIS convention. This check is 
however done as the first step on the LORIS-MRI side; i.e. as soon as the 
insertion pipeline is triggered.

## Requirements

For a successful upload:
- The CandID must exist in the database
- The PSCID must be valid for the CandID
- The Visit label must be valid for the CandID
- The candidate must be active in the database
- The session must be active in the database
- The uploaded file is expected to be of one of the following types: 
`.tgz`, `.tar.gz` or `.zip`.
- The file should not exceed the max upload size
- The filename should follow the:
`PSCID_CandID_VisitLabel_OptionalSuffix` naming convention

## Permissions

#### Module Permission

The imaging uploader module uses one permission called `imaging_uploader` that 
is necessary to have access to the module and gives the user the ability to 
upload and browse all scans uploaded to the database.

#### Filesystem Permission

The path on the filesystem where the uploaded file go 
(see section [Database Configuration](#database_config_link)) should be 
readable and writable by the web server. This is automatically achieved by the 
LORIS-MRI install process.


## Configurations

The imaging uploader has the following configurations that affect its usage:

#### Install Configurations

To enable the Imaging Uploader to handle large files, please update the 
`php.ini` apache configuration file. Recommended sample values appropriate for 
compressed scans not exceeding 500M in size are: 

```
session.gc_maxlifetime = 10800  // After this number of seconds, stored data will be seen as 'garbage' and cleaned up by the garbage collection process.
max_input_time = 10800          // Maximum amount of time each script may spend parsing request data (in seconds)
max_execution_time = 10800      // Maximum execution time of each script (in seconds)
upload_max_filesize = 1024M     // Maximum allowed size for uploaded files.
post_max_size = 1024M           // Maximum size of POST data that PHP will accept.
```

#### <a name="database_config_link"></a> Database Configurations

ImagingUploaderAutoLaunch - This setting determines whether the insertion 
        pipeline that archives the scans is triggered automatically or manually.

MRIUploadIncomingPath - This setting determines where on the filesystem the 
        uploader is to place the uploaded scan. Default location is 
        `/data/incoming/`. This directory is created during the installation of 
        LORIS-MRI. 
        **Note**: Uploaded scans are erased from the 
        `MRIUploadIncomingPath`following a successful archival and insertion 
        through the LORIS-MRI pipeline. 


## Interactions with LORIS

- The `TarchiveInfo` column links to the DICOM Archive module for that scan
- The `Number of MincInserted` column links to the Imaging Browser module for 
that candidate's session 
- The `Number of MincCreated` column links to the MRI Violated scans module if
violated scans (i.e. scans that violate the MRI protocol as defined by the 
study) are present
- If `ImagingUploaderAutoLaunch` configuration is enabled, the Server Process
Manager under the Admin menu can be consulted for scans insertion progress 
(exit codes, error files, etc...). 

