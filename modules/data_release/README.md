# Data Release


## Purpose

The Data Release module can be used to distribute packaged data releases 
of the study to the analysis team. This module can be used by projects 
which desire to publish based on the exact same set of data referred
as data release. Along the lifespan of a study, several data releases might
be made available as the dataset grows.


## Intended users

- Researchers and analysis teams.
- Data coordinator that manages access to and uploads data releases.


## Scope

The module is used to manage, upload and download data releases of the study.
- Different data releases can be differentiated using the version tag.
- Data coordinators can upload data releases of the study via the front-end
web interface.
- For each data release, data coordinators can manage permissions of any
  specific user.


## Permissions

- Users with `data_release_upload` and superusers can upload anything.
- Users with `data_release_edit_file_access` and superusers can grant 
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

- `dataReleasePath` designates the target location for release file uploads.

## Other notes:

- Upload date will automatically be added during file upload.
