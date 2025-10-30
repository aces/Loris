SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE mri_protocol_checks_group WRITE;
TRUNCATE TABLE mri_protocol_checks_group;
LOAD DATA LOCAL INFILE 'mri_protocol_checks_group.tsv' INTO TABLE mri_protocol_checks_group
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
