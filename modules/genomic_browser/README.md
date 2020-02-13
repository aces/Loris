# Genomic Module

## Purpose

The genomic browser module is intended to allow users to visualize the
results of already analyzed genetic tests cross-linked with behavioural
and imaging candidate data.

## Intended Users

Unknown

## Scope

Unknown

NOT in scope:

Unknown

## Permissions

### Module Permissions

- The `genomic_browser_view_allsites` or `genomic_browser_view_site` is required to access this module.

### Filesystem Permissions

The filesystem path for the `GenomicDataPath` (see: Configurations) must be readable and writeable by the web server for
uploading functionality to work.

## Configurations

- For the methylation tab to work, the `genomic_cpg_annotation` table should be filled with data from the Illumina HumanMethylation450k probe annotations file. This file can be found at ftp://webdata2:webdata2@ussd-ftp.illumina.com/downloads/ProductFiles/HumanMethylation450/HumanMethylation450_15017482_v1-2.csv. Use the script `modules/genomic_browser/tools/HumanMethylation450k_annotations_to_sql.py` to transfer the csv file from Illumina's FTP to a mysql transaction file. (The process of loading the SQL file can take 5 to 10 minutes)
- The `GenomicDataPath` configuration specifies where files are uploaded.

To enable the Imaging Uploader to handle large files, please follow the
instructons for [Handling Large File Uploads](../../docs/wiki/00 - SERVER INSTALL AND CONFIGURATION/02 - Website Configuration/Handling Large File Uploads.md).
