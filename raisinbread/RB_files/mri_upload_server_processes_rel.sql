SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE mri_upload_server_processes_rel;
LOCK TABLE mri_upload_server_processes_rel WRITE;
LOAD DATA LOCAL INFILE 'mri_upload_server_processes_rel.tsv' INTO TABLE mri_upload_server_processes_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
