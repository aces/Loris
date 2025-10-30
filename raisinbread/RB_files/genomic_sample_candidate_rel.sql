SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE genomic_sample_candidate_rel WRITE;
TRUNCATE TABLE genomic_sample_candidate_rel;
LOAD DATA LOCAL INFILE 'genomic_sample_candidate_rel.tsv' INTO TABLE genomic_sample_candidate_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
