SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE bids_event_file_mapping;
LOCK TABLE bids_event_file_mapping WRITE;
LOAD DATA LOCAL INFILE 'bids_event_file_mapping.tsv' INTO TABLE bids_event_file_mapping
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
