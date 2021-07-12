SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `consent`;
LOCK TABLES `consent` WRITE;
INSERT INTO `consent` (`ConsentID`, `Name`, `Label`, `ConsentGroupID`) VALUES (1,'study_consent','Consent to Study', '1');
INSERT INTO `consent` (`ConsentID`, `Name`, `Label`, `ConsentGroupID`) VALUES (2,'raisin_consent','Consent to Raisin', '2');
INSERT INTO `consent` (`ConsentID`, `Name`, `Label`, `ConsentGroupID`) VALUES (3,'bread_consent','Consent to Bread', '2');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
