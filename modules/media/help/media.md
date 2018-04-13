# Media Module

## Overview

Media module allows users to **upload**, **search** and **edit** media files 
associated with a specific candidate timepoint in Loris.
Any kind of data associated with a candidate timepoint can be uploaded through 
this module: PDFs, videos, recordings, scripts, log files, etc. Files can optionally 
be associated to a specific instrument form within a given candidate timepoint.


>Note: Currently editing functionality only allows editing of certain metadata 
fields, such as `Comments` and `Date of Administration`.

## Features

1. **Browse** a list of uploaded files and related information
2. **Edit** metadata about media files (except timepoint related data such as 
PSCID, Visit Label and Instrument)
3. **Upload** new files associated to a specific timepoint
  - PSCID, Visit Label and Site are required fields for all uploaded files
  - File name should always start with [PSCID]\_[Visit Label]\_[Instrument] 
  corresponding to the selection in the upload form
4. **Delete** files. Deleting a file hides it from the frontend, but preserves a 
copy in the database