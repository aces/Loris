SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `biobank_pool`;
LOCK TABLES `biobank_pool` WRITE;
INSERT INTO `biobank_pool` (`PoolID`, `Label`, `Quantity`, `UnitID`, `Date`, `Time`) VALUES (1,'MTL002-V1-BL-POOL',1.000,1,'2016-08-15','09:30:00');
INSERT INTO `biobank_pool` (`PoolID`, `Label`, `Quantity`, `UnitID`, `Date`, `Time`) VALUES (2,'OTT166-V1-SE-POOL',400.000,2,'2016-08-15','10:30:00');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
