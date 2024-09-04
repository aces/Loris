SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `physiological_coord_system`;
LOCK TABLES `physiological_coord_system` WRITE;
INSERT INTO `physiological_coord_system` (`PhysiologicalCoordSystemID`, `NameID`, `TypeID`, `UnitID`, `ModalityID`, `FilePath`) VALUES (1,1,1,1,4,NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
