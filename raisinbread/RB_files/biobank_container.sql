SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_container;
LOCK TABLE biobank_container WRITE;
LOAD DATA LOCAL INFILE 'biobank_container.tsv' INTO TABLE biobank_container
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
