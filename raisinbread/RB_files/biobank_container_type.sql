SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_container_type WRITE;
TRUNCATE TABLE biobank_container_type;
LOAD DATA LOCAL INFILE 'biobank_container_type.tsv' INTO TABLE biobank_container_type
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
