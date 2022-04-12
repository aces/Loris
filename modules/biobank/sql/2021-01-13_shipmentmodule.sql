DROP TABLE IF EXISTS `biobank_container_shipment_rel`;
DROP TABLE IF EXISTS `shipment_log`;
DROP TABLE IF EXISTS `shipment`;
DROP TABLE IF EXISTS `shipment_type`;
DROP TABLE IF EXISTS `shipment_status`;

CREATE TABLE `shipment_status` (
  `StatusID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(255) NOT NULL,
  CONSTRAINT `PK_shipment_status` PRIMARY KEY (`StatusID`),
  CONSTRAINT `UK_shipment_status_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;

CREATE TABLE `shipment_type` (
  `ShipmentTypeID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(255) NOT NULL,
  CONSTRAINT `PK_shipment_type` PRIMARY KEY (`ShipmentTypeID`),
  CONSTRAINT `UK_shipment_type_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;

CREATE TABLE `shipment` (
  `ShipmentID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Barcode` varchar(50) NOT NULL,
  `ShipmentTypeID` integer unsigned NOT NULL,
  `DestinationCenterID` integer unsigned NOT NULL,
  CONSTRAINT `PK_shipment` PRIMARY KEY (`ShipmentID`),
  CONSTRAINT `FK_shipment_ShipmentTypeID`
    FOREIGN KEY (`ShipmentTypeID`) REFERENCES `shipment_type`(`ShipmentTypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_shipment_DestinationCentrID`
    FOREIGN KEY (`DestinationCenterID`) REFERENCES `psc`(`CenterID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `UK_shipment_Barcode` UNIQUE (`Barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;

/* Potentially add UK between Shipment ID and StatusID? */
CREATE TABLE `shipment_log` (
  `ShipmentID` integer unsigned NOT NULL,
  `CenterID` integer unsigned NOT NULL,
  `StatusID` integer unsigned NOT NULL,
  `Date` date NOT NULL,
  `Time` time NOT NULL,
  `UserID` integer unsigned NOT NULL,
  `Temperature` decimal(5, 2) NOT NULL,
  `DateTimeCreate` datetime NOT NULL DEFAULT NOW(),
  `DateTimeUpdate` datetime NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  `Comments` varchar(500),
  CONSTRAINT `FK_shipment_log_CenterID`
    FOREIGN KEY (`CenterID`) REFERENCES `psc`(`CenterID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_shipment_log_StatusID`
    FOREIGN KEY (`StatusID`) REFERENCES `shipment_status`(`StatusID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_shipment_log_UserID`
    FOREIGN KEY (`UserID`) REFERENCES `users`(`ID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `UK_shipment_log_ShipmentID_StatusID` UNIQUE (`ShipmentID`, `CenterID`, `StatusID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;

CREATE TABLE `biobank_container_shipment_rel` (
  `ShipmentID` integer unsigned NOT NULL,
  `ContainerID` integer unsigned NOT NULL,
  CONSTRAINT `FK_shipment_log_ShipmentID`
    FOREIGN KEY (`ShipmentID`) REFERENCES `shipment`(`ShipmentID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_shipment_log_ContainerID`
    FOREIGN KEY (`ContainerID`) REFERENCES `biobank_container`(`ContainerID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `UK_biobank_container_shipment_rel_ShipmentID_ContainerID` UNIQUE (`ShipmentID`, `ContainerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;

INSERT INTO `shipment_status` (Label)
  VALUES ('created'),
         ('shipped'),
         ('received'),
         ('cancelled'),
         ('returned')
;

INSERT INTO `shipment_type` (Label)
  VALUES ('Credo Box'),
         ('Dry Ice'),
         ('Ice'),
         ('Envelope'),
         ('Styrofoam/Cardboard Box')
;
