# Document Repository

## Purpose

 The Document Repository is a tool that provides studies with a centralized location for non-candidate documents. Files may be uploaded and organized under any user-defined category.

## Intended Users
 
 All Loris user and data entry staff could view, update, edit and delete the upload files with right permissions.

## Scope

 It's for all non-candidate documents.

## Permissions

 A user that has "document_repository_view" permission can view and upload files in Document Repository.
 A user that has "document_repository_delete" permission can delete files in Document Repository.

## Configurations


- The Document Repository enables users to upload and organize project files of any type that can easily be viewable for users with appropriate permissions. Give full permissions to store documents on server.

- Enable uploads folder: chmod 777 $%projectName%/modules/document_repository/user_uploads 

- A mail server will be required for sending out email notifications about Document Repository updates. 

