SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `biobank_specimen_preparation`;
LOCK TABLES `biobank_specimen_preparation` WRITE;
INSERT INTO `biobank_specimen_preparation` (`SpecimenID`, `SpecimenProtocolID`, `CenterID`, `ExaminerID`, `Date`, `Time`, `Comments`, `Data`) VALUES (2,4,2,18,'2018-03-26','10:30:00',NULL,'{\"3\":\"2018-03-26\",\"4\":\"10:20\"}');
INSERT INTO `biobank_specimen_preparation` (`SpecimenID`, `SpecimenProtocolID`, `CenterID`, `ExaminerID`, `Date`, `Time`, `Comments`, `Data`) VALUES (3,4,2,18,'2018-03-26','10:30:00',NULL,'{\"3\":\"2018-03-26\",\"4\":\"10:20\"}');
INSERT INTO `biobank_specimen_preparation` (`SpecimenID`, `SpecimenProtocolID`, `CenterID`, `ExaminerID`, `Date`, `Time`, `Comments`, `Data`) VALUES (8,4,3,9,'2016-08-15','10:00:00','Spun twice','{\"3\":\"2016-08-15\",\"4\":\"09:50\"}');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
