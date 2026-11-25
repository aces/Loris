SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `biobank_container_shipment_rel`;
LOCK TABLES `biobank_container_shipment_rel` WRITE;
INSERT INTO `biobank_container_shipment_rel` (`ShipmentID`, `ContainerID`) VALUES (1,13);
INSERT INTO `biobank_container_shipment_rel` (`ShipmentID`, `ContainerID`) VALUES (2,14);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
