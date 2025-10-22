SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE feedback_mri_comment_types WRITE;
TRUNCATE TABLE feedback_mri_comment_types;
LOAD DATA LOCAL INFILE 'feedback_mri_comment_types.tsv' INTO TABLE feedback_mri_comment_types
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
