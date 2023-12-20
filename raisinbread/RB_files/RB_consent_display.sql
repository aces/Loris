SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `consent_display`;
LOCK TABLES `consent_display` WRITE;
INSERT INTO `consent_display` (`ConsentDisplayID`, `Title`, `Media`, `Description`, `training`, `Reset_period_days`) VALUES (1,'Sourdough eConsent',NULL,'Welcome to the sourdough eConsent form','Sourdough_Econsent',5);
INSERT INTO `consent_display` (`ConsentDisplayID`, `Title`, `Media`, `Description`, `training`, `Reset_period_days`) VALUES (2,'Bakery eConsent',NULL,'Welcome to the simple eConsent form. This paragraph can give information on what the participant is consenting to. It can also be written as multiple paragraphs.',NULL,NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
