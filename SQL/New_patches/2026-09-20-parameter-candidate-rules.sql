CREATE TABLE `parameter_candidate_rules` (
  `ParameterTypeID` int(10) unsigned NOT NULL,
  `ProjectID` int(10) unsigned NOT NULL,
  `Required` tinyint(1) NOT NULL DEFAULT 0,
  `ShowOnRegistration` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ParameterTypeID`, `ProjectID`),
  KEY `FK_parameter_candidate_rules_2` (`ProjectID`),
  CONSTRAINT `FK_parameter_candidate_rules_1` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`) ON DELETE CASCADE,
  CONSTRAINT `FK_parameter_candidate_rules_2` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='project-specific candidate parameter rules';
