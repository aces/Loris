-- Add permissions
INSERT INTO permissions (code, description, categoryID) VALUES ('genomic_browser_view_site','View Genomic Browser data from own site','2'); 
INSERT INTO permissions (code, description, categoryID) VALUES ('genomic_browser_view_allsites','View Genomic Browser data across all sites','2'); 

-- Add menu item
INSERT INTO LorisMenu (Parent, Label, Link, Visible, OrderNumber) VALUES ('5', 'Genomic Browser', 'main.php?test_name=genomic_browser', NULL, 6);

-- Add menu permissions
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='genomic_browser_view_site' AND m.Label='Genomic Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='genomic_browser_view_allsites' AND m.Label='Genomic Browser';

-- Add tables
--
-- Table structure for table `gene`
--
CREATE TABLE `gene` (
  `GeneID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Symbol` varchar(255) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `NCBIID` varchar(255) DEFAULT NULL,
  `OfficialSymbol` varchar(255) DEFAULT NULL,
  `OfficialName` text,
  `GenomeLocID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`GeneID`),
  KEY `geneGenomeLocID` (`GenomeLocID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `genome_loc`
--
CREATE TABLE `genome_loc` (
  `GenomeLocID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Chromosome` varchar(255) DEFAULT NULL,
  `Strand` varchar(255) DEFAULT NULL,
  `EndLoc` int(11) DEFAULT NULL,
  `Size` int(11) DEFAULT NULL,
  `StartLoc` int(11) DEFAULT NULL,
  PRIMARY KEY (`GenomeLocID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `genotyping_platform`
--
CREATE TABLE `genotyping_platform` (
  `PlatformID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Description` text,
  `TechnologyType` varchar(255) DEFAULT NULL,
  `Provider` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PlatformID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `SNP`
--
CREATE TABLE `SNP` (
  `SNPID` bigint(20) NOT NULL AUTO_INCREMENT,
  `CandID` int(6) DEFAULT NULL,
  `rsID` varchar(9) DEFAULT NULL,
  `Description` text,
  `SNPExternalName` varchar(255) DEFAULT NULL,
  `SNPExternalSource` varchar(255) DEFAULT NULL,
  `ObservedBase` enum('A','C','T','G') DEFAULT NULL,
  `ReferenceBase` enum('A','C','T','G') DEFAULT NULL,
  `ArrayReport` enum('Normal','Pending','Uncertain') DEFAULT NULL,
  `Markers` varchar(255) DEFAULT NULL,
  `ArrayReportDetail` varchar(255) DEFAULT NULL,
  `ValidationMethod` varchar(50) DEFAULT NULL,
  `Validated` enum('0','1') DEFAULT NULL,
  `FunctionPrediction` enum('exonic','ncRNAexonic','splicing','UTR3','UTR5') DEFAULT NULL,
  `Damaging` enum('D','NA') DEFAULT NULL,
  `GenotypeQuality` int(4) DEFAULT NULL,
  `ExonicFunction` enum('nonsynonymous','unknown') DEFAULT NULL,
  `PlatformID` bigint(20) DEFAULT NULL,
  `GenomeLocID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`SNPID`),
  FOREIGN KEY (`PlatformID`) REFERENCES genotyping_platform(`PlatformID`),
  FOREIGN KEY (`GenomeLocID`) REFERENCES genome_loc(`GenomeLocID`),
  FOREIGN KEY (`CandID`) REFERENCES candidate(`CandID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `CNV`
--
CREATE TABLE `CNV` (
  `CNVID` bigint(20) NOT NULL AUTO_INCREMENT,
  `CandID` int(6) DEFAULT NULL,
  `Description` text,
  `Type` enum('gain','loss','unknown') DEFAULT NULL,
  `EventName` varchar(255) DEFAULT NULL,
  `Common_CNV` enum('Y','N') DEFAULT NULL,
  `Characteristics` enum('Benign','Pathogenic','Unknown') DEFAULT NULL,
  `CopyNumChange` int(11) DEFAULT NULL,
  `Inheritance` enum('de novo','NA','unclassified','unknown','maternal','paternal') DEFAULT NULL,
  `ArrayReport` enum('Normal','Abnormal','Pending','Uncertain') DEFAULT NULL,
  `Markers` varchar(255) DEFAULT NULL,
  `ArrayReportDetail` varchar(255) DEFAULT NULL,
  `ValidationMethod` varchar(50) DEFAULT NULL,
  `PlatformID` bigint(20) DEFAULT NULL,
  `GenomeLocID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`CNVID`),
  FOREIGN KEY (`PlatformID`) REFERENCES genotyping_platform(`PlatformID`),
  FOREIGN KEY (`GenomeLocID`) REFERENCES genome_loc(`GenomeLocID`),
  FOREIGN KEY (`CandID`) REFERENCES candidate(`CandID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

