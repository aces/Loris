SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `shipment_type`;
LOCK TABLES `shipment_type` WRITE;
INSERT INTO `shipment_type` (`ShipmentTypeID`, `Label`) VALUES (3,'Dry Shipper');
INSERT INTO `shipment_type` (`ShipmentTypeID`, `Label`) VALUES (1,'Gel Pack Container');
INSERT INTO `shipment_type` (`ShipmentTypeID`, `Label`) VALUES (2,'Insulated Foam Box');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
