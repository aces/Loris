SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `biobank_specimen_protocol_type_rel`;
LOCK TABLES `biobank_specimen_protocol_type_rel` WRITE;
INSERT INTO `biobank_specimen_protocol_type_rel` (`SpecimenProtocolID`, `SpecimenTypeID`) VALUES (1,1);
INSERT INTO `biobank_specimen_protocol_type_rel` (`SpecimenProtocolID`, `SpecimenTypeID`) VALUES (2,1);
INSERT INTO `biobank_specimen_protocol_type_rel` (`SpecimenProtocolID`, `SpecimenTypeID`) VALUES (3,2);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
