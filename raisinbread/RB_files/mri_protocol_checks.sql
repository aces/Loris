SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE mri_protocol_checks;
LOCK TABLE mri_protocol_checks WRITE;
LOAD DATA LOCAL INFILE 'mri_protocol_checks.tsv' INTO TABLE mri_protocol_checks
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
