SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_specimen_freezethaw WRITE;
TRUNCATE TABLE biobank_specimen_freezethaw;
LOAD DATA LOCAL INFILE 'biobank_specimen_freezethaw.tsv' INTO TABLE biobank_specimen_freezethaw
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
