SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_specimen_parent WRITE;
TRUNCATE TABLE biobank_specimen_parent;
LOAD DATA LOCAL INFILE 'biobank_specimen_parent.tsv' INTO TABLE biobank_specimen_parent
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
