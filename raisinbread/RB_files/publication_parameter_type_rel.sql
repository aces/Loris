SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE publication_parameter_type_rel;
LOCK TABLE publication_parameter_type_rel WRITE;
LOAD DATA LOCAL INFILE 'publication_parameter_type_rel.tsv' INTO TABLE publication_parameter_type_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
