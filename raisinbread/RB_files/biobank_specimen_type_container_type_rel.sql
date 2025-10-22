SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_specimen_type_container_type_rel;
LOCK TABLE biobank_specimen_type_container_type_rel WRITE;
LOAD DATA LOCAL INFILE 'biobank_specimen_type_container_type_rel.tsv' INTO TABLE biobank_specimen_type_container_type_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
