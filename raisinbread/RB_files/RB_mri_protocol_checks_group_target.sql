SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `mri_protocol_checks_group_target`;
LOCK TABLES `mri_protocol_checks_group_target` WRITE;
INSERT INTO `mri_protocol_checks_group_target` (`MriProtocolChecksGroupTargetID`, `MriProtocolChecksGroupID`, `ProjectID`, `SubprojectID`, `Visit_label`) VALUES(1, 1, NULL, NULL, NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
