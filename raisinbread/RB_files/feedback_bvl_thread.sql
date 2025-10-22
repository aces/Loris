SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE feedback_bvl_thread;
LOCK TABLE feedback_bvl_thread WRITE;
LOAD DATA LOCAL INFILE 'feedback_bvl_thread.tsv' INTO TABLE feedback_bvl_thread
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
