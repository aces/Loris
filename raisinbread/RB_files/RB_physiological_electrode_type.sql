SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `physiological_electrode_type`;
LOCK TABLES `physiological_electrode_type` WRITE;
INSERT INTO `physiological_electrode_type` (`PhysiologicalElectrodeTypeID`, `ElectrodeType`) VALUES (1,'active/cap');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
