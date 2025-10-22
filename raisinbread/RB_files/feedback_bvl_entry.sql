SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE feedback_bvl_entry;
LOCK TABLE feedback_bvl_entry WRITE;
LOAD DATA LOCAL INFILE 'feedback_bvl_entry.tsv' INTO TABLE feedback_bvl_entry
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
