CREATE TABLE `parameter_type_permissions_rel` (
  `ParameterTypeID` int(10) unsigned NOT NULL,
  `permID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ParameterTypeID`,`permID`),
  KEY `FK_parameter_type_permissions_rel_perm` (`permID`),
  CONSTRAINT `FK_parameter_type_permissions_rel_perm` FOREIGN KEY (`permID`) REFERENCES `permissions` (`permID`),
  CONSTRAINT `FK_parameter_type_permissions_rel_test` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`)
)