SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `ConfigMappings`;
LOCK TABLES `ConfigMappings` WRITE;
INSERT INTO `ConfigMappings` (`ID`, `ConfigID`, `Value`) VALUES (1,137,'Visit 1');
INSERT INTO `ConfigMappings` (`ID`, `ConfigID`, `Value`) VALUES (2,138,'Visit 2');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
