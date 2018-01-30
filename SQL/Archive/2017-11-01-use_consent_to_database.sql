INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useConsent', 'Enable if the study uses the loris architecture for consent', 1, 0, 'boolean', ID, 'Use consent', 15 FROM ConfigSettings WHERE Name='study';
INSERT INTO Config (ConfigID, Value) SELECT ID, 'false' FROM ConfigSettings WHERE Name='useConsent';

CREATE TABLE `consent_type` (
  `ConsentTypeID` int(2) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL DEFAULT "study_consent",
  `Label` varchar(255) NOT NULL DEFAULT "Consent to Study",
  CONSTRAINT `PK_consent_type` PRIMARY KEY (`ConsentTypeID`),
  CONSTRAINT `UK_consent_type_Name` UNIQUE KEY `Name` (`Name`),
  CONSTRAINT `UK_consent_type_Label` UNIQUE KEY `Label` (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `candidate_consent_type_rel` (
  `CandidateID` int(6) NOT NULL,
  `ConsentTypeID` int(2) NOT NULL,
  `Value` enum('yes', 'no', 'not_answered') DEFAULT NULL,
  `DateGiven` date DEFAULT NULL,
  `DateWithdrawn` date DEFAULT NULL,
  CONSTRAINT `PK_candidate_consent_type_rel` PRIMARY KEY (`CandidateID`,`ConsentTypeID`),
  CONSTRAINT `FK_candidate_consent_type_rel_CandidateID` FOREIGN KEY (`CandidateID`) REFERENCES `candidate` (`CandID`),
  CONSTRAINT `FK_candidate_consent_type_rel_ConsentTypeID` FOREIGN KEY (`ConsentTypeID`) REFERENCES `consent_type` (`ConsentTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `candidate_consent_history` (
  `CandidateConsentHistoryID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `CandidateID` int(6) NOT NULL,
  `ConsentTypeID` int(2) NOT NULL,
  `Value` enum('yes','no','not_answered') DEFAULT NULL,
  `DateGiven` date DEFAULT NULL,
  `DateWithdrawn` date DEFAULT NULL,
  `EntryStaff` varchar(255) DEFAULT NULL,
  `EntryDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `PK_candidate_consent_history` PRIMARY KEY (`CandidateConsentHistoryID`),
  CONSTAINT `UK_candidate_consent_history_CandidateConsentHistoryID` UNIQUE KEY `CandidateConsentHistoryID` (`CandidateConsentHistoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
