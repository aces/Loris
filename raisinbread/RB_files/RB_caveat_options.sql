SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `caveat_options`;
LOCK TABLES `caveat_options` WRITE;
INSERT INTO `caveat_options` (`ID`, `Description`) VALUES (1,'Met exclusionary criteria after enrollment in study');
INSERT INTO `caveat_options` (`ID`, `Description`) VALUES (2,'Proband diagnosed positive');
INSERT INTO `caveat_options` (`ID`, `Description`) VALUES (3,'Other');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
