SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `physiological_coord_system_unit`;
LOCK TABLES `physiological_coord_system_unit` WRITE;
INSERT INTO `physiological_coord_system_unit` (`PhysiologicalCoordSystemUnitID`, `Name`, `Symbol`) VALUES (1,'Not registered',NULL);
INSERT INTO `physiological_coord_system_unit` (`PhysiologicalCoordSystemUnitID`, `Name`, `Symbol`) VALUES (2,'Millimeter','mm');
INSERT INTO `physiological_coord_system_unit` (`PhysiologicalCoordSystemUnitID`, `Name`, `Symbol`) VALUES (3,'Centimeter','cm');
INSERT INTO `physiological_coord_system_unit` (`PhysiologicalCoordSystemUnitID`, `Name`, `Symbol`) VALUES (4,'Meter','m');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
