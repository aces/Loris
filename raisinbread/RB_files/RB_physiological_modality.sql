SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `physiological_modality`;
LOCK TABLES `physiological_modality` WRITE;
INSERT INTO `physiological_modality` (`PhysiologicalModalityID`, `PhysiologicalModality`) VALUES (1,'eeg');
INSERT INTO `physiological_modality` (`PhysiologicalModalityID`, `PhysiologicalModality`) VALUES (3,'ieeg');
INSERT INTO `physiological_modality` (`PhysiologicalModalityID`, `PhysiologicalModality`) VALUES (2,'meg');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
