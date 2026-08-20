SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `biobank_specimen_type`;
LOCK TABLES `biobank_specimen_type` WRITE;
INSERT INTO `biobank_specimen_type` (`SpecimenTypeID`, `Label`, `FreezeThaw`) VALUES (1,'Blood',0);
INSERT INTO `biobank_specimen_type` (`SpecimenTypeID`, `Label`, `FreezeThaw`) VALUES (2,'Serum',1);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
