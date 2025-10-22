SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_container_capacity;
LOCK TABLE biobank_container_capacity WRITE;
LOAD DATA LOCAL INFILE 'biobank_container_capacity.tsv' INTO TABLE biobank_container_capacity
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
