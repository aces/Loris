SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE issues_attachments WRITE;
TRUNCATE TABLE issues_attachments;
LOAD DATA LOCAL INFILE 'issues_attachments.tsv' INTO TABLE issues_attachments
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
