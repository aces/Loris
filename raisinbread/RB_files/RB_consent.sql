SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `consent`;
LOCK TABLES `consent` WRITE;
INSERT INTO `consent` (`ConsentID`, `Name`, `Label`) VALUES (1,'study_consent','Consent to Study');
INSERT INTO `consent` (`ConsentID`, `Name`, `Label`) VALUES (2,'raisin_consent','Consent to Raisin');
INSERT INTO `consent` (`ConsentID`, `Name`, `Label`) VALUES (3,'bread_consent','Consent to Bread');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
