SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_container_type;
LOCK TABLE biobank_container_type WRITE;
LOAD DATA LOCAL INFILE 'biobank_container_type.tsv' INTO TABLE biobank_container_type
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
