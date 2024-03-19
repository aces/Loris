SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `consent_display_rel`;
LOCK TABLES `consent_display_rel` WRITE;
INSERT INTO `consent_display_rel` (`ConsentGroupID`, `CenterID`, `ConsentDisplayID`) VALUES (3,NULL,1);
INSERT INTO `consent_display_rel` (`ConsentGroupID`, `CenterID`, `ConsentDisplayID`) VALUES (2,NULL,2);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
