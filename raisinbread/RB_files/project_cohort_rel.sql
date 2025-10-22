SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE project_cohort_rel WRITE;
TRUNCATE TABLE project_cohort_rel;
LOAD DATA LOCAL INFILE 'project_cohort_rel.tsv' INTO TABLE project_cohort_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
