SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE feedback_bvl_thread WRITE;
TRUNCATE TABLE feedback_bvl_thread;
LOAD DATA LOCAL INFILE 'feedback_bvl_thread.tsv' INTO TABLE feedback_bvl_thread
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
