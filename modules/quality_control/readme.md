## Imaging Quality Control Module

#### Purpose
The purpose of this module is to verify and help ensure imaging data has been uploaded into LORIS and reviwed for Quality Control (QC). It provides a queryable interface for users to assess the completeness of imaging data collections matched against a given protocol, and the status of QC review processes on them.

Note: this module is not the module in which visual/radiological QC is performed on scans, just the module in which QC assessments are *reviewed*. Links are included in this module so the user can jump to the Imaging Browser to mark QC assessments on images and visits.

#### Intended Users
This module is used by study administrators, imaging scientists, analysts, coordinators, and clinicians.

#### Scope
The Imaging QC module allows you to view specific data on uploaded image files, with many additional filtering options. The resulting table has a column for QC status, so you can see whether the upload has passed QC or not. The table provides a link to each file. You can download the table in `.csv` format. 

Note: To QC a scan, the user must click the link leading to the Imaging Browser, and enter the QC details in that module.

#### Permissions
The `quality_control` permission gives users access to this module and its features.

#### Interactions
The Imaging Quality Control module is directly related to the following modules:

##### Imaging Browser
The Imaging QC module displays images that have been loaded in LORIS and QC'd in the Imaging Browser. The Imaging Browser also provides metadata and visualization of each scan and session collected for a study. 

##### Imaging Uploader
This module displays the status of images that have been excluded from or failed to load into LORIS, for a variety of reasons.  
#### Configuration
The `tblScanTypes` setting allows customization of which modalities are displayed in this module (as well as in the Imaging Browser main data table). 
