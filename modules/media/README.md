## Media Module

### 📄 Overview

Media module allows users to upload, browse and edit media files associated with a specific timepoint in Loris.

### 🔒 Permissions

In order to use media module user might need one or both of the following permissions:

1. **media_read** - gives user a read-only access to media module (file browsing only)
2. **media_write** - gives user a write access to media module (file uploading, editing and deletion)

>**Note**: superusers have both of the aforementioned permissions by default! 💪

### Default upload path

By default, all files are uploaded under `/data/uploads/`.
This setting is configurable in `Paths` section of `Configuration` module.

### 💯 Features

1. **Browse** a list of uploaded files and related information
2. **Edit** meta information about media files (except timepoint related data such as PSCID, Visit Label and Instrument)
3. **Upload** new files associated to a specific timepoint
  - PSCID, Visit Label and Instrument are required fields for all uploaded files
  - File name should always start with [PSCID]\_[Visit Label]\_[Instrument]
4. **Delete** files. Deleting a file hides it from the frontend, but preserves a copy in the database.
