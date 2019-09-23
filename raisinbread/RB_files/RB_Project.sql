SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `Project`;
LOCK TABLES `Project` WRITE;
INSERT INTO `Project` (`ProjectID`, `Name`, `recruitmentTarget`) VALUES (1,'Pumpernickel',200);
INSERT INTO `Project` (`ProjectID`, `Name`, `recruitmentTarget`) VALUES (2,'Rye',150);
INSERT INTO `Project` (`ProjectID`, `Name`, `recruitmentTarget`) VALUES (3,'Challah',250);
INSERT INTO `Project` (`ProjectID`, `Name`, `recruitmentTarget`) VALUES (4,'DCP',0);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
