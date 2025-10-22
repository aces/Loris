SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE feedback_mri_comment_types;
LOCK TABLE feedback_mri_comment_types WRITE;
LOAD DATA LOCAL INFILE 'feedback_mri_comment_types.tsv' INTO TABLE feedback_mri_comment_types
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
