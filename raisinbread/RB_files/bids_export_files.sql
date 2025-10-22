SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE bids_export_files;
LOCK TABLE bids_export_files WRITE;
LOAD DATA LOCAL INFILE 'bids_export_files.tsv' INTO TABLE bids_export_files
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
