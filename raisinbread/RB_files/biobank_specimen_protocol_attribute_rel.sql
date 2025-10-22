SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_specimen_protocol_attribute_rel WRITE;
TRUNCATE TABLE biobank_specimen_protocol_attribute_rel;
LOAD DATA LOCAL INFILE 'biobank_specimen_protocol_attribute_rel.tsv' INTO TABLE biobank_specimen_protocol_attribute_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
