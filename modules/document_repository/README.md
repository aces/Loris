# Document Repository

## Purpose

 The Document Repository is a tool that provides a centralized location for non-candidate documents that are relevant to the study (i.e. unfilled versions of instruments, publications, or manual of operations).

## Intended Users

LORIS users can view, download, upload, and delete files, as well as edit information pertaining to those files.
This module is used primarily by study coordinators/administrators who share study protocols and manuals, as well as data entry staff who consult these documents.

## Scope

 Any LORIS user can edit and delete all the files in the Document Repository module. 

## Permissions

 A user that has "document_repository_view" permission can view files in Document Repository.
 A user that has "document_repository_upload_edit" permission can upload and edit files in Document Repository.
 A user that has "document_repository_delete" permission can delete files in Document Repository.

## Configurations

- The Document Repository enables users to upload and organize project files of any type (PDF,Photo,Txt...) that can easily be viewable for users with appropriate permissions ("document_repository_view").

The `documentRepositoryPath` configuration setting is the path to the folder on the
uploaded file system where new files will be written.

- A mail server is required to send out email notification regarding the Document Repository updates.

## Interactions with LORIS

Users can enable notifications for the document_repository in the "My Preferences" module. Permissions required in order to be able to change notification settings for this module are dictated by the `notification_modules_perm_rel` table of the database. Once activated, users receive an email each time one of the following events occurs:
* Addition, deletion or modification of a file (by another user)
* Addition of a category (by another user)

### Dashboard Widget

The `Document Repository Notifications` panel is displayed on the dashboard and displays the last 4 recently-uploaded documents for projects/sites relevant to the current user. A document status is `New` if it was created after current user's last login date.
