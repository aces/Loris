SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE mri_protocol_checks_group_target;
LOCK TABLE mri_protocol_checks_group_target WRITE;
LOAD DATA LOCAL INFILE 'mri_protocol_checks_group_target.tsv' INTO TABLE mri_protocol_checks_group_target
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
