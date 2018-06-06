# Data Release Module

The Data Release Module can be used to easily distribute packaged data releases of your study.

## Features:

- Upload new releases through the front-end web interface
- Differentiate releases using (optionally unique) versioning tag
- Assign permissions for each release to any specific user

## Other notes:

- Uploads are stored under the modules/data_release/user_uploads directory which can easily be symlinked to another location if necessary, but please create and make sure it is writable by your web server
- Only superusers have permission to upload files and grant permissions
- Remove permissions by deleting rows in the data_release_permissions table
- Upload date will automatically be added during file upload
