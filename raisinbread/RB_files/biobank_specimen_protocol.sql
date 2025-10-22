SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_specimen_protocol;
LOCK TABLE biobank_specimen_protocol WRITE;
LOAD DATA LOCAL INFILE 'biobank_specimen_protocol.tsv' INTO TABLE biobank_specimen_protocol
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
