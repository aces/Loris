SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `shipment`;
LOCK TABLES `shipment` WRITE;
INSERT INTO `shipment` (`ShipmentID`, `Barcode`, `ShipmentTypeID`, `DestinationCenterID`) VALUES (1,'SHIP-ROM-001',3,2);
INSERT INTO `shipment` (`ShipmentID`, `Barcode`, `ShipmentTypeID`, `DestinationCenterID`) VALUES (2,'SHIP-ROM-002',3,2);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
