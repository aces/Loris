SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_specimen_parent;
LOCK TABLE biobank_specimen_parent WRITE;
LOAD DATA LOCAL INFILE 'biobank_specimen_parent.tsv' INTO TABLE biobank_specimen_parent
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
