SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE bids_scan_type_subcategory;
LOCK TABLE bids_scan_type_subcategory WRITE;
LOAD DATA LOCAL INFILE 'bids_scan_type_subcategory.tsv' INTO TABLE bids_scan_type_subcategory
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
