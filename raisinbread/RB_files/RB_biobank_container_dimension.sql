SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `biobank_container_dimension`;
LOCK TABLES `biobank_container_dimension` WRITE;
INSERT INTO `biobank_container_dimension` (`ContainerDimensionID`, `X`, `XNumerical`, `Y`, `YNumerical`, `Z`, `ZNumerical`) VALUES (1,1,1,1,1,0,0);
INSERT INTO `biobank_container_dimension` (`ContainerDimensionID`, `X`, `XNumerical`, `Y`, `YNumerical`, `Z`, `ZNumerical`) VALUES (2,10,1,10,0,1,0);
INSERT INTO `biobank_container_dimension` (`ContainerDimensionID`, `X`, `XNumerical`, `Y`, `YNumerical`, `Z`, `ZNumerical`) VALUES (3,1,0,5,0,1,0);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
