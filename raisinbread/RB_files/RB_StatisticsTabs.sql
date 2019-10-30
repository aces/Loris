SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `StatisticsTabs`;
LOCK TABLES `StatisticsTabs` WRITE;
INSERT INTO `StatisticsTabs` (`ID`, `ModuleName`, `SubModuleName`, `Description`, `OrderNo`) VALUES (1,'statistics','stats_general','General Description',1);
INSERT INTO `StatisticsTabs` (`ID`, `ModuleName`, `SubModuleName`, `Description`, `OrderNo`) VALUES (2,'statistics','stats_demographic','Demographic Statistics',2);
INSERT INTO `StatisticsTabs` (`ID`, `ModuleName`, `SubModuleName`, `Description`, `OrderNo`) VALUES (3,'statistics','stats_behavioural','Behavioural Statistics',3);
INSERT INTO `StatisticsTabs` (`ID`, `ModuleName`, `SubModuleName`, `Description`, `OrderNo`) VALUES (4,'statistics','stats_MRI','Imaging Statistics',4);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
