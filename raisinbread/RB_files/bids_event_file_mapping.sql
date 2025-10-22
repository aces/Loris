SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE bids_event_file_mapping WRITE;
TRUNCATE TABLE bids_event_file_mapping;
LOAD DATA LOCAL INFILE 'bids_event_file_mapping.tsv' INTO TABLE bids_event_file_mapping
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
