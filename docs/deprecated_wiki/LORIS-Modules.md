**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[LORIS MODULES|LORIS Modules]]**

This page contains descriptions of some core modules among LORIS' many modules.  

***

- [About Modules](#about-modules)
- [Customizing Loris modules](#customizing-loris-modules)

Modules featured here: 
- [Document Repository](#document-repository)
- [Statistics](#statistics)
- [Issue Tracker](#issue-tracker)
- [Double Data Entry (DDE) and Conflict Resolver module](#double-data-entry-dde-and-conflict-resolver-module)
- [Data Integrity Flag and Data Team Helper](#data-integrity-flag-and-data-team-helper-beta-in-1410)
- [Feedback module](#feedback-module)
- [Reliability module](#reliability-module)
- [Data Dictionary Tool](#data-dictionary-tool)
- [Candidate Parameters](#candidate-parameters)
- [Candidate Information](#candidate-information)
- [Radiology Review](#radiology-review)

***

## About Modules 

* [[How to make a LORIS module]]

Modules are added and activated via the LorisMenu MySQL table. User permissions for viewing and accessing menus and menu items are stored in the LorisMenuPermissions table. For example, the Configuration module is visible under the Admin menu only to users who have config permission.

Module-specific setup instructions (if any have been written) are typically included in a Readme under the modules/_$modulename_/ directory.

## Customizing Loris modules

For notes on how to customize modules, please consult the [[Code Customization page|Code-Customization#module-override]]

***

_The following is a partial list of modules and tools available in LORIS:_ 

### Document Repository

The Document Repository enables users to upload and organize project files of any type that can easily be 
viewable for users with appropriate permissions. Give full permissions to store documents on server:

```bash
chmod 777 /var/www/loris/modules/document_repository/user_uploads
```

> Note that the path is assumed to be var/www/loris however your own path may be var/www/`<project-name>`, depending on your setup. 

A mail server will be required for sending out email notifications about Document Repository updates. In addition, in the Configuration Module under the "WWW" settings section, "Main LORIS URL" must be set. Also see [[more information on configuring Apache|Project-Customization#useful-apache-configuration-options]]'s file upload size limit.

### Statistics

Includes tab delineated customizable Summary data, Demographics, Behavioural & Imaging data and Reliability rate. MySQL queries can be customized for project-specific batteries by editing php code. For example, to configure list of instruments for Behavioural statistics, copy NDB_Menu_statistics_site.class.inc from modules/statistics/php/libraries to project/libraries, and populate "var $instruments = array(...)" with instrument names.

### Issue Tracker 

The Issue Tracker module (new for [17.0](https://github.com/aces/Loris/releases)) lets users report bugs and flag data concerns within each Loris installation, for communication to the project coordinators and developers.  
The module is typically used to facilitate discussion, follow-up and resolution of instrument development, data entry, and cross-scan quality control of imaging data.   

Issue tracker features include comment history, watching (email notifications) and various flags. As a beta feature, PSCID and also visit label can be attached to an issue, to pinpoint data corrections to be made.

### Double Data Entry (DDE) and Conflict Resolver module

To enable specific [[DDE instruments|Behavioural-Database#7-double-data-entry]], add **at least 2** instruments within the "Study variables" section of Configuration Module. 

Once the first data entry form and the double data entry form are complete for a given participant's instrument, data entry conflicts can be resolved in the Conflict Resolver module, located under the 'Clinical' menu.  This module is accessible to front-end users via the 'conflict_resolver' permission. 

After all conflicts are resolved in all instruments for a given participant's timepoint, then that timepoint can be marked as 'Passed' in LORIS. 

### Data Integrity Flag and Data Team Helper (Beta in 14.10)

The Data Integrity Flag and Data Team Helper modules are a powerful utilities for tracking workflow of data entry, data cleaning and validation for complete instrument datasets at any timepoint. In the Data Integrity Flag module, 5 status levels are used to indicate whether a dataset is (1) in progress for data entry, (2) complete and ready for cleaning, (3) checked and cleaned, (4) all behavioural feedback resolved, and finally (5) signed off by senior study staff.  

### Feedback module

The Feedback module allows users to flag and comment on any database field particularly for behavioural data entry. Two default feedback types exist: input and scoring errors. Additional feedback types can be added to feedback_bvl_type table. 

### Reliability module

This module enables review of consistency in clinical assessment, between examiners and across sites. Examiners can view and encode candidate behaviour from video, and the reliability module flags behaviour encodings which differ from the gold standard. Activate in loris/project/config.xml:

```xml
<ReliabilityInstruments>
    <Instrument>
        <Testname>aosi</Testname>
        <Threshold>0.5</Threshold>
        <Displayname>AOSI</Displayname>
    </Instrument>
</ReliabilityInstruments>
```

### Data Dictionary Tool

This module allows users to view/edit the Data Dictionary, which must first be created by running data_dictionary_builder.php script in tools directory.  

Before running this script, ensure the parameter_type_category table contains a record where Type = 'Instrument'.

Caveat: It is highly recommended to take a backup copy of your parameter_type table before executing this script, as it deletes and re-loads all Instrument type fields in the parameter_type table.    

The input file automatically read by this script is called ip_output.txt - to create this file: 

1. For all [[PHP hand-coded instruments|Instrument-Coding-Guide]]: run the [[quickform_parser.php|Instrument-Coding-Guide#generate-the-mysql-table]] script on all PHP-coded instruments (in one run) to generate ip_output.txt

2. Also append (cat) all linst files (for all active instruments built using [[instrument builder|https://github.com/aces/Loris/wiki/Behavioural-Database#1-instrument-builder]] module) to ip_output.txt before running the data dictionary builder script. 

```bash
cat /var/www/loris/project/instruments/*.linst >> /var/www/loris/tools/ip_output.txt
```
Note >> operator : Do not overwrite the ip_output.txt file generated in step 1. 

3. Then run: 
```bash
php data_dictionary_builder.php 
```

Running this script is also a **pre-requisite to loading the [[Data Query Tool|Data-Querying-Tool]].**

### Candidate Parameters

Candidate Parameter fields, displayed in the [[Candidate Information page|Candidate-Information-Page]], store data relevant to the candidate across all timepoints, such as race/ethnicity, co-morbidities, blood type, and IDs from other studies. Please see the [[Candidate Parameters|Candidate-Parameters]] wiki page for further instructions.

### Candidate Information

All information regarding overall candidate, proband, participant status across timepoints including consent status is displayed in the front-end Candidate Information page, accessible via the "Edit Candidate Info" button. For more information, please see the [[Candidate Information|Candidate-Information-Page]] wiki page. 

### Radiology Review
The Radiology Review form is referenced in the Imaging Browser and Final Radiological Review LORIS modules. It is used to report MRI results following a local radiology review, including reports of atypical or abnormal incidental findings. If the Radiology Review instrument is desired, it can be installed based on the NDB_BVL_Instrument_radiology_review.class.inc from docs/instruments/ directory, and following the procedure described in [[The Instrument Coding Guide|Instrument-Coding-Guide#generate-the-mysql-table]] for installing any PHP instrument.