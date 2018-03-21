# Document Repository

## Purpose

 The Document Repository is a tool that provides a centralized location for non-candidate documents that are relevant to the study i.e. unfilled versions of instruments, publications, or manual of operations.

## Intended Users

 Given the appropriate permissions, LORIS users can view, download, upload, and delete files, as well as edit information pertaining to those files.
 This module is used primarily by study coordinators/administrators who share study protocols and manuals, as well as data entry staff who consult these documents.
## Scope

 The document can only be seen by Users from the Site that the document is associated with.

## Permissions

 A user that has "document_repository_view" permission can view and upload files in Document Repository.
 A user that has "document_repository_delete" permission can delete files in Document Repository.

## Configurations


- The Document Repository enables users to upload and organize project files of any type that can easily be viewable for users with appropriate permissions. Give full permissions to store documents on server.
```
session.gc_maxlifetime = 10800  // After this number of seconds, stored data will be seen as 'garbage' and cleaned up by the garbage collection process.
max_input_time = 10800          // Maximum amount of time each script may spend parsing request data (in seconds)
max_execution_time = 10800      // Maximum execution time of each script (in seconds)
upload_max_filesize = 1024M     // Maximum allowed size for uploaded files.
post_max_size = 1024M           // Maximum size of POST data that PHP will accept.
```

- To enable folder upload:
```
chmod 777 /var/www/loris/modules/document_repository/user_uploads
```
[Note that the path is assumed to be ```/var/www/loris```, however your own path may be ```/var/www/<project-name>``` , depending on your setup.]

- A mail server will be required for sending out email notifications about Document Repository updates. 

- Interactions: Document repository notifications are visible on the dashboard panel.
  
- Create user-defined category in the "document_repository_categories" table. For example: 
```
INSERT INTO `document_repository_categories` VALUES (1,'text',0,NULL),(2,'photo',0,NULL),(3,'pdf',0,NULL);
```
