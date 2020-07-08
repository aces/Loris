**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[IMAGING DATABASE|Imaging Database]]**

***

1. [Install the imaging pipeline codebase](#1-install-the-imaging-pipeline-codebase)
2. [Set up imaging insertion scripts](#2-set-up-imaging-insertion-scripts) <br>
3. [Loading a scan into LORIS](#3-loading-a-scan-into-loris) <BR>
3a. [Imaging Uploader](#3a-imaging-uploader) <br>
3b. [Running the insertion Pipeline](#3b-running-the-insertion-pipeline)
4. [Verify loaded images and Troubleshooting](#verify-loaded-images-and-troubleshooting)
5. [Queue Manager](#5-queue-manager-optionalrecommended)
6. [Email Notifications](#6-email-notifications)
7. [Visualization: BrainBrowser](#7-visualization-brainbrowser)
8. [Quality Control within the Imaging Browser](#8-quality-control-within-the-imaging-browser)
9. [Anonymization](#9-anonymization)
10. [Post-processing (CBRAIN)](#10-post-processing-cbrain)

***

   LORIS' Imaging insertion pipeline is composed of several Perl-based scripts and configuration files, which are housed in the [Loris-MRI git repo](https://github.com/aces/Loris-MRI).  

   [View schematic for the **LORIS Imaging insertion pipeline scripts**](https://demo.loris.ca/LORIS_Imaging_Pipeline_flowchart_ZM_20150608.png)

   [View step-by-step **LORIS MRI Pipeline Flowchart**](https://drive.google.com/open?id=0B3CILaw6mATHU0huc192R2I4MXM)

By default the pipeline is designed for **raw DICOM MRI** data, collected by a longitudinally-organized multisite study with a defined data acquisition protocol. 
With modifications and further customization, it can handle any modality of imaging data.  

**Formats:** By default, all DICOMs are converted both to [MINC](https://www.mcgill.ca/bic/software/minc) and NIfTI formats by LORIS' imaging insertion pipeline. 
> After installation, use the Config module to setting to enable/disable automatic conversion to NIfTI.

### 1) Install the [imaging pipeline codebase](https://github.com/aces/Loris-MRI)

   Follow the [Loris-MRI Readme](https://github.com/aces/Loris-MRI).

#### Installation Troubleshooting Notes 
Key [configuration points](https://github.com/aces/Loris-MRI/tree/master) to verify: 

1. `/data/*` subdirectories were created by the imaging install script. 
If not, it may be due to `root:root` ownership of the `/data/` mount on your system.  
Ensure these subdirectories are created manually, particularly:
`/data/$PROJ/data/*`, `/data/$PROJ/bin/mri/` and `/data/incoming/`

2. `/data/$PROJ/` directory and subdirectories must be readable and executable by the Apache linux user.  It may also help to ensure the /data/ mount is executable.  After any modifications, ensure you restart apache.  

* Depending on your operating system, some dependencies might be missing. During initial troubleshooting of the imaging pipeline, note any related error messages (e.g. `install_driver(mysql) failed: Can't locate DBD/mysql.pm`) and install missing packages as needed (e.g. `sudo apt-get install libdbi-perl`, `sudo apt-get install libdbd-mysql-perl`, `sudo apt-get install libarchive-zip-perl`). 

* If your MINC toolkit is older than 1.9.14 and your scans have no Date of Birth value, you may see an _age unit error_ during DICOM to MINC conversion. Instructions for compiling a more recent version available on [MNI-BIC GitHub](https://github.com/BIC-MNI/minc-toolkit-v2).

### 2) Set up imaging insertion scripts

Populating a few database tables and configuration settings will tell the imaging insertion scripts how and where to load scans: 

1. #### **Configuration module**

Within the following sections: 
* _Imaging Pipeline_: Verify all paths
* _WWW_: Verify Host and URL
* _Paths_: Verify `LORIS-MRI code`, `MRI-Upload Directory`, `Images` settings
*  _Study_: Set `ImagingUploader Auto-Launch` to `Yes` only if files should be automatically inserted after they are uploaded to the server. For [initial upload troubleshooting](), it is recommended to leave the default `No`.
* _DICOM Archive_ section: Enter regex pattern to detect and mask identifying information in `PatientID` or `PatientHeader` values, for display in the DICOM Archive module.  Populate the Living and Lego Phantom regex fields to identify these special scans.

2. #### **`psc` table**

The `MRI_alias` field must be populated for each site that is scanning candidates or phantoms

3. ####  **`Visit_Windows` table**
  
Ensure the [Visit Windows table](https://github.com/aces/Loris/wiki/Project-Customization#iv-visit-windows) is fully populated with all valid Visit Labels.  Scans will be identified and loaded based on these entries. 

4. #### **`mri_protocol` table**

Ensure your `mri_protocol` table contains an entry for each type of scan in the study protocol.
The `mri_protocol` table is used to identify incoming scans based on their SeriesDescription and scan parameter values (TE, TR, slice thickness, etc). By default, this table is populated with entries for t1, t2, fMRI and DTI, and the columns defining expected scan parameters (e.g. `TE_Range`) are defined very broadly.  

Note: `Scan_type` column values are defined in the `mri_scan_type` table (e.g. 44=t1); do not include hyphens, spaces or periods in your `mri_scan_type.Scan_type` column values.

#### Notes on Scan type identification 
* By default, any scan will be inserted if it matches an _mri_protocol_ table entry.
* To **force-load** a specific MRI acquisition see (below) [bypassing protocol violation checks](Bypassing-protocol-violation-checks)
* To **whitelist/blacklist** specific scan types -- e.g. in case of protocol exclusion, case sensitivity or labelling variance -- modify the subroutine `isFileToBeRegisteredGivenProtocol()` in your `prod` file (`/data/$PROJ/bin/mri/dicom-archive/.loris_mri/prod`) e.g.:

```perl
if($acquisitionProtocol eq 't1' or $acquisitionProtocol eq 't2' or $acquisitionProtocol eq 'dti' or $acquisitionProtocol eq 'bold' or $acquisitionProtocol =~ /fmri/) { return 1; }
```

### 3) Loading a scan into LORIS

Either the front-end (3a) Imaging Uploader module or the back-end (3b) insertion Pipeline scripts can be used to load a scan into LORIS.  For projects loading large collections of data, batch execution of the Pipeline is recommended.  Note that all data must be anonymized before either method can be used. 

### 3a) Imaging Uploader 
The Imaging Uploader module provides a user-friendly interface for transferring an imaging dataset to the Loris server, before it is handled by the imaging pre-processing and insertion pipeline scripts.  

To configure the Imaging Uploader module for upload and insertion of scans via a browser, see the [Imaging Uploader Readme](https://github.com/aces/Loris/blob/master/modules/imaging_uploader/README.md) (within `modules/imaging_uploader` folder).

> **Missing visit label options?** The Imaging Uploader's Visit label options are drawn from the list of all timepoints registered in the database _where CenterID != 1_ (this CenterID [is reserved for DCC candidates](https://github.com/aces/Loris/wiki/Project-Customization#4-define-study-sites)).  If you do not see a particular visit label option in the Uploader's dropdown select, simply create a new timepoint for any (non-DCC) candidate with that visit label (via Candidate menu, Access Profiles). The visit label should then automatically appear in the Uploader's dropdown options. 

### Post-Upload: Pre-processing and Insertion into Loris

After an imaging dataset is uploaded to the Loris server, run the script _imaging_upload_file.pl_ to run the pre-processing and insertion pipeline scripts that load the imaging data into the Loris database tables. 
Provide the upload_id value and uploaded dataset name (e.g. 608, AAA0001_513067_V01.zip):
```bash
cd /data/$PROJ/bin/mri
uploadNeuroDB/imaging_upload_file.pl -profile prod -verbose -upload_id 608 /data/incoming/AAA0001_513067_V01.zip 
```

> See also: [Logs](#log-files)

#### Troubleshooting Insertion of uploaded datasets
If upload was successful but issues were encountered with the imaging insertion pipeline scripts:
* CentOS: check for additional dependencies/configurations (e.g. Dicom Dictionary path) in the detailed [CentOS Imaging Installation transcript](https://github.com/aces/Loris/wiki/CentOS-Imaging-installation-transcript)
* Manually re-run the entire pipeline sequence: _[imaging_upload_file.pl](#post-upload-pre-processing-and-insertion-into-loris)_ 
* If one of the final steps such as the MINC conversion is failing, you may wish to just re-run the tarchiveLoader script. 
* See also [re-running the Imaging pipeline](#re-running-the-imaging-pipeline) section for troubleshooting information.   

### Setting up Imaging AutoLaunch

* To automatically preprocess, validate and insert all uploaded scans into the database, set _ImagingUploader Auto-Launch_ to "Yes" in the `Config` module, "Study" section. 
* For initial setup and configuration, it is recommended to [manually run the imaging pipeline scripts](#3b-Running-the-insertion-pipeline) for each uploaded dataset.  
* Note that your _lorisadmin_ user must also be part of the apache group (e.g. www-data). 

#### Server Processes Manager

The Server Processes Manager module (Admin menu) shows all server jobs launched by Imaging Uploader. The exact Output and Error file names for each upload/insertion are easily found in this module.  The Exit Code file describes the exit status of the job.  

Caveat: By default these log files are output to `/tmp/` and deleted. To avoid deletion, edit [deleteProcessFiles()](https://github.com/aces/Loris/blob/master/modules/server_processes_manager/php/AbstractServerProcess.class.inc#L521) to return false.  (See also: [Logs](#log-files)). 

### 3b) Running the insertion pipeline

An alternative to the front-end Imaging Uploader is to load scans in LORIS via the back-end pipeline scripts.  This is commonly used for automating the image insertion process.  The pipeline can be launched in a single command, or by calling the constituent scripts in sequence: 

#### One-step insertion
The _batch_uploads_imageuploader_ script runs in a single step the imaging pre-processing and insertion pipeline sequence  ([details: MRI-PR#133](https://github.com/aces/Loris-MRI/pull/133)).
```bash 
cd /data/$PROJ/bin/mri
./batch_uploads_imageuploader -profile prod < imageuploader_list >log_batch_imageuploader.txt 2>&1 
```

Input file ```imageuploader_list``` must be a text file, listing one line per dataset (example below). The following fields are expected, separated by spaces:
* full path to the zipped DICOM scanset (.zip, .tgz or .tar.gz)
* _Y_ or _N_ depending on whether the scan is for a phantom or not
* PSCID_CandID_VisitLabel Loris convention for "patient name".  Leave blank for phantoms.

Example for 2 entries/scans to be uploaded (one human subject and one phantom):
```
/data/incoming/PSC0001_123457_V1.tar.gz N PSC0000_123456_V1
/data/incoming/Lego_Phantom_MNI_20140101.zip Y
```

#### Multi-step pipeline execution
Projects wishing to customize the execution of pipeline steps can run the following scripts in sequence:  
   > See also **[2015 Imaging Pipeline Flow Schematic](https://demo.loris.ca/LORIS_Imaging_Pipeline_flowchart_ZM_20150608.png)** and [older UML diagrams of MRI and DICOM tar pipeline](https://github.com/aces/Loris-MRI/wiki/Loris-MRI-imaging-tables-schema-(ERD)) 

* 1)  **dicomTar.pl**: Tars DICOMs into /data/$PROJ/data/tarchive and loads the tarchive table with DICOM header data  

E.g. Sample command to load a pre-registered subject visit from site DCC, given a DICOM dataset organized under $IncomingPath/PSCID_DCCID_VisitLabel/ 
```bash
cd /data/$PROJ/bin/mri
dicom-archive/dicomTar.pl /data/$PROJ/data/incoming/DCC0001_513066_V01 /data/$PROJ/data/tarchive -verbose -clobber -database -profile prod -centerName DCC -mri_upload_update  > yourLogFile1.txt 2>&1 
```

* 2) **tarchive_loader** script (or [batch_uploads_tarchive](other-imaging-scripts)): loads imaging datasets, runs minc conversion and stores header information into the files and parameter_file tables; Creates candidate sessions if none exists.  
```bash
cd /data/$PROJ/bin/mri
uploadNeuroDB/tarchiveLoader -globLocation -profile prod  /data/$PROJ/data/tarchive/DCM_2009-03-19_DCC0001_513066_V01.tar > _yourLogFile2.txt_  2>&1
```

### Verify loaded images and Troubleshooting
Once an MRI scan session has been successfully inserted, it will be listed in the Imaging Browser main data table (also linked from the Dicom Archive subpage: "View Images"). 

Verify in the Imaging Browser's View Session page that a jpg showing 3 slice orientations displays properly; if not, verify your permissions and restart apache:
```bash
sudo chmod o+r /data/$PROJ/bin
sudo chmod o+r /data/$PROJ/data 
sudo service apache2 restart
```

If download links do not work, ensure that the `/data/$PROJ/data/assembly` directory and subdirectories are executable. 

#### Log files

Error and output messages from the imaging insertion scripts are logged in files created under the /data/$PROJ/data/logs/ directory. To view messages from the last script run, consult the most recent log file modified in this directory. These log files reference an _uploadID_ used to identify each imaging dataset -- consult the mri_upload database table to look up which uploadID has been assigned to your scans. 

***Caveat*** When the imaging insertion pipeline is auto-launched by the Imaging Uploader module, the pipeline scripts' log files are output to /tmp/ and deleted. To avoid deletion, edit the Server Processes Manager function [deleteProcessFiles()](https://github.com/aces/Loris/blob/master/modules/server_processes_manager/php/AbstractServerProcess.class.inc#L521) to return false instead of true.

#### Protocol Violations

Scans whose parameters can't be matched against the `mri_protocol` table during the imaging insertion process, will be flagged as protocol violations and will not have their minc/nifti volumes loaded in the database.  Review these in the front-end _Mri Violations_ module (Imaging menu). The type of error (scan identification, protocol violation) will be listed.

> See also notes on protocol checks and flagging of protocol violations in [**LORIS MRI Pipeline Flowchart**](https://drive.google.com/open?id=0B3CILaw6mATHU0huc192R2I4MXM)

##### Bypassing protocol violation checks

For cases when a scan has triggered a protocol violation, the minc volume can be **force-loaded** into LORIS by running: 
```bash
uploadNeuroDB/minc_insertion.pl -acquisition_protocol t2w -bypass_extra_file_checks -create_minc_pics -profile prod -globLocation -force  -tarchivePath _/data/project/dataTransfer/library/2009/DCM_2009-09-25_project_20110214_185904581.tar_ -mincPath _/data/project/data/trashbin/TarLoad-3-34-pVzGC5/xxx0067_703739_v12_20090925_222403_18e1_mri.mnc_
```

Note carefully the following arguments: 
* _acquisition_protocol_ : must be a known scan type according to the `mri_scan_type` table
* _tarchive_Path_ : the DICOM tarball
* _mincPath_ : note this file may haven placed in the trashbin directory

See also: [MRI-PR#141](https://github.com/aces/Loris-MRI/pull/141) for more examples.

#### Re-running the Imaging pipeline

> When the need arises to re-load imaging data in LORIS, it is generally not sufficient to just re-run the minc/nifti loading step (tarchiveLoader or batch_uploads_tarchive). [The pipeline steps](#multi-step-pipeline-execution) must be re-run starting with dicomTar.pl. 

In general, to re-load an imaging dataset through the pipeline from start (from dicomTar.pl) -- Ensure entries from the previous attempt to load the dataset have been removed from the following database tables: 
* `parameter_file`
* `tarchive`
* `mri_acquisition_dates`
* `files` (best to delete from this table last)
* `session` - _not recommended_ - only if necessary, and only if no other data is associated to this session e.g. on the Behavioural side of Loris. 

It is also recommended to remove from the tarchive directory the last generated *.tar package for this dataset. 

If any Quality Control flags or comments exist for these scans, you may also wish to delete specific records from `files_qcstatus` and the `mri_feedback_*` tables.

For backing up, re-labelling and re-loading MRI datasets with QC information, see [Beta Tutorial](https://github.com/aces/Loris/wiki/Reloading-MRI-data-for-mislabelled-session)

#### Multiple scanner datasets per session 

In cases where a subject was scanned in two scanner sessions within a single study Timepoint, both datasets should be loaded and associated to the same visit label / session table record. Create separate tarchives for each DICOM dataset upload each to the same visit.  

### 5) Queue Manager (optional/recommended)

   Installing Sun GridEngine (SGE) is useful for managing the server processing load for all scripts. Use the `Configuration` module setting `isqsub` to tell the pipeline whether a queue manager is installed. 

### 6) Email Notifications

   Installing a mail server is recommended, as the LORIS Imaging pipeline by default attempts to send notifications about completed or failed uploads.

### 7) Visualization: [BrainBrowser](https://brainbrowser.cbrain.mcgill.ca/)

[BrainBrowser](https://brainbrowser.cbrain.mcgill.ca/), a web-enabled viewer for real-time exploration of 3D images, comes embedded within LORIS, including a 2D Volume viewer that can overlay 2 acquisitions.  A 3D surface viewer can be used for processed surface datasets.    

Troubleshooting notes: 
* `/data/$PROJ` directory and subdirectories must be readable and executable by the Apache linux user.
* If [`showDatabaseQueries`](Behavioural-Database#showdatabasequeries) is enabled, image volumes will not display properly in the Imaging Browser.
* Verify the Configuration module (_Paths_) `MINC files` setting is `/data/$PROJ/data/`. 

### 8) Quality Control within the Imaging Browser

The Imaging Browser module enables web-based Quality Control (QC) of acquisitions. 

MRI scans can be viewed in 3D space using the embedded [BrainBrowser visualization tool](https://github.com/aces/Loris/wiki/Imaging-Database#7-visualization-brainbrowser).

QC flags, comments and statistics are fully integrated and can be enabled by:
* Grant QC permissions in User Accounts (or add `mri_feedback` permission via `user_perm_rel` table). 
* Scan types will be populated automatically once images are inserted in the database. Use the "Selected" dropdown to identify the single best acquistion for a given type (e.g. t1) for the scan session. 
* QC comments should already be enabled via the feedback_mri_comment_types table. 

### 9) Anonymization

   All DICOM data transferred to the DCC must be free of any identifying information (e.g. patient name). A tool can be provided to the sites to facilitate anonymization. Please contact the LORIS team for details.

### 10) Post-processing (CBRAIN)

   LORIS is agnostic to external processing pipelines. Contact us for more information about CBRAIN links.

**[[NEXT: (5) LORIS Modules|LORIS-Modules]]**