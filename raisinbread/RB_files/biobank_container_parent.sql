SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_container_parent;
LOCK TABLE biobank_container_parent WRITE;
LOAD DATA LOCAL INFILE 'biobank_container_parent.tsv' INTO TABLE biobank_container_parent
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
