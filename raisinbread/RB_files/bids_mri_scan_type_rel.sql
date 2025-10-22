SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE bids_mri_scan_type_rel WRITE;
TRUNCATE TABLE bids_mri_scan_type_rel;
LOAD DATA LOCAL INFILE 'bids_mri_scan_type_rel.tsv' INTO TABLE bids_mri_scan_type_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
