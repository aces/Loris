SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE genomic_candidate_files_rel;
LOCK TABLE genomic_candidate_files_rel WRITE;
LOAD DATA LOCAL INFILE 'genomic_candidate_files_rel.tsv' INTO TABLE genomic_candidate_files_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
