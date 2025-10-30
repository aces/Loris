SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE bids_export_file_level_category WRITE;
TRUNCATE TABLE bids_export_file_level_category;
LOAD DATA LOCAL INFILE 'bids_export_file_level_category.tsv' INTO TABLE bids_export_file_level_category
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
