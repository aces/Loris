SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_container WRITE;
TRUNCATE TABLE biobank_container;
LOAD DATA LOCAL INFILE 'biobank_container.tsv' INTO TABLE biobank_container
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
