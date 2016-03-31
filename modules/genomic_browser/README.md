# Genomic Module

## Methylation tab

To use the methylation tab, the genomic_cpg_annotaion table should be filled with data from the Illumina HumanMethylation450k probe annotations file. This file can be found at ftp://webdata2:webdata2@ussd-ftp.illumina.com/downloads/ProductFiles/HumanMethylation450/HumanMethylation450_15017482_v1-2.csv. We provide a script,  `modules/genomic_browser/tools/HumanMethylation450k_annotations_to_sql` to transforme the csv file from Illumina's FTP to into a mysql transaction file. The output of the tool can be piped to mysql. The process should take between 5 to 10 minutes. 

usage :```
python3 HumanMethylation450k_annotations_to_sql.py <annotation_file> | mysql -u <user> -p <database>
```
