SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_specimen_type_container_type_rel WRITE;
TRUNCATE TABLE biobank_specimen_type_container_type_rel;
LOAD DATA LOCAL INFILE 'biobank_specimen_type_container_type_rel.tsv' INTO TABLE biobank_specimen_type_container_type_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
