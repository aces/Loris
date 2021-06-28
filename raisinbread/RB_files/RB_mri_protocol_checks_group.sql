SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `mri_protocol_checks_group`;
LOCK TABLES `mri_protocol_checks_group` WRITE;
INSERT INTO `mri_protocol_checks_group` (`MriProtocolChecksGroupID`, `Name`) VALUES (1,'Default MRI protocol checks group');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
