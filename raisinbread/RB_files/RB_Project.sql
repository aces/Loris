SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `Project`;
LOCK TABLES `Project` WRITE;
INSERT INTO `Project` (`ProjectID`, `Name`, `Alias`, `recruitmentTarget`) VALUES (1,'Pumpernickel','PUMP',200);
INSERT INTO `Project` (`ProjectID`, `Name`, `Alias`, `recruitmentTarget`) VALUES (2,'Rye','RYE',150);
INSERT INTO `Project` (`ProjectID`, `Name`, `Alias`, `recruitmentTarget`) VALUES (3,'Challah','CHA',250);
INSERT INTO `Project` (`ProjectID`, `Name`, `Alias`, `recruitmentTarget`) VALUES (4,'DCP','DCP',0);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
