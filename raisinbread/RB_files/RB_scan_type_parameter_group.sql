SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `scan_type_parameter_group`;
LOCK TABLES `scan_type_parameter_group` WRITE;
INSERT INTO `scan_type_parameter_group` (`ScanTypeParameterGroupID`, `ScanTypeParameterGroupName`) VALUES (1,'Default MRI protocol group');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
