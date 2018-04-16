# Data Release

## Purpose

The Data Release module can be used to distribute packaged data releases 
of the study to the analysis team. This module can be used by projects 
which desires to publish based on the exact same set of data referred
as data release. Along the lifespan of a study, several data releases might
be made available as the dataset keeps growing.

## Intended users

- Researchers and analysis teams
- Data coordinator that will manage access to, and upload of, the data releases

## Scope

The module is used to manage, upload and download data releases of the study.
- Different data releases can be differentiated using the version tag.
- Data coordinators can upload data releases of the study via the front-end
web interface.
- For each data release, data coordinators can manage permissions of any
  specific user.
- Upload date will automatically be added during file upload.


## Permissions

- Users permissions to view data releases based on their versions are managed 
  within the data release module.
- Only superusers have permission to upload and view all data releases.
  Superusers can also grant other users permissions to specific data release
  within the data release module.
- At the moment, the only way to remove a user's permission to a specific data
  release is via the backend, by manually deleting rows in the
  `data_release_permissions` MySQL table.

## Configurations

- Data release uploads are stored under the
  `modules/data_release/user_uploads directory`, which can easily be symlinked
  to another location if necessary. Note that the this directory needs to be
  writable by your web server.
