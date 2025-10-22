SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE feedback_mri_comments WRITE;
TRUNCATE TABLE feedback_mri_comments;
LOAD DATA LOCAL INFILE 'feedback_mri_comments.tsv' INTO TABLE feedback_mri_comments
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
