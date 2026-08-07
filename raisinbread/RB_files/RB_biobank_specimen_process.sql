SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `biobank_specimen_process`;
LOCK TABLES `biobank_specimen_process` WRITE;
INSERT INTO `biobank_specimen_process` (`SpecimenProcessID`, `Label`) VALUES (2,'Analysis');
INSERT INTO `biobank_specimen_process` (`SpecimenProcessID`, `Label`) VALUES (1,'Collection');
INSERT INTO `biobank_specimen_process` (`SpecimenProcessID`, `Label`) VALUES (3,'Preparation');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
