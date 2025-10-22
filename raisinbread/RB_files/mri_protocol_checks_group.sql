SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE mri_protocol_checks_group;
LOCK TABLE mri_protocol_checks_group WRITE;
LOAD DATA LOCAL INFILE 'mri_protocol_checks_group.tsv' INTO TABLE mri_protocol_checks_group
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
