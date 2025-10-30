SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_container_dimension WRITE;
TRUNCATE TABLE biobank_container_dimension;
LOAD DATA LOCAL INFILE 'biobank_container_dimension.tsv' INTO TABLE biobank_container_dimension
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
