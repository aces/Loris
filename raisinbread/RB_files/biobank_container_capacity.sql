SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_container_capacity WRITE;
TRUNCATE TABLE biobank_container_capacity;
LOAD DATA LOCAL INFILE 'biobank_container_capacity.tsv' INTO TABLE biobank_container_capacity
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
