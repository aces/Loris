SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `Project`;
LOCK TABLES `Project` WRITE;
INSERT INTO `Project` (`ProjectID`, `Name`, `Alias`, `recruitmentTarget`, `showSummaryOnLogin`) VALUES (1,'Pumpernickel','PUMP',200,1);
INSERT INTO `Project` (`ProjectID`, `Name`, `Alias`, `recruitmentTarget`, `showSummaryOnLogin`) VALUES (2,'Rye','RYE',150,1);
INSERT INTO `Project` (`ProjectID`, `Name`, `Alias`, `recruitmentTarget`, `showSummaryOnLogin`) VALUES (3,'Challah','CHA',250,1);
INSERT INTO `Project` (`ProjectID`, `Name`, `Alias`, `recruitmentTarget`, `showSummaryOnLogin`) VALUES (4,'DCP','DCP',0,0);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
