SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE bids_export_file_level_category;
LOCK TABLE bids_export_file_level_category WRITE;
LOAD DATA LOCAL INFILE 'bids_export_file_level_category.tsv' INTO TABLE bids_export_file_level_category
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
