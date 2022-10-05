SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `physiological_annotation_file_type`;
LOCK TABLES `physiological_annotation_file_type` WRITE;
INSERT INTO `physiological_annotation_file_type` (`FileType`, `Description`) VALUES ('json','JSON File Type, metadata for annotations');
INSERT INTO `physiological_annotation_file_type` (`FileType`, `Description`) VALUES ('tsv','TSV File Type, contains information about each annotation');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
