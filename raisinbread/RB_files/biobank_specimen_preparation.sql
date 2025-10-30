SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_specimen_preparation WRITE;
TRUNCATE TABLE biobank_specimen_preparation;
LOAD DATA LOCAL INFILE 'biobank_specimen_preparation.tsv' INTO TABLE biobank_specimen_preparation
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
