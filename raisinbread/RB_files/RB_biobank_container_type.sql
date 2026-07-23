SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `biobank_container_type`;
LOCK TABLES `biobank_container_type` WRITE;
INSERT INTO `biobank_container_type` (`ContainerTypeID`, `Brand`, `ProductNumber`, `Label`, `Primary`, `ContainerCapacityID`, `ContainerDimensionID`) VALUES (1,'Brand','Product Number 1','Vial',1,1,1);
INSERT INTO `biobank_container_type` (`ContainerTypeID`, `Brand`, `ProductNumber`, `Label`, `Primary`, `ContainerCapacityID`, `ContainerDimensionID`) VALUES (2,'Brand','Product Number 2','Matrix Box',0,NULL,2);
INSERT INTO `biobank_container_type` (`ContainerTypeID`, `Brand`, `ProductNumber`, `Label`, `Primary`, `ContainerCapacityID`, `ContainerDimensionID`) VALUES (3,'Brand','Product Number 3','Rack',0,NULL,3);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
