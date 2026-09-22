CREATE TABLE `candidate_identifier_types` (
  `CandidateIdentifierTypeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Format` varchar(255) NOT NULL,
  `Required` boolean NOT NULL DEFAULT 1,
  `Unique` boolean NOT NULL DEFAULT 1,
  `AutoGenerate` boolean NOT NULL DEFAULT 1,
  `AllowMultiple` boolean NOT NULL DEFAULT 0,
  PRIMARY KEY (`CandidateIdentifierTypeID`),
  UNIQUE KEY (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `candidate_identifier_types_project_rel` (
  `CandidateIdentifierTypeID` int(10) unsigned NOT NULL,
  `ProjectID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`CandidateIdentifierTypeID`, `ProjectID`),
  CONSTRAINT `FK_candidate_identifier_type_project_type`
    FOREIGN KEY (`CandidateIdentifierTypeID`)
    REFERENCES `candidate_identifier_types` (`CandidateIdentifierTypeID`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_candidate_identifier_type_project_project`
    FOREIGN KEY (`ProjectID`)
    REFERENCES `Project` (`ProjectID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `candidate_identifier_types_permission_rel` (
  `CandidateIdentifierTypeID` int(10) unsigned NOT NULL,
  `permID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`CandidateIdentifierTypeID`),
  UNIQUE KEY (`permID`),
  CONSTRAINT `FK_candidate_identifier_type_permission_type`
    FOREIGN KEY (`CandidateIdentifierTypeID`)
    REFERENCES `candidate_identifier_types` (`CandidateIdentifierTypeID`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_candidate_identifier_type_permission_perm`
    FOREIGN KEY (`permID`)
    REFERENCES `permissions` (`permID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `candidate_identifiers` (
  `CandidateIdentifierID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `CandidateID` int(10) unsigned NOT NULL,
  `CandidateIdentifierTypeID` int(10) unsigned NOT NULL,
  `Value` varchar(255) NOT NULL,
  PRIMARY KEY (`CandidateIdentifierID`),
  CONSTRAINT `FK_candidate_identifier_candidate`
    FOREIGN KEY (`CandidateID`)
    REFERENCES `candidate` (`ID`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_candidate_identifier_type`
    FOREIGN KEY (`CandidateIdentifierTypeID`)
    REFERENCES `candidate_identifier_types` (`CandidateIdentifierTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;