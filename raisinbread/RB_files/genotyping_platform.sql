SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE genotyping_platform WRITE;
TRUNCATE TABLE genotyping_platform;
LOAD DATA LOCAL INFILE 'genotyping_platform.tsv' INTO TABLE genotyping_platform
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
