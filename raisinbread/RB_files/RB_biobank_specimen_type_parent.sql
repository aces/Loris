SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `biobank_specimen_type_parent`;
LOCK TABLES `biobank_specimen_type_parent` WRITE;
INSERT INTO `biobank_specimen_type_parent` (`SpecimenTypeID`, `ParentSpecimenTypeID`) VALUES (2,1);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
