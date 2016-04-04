CREATE TABLE `genomic_analysis_modality_enum` (
  `analysis_modality` varchar(100),
  PRIMARY KEY (`analysis_modality`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
COMMENT '';

INSERT IGNORE INTO `genomic_analysis_modality_enum` (analysis_modality) VALUES
('Methylation beta-values'),
('Other');

CREATE TABLE `genomic_candidate_files_rel` (
    `CandID` int(6) NOT NULL,
    `GenomicFileID` int(10) unsigned NOT NULL,
    PRIMARY KEY (`CandID`,`GenomicFileID`),
    FOREIGN KEY (CandID) 
        REFERENCES candidate (CandID),
    FOREIGN KEY (GenomicFileID)
        REFERENCES genomic_files (GenomicFileID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO genomic_candidate_files_rel (CandID, GenomicFileID) select CandID, GenomicFileID FROM genomic_files;

ALTER TABLE genomic_files DROP FOREIGN KEY `FK_genomic_files_1`;
ALTER TABLE genomic_files DROP COLUMN `CandID`;
ALTER TABLE genomic_files DROP COLUMN `VisitLabel`;

ALTER TABLE genomic_files 
    ADD COLUMN AnalysisModality varchar(100),
    ADD FOREIGN KEY (AnalysisModality) REFERENCES genomic_analysis_modality_enum (analysis_modality);
