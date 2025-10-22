SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE bids_phase_encoding_direction WRITE;
TRUNCATE TABLE bids_phase_encoding_direction;
LOAD DATA LOCAL INFILE 'bids_phase_encoding_direction.tsv' INTO TABLE bids_phase_encoding_direction
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
