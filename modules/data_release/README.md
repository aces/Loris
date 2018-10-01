# Data Release Module

The Data Release Module can be used to easily distribute packaged data releases of your study.

## Features:

- Upload new releases through the front-end web interface
- Differentiate releases using (optionally unique) versioning tag
- Assign permissions for each release to any specific user

## Intended users

- Researchers and analysis teams
- Data coordinator that manages access to and uploads data releases


## Scope

The module is used to manage, upload and download data releases of the study.
- Different data releases can be differentiated using the version tag.
- Data coordinators can upload data releases of the study via the front-end
web interface.
- For each data release, data coordinators can manage permissions of any
  specific user.


## Permissions

- Only users with `data_release_upload` an superusers can upload anything, 
no one else has upload permission.
- Only users with `data_release_edit_permissions` and superusers can grant 
permissions whether by "version" or specific "file_name".
- Once a user is granted permission on any data release, they will be able
  to see the data release and download it directly from the module.
- Users permissions to view data releases are based on the file
  level permissions in the `data_release_permissions` table. Granting by
  version grants every file tied to the specified version.

Note: At the moment, the only way to remove a user's permission to a specific
      data release is via the backend, by manually deleting rows in the
      `data_release_permissions` MySQL table.


## Configurations

- Data release uploads are stored under the
  `modules/data_release/user_uploads directory`, which can easily be symlinked
  to another location if necessary. Note that this directory needs to be
  writable by your web server.

## Other notes:

- Uploads are stored under the modules/data_release/user_uploads directory which 
can easily be symlinked to another location if necessary, but please create and 
make sure it is writable by your web server
- Remove permissions by deleting rows in the data_release_permissions table
- Upload date will automatically be added during file upload