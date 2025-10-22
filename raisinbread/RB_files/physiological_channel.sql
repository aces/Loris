SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE physiological_channel;
LOCK TABLE physiological_channel WRITE;
LOAD DATA LOCAL INFILE 'physiological_channel.tsv' INTO TABLE physiological_channel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
