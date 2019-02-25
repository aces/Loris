-- DROPS --

/*Relational*/
DROP TABLE IF EXISTS `biobank_container_parent`;
DROP TABLE IF EXISTS `biobank_container_psc_rel`;
DROP TABLE IF EXISTS `biobank_specimen_pool_rel`;
DROP TABLE IF EXISTS `biobank_specimen_parent`;
DROP TABLE IF EXISTS `biobank_specimen_type_unit_rel`;
DROP TABLE IF EXISTS `biobank_specimen_type_container_type_rel`;
DROP TABLE IF EXISTS `biobank_specimen_method_attribute_rel`;
DROP TABLE IF EXISTS `biobank_specimen_protocol_attribute_rel`;
DROP TABLE IF EXISTS `biobank_specimen_type_attribute_rel`;

/*Pool*/
DROP TABLE IF EXISTS `biobank_pool`;

/*Specimen*/
DROP TABLE IF EXISTS `biobank_specimen_attribute`;
DROP TABLE IF EXISTS `biobank_specimen_analysis`;
DROP TABLE IF EXISTS `biobank_specimen_preparation`;
DROP TABLE IF EXISTS `biobank_specimen_collection`;
DROP TABLE IF EXISTS `biobank_specimen_freezethaw`;
DROP TABLE IF EXISTS `biobank_specimen`;
DROP TABLE IF EXISTS `biobank_specimen_method`;
DROP TABLE IF EXISTS `biobank_specimen_protocol`;
DROP TABLE IF EXISTS `biobank_specimen_type`;

/*Container*/
DROP TABLE IF EXISTS `biobank_container`;
DROP TABLE IF EXISTS `biobank_container_status`;
DROP TABLE IF EXISTS `biobank_container_type`;
DROP TABLE IF EXISTS `biobank_container_dimension`;
DROP TABLE IF EXISTS `biobank_container_capacity`;

/*Global*/
DROP TABLE IF EXISTS `biobank_unit`;
DROP TABLE IF EXISTS `biobank_datatype`;
DROP TABLE IF EXISTS `biobank_reference_table`;


-- CREATES --

/*Global*/
CREATE TABLE `biobank_reference_table` (
  `ReferenceTableID` integer unsigned NOT NULL AUTO_INCREMENT,
  `TableName` varchar(50) NOT NULL,
  `ColumnName` varchar(50) NOT NULL,
  CONSTRAINT `PK_biobank_reference_table` PRIMARY KEY (`ReferenceTableID`),
  CONSTRAINT `UK_biobank_reference_table_TableName_ColumnName` UNIQUE(`TableName`, `ColumnName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_datatype` (
  `DatatypeID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Datatype` varchar(20) NOT NULL UNIQUE,
  CONSTRAINT `PK_biobank_datatype` PRIMARY KEY (`DatatypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_unit` (
  `UnitID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(20) NOT NULL UNIQUE,
  CONSTRAINT `PK_biobank_unit` PRIMARY KEY (`UnitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/*Container*/

/*TODO: Decide if necessary*/
/*Currently not in use*/
CREATE TABLE `biobank_container_capacity` (
  `ContainerCapacityID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Quantity` decimal(10, 3) NOT NULL,
  `UnitID` integer unsigned NOT NULL,
  CONSTRAINT `PK_biobank_container_capacity` PRIMARY KEY (`ContainerCapacityID`),
  CONSTRAINT `FK_biobank_container_capacity_UnitID`
    FOREIGN KEY (`UnitID`) REFERENCES `biobank_unit`(`UnitID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `UK_biobank_container_capacity_Quantity_UnitID` UNIQUE(`Quantity`, `UnitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_container_dimension` (
  `ContainerDimensionID` integer unsigned NOT NULL AUTO_INCREMENT,
  `X` integer unsigned NOT NULL,
  `Y` integer unsigned NOT NULL,
  `Z` integer unsigned NOT NULL,
  CONSTRAINT `PK_biobank_container_dimension` PRIMARY KEY (`ContainerDimensionID`),
  CONSTRAINT `UK_biobank_container_dimension_X_Y_Z` UNIQUE(`X`, `Y`, `Z`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_container_type` (
  `ContainerTypeID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Type` varchar(20) NOT NULL,
  `Descriptor` varchar(20) NOT NULL,
  `Label` varchar(40) NOT NULL,
  `Primary` BIT(1) NOT NULL,
  `ContainerCapacityID` integer unsigned,
  `ContainerDimensionID` integer unsigned,
  CONSTRAINT `PK_biobank_container_type` PRIMARY KEY (`ContainerTypeID`),
  CONSTRAINT `FK_biobank_container_type_CapacityID`
    FOREIGN KEY (`ContainerCapacityID`) REFERENCES `biobank_container_capacity`(`ContainerCapacityID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_container_type_DimensionID`
    FOREIGN KEY (`ContainerDimensionID`) REFERENCES `biobank_container_dimension`(`ContainerDimensionID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `UK_biobank_container_type_Type_Descriptor` UNIQUE(`Type`, `Descriptor`),
  CONSTRAINT `UK_biobank_container_type_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* Should this be simply biobank_status since it applies to both containers and specimen? */
CREATE TABLE `biobank_container_status` (
  `ContainerStatusID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(40) NOT NULL,
  CONSTRAINT `PK_biobank_container_status` PRIMARY KEY (`ContainerStatusID`),
  CONSTRAINT `UK_biobank_container_status_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_container` (
  `ContainerID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Barcode` varchar(40) NOT NULL, /*index by barcode*/
  `ContainerTypeID` integer unsigned NOT NULL,
  `Temperature` decimal(5, 2) NOT NULL DEFAULT 20,
  `ContainerStatusID` integer unsigned NOT NULL,
  `OriginCenterID` integer unsigned NOT NULL,
  `CurrentCenterID` integer unsigned NOT NULL,
  `DateTimeCreate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DateTimeUpdate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `PK_biobank_container` PRIMARY KEY (`ContainerID`),
  CONSTRAINT `FK_biobank_container_ContainerTypeID`
    FOREIGN KEY (`ContainerTypeID`) REFERENCES `biobank_container_type`(`ContainerTypeID`)  
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_container_ContainerStatusID`
    FOREIGN KEY (`ContainerStatusID`) REFERENCES `biobank_container_status`(`ContainerStatusID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_container_OriginCenterID`
    FOREIGN KEY (`OriginCenterID`) REFERENCES `psc`(`CenterID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_container_CurrentCenterID`
    FOREIGN KEY (`CurrentCenterID`) REFERENCES `psc`(`CenterID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `UK_biobank_container_Barcode` UNIQUE (`Barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/*Specimen*/
CREATE TABLE `biobank_specimen_type` (
  `SpecimenTypeID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(50) NOT NULL,
  `FreezeThaw` BIT(1) NOT NULL,
  `ParentSpecimenTypeID` integer unsigned,
  `Regex` varchar(100),
  CONSTRAINT `PK_biobank_specimen_type` PRIMARY KEY (`SpecimenTypeID`),
  CONSTRAINT `FK_biobank_specimen_type_ParentSpecimenTypeID`
    FOREIGN KEY (`ParentSpecimenTypeID`) REFERENCES `biobank_specimen_type`(`SpecimenTypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `UK_biobank_specimen_type_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_protocol` (
  `SpecimenProtocolID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(50) NOT NULL,
  `SpecimenTypeID` integer unsigned NOT NULL,
  CONSTRAINT `PK_biobank_specimen_protocol` PRIMARY KEY (`SpecimenProtocolID`),
  CONSTRAINT `FK_biobank_specimen_protocol_SpecimenTypeID`
    FOREIGN KEY (`SpecimenTypeID`) REFERENCES `biobank_specimen_type`(`SpecimenTypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `UK_biobank_specimen_protocol_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 

CREATE TABLE `biobank_specimen_method` (
  `SpecimenMethodID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(50) NOT NULL,
  `SpecimenTypeID` integer unsigned NOT NULL,
  CONSTRAINT `PK_biobank_specimen_method` PRIMARY KEY (`SpecimenMethodID`),
  CONSTRAINT `FK_biobank_specimen_method_SpecimenTypeID`
    FOREIGN KEY (`SpecimenTypeID`) REFERENCES `biobank_specimen_type`(`SpecimenTypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `UK_biobank_specimen_method_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 

CREATE TABLE `biobank_specimen` (
  `SpecimenID` integer unsigned NOT NULL AUTO_INCREMENT,
  `ContainerID` integer unsigned NOT NULL, /*Index by ContainerID*/
  `SpecimenTypeID` integer unsigned NOT NULL,
  `Quantity` DECIMAL(10, 3) NOT NULL,
  `UnitID` integer unsigned NOT NULL,
  `CandidateID` int(6) NOT NULL,
  `SessionID` integer unsigned UNSIGNED NOT NULL,
  CONSTRAINT `PK_biobank_specimen` PRIMARY KEY (`SpecimenID`),
  CONSTRAINT `FK_biobank_specimen_ContainerID`
    FOREIGN KEY (`ContainerID`) REFERENCES `biobank_container`(`ContainerID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_SpecimenTypeID` 
    FOREIGN KEY (`SpecimenTypeID`) REFERENCES `biobank_specimen_type`(`SpecimenTypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_UnitID` 
    FOREIGN KEY (`UnitID`) REFERENCES `biobank_unit` (`UnitID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_CandidateID`
    FOREIGN KEY (`CandidateID`) REFERENCES `candidate`(`CandID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_SessionID`
    FOREIGN KEY (`SessionID`) REFERENCES `session`(`ID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `UK_biobank_specimen_ContainerID` UNIQUE (`ContainerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_freezethaw` (
  `SpecimenID` integer unsigned NOT NULL,
  `FreezeThawCycle` integer unsigned NOT NULL,
  CONSTRAINT `PK_biobank_specimen_freezethaw` PRIMARY KEY (`SpecimenID`),
  CONSTRAINT `FK_biobank_specimen_freezethaw_SpecimenID`
    FOREIGN KEY (`SpecimenID`) REFERENCES `biobank_specimen`(`SpecimenID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_collection` (
  `SpecimenID` integer unsigned NOT NULL,
  `Quantity` DECIMAL(10, 3) NOT NULL,
  `UnitID` integer unsigned NOT NULL,
  `CenterID` integer unsigned NOT NULL,
  `Date` DATE NOT NULL,
  `Time` TIME NOT NULL,
  `Comments` varchar(255),
  `Data` json DEFAULT NULL,
  CONSTRAINT `PK_biobank_specimen_collection` PRIMARY KEY (`SpecimenID`),
  CONSTRAINT `FK_biobank_specimen_collection_SpecimenID`
    FOREIGN KEY (`SpecimenID`) REFERENCES `biobank_specimen`(`SpecimenID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_collection_UnitID`
    FOREIGN KEY (`UnitID`) REFERENCES `biobank_unit`(`UnitID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_collection_CenterID`
    FOREIGN KEY (`CenterID`) REFERENCES `psc`(`CenterID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_preparation` (
  `SpecimenID` integer unsigned NOT NULL,
  `SpecimenProtocolID` integer unsigned NOT NULL,
  `CenterID` integer unsigned NOT NULL,
  `Date` DATE NOT NULL,
  `Time` TIME NOT NULL,
  `Comments` varchar(255),
  `Data` json DEFAULT NULL,
  CONSTRAINT `PK_biobank_specimen_preparation` PRIMARY KEY (`SpecimenID`),
  CONSTRAINT `FK_biobank_specimen_preparation_SpecimenID`
    FOREIGN KEY (`SpecimenID`) REFERENCES `biobank_specimen`(`SpecimenID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_preparation_SpecimenProtocolID`
    FOREIGN KEY (`SpecimenProtocolID`) REFERENCES `biobank_specimen_protocol`(`SpecimenProtocolID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_preparation_CenterID`
    FOREIGN KEY (`CenterID`) REFERENCES `psc`(`CenterID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_analysis` (
  `SpecimenID` integer unsigned NOT NULL,
  `SpecimenMethodID` integer unsigned NOT NULL,
  `CenterID` integer unsigned NOT NULL,
  `Date` DATE NOT NULL,
  `Time` TIME NOT NULL,
  `Comments` varchar(255),
  `Data` json DEFAULT NULL,
  CONSTRAINT `PK_biobank_specimen` PRIMARY KEY (`SpecimenID`),
  CONSTRAINT `FK_biobank_specimen_SpecimenID`
    FOREIGN KEY (`SpecimenID`) REFERENCES `biobank_specimen`(`SpecimenID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_SpecimenMethodID`
    FOREIGN KEY (`SpecimenMethodID`) REFERENCES `biobank_specimen_method`(`SpecimenMethodID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_analysis_CenterID`
    FOREIGN KEY (`CenterID`) REFERENCES `psc`(`CenterID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_attribute` (
  `SpecimenAttributeID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(40) NOT NULL,
  `DatatypeID` integer unsigned NOT NULL,
  `ReferenceTableID` integer unsigned,
  CONSTRAINT `PK_biobank_specimen_attribute` PRIMARY KEY (`SpecimenAttributeID`),
  CONSTRAINT `FK_biobank_specimen_attribute_DatatypeID`
    FOREIGN KEY (`DatatypeID`) REFERENCES `biobank_datatype`(`DatatypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_attribute_ReferenceTableID` 
    FOREIGN KEY (`ReferenceTableID`) REFERENCES `biobank_reference_table`(`ReferenceTableID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `UK_biobank_specimen_attribute_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Pool*/
CREATE TABLE `biobank_pool` (
  `PoolID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(40) NOT NULL,
  `CenterID` integer unsigned NOT NULL,
  `Date` DATE NOT NULL,
  `Time` TIME NOT NULL,
  CONSTRAINT `PK_biobank_pool` PRIMARY KEY (`PoolID`),
  CONSTRAINT `FK_biobank_pool_CenterID`
    FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`),
  CONSTRAINT `UK_biobank_pool_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/*Relational Tables*/
CREATE TABLE `biobank_specimen_type_attribute_rel` (
  `SpecimenTypeID` integer unsigned NOT NULL,
  `SpecimenAttributeID` integer unsigned NOT NULL,
  `Required` BIT(1) NOT NULL, 
  CONSTRAINT `PK_biobank_specimen_type_attribute_rel` PRIMARY KEY (`SpecimenTypeID`, `SpecimenAttributeID`),
  CONSTRAINT `FK_biobank_specimen_type_attribute_rel_SpecimenTypeID`
    FOREIGN KEY (`SpecimenTypeID`) REFERENCES `biobank_specimen_type`(`SpecimenTypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_type_attribute_rel_SpecimenAttributeID` 
    FOREIGN KEY (`SpecimenAttributeID`) REFERENCES `biobank_specimen_attribute`(`SpecimenAttributeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_protocol_attribute_rel` (
  `SpecimenProtocolID` integer unsigned NOT NULL,
  `SpecimenAttributeID` integer unsigned NOT NULL,
  `Required` BIT(1) NOT NULL, 
  CONSTRAINT `PK_biobank_specimen_protocol_attribute_rel` PRIMARY KEY (`SpecimenProtocolID`, `SpecimenAttributeID`),
  CONSTRAINT `FK_biobank_specimen_protocol_attribute__rel_SpecimenProtocolID` 
    FOREIGN KEY (`SpecimenProtocolID`) REFERENCES `biobank_specimen_protocol`(`SpecimenProtocolID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_protocol_attribute_rel_SpecimenAttributeID` 
    FOREIGN KEY (`SpecimenAttributeID`) REFERENCES `biobank_specimen_attribute`(`SpecimenAttributeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_method_attribute_rel` (
  `SpecimenMethodID` integer unsigned NOT NULL,
  `SpecimenAttributeID` integer unsigned NOT NULL,
  `Required` BIT(1) NOT NULL, 
  CONSTRAINT `PK_biobank_specimen_method_attribute_rel` PRIMARY KEY (`SpecimenMethodID`, `SpecimenAttributeID`),
  CONSTRAINT `FK_biobank_specimen_method_attribute_rel_SpecimenMethodID` 
    FOREIGN KEY (`SpecimenMethodID`) REFERENCES `biobank_specimen_method`(`SpecimenMethodID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_method_attribute_rel_SpecimenAttributeID` 
    FOREIGN KEY (`SpecimenAttributeID`) REFERENCES `biobank_specimen_attribute`(`SpecimenAttributeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_type_container_type_rel` (
  `SpecimenTypeID` integer unsigned NOT NULL,
  `ContainerTypeID` integer unsigned NOT NULL,
  `Regex` varchar(255) NOT NULL,
  CONSTRAINT `PK_biobank_validate_identifer` PRIMARY KEY (SpecimenTypeID, ContainerTypeID),
  CONSTRAINT `FK_biobank_validate_identifier_SpecimenTypeID` 
    FOREIGN KEY (`SpecimenTypeID`) REFERENCES `biobank_specimen_type`(`SpecimenTypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_validate_identifier_ContainerTypeID` 
    FOREIGN KEY (`ContainerTypeID`) REFERENCES `biobank_container_type`(`ContainerTypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_type_unit_rel` (
  `SpecimenTypeID` integer unsigned NOT NULL, 
  `UnitID` integer unsigned  NOT NULL,
  CONSTRAINT `PK_biobank_container_psc_rel` PRIMARY KEY (`SpecimenTypeID`, `UnitID`),
  CONSTRAINT `FK_biobank_specimen_type_unit_rel_TypeID`
    FOREIGN KEY (`SpecimenTypeID`) REFERENCES `biobank_specimen_type` (`SpecimenTypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_type_unit_rel_SourceID`
    FOREIGN KEY (`UnitID`) REFERENCES `biobank_unit` (`UnitID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_parent` (
  `SpecimenID` integer unsigned NOT NULL,
  `ParentSpecimenID` integer unsigned NOT NULL,
  CONSTRAINT `PK_biobank_specimen_parent` PRIMARY KEY (`SpecimenID`, `ParentSpecimenID`),
  CONSTRAINT `FK_biobank_specimen_parent_SpecimenID`
    FOREIGN KEY (`SpecimenID`) REFERENCES `biobank_specimen`(`SpecimenID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_parent_ParentSpecimenID`
    FOREIGN KEY (`ParentSpecimenID`) REFERENCES `biobank_specimen`(`SpecimenID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_pool_rel` (
  `SpecimenID` integer unsigned NOT NULL,
  `PoolID` integer unsigned NOT NULL,
  CONSTRAINT `PK_biobank_specimen_pool_rel` PRIMARY KEY (`SpecimenID`, `PoolID`),
  CONSTRAINT `FK_biobank_specimen_pool_rel_SpecimenID`
    FOREIGN KEY (`SpecimenID`) REFERENCES `biobank_specimen`(`SpecimenID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_pool_rel_PoolID`
    FOREIGN KEY (`PoolID`) REFERENCES `biobank_pool`(`PoolID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_container_psc_rel` (
  `ContainerID` integer unsigned NOT NULL, 
  `SourceCenterID` integer unsigned NOT NULL,
  `DestinationCenterID` integer unsigned NOT NULL,
  CONSTRAINT `PK_biobank_container_psc_rel_ContainerID` PRIMARY KEY (`ContainerID`),
  CONSTRAINT `FK_biobank_container_psc_rel_ContainerID`
    FOREIGN KEY (`ContainerID`) REFERENCES `biobank_container` (`ContainerID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_container_psc_rel_SourceCenterID`
    FOREIGN KEY (`SourceCenterID`) REFERENCES `psc` (`CenterID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_container_psc_rel_DestinationCenterID`
    FOREIGN KEY (`DestinationCenterID`) REFERENCES `psc` (`CenterID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_container_parent` (
  `ContainerID` integer unsigned NOT NULL,
  `ParentContainerID` integer unsigned NOT NULL,
  `Coordinate` integer unsigned,
  CONSTRAINT `PK_biobank_container_parent_ContainerID`
    PRIMARY KEY (`ContainerID`),
  CONSTRAINT `FK_biobank_container_parent_ContainerID`
    FOREIGN KEY (`ContainerID`) REFERENCES `biobank_container` (`ContainerID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_container_parent_ParentContainerID`
    FOREIGN KEY (`ParentContainerID`) REFERENCES `biobank_container` (`ContainerID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `UK_biobank_container_parent_ParentContainerID_Coordinate`
    UNIQUE (`ParentContainerID`, `Coordinate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/*INDEXES*/

/* Future indexes need to go here*/


/*INSERTS*/

/*Global*/
INSERT INTO biobank_datatype (Datatype)
VALUES  ('boolean'),
        ('number'),
        ('text'),
        ('datetime'),
        ('file')
;

/*Container*/
INSERT INTO biobank_container_status (Label)
VALUES  ('Available'),
        ('Reserved'),
        ('Dispensed'),
        ('Discarded')
;

