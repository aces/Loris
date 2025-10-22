SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_container_status WRITE;
TRUNCATE TABLE biobank_container_status;
LOAD DATA LOCAL INFILE 'biobank_container_status.tsv' INTO TABLE biobank_container_status
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
