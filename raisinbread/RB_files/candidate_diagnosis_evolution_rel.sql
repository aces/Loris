SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE candidate_diagnosis_evolution_rel;
LOCK TABLE candidate_diagnosis_evolution_rel WRITE;
LOAD DATA LOCAL INFILE 'candidate_diagnosis_evolution_rel.tsv' INTO TABLE candidate_diagnosis_evolution_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
