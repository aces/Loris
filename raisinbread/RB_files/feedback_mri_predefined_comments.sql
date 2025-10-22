SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE feedback_mri_predefined_comments;
LOCK TABLE feedback_mri_predefined_comments WRITE;
LOAD DATA LOCAL INFILE 'feedback_mri_predefined_comments.tsv' INTO TABLE feedback_mri_predefined_comments
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
