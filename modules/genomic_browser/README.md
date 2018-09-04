# Genomic Module

## Methylation tab

To use the methylation tab, the genomic_cpg_annotaion table should be filled with data from the Illumina HumanMethylation450k probe annotations file. This file can be found at ftp://webdata2:webdata2@ussd-ftp.illumina.com/downloads/ProductFiles/HumanMethylation450/HumanMethylation450_15017482_v1-2.csv. We provide a script,  `modules/genomic_browser/tools/HumanMethylation450k_annotations_to_sql` to transfer the csv file from Illumina's FTP to into a mysql transaction file. The output of the tool can be piped to mysql. The process should take between 5 to 10 minutes. 

This example script is a python3 script. 

usage :
```
python3 HumanMethylation450k_annotations_to_sql.py <annotation_file> | mysql -u <user> -p <database>
```

## Files

In order to enable file uploading functionality, you must create a `genomic_uploader` directory in the `GenomicDataPath` directory (specified in the ConfigSettings). This directory needs to have read and write permissions for the apache user. It's recommended that this directory is soft-linked to a directory under `/data`.

The Methylation file parser is expecting a csv file where the first column value is the cpg_name (probe_id) and each next column header is the PSCID of that sample.

Ex: 
Cpg Name,MTL001,MTL002,MTL003,OTT001,OTT002,OTT003
cg00004192,0.801189261,0.0301716141,0.8076612619,0.9952436145,0.8506495436,0.7583490037
cg00021762,0.747602724,0.4233800573,0.1582679939,0.5039519868,0.2587142177,0.2294365754

To enable uploading of large files via the genomic file uploader, update apache configurations to increase size and time limits. This can be done by editing the `php.ini` file which can be found by running the command `php --ini`.

Sample values:

```
session.gc_maxlifetime = 10800 
max_input_time = 10800 
max_execution_time = 10800 
upload_max_filesize = 1024M 
post_max_size = 1024M
```
