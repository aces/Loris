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


The `tblScanTypes` setting allows customization of which modalities are displayed in this module.

> **caveat:** This module has a key dependency - the `mri_parameter_form` instrument must installed and properly configured. 
If not, this module will not load and an error message will indicate that `Table 'LORIS.mri_parameter_form` is missing. 
A sample MRI Parameter Form is available with our sample dataset in this repo: `raisinbread/instruments/NDB_BVL_Instrument_mri_parameter_form.class.inc`.  Please customize this PHP instrument for your project, and install it following the instructions in our Setup Guide for behavioural instruments, so that it appears among the database tables. Also consult the Setup Guide for recommended steps to configure and populate this instrument for your battery. 

#### Permissions
The `quality_control` permission gives users access to this module and its features.

#### Interactions With LORIS

- Imaging Browser 

  Links are provided to the Imaging Browser module, and the QC entered in that module (for the scan types specified in the Configuration module as noted above).

- Imaging Uploader 

  The name of the user who uploaded the scan via the Imaging Uploader module is displayed in this module.
