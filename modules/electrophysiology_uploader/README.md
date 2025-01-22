# Electrophysiology Uploader

## Purpose

The electrophysiology uploader is intended to allow users to upload electrophysiology files.

**LORIS 26 Beta Note:** Files uploaded in this module will not be viewable 
in 
the Electrophysiology Browser module.
This feature is under construction for the next release. Please get in 
touch with the LORIS team to configure this for your project.


## Intended Users

The primary users are EEG technicians or site coordinators uploading EEG recordings 
for registered LORIS candidates and timepoints.

## Scope

The electrophysiology uploader has the following built-in capabilities to facilitate 
timely EEG insertion into the LORIS database. Specifically, it allows the user to browse
uploaded recordings using the `Browse` tab and upload recordings using the `Upload` 
tab.

EEG recordings can be re-uploaded multiple times. Previous upload attempts will be backed up in _EEGUploadIncomingPath_/archives/.

## Permissions

#### Module Permission

Permission `electrophysiology_browser_view_allsites` or `electrophysiology_browser_view_site`
is necessary to have access to the module and gives the user the ability to 
upload and browse all recordings uploaded to the database.
Permission `monitor_eeg_uploads` is necessary to receive EEG upload notifications.

#### Filesystem Permission

The path on the filesystem where the uploaded files go (_EEGUploadIncomingPath_) should be 
readable and writable by the web server.

## Configurations

The electrophysiology uploader has the following configurations that affect its usage:

### Install Configurations

To enable the module to handle large files, please follow the
instructons for [Handling Large File Uploads](../../docs/wiki/00_SERVER_INSTALL_AND_CONFIGURATION/02_Website_Configuration/Handling_Large_File_Uploads.md).

#### <a name="database_config_link"></a> Database Configurations

EEGUploadIncomingPath - This setting determines where on the filesystem the 
        uploader is to place the uploaded recordings.
        **Note**: Uploaded recordings are erased from the 
        `EEGUploadIncomingPath` following a successful archival and insertion 
        through the LORIS-MRI pipeline. 

### Caveat

Archive extraction and EEG insertion have to be performed manually at the moment.