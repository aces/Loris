SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_specimen_type;
LOCK TABLE biobank_specimen_type WRITE;
LOAD DATA LOCAL INFILE 'biobank_specimen_type.tsv' INTO TABLE biobank_specimen_type
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
