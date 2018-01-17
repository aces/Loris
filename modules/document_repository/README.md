# Document Repository

## Purpose

The Document Repository is a useful tool that provides studies with a centralized location for important documents. Files may be uploaded and organized under any user-defined category. Subcategories can also be defined by the user to be nested under parent categories.

## Intended Users
 
 All Loirs user could view, update, edit and delete the upload files with right permissions.

## Scope

-Viewing Documents
 
 Similar to other LORIS modules, use the Selection Filters to search for specific documents and click  "Show Data" to apply filters and retrieve results. Clicking on any column header will sort the data table in ascending/descending order based on that column. Click the filename to download the file.
 
-Uploading a File
 
 Users may upload new documents to the Document Repository by clicking "Upload File" in the Selection Filter panel. A new panel will prompt for information about the file; required fields are denoted by red asterisk. Click “Browse” to select the local file to upload.  Click “Upload” to launch the upload to the Document Repository.  The new document, if uploaded successfully, will appear in the document repository list.Click "Add Category" to create a new category or subcategory for an existing parent category.

## Permissions

 A user has "document_repository_view" permission could view and upload files in Document Repository.
 A user has "document_repository_delete" permission could delete files in Document Repository.

## Configurations


- The Document Repository enables users to upload and organize project files of any type that can easily be viewable for users with appropriate permissions. Give full permissions to store documents on server:

chmod 777 /var/www/loris/modules/document_repository/user_uploads
Note that the path is assumed to be var/www/loris however your own path may be var/www/<project-name>, depending on your setup.

- A mail server will be required for sending out email notifications about Document Repository updates. In addition, in the Configuration Module under the "WWW" settings section, "Main LORIS URL" must be set. Also see more information on configuring Apache's file upload size limit.

- The table "document_repository_categories" in the database can be used to initialize the name of the category.
