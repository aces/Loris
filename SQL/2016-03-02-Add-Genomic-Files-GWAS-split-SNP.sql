--
-- Table structure for Genomic Browser table `GWAS`
--
DROP TABLE IF EXISTS `GWAS`;

CREATE TABLE `GWAS` (
  `GWASID` int(20) NOT NULL AUTO_INCREMENT,
  `SNPID` int(20) NOT NULL,
  `rsID` varchar(20) DEFAULT NULL,
  `MajorAllele` enum('A','C','T','G') DEFAULT NULL,
  `MinorAllele` enum('A','C','T','G') DEFAULT NULL,
  `MAF` varchar(20) DEFAULT NULL,
  `Estimate` varchar(20) DEFAULT NULL,
  `StdErr` varchar(20) DEFAULT NULL,
  `Pvalue` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`GWASID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Stores results of Genome-Wide Analysis Study';

--
-- Table structure for table `genomic_files`
--
DROP TABLE IF EXISTS `genomic_files`;

CREATE TABLE `genomic_files` (
  `GenomicFileID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `CandID` int(6) NOT NULL DEFAULT '0',
  `VisitLabel` varchar(255) DEFAULT NULL,
  `FileName` varchar(255) NOT NULL,
  `FilePackage` tinyint(1) DEFAULT NULL,
  `Description` varchar(255) NOT NULL,
  `FileType` varchar(255) NOT NULL,
  `FileSize` int(20) NOT NULL,
  `Platform` varchar(255) DEFAULT NULL,
  `Batch` varchar(255) DEFAULT NULL,
  `Source` varchar(255) DEFAULT NULL,
  `Date_taken` date DEFAULT NULL,
  `Category` enum('raw','cleaned','GWAS') DEFAULT NULL,
  `Pipeline` varchar(255) DEFAULT NULL,
  `Algorithm` varchar(255) DEFAULT NULL,
  `Normalization` varchar(255) DEFAULT NULL,
  `SampleID` varchar(255) DEFAULT NULL,
  `AnalysisProtocol` varchar(255) DEFAULT NULL,
  `InsertedByUserID` varchar(255) NOT NULL DEFAULT '',
  `Date_inserted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Caveat` tinyint(1) DEFAULT NULL,
  `Notes` text,
  PRIMARY KEY (`GenomicFileID`),
  KEY `FK_genomic_files_1` (`CandID`),
  CONSTRAINT `FK_genomic_files_1` FOREIGN KEY (`CandID`) REFERENCES `candidate` (`CandID`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;

--
-- Table structure for Genomic Browser table `SNP_candidate_rel`
--
DROP TABLE IF EXISTS `SNP_candidate_rel`;

CREATE TABLE `SNP_candidate_rel` (
  `SNPID` int(20) NOT NULL DEFAULT '0',
  `CandID` varchar(255) NOT NULL DEFAULT '0',
  `ObservedBase` enum('A','C','T','G') DEFAULT NULL,
  `ArrayReport` enum('Normal','Uncertain','Pending') DEFAULT NULL,
  `ArrayReportDetail` varchar(255) DEFAULT NULL,
  `ValidationMethod` varchar(50) DEFAULT NULL,
  `Validated` enum('0','1') DEFAULT NULL,
  `GenotypeQuality` int(4) DEFAULT NULL,
  `PlatformID` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO SNP_candidate_rel (SNPID, CandID, ObservedBase, ArrayReport, ArrayReportDetail, ValidationMethod, Validated, GenotypeQuality, PlatformID)  SELECT DISTINCT (SNPID, CandID, ObservedBase, ArrayReport, ArrayReportDetail, ValidationMethod, Validated, GenotypeQuality, PlatformID) FROM SNP;

ALTER TABLE SNP DROP COLUMN ObservedBase, ArrayReport, ArrayReportDetail, ValidationMethod, Validated, GenotypeQuality, PlatformID;

-- Remove any duplicate SNP records, given dropped columns   
CREATE TABLE temp_unique_SNP_records SELECT DISTINCT * from SNP;
DELETE FROM SNP WHERE 1=1; 
INSERT INTO SNP VALUES (SELECT * FROM temp_unique_SNP_records); 
-- # issue with SNP ID ????

-- Add Config setting

NSERT IGNORE INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'GenomicDataPath', 'Path to Genomic data files', 1, 0, 'text', ID, 'Genomic Data Path', 8 FROM ConfigSettings WHERE Name="paths";

INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/Genomic-Data/" FROM ConfigSettings WHERE Name="GenomicDataPath";



