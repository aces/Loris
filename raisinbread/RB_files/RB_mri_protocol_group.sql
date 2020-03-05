SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `mri_protocol_group`;
LOCK TABLES `mri_protocol_group` WRITE;
INSERT INTO `mri_protocol_group` (`MriProtocolGroupID`, `Name`) VALUES(1, 'Default MRI protocol group');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
