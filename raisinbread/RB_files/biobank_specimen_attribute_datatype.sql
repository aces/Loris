SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_specimen_attribute_datatype WRITE;
TRUNCATE TABLE biobank_specimen_attribute_datatype;
LOAD DATA LOCAL INFILE 'biobank_specimen_attribute_datatype.tsv' INTO TABLE biobank_specimen_attribute_datatype
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
