SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `biobank_specimen_type_unit_rel`;
LOCK TABLES `biobank_specimen_type_unit_rel` WRITE;
INSERT INTO `biobank_specimen_type_unit_rel` (`SpecimenTypeID`, `UnitID`) VALUES (1,1);
INSERT INTO `biobank_specimen_type_unit_rel` (`SpecimenTypeID`, `UnitID`) VALUES (2,2);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
