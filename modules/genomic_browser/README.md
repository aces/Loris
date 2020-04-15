# Genomic Module

## Purpose

The Genomic Browser module is intended to allow users to visualize the
results of already analyzed genetic tests cross-linked with behavioural
and imaging candidate data.

## Intended Users

The intended users are researchers and study personnel browsing and reviewing summary data. 

## Scope

This module is a beta version which aims to present summary genomic data of several types so that researchers can usefully review and explore data available for study participants in a cross-modal context. 
SNP, CNV, and methylation (epigenomic) data are example types of data supported. Utilities are included for uploading and visualizing data, and these functions can be extended for additional data types.
Extensive customization may be required to work seamlessly with your data context. For example, the `Configurations` detailed below enable the upload of files formatted according to a specific analysis platform (Illumina 450k). 
This module is not designed to replace existing databases designed for storing genomic data.  

## Permissions

### Module Permissions

- The `genomic_browser_view_allsites` or `genomic_browser_view_site` is required to access this module.

### Filesystem Permissions

The filesystem path for the `GenomicDataPath` (see: Configurations) must be readable and writeable by the web server for
uploading functionality to work.

## Configurations

- For the methylation tab to work, the `genomic_cpg_annotation` table should be filled with data from the Illumina HumanMethylation450k probe annotations file. This file can be found at ftp://webdata2:webdata2@ussd-ftp.illumina.com/downloads/ProductFiles/HumanMethylation450/HumanMethylation450_15017482_v1-2.csv. Use the script `modules/genomic_browser/tools/HumanMethylation450k_annotations_to_sql.py` to transfer the csv file from Illumina's FTP to a mysql transaction file. (The process of loading the SQL file can take 5 to 10 minutes)
- The `GenomicDataPath` configuration specifies where files are uploaded.
- To enable uploads, please consult instructions for [Handling Large File Uploads](../../docs/wiki/00 - SERVER INSTALL AND CONFIGURATION/02 - Website Configuration/Handling Large File Uploads.md).
