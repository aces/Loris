SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `biobank_specimen_protocol`;
LOCK TABLES `biobank_specimen_protocol` WRITE;
INSERT INTO `biobank_specimen_protocol` (`SpecimenProtocolID`, `Label`, `SpecimenProcessID`) VALUES (1,'Blood Collection',1);
INSERT INTO `biobank_specimen_protocol` (`SpecimenProtocolID`, `Label`, `SpecimenProcessID`) VALUES (2,'Blood Preparation',2);
INSERT INTO `biobank_specimen_protocol` (`SpecimenProtocolID`, `Label`, `SpecimenProcessID`) VALUES (3,'Serum Collection',1);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
