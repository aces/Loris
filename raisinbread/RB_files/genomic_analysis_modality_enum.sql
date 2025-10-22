SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE genomic_analysis_modality_enum WRITE;
TRUNCATE TABLE genomic_analysis_modality_enum;
LOAD DATA LOCAL INFILE 'genomic_analysis_modality_enum.tsv' INTO TABLE genomic_analysis_modality_enum
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
