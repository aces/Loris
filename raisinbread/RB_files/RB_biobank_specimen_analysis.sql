SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `biobank_specimen_analysis`;
LOCK TABLES `biobank_specimen_analysis` WRITE;
INSERT INTO `biobank_specimen_analysis` (`SpecimenID`, `SpecimenProtocolID`, `CenterID`, `ExaminerID`, `Date`, `Time`, `Comments`, `Data`) VALUES (2,5,2,22,'2018-04-02','13:00:00',NULL,'{\"5\":\"8\"}');
INSERT INTO `biobank_specimen_analysis` (`SpecimenID`, `SpecimenProtocolID`, `CenterID`, `ExaminerID`, `Date`, `Time`, `Comments`, `Data`) VALUES (6,2,2,22,'2016-08-22','15:30:00',NULL,'{\"5\":\"12\"}');
INSERT INTO `biobank_specimen_analysis` (`SpecimenID`, `SpecimenProtocolID`, `CenterID`, `ExaminerID`, `Date`, `Time`, `Comments`, `Data`) VALUES (9,2,3,9,'2016-08-15','15:00:00','Above threshold, sample discarded','{\"5\":\"95\"}');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
