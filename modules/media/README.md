# Media

## Purpose

Media module allows users to **upload**, **search** and **edit** media files 
associated with a specific candidate timepoint in Loris. Any kind of data 
associated with a candidate timepoint can be uploaded through this module: 
PDFs, videos, recordings, scripts, log files, etc. Files can optionally be 
associated with a specific instrument from within a given candidate timepoint.

## Intended Users

The Media module is used by data entry staff to upload candidate and timepoint 
specific media. The module can also be used by data-monitoring staff ensuring the 
integrity of the data for each candidate.

## Scope

The Media module provides a tool for uploading files to the server and tracking 
them, once uploaded. Data uploaded must be specific to a candidate and timepoint, 
and, optionally, an instrument. The *Edit* functionality only allows modification of 
the date of upload and of comments linked to the upload. The *Delete* functionality 
only hides the file from the front-end; it does not remove its database entry nor 
the file on the server.

Out of scope: media that is not affiliated with a candidate does not belong in Media.

## Permissions

In order to use the media module the user needs one or both of the following 
permissions:

- `media_read`: gives user a read-only access to media module 
(file browsing only)
- `media_write`: gives user a write access to media module 
(upload/delete files and edit metadata)

Media files are displayed if and only if the files were uploaded to a site within 
the logged in user's own site affiliations.

## Configurations

The following configuration is necessary for the media module to function

- `mediaPath`: determine where files will be uploaded on the server. Files are 
uploaded directly into the directory specified (no subdirectories are created). 

Creation of the upload directory is not done by the install script automatically and 
permissions for access to the directory must be set-up manually, either the web 
server `user` or `group` must have read and write permissions.

## Interactions with LORIS

Media module depends on a session to be already created before any files can be 
uploaded for it.

Uploaded files are displayed in the browse tab. Each entry has a link to download 
the file itself and a link to the timepoint the file was uploaded for.
