SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `biobank_specimen_pool_rel`;
LOCK TABLES `biobank_specimen_pool_rel` WRITE;
INSERT INTO `biobank_specimen_pool_rel` (`SpecimenID`, `PoolID`) VALUES (4,1);
INSERT INTO `biobank_specimen_pool_rel` (`SpecimenID`, `PoolID`) VALUES (5,1);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
