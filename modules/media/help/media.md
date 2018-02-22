# Media Module

## Overview

Media module allows users to **upload**, **search** and **edit** media files associated with a specific candidate timepoint in Loris.
Any kind of data associated with a candidate timepoint can be uploaded through this module: PDFs, videos, recordings, scripts, log files, etc. Files can optionally be associated to a specific instrument form within a given candidate timepoint.


>Note: Currently editing functionality only allows editing of certain metadata fields, such as `Comments` and `Date of Administration`.

## Permissions

In order to use the media module the user needs one or both of the following permissions:

1. **media_read** - gives user a read-only access to media module (file browsing only)
2. **media_write** - gives user a write access to media module (upload/delete files and edit metadata)

>**Note**: superusers have both of the aforementioned permissions by default! 

## :file_folder: Upload path

By default, all files are uploaded under `/data/uploads/`.
*(Note this directory is not created by the Loris install script and should be manually created by the admin.)*

The upload path is configurable in `Paths` section of `Configuration` module.

>**Important** 
>
>The upload path must be readable and writable by your web server; either the web server `user` or `group` must have read and write permissions.
>The default group for your web server process is listed below
>```
>Ubuntu: $GROUP$ = www-data
>CentOS: $GROUP$ = apache
>```
>
>To find the `user` of your web server, run `ps aux | grep 'apache' | egrep -v 'grep|Ss' | awk '{ print $1 }' | sort | uniq`
>To find the `group` of your web server, run `ps aux | grep 'apache' | egrep -v 'grep|Ss' | awk '{ print $1 }' | sort | uniq | groups`

>To see if your web server's user or group owns the upload path, run `ls -ld /data/uploads | awk '{ print "user:" $3 ", group:" $4 }'`

>If neither owns the folder, you should run `sudo chown <unix-user>:<web-server-group> /data/uploads`
>Then, run `chmod 775 /data/uploads`

## Features

1. **Browse** a list of uploaded files and related information
2. **Edit** metadata about media files (except timepoint related data such as PSCID, Visit Label and Instrument)
3. **Upload** new files associated to a specific timepoint
  - PSCID, Visit Label and Site are required fields for all uploaded files
  - File name should always start with [PSCID]\_[Visit Label]\_[Instrument] corresponding to the selection in the upload form
4. **Delete** files. Deleting a file hides it from the frontend, but preserves a copy in the database