SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE mri_processing_protocol WRITE;
TRUNCATE TABLE mri_processing_protocol;
LOAD DATA LOCAL INFILE 'mri_processing_protocol.tsv' INTO TABLE mri_processing_protocol
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
