SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE mri_protocol_violated_scans;
LOCK TABLE mri_protocol_violated_scans WRITE;
LOAD DATA LOCAL INFILE 'mri_protocol_violated_scans.tsv' INTO TABLE mri_protocol_violated_scans
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
