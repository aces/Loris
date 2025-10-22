SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE mri_protocol_checks WRITE;
TRUNCATE TABLE mri_protocol_checks;
LOAD DATA LOCAL INFILE 'mri_protocol_checks.tsv' INTO TABLE mri_protocol_checks
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
