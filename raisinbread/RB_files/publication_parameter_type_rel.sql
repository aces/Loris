SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE publication_parameter_type_rel WRITE;
TRUNCATE TABLE publication_parameter_type_rel;
LOAD DATA LOCAL INFILE 'publication_parameter_type_rel.tsv' INTO TABLE publication_parameter_type_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
