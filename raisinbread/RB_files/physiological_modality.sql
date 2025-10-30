SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_modality WRITE;
TRUNCATE TABLE physiological_modality;
LOAD DATA LOCAL INFILE 'physiological_modality.tsv' INTO TABLE physiological_modality
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
