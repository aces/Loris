SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_specimen_freezethaw;
LOCK TABLE biobank_specimen_freezethaw WRITE;
LOAD DATA LOCAL INFILE 'biobank_specimen_freezethaw.tsv' INTO TABLE biobank_specimen_freezethaw
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
