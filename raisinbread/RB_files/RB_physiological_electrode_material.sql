SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `physiological_electrode_material`;
LOCK TABLES `physiological_electrode_material` WRITE;
INSERT INTO `physiological_electrode_material` (`PhysiologicalElectrodeMaterialID`, `ElectrodeMaterial`) VALUES (1,'Ag/AgCl');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
