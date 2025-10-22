SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_specimen_analysis;
LOCK TABLE biobank_specimen_analysis WRITE;
LOAD DATA LOCAL INFILE 'biobank_specimen_analysis.tsv' INTO TABLE biobank_specimen_analysis
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
