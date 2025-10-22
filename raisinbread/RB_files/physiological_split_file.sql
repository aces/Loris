SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_split_file;
LOCK TABLE physiological_split_file WRITE;
LOAD DATA LOCAL INFILE 'physiological_split_file.tsv' INTO TABLE physiological_split_file
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
