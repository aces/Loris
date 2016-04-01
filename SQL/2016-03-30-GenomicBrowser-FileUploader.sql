CREATE TABLE `genomic_file_type_enum` (
  `genomic_file_type` varchar(100),
  PRIMARY KEY (`genomic_file_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
COMMENT '';

INSERT IGNORE INTO `genomic_file_type_enum` (genomic_file_type) VALUES
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
