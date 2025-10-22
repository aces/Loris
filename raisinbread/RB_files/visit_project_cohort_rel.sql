SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE visit_project_cohort_rel;
LOCK TABLE visit_project_cohort_rel WRITE;
LOAD DATA LOCAL INFILE 'visit_project_cohort_rel.tsv' INTO TABLE visit_project_cohort_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
