
DROP TABLE IF EXISTS `gene`;
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
DROP TABLE IF EXISTS `genome_loc`;
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
-- Table structure for table `platform`
--
DROP TABLE IF EXISTS `platform`;
CREATE TABLE `platform` (
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
DROP TABLE IF EXISTS `SNP`;
CREATE TABLE `SNP` (
  `SNPID` bigint(20) NOT NULL AUTO_INCREMENT,
  `CandID` varchar(255) DEFAULT NULL,
  `rsID` varchar(9) DEFAULT NULL,
  `Description` text,
  `SNPExternalName` varchar(255) DEFAULT NULL,
  `SNPExternalSource` varchar(255) DEFAULT NULL,
  `ObservedBase` enum('A','C','T','G') DEFAULT NULL,
  `ReferenceBase` enum('A','C','T','G') DEFAULT NULL,
  `ArrayReport` enum('Normal','Uncertain','Pending','Uncertain') DEFAULT NULL,
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
  KEY `SNPGenomeLocID` (`GenomeLocID`),
  KEY `SNPPlatformID` (`PlatformID`),
  KEY `CandID` (`CandID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `CNV`
--

DROP TABLE IF EXISTS `CNV`;
CREATE TABLE `CNV` (
  `CNVID` bigint(20) NOT NULL AUTO_INCREMENT,
  `CandID` varchar(255) DEFAULT NULL,
  `Description` text,
  `Type` enum('gain','loss','unknown') DEFAULT NULL,
  `EventName` varchar(255) DEFAULT NULL,
  `Common_CNV` enum('Y','N') DEFAULT NULL,
  `Characteristics` enum('Benign','Pathogenic','Unknown') DEFAULT NULL,
  `CopyNumChange` int(11) DEFAULT NULL,
  `Inheritance` enum('de novo','NA','unclassified','unknown','maternal','paternal') DEFAULT NULL,
  `ArrayReport` enum('Normal','Abnormal','Uncertain','Pending','Uncertain') DEFAULT NULL,
  `Markers` varchar(255) DEFAULT NULL,
  `ArrayReportDetail` varchar(255) DEFAULT NULL,
  `ValidationMethod` varchar(50) DEFAULT NULL,
  `PlatformID` bigint(20) DEFAULT NULL,
  `GenomeLocID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`CNVID`),
  KEY `CNVGenomeLocID` (`GenomeLocID`),
  KEY `CNVPlatformID` (`PlatformID`),
  KEY `CandID` (`CandID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

