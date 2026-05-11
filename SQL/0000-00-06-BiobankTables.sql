--
-- Biobank Schema
--

-- Table structure for table `biobank_unit`
CREATE TABLE `biobank_unit` (
  `UnitID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(20) NOT NULL,
  PRIMARY KEY (`UnitID`),
  UNIQUE KEY `Label` (`Label`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_container_dimension`
CREATE TABLE `biobank_container_dimension` (
  `ContainerDimensionID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `X` int(10) unsigned NOT NULL,
  `XNumerical` tinyint(1) DEFAULT NULL,
  `Y` int(10) unsigned NOT NULL,
  `YNumerical` tinyint(1) DEFAULT NULL,
  `Z` int(10) unsigned NOT NULL,
  `ZNumerical` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ContainerDimensionID`),
  UNIQUE KEY `UK_biobank_container_dimension_X_Y_Z` (`X`,`Y`,`Z`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_container_capacity`
CREATE TABLE `biobank_container_capacity` (
  `ContainerCapacityID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Quantity` decimal(10,3) NOT NULL,
  `UnitID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ContainerCapacityID`),
  UNIQUE KEY `UK_biobank_container_capacity_Quantity_UnitID` (`Quantity`,`UnitID`),
  KEY `FK_biobank_container_capacity_UnitID` (`UnitID`),
  CONSTRAINT `FK_biobank_container_capacity_UnitID` FOREIGN KEY (`UnitID`) REFERENCES `biobank_unit` (`UnitID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_container_status`
CREATE TABLE `biobank_container_status` (
  `ContainerStatusID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(40) NOT NULL,
  PRIMARY KEY (`ContainerStatusID`),
  UNIQUE KEY `UK_biobank_container_status_Label` (`Label`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_container_type`
CREATE TABLE `biobank_container_type` (
  `ContainerTypeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Brand` varchar(50) NOT NULL,
  `ProductNumber` varchar(50) NOT NULL,
  `Label` varchar(40) NOT NULL,
  `Primary` tinyint(1) DEFAULT NULL,
  `ContainerCapacityID` int(10) unsigned DEFAULT NULL,
  `ContainerDimensionID` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`ContainerTypeID`),
  UNIQUE KEY `UK_biobank_container_type_Brand_ProductNumber` (`Brand`,`ProductNumber`),
  UNIQUE KEY `UK_biobank_container_type_Label` (`Label`),
  KEY `FK_biobank_container_type_CapacityID` (`ContainerCapacityID`),
  KEY `FK_biobank_container_type_DimensionID` (`ContainerDimensionID`),
  KEY `idx_biobank_container_type_primary` (`Primary`),
  CONSTRAINT `FK_biobank_container_type_CapacityID` FOREIGN KEY (`ContainerCapacityID`) REFERENCES `biobank_container_capacity` (`ContainerCapacityID`),
  CONSTRAINT `FK_biobank_container_type_DimensionID` FOREIGN KEY (`ContainerDimensionID`) REFERENCES `biobank_container_dimension` (`ContainerDimensionID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_container`
CREATE TABLE `biobank_container` (
  `ContainerID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Barcode` varchar(40) NOT NULL,
  `ContainerTypeID` int(10) unsigned NOT NULL,
  `Temperature` decimal(5,2) NOT NULL DEFAULT 20.00,
  `ContainerStatusID` int(10) unsigned NOT NULL,
  `CenterID` int(10) unsigned DEFAULT NULL,
  `LotNumber` varchar(40) DEFAULT NULL,
  `ExpirationDate` date DEFAULT NULL,
  `Comments` varchar(255) DEFAULT NULL,
  `DateTimeCreate` datetime NOT NULL DEFAULT current_timestamp(),
  `DateTimeUpdate` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`ContainerID`),
  UNIQUE KEY `UK_biobank_container_Barcode` (`Barcode`),
  KEY `FK_biobank_container_ContainerTypeID` (`ContainerTypeID`),
  KEY `FK_biobank_container_ContainerStatusID` (`ContainerStatusID`),
  KEY `FK_biobank_container_CurrentCenterID` (`CenterID`),
  CONSTRAINT `FK_biobank_container_CenterID` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`) ON UPDATE CASCADE,
  CONSTRAINT `FK_biobank_container_ContainerStatusID` FOREIGN KEY (`ContainerStatusID`) REFERENCES `biobank_container_status` (`ContainerStatusID`),
  CONSTRAINT `FK_biobank_container_ContainerTypeID` FOREIGN KEY (`ContainerTypeID`) REFERENCES `biobank_container_type` (`ContainerTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=154926 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_container_parent`
CREATE TABLE `biobank_container_parent` (
  `ContainerID` int(10) unsigned NOT NULL,
  `ParentContainerID` int(10) unsigned NOT NULL,
  `Coordinate` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`ContainerID`),
  UNIQUE KEY `UK_biobank_container_parent_ParentContainerID_Coordinate` (`ParentContainerID`,`Coordinate`),
  CONSTRAINT `FK_biobank_container_parent_ContainerID` FOREIGN KEY (`ContainerID`) REFERENCES `biobank_container` (`ContainerID`) ON DELETE CASCADE,
  CONSTRAINT `FK_biobank_container_parent_ParentContainerID` FOREIGN KEY (`ParentContainerID`) REFERENCES `biobank_container` (`ContainerID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_specimen_type`
CREATE TABLE `biobank_specimen_type` (
  `SpecimenTypeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(50) NOT NULL,
  `FreezeThaw` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`SpecimenTypeID`),
  UNIQUE KEY `UK_biobank_specimen_type_Label` (`Label`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_specimen_type_unit_rel`
CREATE TABLE `biobank_specimen_type_unit_rel` (
  `SpecimenTypeID` int(10) unsigned NOT NULL,
  `UnitID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`SpecimenTypeID`,`UnitID`),
  KEY `FK_biobank_specimen_type_unit_rel_SourceID` (`UnitID`),
  CONSTRAINT `FK_biobank_specimen_type_unit_rel_SourceID` FOREIGN KEY (`UnitID`) REFERENCES `biobank_unit` (`UnitID`),
  CONSTRAINT `FK_biobank_specimen_type_unit_rel_TypeID` FOREIGN KEY (`SpecimenTypeID`) REFERENCES `biobank_specimen_type` (`SpecimenTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_specimen_type_container_type_rel`
CREATE TABLE `biobank_specimen_type_container_type_rel` (
  `SpecimenTypeID` int(10) unsigned NOT NULL,
  `ContainerTypeID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`SpecimenTypeID`,`ContainerTypeID`),
  KEY `FK_biobank_validate_identifier_ContainerTypeID` (`ContainerTypeID`),
  CONSTRAINT `FK_biobank_specimen_type_container_type_rel_SpecimenTypeID` FOREIGN KEY (`SpecimenTypeID`) REFERENCES `biobank_specimen_type` (`SpecimenTypeID`),
  CONSTRAINT `FK_biobank_validate_identifier_ContainerTypeID` FOREIGN KEY (`ContainerTypeID`) REFERENCES `biobank_container_type` (`ContainerTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Table structure for table `biobank_specimen_type_parent`
CREATE TABLE `biobank_specimen_type_parent` (
  `SpecimenTypeID` int(10) unsigned NOT NULL,
  `ParentSpecimenTypeID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`SpecimenTypeID`,`ParentSpecimenTypeID`),
  KEY `FK_biobank_specimen_type_parent_ParentSpecimenTypeID` (`ParentSpecimenTypeID`),
  CONSTRAINT `FK_biobank_specimen_type_parent_ParentSpecimenTypeID` FOREIGN KEY (`ParentSpecimenTypeID`) REFERENCES `biobank_specimen_type` (`SpecimenTypeID`),
  CONSTRAINT `FK_biobank_specimen_type_parent_SpecimenTypeID` FOREIGN KEY (`SpecimenTypeID`) REFERENCES `biobank_specimen_type` (`SpecimenTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_specimen_process`
CREATE TABLE `biobank_specimen_process` (
  `SpecimenProcessID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(50) NOT NULL,
  PRIMARY KEY (`SpecimenProcessID`),
  UNIQUE KEY `UK_biobank_specimen_process_Label` (`Label`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table structure for table `biobank_specimen_attribute_datatype`
CREATE TABLE `biobank_specimen_attribute_datatype` (
  `DatatypeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Datatype` varchar(20) NOT NULL,
  PRIMARY KEY (`DatatypeID`),
  UNIQUE KEY `Datatype` (`Datatype`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_specimen_attribute`
CREATE TABLE `biobank_specimen_attribute` (
  `SpecimenAttributeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(255) NOT NULL,
  `DatatypeID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`SpecimenAttributeID`),
  UNIQUE KEY `UK_biobank_specimen_attribute_Label` (`Label`),
  KEY `FK_biobank_specimen_attribute_DatatypeID` (`DatatypeID`),
  CONSTRAINT `FK_biobank_specimen_attribute_DatatypeID` FOREIGN KEY (`DatatypeID`) REFERENCES `biobank_specimen_attribute_datatype` (`DatatypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=180 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_specimen_protocol`
CREATE TABLE `biobank_specimen_protocol` (
  `SpecimenProtocolID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(100) NOT NULL,
  `SpecimenProcessID` int(10) unsigned NOT NULL,
  `SpecimenTypeID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`SpecimenProtocolID`),
  UNIQUE KEY `UK_biobank_specimen_protocol_Label_SpecimenProcessID` (`Label`,`SpecimenProcessID`),
  KEY `FK_biobank_specimen_protocol_SpecimenProcessID` (`SpecimenProcessID`),
  KEY `FK_biobank_specimen_protocol_SpecimenTypeID` (`SpecimenTypeID`),
  CONSTRAINT `FK_biobank_specimen_protocol_SpecimenProcessID` FOREIGN KEY (`SpecimenProcessID`) REFERENCES `biobank_specimen_process` (`SpecimenProcessID`),
  CONSTRAINT `FK_biobank_specimen_protocol_SpecimenTypeID` FOREIGN KEY (`SpecimenTypeID`) REFERENCES `biobank_specimen_type` (`SpecimenTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_specimen_protocol_attribute_rel`
CREATE TABLE `biobank_specimen_protocol_attribute_rel` (
  `SpecimenProtocolID` int(10) unsigned NOT NULL,
  `SpecimenAttributeID` int(10) unsigned NOT NULL,
  `Required` tinyint(1) DEFAULT NULL,
  `showInDataTable` tinyint(1) DEFAULT NULL,
  `OrderIndex` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`SpecimenProtocolID`,`SpecimenAttributeID`),
  UNIQUE KEY `UK_SpecimenProtocolId_OrderIndex` (`SpecimenProtocolID`, `OrderIndex`),
  KEY `FK_biobank_specimen_protocol_attribute_rel_SpecimenAttributeID` (`SpecimenAttributeID`),
  CONSTRAINT `FK_biobank_specimen_protocol_attribute__rel_SpecimenProtocolID` FOREIGN KEY (`SpecimenProtocolID`) REFERENCES `biobank_specimen_protocol` (`SpecimenProtocolID`),
  CONSTRAINT `FK_biobank_specimen_protocol_attribute_rel_SpecimenAttributeID` FOREIGN KEY (`SpecimenAttributeID`) REFERENCES `biobank_specimen_attribute` (`SpecimenAttributeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_specimen`
CREATE TABLE `biobank_specimen` (
  `SpecimenID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ContainerID` int(10) unsigned NOT NULL,
  `SpecimenTypeID` int(10) unsigned NOT NULL,
  `Quantity` decimal(10,3) NOT NULL,
  `UnitID` int(10) unsigned NOT NULL,
  `SessionID` int(10) unsigned NOT NULL,
  `SampleNumber` int(11) NOT NULL,
  PRIMARY KEY (`SpecimenID`),
  UNIQUE KEY `UK_biobank_specimen_ContainerID` (`ContainerID`),
  KEY `FK_biobank_specimen_SpecimenTypeID` (`SpecimenTypeID`),
  KEY `FK_biobank_specimen_UnitID` (`UnitID`),
  KEY `FK_biobank_specimen_SessionID` (`SessionID`),
  CONSTRAINT `FK_biobank_specimen_ContainerID` FOREIGN KEY (`ContainerID`) REFERENCES `biobank_container` (`ContainerID`),
  CONSTRAINT `FK_biobank_specimen_SessionID` FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`),
  CONSTRAINT `FK_biobank_specimen_SpecimenTypeID` FOREIGN KEY (`SpecimenTypeID`) REFERENCES `biobank_specimen_type` (`SpecimenTypeID`),
  CONSTRAINT `FK_biobank_specimen_UnitID` FOREIGN KEY (`UnitID`) REFERENCES `biobank_unit` (`UnitID`)
) ENGINE=InnoDB AUTO_INCREMENT=153402 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_specimen_freezethaw`
CREATE TABLE `biobank_specimen_freezethaw` (
  `SpecimenID` int(10) unsigned NOT NULL,
  `FreezeThawCycle` int(10) unsigned NOT NULL,
  PRIMARY KEY (`SpecimenID`),
  CONSTRAINT `FK_biobank_specimen_freezethaw_SpecimenID` FOREIGN KEY (`SpecimenID`) REFERENCES `biobank_specimen` (`SpecimenID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Table structure for table `biobank_specimen_collection`
CREATE TABLE `biobank_specimen_collection` (
  `SpecimenID` int(10) unsigned NOT NULL,
  `SpecimenProtocolID` int(10) unsigned NOT NULL,
  `Quantity` decimal(10,3) NOT NULL,
  `UnitID` int(10) unsigned NOT NULL,
  `CenterID` int(10) unsigned NOT NULL,
  `ExaminerID` int(10) unsigned NOT NULL,
  `Date` date NOT NULL,
  `Time` time NOT NULL,
  `Comments` varchar(500) DEFAULT NULL,
  `Data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`SpecimenID`),
  KEY `FK_biobank_specimen_collection_SpecimenProtocolID` (`SpecimenProtocolID`),
  KEY `FK_biobank_specimen_collection_UnitID` (`UnitID`),
  KEY `FK_biobank_specimen_collection_CenterID` (`CenterID`),
  KEY `FK_biobank_specimen_collection_ExaminerID` (`ExaminerID`),
  CONSTRAINT `FK_biobank_specimen_collection_CenterID` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`),
  CONSTRAINT `FK_biobank_specimen_collection_ExaminerID` FOREIGN KEY (`ExaminerID`) REFERENCES `examiners` (`examinerID`),
  CONSTRAINT `FK_biobank_specimen_collection_SpecimenID` FOREIGN KEY (`SpecimenID`) REFERENCES `biobank_specimen` (`SpecimenID`) ON DELETE CASCADE,
  CONSTRAINT `FK_biobank_specimen_collection_SpecimenProtocolID` FOREIGN KEY (`SpecimenProtocolID`) REFERENCES `biobank_specimen_protocol` (`SpecimenProtocolID`),
  CONSTRAINT `FK_biobank_specimen_collection_UnitID` FOREIGN KEY (`UnitID`) REFERENCES `biobank_unit` (`UnitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_specimen_preparation`
CREATE TABLE `biobank_specimen_preparation` (
  `SpecimenID` int(10) unsigned NOT NULL,
  `SpecimenProtocolID` int(10) unsigned NOT NULL,
  `CenterID` int(10) unsigned NOT NULL,
  `ExaminerID` int(10) unsigned NOT NULL,
  `Date` date NOT NULL,
  `Time` time NOT NULL,
  `Comments` varchar(500) DEFAULT NULL,
  `Data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`SpecimenID`),
  KEY `FK_biobank_specimen_preparation_SpecimenProtocolID` (`SpecimenProtocolID`),
  KEY `FK_biobank_specimen_preparation_CenterID` (`CenterID`),
  KEY `FK_biobank_specimen_preparation_ExaminerID` (`ExaminerID`),
  CONSTRAINT `FK_biobank_specimen_preparation_CenterID` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`),
  CONSTRAINT `FK_biobank_specimen_preparation_ExaminerID` FOREIGN KEY (`ExaminerID`) REFERENCES `examiners` (`examinerID`),
  CONSTRAINT `FK_biobank_specimen_preparation_SpecimenID` FOREIGN KEY (`SpecimenID`) REFERENCES `biobank_specimen` (`SpecimenID`) ON DELETE CASCADE,
  CONSTRAINT `FK_biobank_specimen_preparation_SpecimenProtocolID` FOREIGN KEY (`SpecimenProtocolID`) REFERENCES `biobank_specimen_protocol` (`SpecimenProtocolID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_specimen_analysis`
CREATE TABLE `biobank_specimen_analysis` (
  `SpecimenID` int(10) unsigned NOT NULL,
  `SpecimenProtocolID` int(10) unsigned NOT NULL,
  `CenterID` int(10) unsigned NOT NULL,
  `ExaminerID` int(10) unsigned NOT NULL,
  `Date` date NOT NULL,
  `Time` time NOT NULL,
  `Comments` varchar(500) DEFAULT NULL,
  `Data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`SpecimenID`),
  KEY `FK_biobank_specimen_analysis_SpecimenProtocolID` (`SpecimenProtocolID`),
  KEY `FK_biobank_specimen_analysis_CenterID` (`CenterID`),
  KEY `FK_biobank_specimen_analysis_ExaminerID` (`ExaminerID`),
  CONSTRAINT `FK_biobank_specimen_analysis_CenterID` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`),
  CONSTRAINT `FK_biobank_specimen_analysis_ExaminerID` FOREIGN KEY (`ExaminerID`) REFERENCES `examiners` (`examinerID`),
  CONSTRAINT `FK_biobank_specimen_analysis_SpecimenID` FOREIGN KEY (`SpecimenID`) REFERENCES `biobank_specimen` (`SpecimenID`) ON DELETE CASCADE,
  CONSTRAINT `FK_biobank_specimen_analysis_SpecimenProtocolID` FOREIGN KEY (`SpecimenProtocolID`) REFERENCES `biobank_specimen_protocol` (`SpecimenProtocolID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_specimen_parent`
CREATE TABLE `biobank_specimen_parent` (
  `SpecimenID` int(10) unsigned NOT NULL,
  `ParentSpecimenID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`SpecimenID`,`ParentSpecimenID`),
  KEY `FK_biobank_specimen_parent_ParentSpecimenID` (`ParentSpecimenID`),
  CONSTRAINT `FK_biobank_specimen_parent_ParentSpecimenID` FOREIGN KEY (`ParentSpecimenID`) REFERENCES `biobank_specimen` (`SpecimenID`) ON DELETE CASCADE,
  CONSTRAINT `FK_biobank_specimen_parent_SpecimenID` FOREIGN KEY (`SpecimenID`) REFERENCES `biobank_specimen` (`SpecimenID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_pool`
CREATE TABLE `biobank_pool` (
  `PoolID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(40) NOT NULL,
  `Quantity` decimal(10,3) NOT NULL,
  `UnitID` int(10) unsigned NOT NULL,
  `Date` date NOT NULL,
  `Time` time NOT NULL,
  PRIMARY KEY (`PoolID`),
  UNIQUE KEY `UK_biobank_pool_Label` (`Label`),
  KEY `FK_biobank_pool_UnitID` (`UnitID`),
  CONSTRAINT `FK_biobank_pool_UnitID` FOREIGN KEY (`UnitID`) REFERENCES `biobank_unit` (`UnitID`)
) ENGINE=InnoDB AUTO_INCREMENT=3703 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_specimen_pool_rel`
CREATE TABLE `biobank_specimen_pool_rel` (
  `SpecimenID` int(10) unsigned NOT NULL,
  `PoolID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`SpecimenID`),
  KEY `FK_biobank_specimen_pool_rel_PoolID` (`PoolID`),
  CONSTRAINT `FK_biobank_specimen_pool_rel_PoolID` FOREIGN KEY (`PoolID`) REFERENCES `biobank_pool` (`PoolID`) ON DELETE CASCADE,
  CONSTRAINT `FK_biobank_specimen_pool_rel_SpecimenID` FOREIGN KEY (`SpecimenID`) REFERENCES `biobank_specimen` (`SpecimenID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `shipment_type`
CREATE TABLE `shipment_type` (
  `ShipmentTypeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(255) NOT NULL,
  PRIMARY KEY (`ShipmentTypeID`),
  UNIQUE KEY `UK_shipment_type_Label` (`Label`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `shipment_status`
CREATE TABLE `shipment_status` (
  `StatusID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(255) NOT NULL,
  PRIMARY KEY (`StatusID`),
  UNIQUE KEY `UK_shipment_status_Label` (`Label`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `shipment_log`
CREATE TABLE `shipment_log` (
  `ShipmentID` int(10) unsigned NOT NULL,
  `CenterID` int(10) unsigned NOT NULL,
  `StatusID` int(10) unsigned NOT NULL,
  `Date` date NOT NULL,
  `Time` time NOT NULL,
  `UserID` int(10) unsigned NOT NULL,
  `Temperature` decimal(5,2) NOT NULL,
  `DateTimeCreate` datetime NOT NULL DEFAULT current_timestamp(),
  `DateTimeUpdate` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Comments` varchar(500) DEFAULT NULL,
  UNIQUE KEY `UK_shipment_log_ShipmentID_StatusID` (`ShipmentID`,`CenterID`,`StatusID`),
  KEY `FK_shipment_log_CenterID` (`CenterID`),
  KEY `FK_shipment_log_StatusID` (`StatusID`),
  KEY `FK_shipment_log_UserID` (`UserID`),
  CONSTRAINT `FK_shipment_log_CenterID` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`),
  CONSTRAINT `FK_shipment_log_StatusID` FOREIGN KEY (`StatusID`) REFERENCES `shipment_status` (`StatusID`),
  CONSTRAINT `FK_shipment_log_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `shipment`
CREATE TABLE `shipment` (
  `ShipmentID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Barcode` varchar(50) NOT NULL,
  `ShipmentTypeID` int(10) unsigned NOT NULL,
  `DestinationCenterID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ShipmentID`),
  UNIQUE KEY `UK_shipment_Barcode` (`Barcode`),
  KEY `FK_shipment_ShipmentTypeID` (`ShipmentTypeID`),
  KEY `FK_shipment_DestinationCentrID` (`DestinationCenterID`),
  CONSTRAINT `FK_shipment_DestinationCentrID` FOREIGN KEY (`DestinationCenterID`) REFERENCES `psc` (`CenterID`),
  CONSTRAINT `FK_shipment_ShipmentTypeID` FOREIGN KEY (`ShipmentTypeID`) REFERENCES `shipment_type` (`ShipmentTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `biobank_container_shipment_rel`
CREATE TABLE `biobank_container_shipment_rel` (
  `ShipmentID` int(10) unsigned NOT NULL,
  `ContainerID` int(10) unsigned NOT NULL,
  UNIQUE KEY `UK_biobank_container_shipment_rel_ShipmentID_ContainerID` (`ShipmentID`,`ContainerID`),
  KEY `FK_shipment_log_ContainerID` (`ContainerID`),
  CONSTRAINT `FK_shipment_log_ContainerID` FOREIGN KEY (`ContainerID`) REFERENCES `biobank_container` (`ContainerID`) ON DELETE CASCADE,
  CONSTRAINT `FK_shipment_log_ShipmentID` FOREIGN KEY (`ShipmentID`) REFERENCES `shipment` (`ShipmentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert units, processes, container status and shipment status
INSERT INTO `biobank_unit` VALUES (1,'mL'),(2,'µL');
INSERT INTO `biobank_specimen_attribute_datatype` VALUES (1,'text'),(2,'number'),(3,'date'),(4,'time'),(5,'boolean');
INSERT INTO `biobank_specimen_process` VALUES (1,'Collection'),(2,'Analysis'),(3,'Preparation');
INSERT INTO `biobank_container_status` VALUES (1,'Available'),(3,'Dispensed'),(4,'Discarded');
INSERT INTO `shipment_status` VALUES (1,'cancelled'),(2,'created'),(3,'received'),(4,'returned'),(5,'shipped');
INSERT INTO `biobank_specimen_type` VALUES (1,'Blood',0),(2,'Serum',1);
INSERT INTO `biobank_container_dimension`
VALUES (1,1,1,1,1,0,0),
       (2,10,1,10,0,1,0),
       (3,1,0,5,0,1,0);
INSERT INTO `biobank_container_capacity` VALUES (1,1,1);
INSERT INTO `biobank_container_type`
VALUES (1,'Brand','Product Number 1','Vial',1,1,1),
       (2,'Brand','Product Number 2','Matrix Box',0,NULL,2),
       (3,'Brand','Product Number 3','Rack',0,NULL,3);
INSERT INTO `biobank_specimen_protocol`
VALUES (1,'Blood Collection',1,1),
       (2,'Blood Preparation',2,1),
       (3,'Serum Collection',1,2);
INSERT INTO `biobank_specimen_type_unit_rel` VALUES (1,1),(2,2);
INSERT INTO `biobank_specimen_type_parent` VALUES (2,1);
INSERT INTO `biobank_specimen_type_container_type_rel` VALUES (1,1),(2,1);
INSERT INTO `shipment_type` VALUES (1, 'Gel Pack Container'),(2, 'Insulated Foam Box'),(3, 'Dry Shipper');

-- Insert ConfigSettings for label printing endpoint
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('biobank', 'Settings related to the biobank module', 1, 0, 'Biobank', 16);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'printEndpoint', 'Endpoint address for label printing logic', 1, 0, 'text', ID, 'Label Printing Endpoint', 1 FROM ConfigSettings WHERE Name="biobank";

