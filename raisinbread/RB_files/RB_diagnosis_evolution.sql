/*!999999\- enable the sandbox mode */ 
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `diagnosis_evolution`;
LOCK TABLES `diagnosis_evolution` WRITE;
INSERT INTO `diagnosis_evolution` (`DxEvolutionID`, `Name`, `ProjectID`, `visitLabel`, `instrumentName`, `sourceField`, `orderNumber`) VALUES (1,'TestingTrajectory',3,'V1','bmi','bmi',1);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
