SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_container_status;
LOCK TABLE biobank_container_status WRITE;
LOAD DATA LOCAL INFILE 'biobank_container_status.tsv' INTO TABLE biobank_container_status
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
