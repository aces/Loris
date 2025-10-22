SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_specimen_attribute_datatype;
LOCK TABLE biobank_specimen_attribute_datatype WRITE;
LOAD DATA LOCAL INFILE 'biobank_specimen_attribute_datatype.tsv' INTO TABLE biobank_specimen_attribute_datatype
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
