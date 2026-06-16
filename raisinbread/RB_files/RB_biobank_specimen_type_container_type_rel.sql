SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `biobank_specimen_type_container_type_rel`;
LOCK TABLES `biobank_specimen_type_container_type_rel` WRITE;
INSERT INTO `biobank_specimen_type_container_type_rel` (`SpecimenTypeID`, `ContainerTypeID`) VALUES (1,1);
INSERT INTO `biobank_specimen_type_container_type_rel` (`SpecimenTypeID`, `ContainerTypeID`) VALUES (2,1);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
