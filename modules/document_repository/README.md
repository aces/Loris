# Document Repository

## Purpose

 The Document Repository is a tool that provides a centralized location for non-candidate documents that are relevant to the study (i.e. unfilled versions of instruments, publications, or manual of operations).

## Intended Users

LORIS users can view, download, upload, and delete files, as well as edit information pertaining to those files.
This module is used primarily by study coordinators/administrators who share study protocols and manuals, as well as data entry staff who consult these documents.

## Scope

 Any LORIS user can edit and delete all the files in the Document Repository module. 

## Permissions

 A user that has "document_repository_view" permission can view and upload files in Document Repository.
 A user that has "document_repository_delete" permission can delete files in Document Repository.

## Configurations

- The Document Repository enables users to upload and organize project files of any type (PDF,Photo,Txt...) that can easily be viewable for users with appropriate permissions ("document_repository_view").

- Check that the following settings are in the php.ini file. 
```
session.gc_maxlifetime = 10800  // After this number of seconds, stored data will be seen as 'garbage' and cleaned up by the garbage collection process.
max_input_time = 10800          // Maximum amount of time each script may spend parsing request data (in seconds)
max_execution_time = 10800      // Maximum execution time of each script (in seconds)
upload_max_filesize = 1024M     // Maximum allowed size for uploaded files.
post_max_size = 1024M           // Maximum size of POST data that PHP will accept.
```

- A mail server is required to send out email notification regarding the Document Repository updates.

## Interactions with LORIS

Users can enable notifications for the document_repository in the My Preferences module. Once activated, users receive an email each time one of the following event occurs:
* Addition, deletion or modification of a file (by another user)
* Addition of a category (by another user)

### Dashboard Widget

The `Document Repository Notifications` panel is displayed on the dashboard and displays the last 4 recently-uploaded documents for projects/sites relevant to the current user. A document status is `New` if it was created after current user's last login date.
