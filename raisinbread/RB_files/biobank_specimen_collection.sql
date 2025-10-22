SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_specimen_collection;
LOCK TABLE biobank_specimen_collection WRITE;
LOAD DATA LOCAL INFILE 'biobank_specimen_collection.tsv' INTO TABLE biobank_specimen_collection
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
