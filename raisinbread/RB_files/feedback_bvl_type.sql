SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE feedback_bvl_type;
LOCK TABLE feedback_bvl_type WRITE;
LOAD DATA LOCAL INFILE 'feedback_bvl_type.tsv' INTO TABLE feedback_bvl_type
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
