SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_specimen_protocol_attribute_rel;
LOCK TABLE biobank_specimen_protocol_attribute_rel WRITE;
LOAD DATA LOCAL INFILE 'biobank_specimen_protocol_attribute_rel.tsv' INTO TABLE biobank_specimen_protocol_attribute_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
