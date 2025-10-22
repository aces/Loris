SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE genomic_cpg_annotation;
LOCK TABLE genomic_cpg_annotation WRITE;
LOAD DATA LOCAL INFILE 'genomic_cpg_annotation.tsv' INTO TABLE genomic_cpg_annotation
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
