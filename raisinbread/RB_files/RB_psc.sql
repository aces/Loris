SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `psc`;
LOCK TABLES `psc` WRITE;
INSERT INTO `psc` (`CenterID`, `Name`, `PSCArea`, `Address`, `City`, `StateID`, `ZIP`, `Phone1`, `Phone2`, `Contact1`, `Contact2`, `Alias`, `MRI_alias`, `Account`, `Study_site`) VALUES (1,'Data Coordinating Center','','','',0,'','','','','','DCC','DCC','','Y');
INSERT INTO `psc` (`CenterID`, `Name`, `PSCArea`, `Address`, `City`, `StateID`, `ZIP`, `Phone1`, `Phone2`, `Contact1`, `Contact2`, `Alias`, `MRI_alias`, `Account`, `Study_site`) VALUES (2,'Montreal',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'MTL','MTL',NULL,'Y');
INSERT INTO `psc` (`CenterID`, `Name`, `PSCArea`, `Address`, `City`, `StateID`, `ZIP`, `Phone1`, `Phone2`, `Contact1`, `Contact2`, `Alias`, `MRI_alias`, `Account`, `Study_site`) VALUES (3,'Ottawa',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'OTT','OTT',NULL,'Y');
INSERT INTO `psc` (`CenterID`, `Name`, `PSCArea`, `Address`, `City`, `StateID`, `ZIP`, `Phone1`, `Phone2`, `Contact1`, `Contact2`, `Alias`, `MRI_alias`, `Account`, `Study_site`) VALUES (4,'Rome',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ROM','ROM',NULL,'Y');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
