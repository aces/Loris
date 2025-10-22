SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE parameter_type_override;
LOCK TABLE parameter_type_override WRITE;
LOAD DATA LOCAL INFILE 'parameter_type_override.tsv' INTO TABLE parameter_type_override
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
