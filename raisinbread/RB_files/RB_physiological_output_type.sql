SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `physiological_output_type`;
LOCK TABLES `physiological_output_type` WRITE;
INSERT INTO `physiological_output_type` (`PhysiologicalOutputTypeID`, `OutputTypeName`, `OutputTypeDescription`) VALUES (1,'raw','raw dataset');
INSERT INTO `physiological_output_type` (`PhysiologicalOutputTypeID`, `OutputTypeName`, `OutputTypeDescription`) VALUES (2,'derivative','derivative/processed dataset');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
