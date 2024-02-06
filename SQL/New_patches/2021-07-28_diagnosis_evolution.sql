CREATE TABLE `diagnosis_evolution` (
  `DxEvolutionID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `ProjectID` int(10) unsigned NOT NULL,
  `visitLabel` varchar(255) DEFAULT NULL,
  `instrumentName` varchar(255) DEFAULT NULL,
  `sourceField` varchar(255) DEFAULT NULL,
  `orderNumber` int(10) unsigned DEFAULT NULL,
  CONSTRAINT `PK_diagnosis_evolution` PRIMARY KEY (`DxEvolutionID`),
  CONSTRAINT `UK_diagnosis_evolution_Name` UNIQUE KEY `Name` (`Name`),
  CONSTRAINT `FK_diagnosis_evolution_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_diagnosis_evolution_instrumentName` FOREIGN KEY (`instrumentName`) REFERENCES `test_names` (`Test_name`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `candidate_diagnosis_evolution_rel` (
  `CandID` int(6) NOT NULL,
  `DxEvolutionID` int(10) unsigned NOT NULL,
  `Diagnosis` text DEFAULT NULL,
  `Confirmed` enum('Y', 'N') DEFAULT NULL,
  `LastUpdate` datetime NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  CONSTRAINT `PK_candidate_diagnosis_evolution_rel` PRIMARY KEY (`CandID`, `DxEvolutionID`),
  CONSTRAINT `FK_candidate_diagnosis_evolution_rel_CandID` FOREIGN KEY (`CandID`) REFERENCES `candidate` (`CandID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_candidate_diagnosis_evolution_rel_DxEvolutionID` FOREIGN KEY (`DxEvolutionID`) REFERENCES `diagnosis_evolution` (`DxEvolutionID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
