SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE instrument_subtests WRITE;
TRUNCATE TABLE instrument_subtests;
LOAD DATA LOCAL INFILE 'instrument_subtests.tsv' INTO TABLE instrument_subtests
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
