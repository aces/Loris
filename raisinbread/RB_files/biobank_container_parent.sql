SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_container_parent WRITE;
TRUNCATE TABLE biobank_container_parent;
LOAD DATA LOCAL INFILE 'biobank_container_parent.tsv' INTO TABLE biobank_container_parent
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
