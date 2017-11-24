# Genomic Module (Beta version)

## Purpose

The Genomic Browser module is intended to allow researchers to see what
kind of data is available for each of their study's candidates (see
[Profile](#profile_link)). For each type of data ([SNP](#snp_link),
[CNV](#cnv_link), [CPG](#cpg_link)) A distinct tab is provided to allow
for browsing and filtering each individual values of each candidate
for each of the variables of that type. Filtering is based on provided
annotations. Links to specific external databases (UCSC, dbSNP) have
been added to variable ID and some annotation columns. An uploader

## Intended Users


## Scope


## Permissions

Permission Code               	| Description
-------------------------------	| -----------------------------------------------------------------------
genomic_browser_view_site     	| Allow to view genomic data of Candidates from that user own site(s)
genomic_browser_view_allsites 	| Allow to view genomic data of Candidates from all sites
genomic_data_manager 		| Allow for genomic file uploading (see [File Upload](#file_upload_link))

## Configurations

Config name 	| Description
---------------	| ------------------------------------------------------------------
GenomicDataPath | The to a directory readable and writable by www-data. This 
                | directory should contain a `genomic_uploader` directory that is 
                | also readable and writable by www-data.

## Interactions with LORIS There are foreign keys on the candidate table.


## More...  This module use tabs for each data modality

Tab | Description
--- | -----------
[Profile](#profile_link) | [GWAS](#gwas_link) | [SNP](#snp_link) | [CNV](#cnv_link) |
[CPG](#cpg_link) | [File Upload](#file_upload_link) |


<a name="profile_link"></a> ## Profile

<a name="gwas_link"></a> ## GWAS

<a name="snp_link"></a> ## SNP

<a name="cnv_link"></a> ## CNV

<a name="cpg_link"></a> ## CPG tab

To use the methylation tab, the genomic_cpg_annotaion
table should be filled with data from the Illumina
HumanMethylation450k probe annotations file. This file can be found at
ftp://webdata2:webdata2@ussd-ftp.illumina.com/downloads/ProductFiles/HumanMethylation450/HumanMethylation450_15017482_v1-2.csv.
We provide a script,
`modules/genomic_browser/tools/HumanMethylation450k_annotations_to_sql`
to transforme the csv file from Illumina's FTP to into a mysql transaction
file. The output of the tool can be piped to mysql. The process should
take between 5 to 10 minutes.

This exemple script is a python3 script.

usage : ``` python3 HumanMethylation450k_annotations_to_sql.py
<annotation_file> | mysql -u <user> -p <database> ```


<a name="file_upload_link"></a> ## Files

The uploading functionnality require a genomic_uploader directory under
the GenomicDataPath directory specified in the ConfigSettings. This
directory needs to be accessible w/r to the apache user. It's recommended
that this configSetting be soft-linked to a directory under the /data/

To enable uploading of large files via the genomic file uploader, update
apache configurations to increase size and time limits.  (Sample values
suggested below)

Apache configuration file to update : /etc/php5/apache2/php.ini

Sample values:

``` session.gc_maxlifetime = 10800 max_input_time = 10800
max_execution_time = 10800 upload_max_filesize = 1024M post_max_size =
1024M ```

