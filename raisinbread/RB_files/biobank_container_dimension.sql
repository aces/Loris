SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_container_dimension;
LOCK TABLE biobank_container_dimension WRITE;
LOAD DATA LOCAL INFILE 'biobank_container_dimension.tsv' INTO TABLE biobank_container_dimension
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
