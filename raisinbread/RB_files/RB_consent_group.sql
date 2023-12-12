SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `consent_group`;
LOCK TABLES `consent_group` WRITE;
INSERT INTO `consent_group` (`ConsentGroupID`, `Name`, `Label`) VALUES (1,'study_consent_form','Study Information and Consent Form');
INSERT INTO `consent_group` (`ConsentGroupID`, `Name`, `Label`) VALUES (2,'bakery_consent_form','Bakery Information and Consent Form');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
