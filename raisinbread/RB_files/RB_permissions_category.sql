SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `permissions_category`;
LOCK TABLES `permissions_category` WRITE;
INSERT INTO `permissions_category` (`ID`, `Description`) VALUES (1,'Roles');
INSERT INTO `permissions_category` (`ID`, `Description`) VALUES (2,'Permission');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
