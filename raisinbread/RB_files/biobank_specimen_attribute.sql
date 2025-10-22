SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_specimen_attribute WRITE;
TRUNCATE TABLE biobank_specimen_attribute;
LOAD DATA LOCAL INFILE 'biobank_specimen_attribute.tsv' INTO TABLE biobank_specimen_attribute
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
