SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE feedback_bvl_type WRITE;
TRUNCATE TABLE feedback_bvl_type;
LOAD DATA LOCAL INFILE 'feedback_bvl_type.tsv' INTO TABLE feedback_bvl_type
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
