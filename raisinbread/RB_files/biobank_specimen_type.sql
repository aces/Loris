SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_specimen_type WRITE;
TRUNCATE TABLE biobank_specimen_type;
LOAD DATA LOCAL INFILE 'biobank_specimen_type.tsv' INTO TABLE biobank_specimen_type
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
