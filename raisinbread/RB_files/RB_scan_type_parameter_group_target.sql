SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `scan_type_parameter_group_target`;
LOCK TABLES `scan_type_parameter_group_target` WRITE;
INSERT INTO `scan_type_parameter_group_target` (`ScanTypeParameterGroupTargetID`, `ScanTypeParameterGroupID`, `ProjectID`, `SubprojectID`, `Visit_label`, `ScannerID`, `CenterID`) VALUES (1,1,NULL,NULL,NULL,NULL,NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
