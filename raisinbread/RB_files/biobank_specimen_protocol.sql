SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_specimen_protocol WRITE;
TRUNCATE TABLE biobank_specimen_protocol;
LOAD DATA LOCAL INFILE 'biobank_specimen_protocol.tsv' INTO TABLE biobank_specimen_protocol
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
