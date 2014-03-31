CREATE TABLE `mri_upload` (
  `UploadID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `UploadedBy` varchar(255) NOT NULL DEFAULT '',
  `UploadDate` DateTime DEFAULT NULL,
  `SourceLocation` varchar(255) NOT NULL DEFAULT '',
  `number_of_mincInserted` int(11) DEFAULT NULL,
  `number_of_mincCreated` int(11) DEFAULT NULL,
  `TarchiveID` int(11) DEFAULT NULL,
  `SessionID` int(10) unsigned DEFAULT NULL,
  `IsValidated` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`UploadID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `mri_protocol_checks` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Scan_type` int(11) unsigned DEFAULT NULL,
  `Severity` enum('warning','exclude') DEFAULT NULL,
  `Header` varchar(255) DEFAULT NULL,
  `ValidRange` varchar(255) DEFAULT NULL,
  `ValidRegex` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `MRICandidateErrors` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TimeRun` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `SeriesUID` varchar(64) DEFAULT NULL,
  `TarchiveID` int(11) DEFAULT NULL,
  `MincFile` varchar(255) DEFAULT NULL,
  `PatientName` varchar(255) DEFAULT NULL,
  `Reason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `mri_violations_log` (
  `LogID` int(11) NOT NULL AUTO_INCREMENT,
  `TimeRun` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `SeriesUID` varchar(64) DEFAULT NULL,
  `TarchiveID` int(11) DEFAULT NULL,
  `MincFile` varchar(255) DEFAULT NULL,
  `PatientName` varchar(255) DEFAULT NULL,
  `CandID` int(6) DEFAULT NULL,
  `Visit_label` varchar(255) DEFAULT NULL,
  `CheckID` int(11) DEFAULT NULL,
  `Scan_type` int(11) unsigned DEFAULT NULL,
  `Severity` enum('warning','exclude') DEFAULT NULL,
  `Header` varchar(255) DEFAULT NULL,
  `Value` varchar(255) DEFAULT NULL,
  `ValidRange` varchar(255) DEFAULT NULL,
  `ValidRegex` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`LogID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE files ADD COLUMN `Caveat` tinyint(1) DEFAULT NULL;
ALTER TABLE files ADD COLUMN `TarchiveSource` int(11) DEFAULT NULL;
