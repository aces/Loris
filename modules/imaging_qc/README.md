## Imaging Quality Control Module

#### Purpose
The purpose of this module is to verify and help ensure imaging data has been uploaded into LORIS and reviewed for Quality Control (QC). It provides a queryable interface to check at a glance the completeness of imaging data collection for a study, and the status of QC review processes on them.  

Note: this module is not the module in which visual/radiological QC is performed on scans, just the module in which QC assessments are *reviewed*. Links are included in this module so the user can jump to the Imaging Browser to mark QC assessments on images and visits.

#### Intended Users
This module is used by study administrators, imaging scientists, analysts, coordinators, and clinicians.

#### Scope
The Imaging QC module allows you to view specific data on uploaded image files, with many additional filtering options. The resulting table has a column for QC status, so you can see whether the upload has passed QC or not. The table provides a link to each file. You can download the table in `.csv` format. 

Note: To QC a scan, the user must click the link leading to the Imaging Browser, and enter the QC details in that module.

#### Configurations

* This module will not load without the `mri_parameter_form` instrument installed and properly configured.  Each scan type (identified below via the Configuration module) should have an equivalent _scan_done_ column in the database table for this instrument. 
>  A sample MRI Parameter Form is available with our sample dataset in this repo: `raisinbread/instruments/NDB_BVL_Instrument_mri_parameter_form.class.inc`, and should be customized and installed for your project.  (Please consult our online Setup Guide for more information.)  

* The `tblScanTypes` Configuration setting allows customization of which modalities are displayed in this module. 

#### Permissions
The `quality_control` permission gives users access to this module and its features.

#### Interactions With LORIS

* Imaging Browser: presents info about and links to QC and scans, for the scan types specified in the Configuration module (as noted above)
* Imaging Uploader : the name of the user who uploaded the scan is displayed in this module 
* Dicom Archive: Tarchive detected
* MRI parameter form: Completeness of form and Scan Done are displayed, for this instrument
