SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `user_project_rel`;
LOCK TABLES `user_project_rel` WRITE;
INSERT INTO `user_project_rel` (`UserID`, `ProjectID`) VALUES (1,1);
INSERT INTO `user_project_rel` (`UserID`, `ProjectID`) VALUES (1,2);
INSERT INTO `user_project_rel` (`UserID`, `ProjectID`) VALUES (1,3);
INSERT INTO `user_project_rel` (`UserID`, `ProjectID`) VALUES (1,4);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
