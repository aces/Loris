SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_specimen_process;
LOCK TABLE biobank_specimen_process WRITE;
LOAD DATA LOCAL INFILE 'biobank_specimen_process.tsv' INTO TABLE biobank_specimen_process
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
