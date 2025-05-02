SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `genotyping_platform`;
LOCK TABLES `genotyping_platform` WRITE;
INSERT INTO `genotyping_platform` (`PlatformID`, `Name`, `Description`, `TechnologyType`, `Provider`) VALUES (1,'Custom CNV array','A platform inserted for demo purposes',NULL,NULL);
INSERT INTO `genotyping_platform` (`PlatformID`, `Name`, `Description`, `TechnologyType`, `Provider`) VALUES (2,'Custom SNP array','A platform inserted for demo purposes',NULL,NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
