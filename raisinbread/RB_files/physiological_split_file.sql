SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE physiological_split_file WRITE;
TRUNCATE TABLE physiological_split_file;
LOAD DATA LOCAL INFILE 'physiological_split_file.tsv' INTO TABLE physiological_split_file
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
