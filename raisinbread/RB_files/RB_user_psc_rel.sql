SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `user_psc_rel`;
LOCK TABLES `user_psc_rel` WRITE;
INSERT INTO `user_psc_rel` (`UserID`, `CenterID`) VALUES (1,1);
INSERT INTO `user_psc_rel` (`UserID`, `CenterID`) VALUES (1,2);
INSERT INTO `user_psc_rel` (`UserID`, `CenterID`) VALUES (1,3);
INSERT INTO `user_psc_rel` (`UserID`, `CenterID`) VALUES (1,4);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
