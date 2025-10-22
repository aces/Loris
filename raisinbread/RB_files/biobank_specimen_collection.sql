SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_specimen_collection WRITE;
TRUNCATE TABLE biobank_specimen_collection;
LOAD DATA LOCAL INFILE 'biobank_specimen_collection.tsv' INTO TABLE biobank_specimen_collection
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
