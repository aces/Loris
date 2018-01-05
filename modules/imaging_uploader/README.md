# Imaging Uploader

## Purpose

The imaging uploader is intended to allow users to upload, browse, and track 
pipeline insertion progress.


## Requirements

A successful scan upload should obey the following requirements: 


### Install Configurations

To enable the Imaging Uploader to handle large files, please update the apache 
configuration file (located in `/etc/php/7.0/apache2/php.ini` for PHP 7.0) with 
the following sample values: 

```
session.gc_maxlifetime = 10800
max_input_time = 10800
max_execution_time = 10800
upload_max_filesize = 1024M
post_max_size = 1024M
```

### Uploaded file

The uploaded file is expected to be of one of the following types: 
`.tgz, .tar.gz or .zip`. The filename should follow the:
`PSCID_CandID_VisitLabel_*OptionalSuffix*.zip` naming convention for a `.zip` 
file. It is also expected that the candidate and visit are already created in 
the database.


## Intended Users

The primary users are MRI technicians or site coordinators to
upload imaging scans for registered LORIS candidates and timepoints.

## Scope

The imaging uploader has the following built-in capabilities to facilitate 
timely scan insertion into the LORIS database:

1. Upload imaging scans using the `Upload` tab that can subsequently be inserted 
into the database automatically using a collection of perl scripts provided in 
[LORIS-MRI](https://github.com/aces/Loris-MRI). The launching of the insertion
can also be achieved manually
2. Browse uploaded scans using the `Browse` tab, which displays information 
about who uploaded the scan, when it was uploaded, and an `UploadID` and 
`UploadLocation` that can be used to trigger the LORIS-MRI insertion manually
3. Track scan insertion status through the `Progress` column and a `Log Viewer` 
which displays in either `Summary` or `Detailed` mode relevant feedback messages
about insertion success or failure causes
4. Uploaded scans can be overwritten if insertion is `Not Started` or `Failed` 
(i.e. if the `Progress` is neither `In Progres` nor `Success`. 


NOT in scope:

The imaging uploader does NOT read the DICOM files within the uploaded scans. 
As such, it does not check if the files within the uploaded scan are of the 
expected DICOM type, nor whether the  PatientName and/or PatientID DICOM headers 
are properly de-identified according to the LORIS convention. This check is 
however done as the first step on the LORIS-MRi side; i.e. as soon as the 
insertion pipeline is triggered.

## Permissions

The imaging uploader module uses one permission called `imaging_uploader` that 
is necessary to have access to the module and gives the user the ability to 
upload and browse all scans uploaded to the database.


## Database Configurations

The imaging uploader has the following configurations that affect its usage:

ImagingUploaderAutoLaunch - This setting determines whether the insertion 
        pipeline that archives the images and is triggered automatically or 
        manually.

MRIUploadIncomingPath - This setting determines where on the filesystem the 
        uploader is to place the uploaded file. Default location is 
        `/data/incoming/`. This directory is created during the installation of 
        LORIS-MRI.

patientNameRegex - Unused.


## Interactions with LORIS

1. Links to other LORIS modules archived DICOMs acessible from the hyperlink in 
the `TarchiveInfo` column
2. MINC images are accessible through the hyperlink in the 
`Number of MincInserted` column
3. If present, MRI violated scans (as defined by the study MRI protocol) can be 
accessed through the hyperlink in the `Number of MincCreated` column.
