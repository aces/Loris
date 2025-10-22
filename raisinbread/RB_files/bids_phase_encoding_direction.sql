SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE bids_phase_encoding_direction;
LOCK TABLE bids_phase_encoding_direction WRITE;
LOAD DATA LOCAL INFILE 'bids_phase_encoding_direction.tsv' INTO TABLE bids_phase_encoding_direction
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
