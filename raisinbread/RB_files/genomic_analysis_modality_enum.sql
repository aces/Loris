SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE genomic_analysis_modality_enum;
LOCK TABLE genomic_analysis_modality_enum WRITE;
LOAD DATA LOCAL INFILE 'genomic_analysis_modality_enum.tsv' INTO TABLE genomic_analysis_modality_enum
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
