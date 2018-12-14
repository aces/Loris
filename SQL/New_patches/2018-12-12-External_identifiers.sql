CREATE TABLE `project_external` (
  `ProjectExternalID` int(4) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) UNIQUE DEFAULT NULL,
  PRIMARY KEY (`ProjectExternalID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `candidate_project_external_rel` (
  `CandID` int(6) NOT NULL DEFAULT 0,
  `ProjectExternalID` int(4) NOT NULL,
  `ExtStudyID` varchar(255) NOT NULL DEFAULT '',
  `DateUpdated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`CandID`,`ProjectExternalID`),
  KEY `FK_candidate_project_extid_rel_2` (`ProjectExternalID`),
  CONSTRAINT `FK_candidate_project_external_rel_1` FOREIGN KEY (`CandID`) REFERENCES `candidate` (`CandID`),
  CONSTRAINT `FK_candidate_project_external_rel_2` FOREIGN KEY (`ProjectExternalID`) REFERENCES `project_external` (`ProjectExternalID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
