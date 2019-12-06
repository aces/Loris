-- DROPS --

/*Relational*/
DROP TABLE IF EXISTS `biobank_container_parent`;
DROP TABLE IF EXISTS `biobank_container_project_rel`;
DROP TABLE IF EXISTS `biobank_container_psc_rel`;
DROP TABLE IF EXISTS `biobank_specimen_pool_rel`;
DROP TABLE IF EXISTS `biobank_specimen_type_parent`;
DROP TABLE IF EXISTS `biobank_specimen_parent`;
DROP TABLE IF EXISTS `biobank_specimen_type_unit_rel`;
DROP TABLE IF EXISTS `biobank_specimen_protocol_container_type_rel`;
DROP TABLE IF EXISTS `biobank_specimen_type_container_type_rel`;
DROP TABLE IF EXISTS `biobank_specimen_protocol_attribute_rel`;
DROP TABLE IF EXISTS `biobank_specimen_type_attribute_rel`;
DROP TABLE IF EXISTS `biobank_specimen_method_attribute_rel`;

/*Pool*/
DROP TABLE IF EXISTS `biobank_pool`;

/*Specimen*/
DROP TABLE IF EXISTS `biobank_specimen_attribute`;
DROP TABLE IF EXISTS `biobank_specimen_attribute_referencetable`;
DROP TABLE IF EXISTS `biobank_specimen_attribute_datatype`;
DROP TABLE IF EXISTS `biobank_specimen_analysis`;
DROP TABLE IF EXISTS `biobank_specimen_preparation`;
DROP TABLE IF EXISTS `biobank_specimen_collection`;
DROP TABLE IF EXISTS `biobank_specimen_freezethaw`;
DROP TABLE IF EXISTS `biobank_specimen`;
DROP TABLE IF EXISTS `biobank_specimen_protocol`;
DROP TABLE IF EXISTS `biobank_specimen_process`;
DROP TABLE IF EXISTS `biobank_specimen_type`;
DROP TABLE IF EXISTS `biobank_specimen_method`;

/*Container*/
DROP TABLE IF EXISTS `biobank_container`;
DROP TABLE IF EXISTS `biobank_container_status`;
DROP TABLE IF EXISTS `biobank_container_type`;
DROP TABLE IF EXISTS `biobank_container_dimension`;
DROP TABLE IF EXISTS `biobank_container_capacity`;

/*Global*/
DROP TABLE IF EXISTS `biobank_unit`;


-- CREATES --

/*Global*/

CREATE TABLE `biobank_unit` (
  `UnitID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(20) NOT NULL UNIQUE,
  CONSTRAINT `PK_biobank_unit` PRIMARY KEY (`UnitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/*Container*/

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
  `XNumerical` BIT(1) NOT NULL,
  `Y` integer unsigned NOT NULL,
  `YNumerical` BIT(1) NOT NULL,
  `Z` integer unsigned NOT NULL,
  `ZNumerical` BIT(1) NOT NULL,
  CONSTRAINT `PK_biobank_container_dimension` PRIMARY KEY (`ContainerDimensionID`),
  CONSTRAINT `UK_biobank_container_dimension_X_Y_Z` UNIQUE(`X`, `Y`, `Z`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_container_type` (
  `ContainerTypeID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Brand` varchar(50) NOT NULL,
  `ProductNumber` varchar(50) NOT NULL,
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
  CONSTRAINT `UK_biobank_container_type_Brand_ProductNumber` UNIQUE(`Brand`, `ProductNumber`),
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
  `LotNumber` varchar(40),
  `ExpirationDate` DATE,
  `Comments` varchar(255),
  `DateTimeCreate` DATETIME NOT NULL DEFAULT NOW(),
  `DateTimeUpdate` DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW(),
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
  CONSTRAINT `PK_biobank_specimen_type` PRIMARY KEY (`SpecimenTypeID`),
  CONSTRAINT `UK_biobank_specimen_type_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_process` (
  `SpecimenProcessID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(50) NOT NULL,
  CONSTRAINT `PK_biobank_specimen_process` PRIMARY KEY (`SpecimenProcessID`),
  CONSTRAINT `UK_biobank_specimen_process_Label` UNIQUE (`Label`)
);

CREATE TABLE `biobank_specimen_protocol` (
  `SpecimenProtocolID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(50) NOT NULL,
  `SpecimenProcessID` integer unsigned NOT NULL,
  `SpecimenTypeID` integer unsigned NOT NULL,
  CONSTRAINT `PK_biobank_specimen_protocol` PRIMARY KEY (`SpecimenProtocolID`),
  CONSTRAINT `FK_biobank_specimen_protocol_SpecimenProcessID`
    FOREIGN KEY (`SpecimenProcessID`) REFERENCES `biobank_specimen_process`(`SpecimenProcessID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_protocol_SpecimenTypeID`
    FOREIGN KEY (`SpecimenTypeID`) REFERENCES `biobank_specimen_type`(`SpecimenTypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `UK_biobank_specimen_protocol_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 

CREATE TABLE `biobank_specimen` (
  `SpecimenID` integer unsigned NOT NULL AUTO_INCREMENT,
  `ContainerID` integer unsigned NOT NULL, /*Index by ContainerID*/
  `SpecimenTypeID` integer unsigned NOT NULL,
  `Quantity` DECIMAL(10, 3) NOT NULL,
  `UnitID` integer unsigned NOT NULL,
  `SessionID` integer unsigned NOT NULL,
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
  `SpecimenProtocolID` integer unsigned NOT NULL,
  `Quantity` DECIMAL(10, 3) NOT NULL,
  `UnitID` integer unsigned NOT NULL,
  `CenterID` integer unsigned NOT NULL,
  `ExaminerID` integer unsigned NOT NULL,
  `Date` DATE NOT NULL,
  `Time` TIME NOT NULL,
  `Comments` varchar(255),
  `Data` json DEFAULT NULL,
  CONSTRAINT `PK_biobank_specimen_collection` PRIMARY KEY (`SpecimenID`),
  CONSTRAINT `FK_biobank_specimen_collection_SpecimenID`
    FOREIGN KEY (`SpecimenID`) REFERENCES `biobank_specimen`(`SpecimenID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_collection_SpecimenProtocolID`
    FOREIGN KEY (`SpecimenProtocolID`) REFERENCES `biobank_specimen_protocol`(`SpecimenProtocolID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_collection_UnitID`
    FOREIGN KEY (`UnitID`) REFERENCES `biobank_unit`(`UnitID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_collection_CenterID`
    FOREIGN KEY (`CenterID`) REFERENCES `psc`(`CenterID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_collection_ExaminerID`
    FOREIGN KEY (`ExaminerID`) REFERENCES `examiners`(`examinerID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_preparation` (
  `SpecimenID` integer unsigned NOT NULL,
  `SpecimenProtocolID` integer unsigned NOT NULL,
  `CenterID` integer unsigned NOT NULL,
  `ExaminerID` integer unsigned NOT NULL,
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
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_preparation_ExaminerID`
    FOREIGN KEY (`ExaminerID`) REFERENCES `examiners`(`examinerID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_analysis` (
  `SpecimenID` integer unsigned NOT NULL,
  `SpecimenProtocolID` integer unsigned NOT NULL,
  `CenterID` integer unsigned NOT NULL,
  `ExaminerID` integer unsigned NOT NULL,
  `Date` DATE NOT NULL,
  `Time` TIME NOT NULL,
  `Comments` varchar(255),
  `Data` json DEFAULT NULL,
  CONSTRAINT `PK_biobank_specimen` PRIMARY KEY (`SpecimenID`),
  CONSTRAINT `FK_biobank_specimen_analysis_SpecimenID`
    FOREIGN KEY (`SpecimenID`) REFERENCES `biobank_specimen`(`SpecimenID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_analysis_SpecimenProtocolID`
    FOREIGN KEY (`SpecimenProtocolID`) REFERENCES `biobank_specimen_protocol`(`SpecimenProtocolID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_analysis_CenterID`
    FOREIGN KEY (`CenterID`) REFERENCES `psc`(`CenterID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_analysis_ExaminerID`
    FOREIGN KEY (`ExaminerID`) REFERENCES `examiners`(`examinerID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_attribute_datatype` (
  `DatatypeID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Datatype` varchar(20) NOT NULL UNIQUE,
  CONSTRAINT `PK_biobank_datatype` PRIMARY KEY (`DatatypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_attribute_referencetable` (
  `ReferenceTableID` integer unsigned NOT NULL AUTO_INCREMENT,
  `TableName` varchar(50) NOT NULL,
  `ColumnName` varchar(50) NOT NULL,
  CONSTRAINT `PK_biobank_specimen_attribute_referencetable` PRIMARY KEY (`ReferenceTableID`),
  CONSTRAINT `UK_bio_spec_attribute_referencetable_TableName_ColumnName` UNIQUE(`TableName`, `ColumnName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `biobank_specimen_attribute` (
  `SpecimenAttributeID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(40) NOT NULL,
  `DatatypeID` integer unsigned NOT NULL,
  `ReferenceTableID` integer unsigned,
  CONSTRAINT `PK_biobank_specimen_attribute` PRIMARY KEY (`SpecimenAttributeID`),
  CONSTRAINT `FK_biobank_specimen_attribute_DatatypeID`
    FOREIGN KEY (`DatatypeID`) REFERENCES `biobank_specimen_attribute_datatype`(`DatatypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_attribute_ReferenceTableID` 
    FOREIGN KEY (`ReferenceTableID`) REFERENCES `biobank_specimen_attribute_referencetable`(`ReferenceTableID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `UK_biobank_specimen_attribute_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Pool*/
CREATE TABLE `biobank_pool` (
  `PoolID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(40) NOT NULL,
  `Quantity` DECIMAL(10, 3) NOT NULL,
  `UnitID` integer unsigned NOT NULL,
  `CenterID` integer unsigned NOT NULL,
  `Date` DATE NOT NULL,
  `Time` TIME NOT NULL,
  CONSTRAINT `PK_biobank_pool` PRIMARY KEY (`PoolID`),
  CONSTRAINT `FK_biobank_pool_UnitID` 
    FOREIGN KEY (`UnitID`) REFERENCES `biobank_unit` (`UnitID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_pool_CenterID`
    FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`),
  CONSTRAINT `UK_biobank_pool_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/*Relational Tables*/
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

CREATE TABLE `biobank_specimen_protocol_container_type_rel` (
  `SpecimenProtocolID` integer unsigned NOT NULL,
  `ContainerTypeID` integer unsigned NOT NULL,
  CONSTRAINT `PK_biobank_specimen_protocol_container_type_rel` PRIMARY KEY (SpecimenProtocolID, ContainerTypeID),
  CONSTRAINT `FK_bio_spec_protocol_container_type_rel_SpecimenProtocolID` 
    FOREIGN KEY (`SpecimenProtocolID`) REFERENCES `biobank_specimen_protocol`(`SpecimenProtocolID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_protocol_container_type_rel_ContainerTypeID` 
    FOREIGN KEY (`ContainerTypeID`) REFERENCES `biobank_container_type`(`ContainerTypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_type_container_type_rel` (
  `SpecimenTypeID` integer unsigned NOT NULL,
  `ContainerTypeID` integer unsigned NOT NULL,
  CONSTRAINT `PK_biobank_specimen_type_container_type_rel` PRIMARY KEY (SpecimenTypeID, ContainerTypeID),
  CONSTRAINT `FK_biobank_specimen_type_container_type_rel_SpecimenTypeID` 
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

CREATE TABLE `biobank_specimen_type_parent` (
  `SpecimenTypeID` integer unsigned NOT NULL,
  `ParentSpecimenTypeID` integer unsigned NOT NULL,
  CONSTRAINT `PK_biobank_specimen_type_parent` PRIMARY KEY (`SpecimenTypeID`, `ParentSpecimenTypeID`),
  CONSTRAINT `FK_biobank_specimen_type_parent_SpecimenTypeID`
    FOREIGN KEY (`SpecimenTypeID`) REFERENCES `biobank_specimen_type`(`SpecimenTypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_type_parent_ParentSpecimenTypeID`
    FOREIGN KEY (`ParentSpecimenTypeID`) REFERENCES `biobank_specimen_type`(`SpecimenTypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_specimen_pool_rel` (
  `SpecimenID` integer unsigned NOT NULL,
  `PoolID` integer unsigned NOT NULL,
  CONSTRAINT `PK_biobank_specimen_pool_rel` PRIMARY KEY (`SpecimenID`),
  CONSTRAINT `FK_biobank_specimen_pool_rel_SpecimenID`
    FOREIGN KEY (`SpecimenID`) REFERENCES `biobank_specimen`(`SpecimenID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_pool_rel_PoolID`
    FOREIGN KEY (`PoolID`) REFERENCES `biobank_pool`(`PoolID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `biobank_container_project_rel` (
  `ContainerID` integer unsigned NOT NULL,
  `ProjectID` int(2) NOT NULL,
  CONSTRAINT `PK_biobank_container_project_rel` PRIMARY KEY (`ContainerID`, `ProjectID`),
  CONSTRAINT `FK_biobank_container_project_rel_ContainerID`
    FOREIGN KEY (`ContainerID`) REFERENCES `biobank_container`(`ContainerID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_container_project_rel_ProjectID`
    FOREIGN KEY (`ProjectID`) REFERENCES `Project`(`ProjectID`)
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


/*DELETES The following deletes are for testing. Delete before merging.*/
DELETE FROM LorisMenu WHERE `Label`='Specimens';
DELETE FROM LorisMenu WHERE `Label`='Containers';
DELETE FROM LorisMenu WHERE `Label`='Pools';
DELETE FROM LorisMenu WHERE `Label`='Biobank';

DELETE FROM user_perm_rel WHERE
    `permID`= (SELECT permID FROM permissions WHERE code='biobank_specimen_view') OR
    `permID`= (SELECT permID FROM permissions WHERE code='biobank_specimen_create') OR
    `permID`= (SELECT permID FROM permissions WHERE code='biobank_specimen_update') OR
    `permID`= (SELECT permID FROM permissions WHERE code='biobank_container_view') OR
    `permID`= (SELECT permID FROM permissions WHERE code='biobank_container_create') OR
    `permID`= (SELECT permID FROM permissions WHERE code='biobank_container_update') OR
    `permID`= (SELECT permID FROM permissions WHERE code='biobank_pool_view') OR
    `permID`= (SELECT permID FROM permissions WHERE code='biobank_pool_create');

DELETE FROM permissions WHERE 
    `code`='biobank_specimen_view' OR 
    `code`='biobank_specimen_create' OR
    `code`='biobank_specimen_update' OR
    `code`='biobank_specimen_alter' OR
    `code`='biobank_container_view' OR
    `code`='biobank_container_create' OR
    `code`='biobank_container_update' OR
    `code`='biobank_pool_view' OR
    `code`='biobank_pool_create';

DELETE FROM ConfigSettings WHERE
    `Name`='biobankPath';

/*Loris Menu*/
SELECT OrderNumber INTO @ordernumber FROM LorisMenu WHERE Label='Imaging';
UPDATE LorisMenu SET OrderNumber=(OrderNumber+1) WHERE Parent IS NULL AND OrderNumber>@ordernumber;
INSERT INTO LorisMenu (Label, OrderNumber)
SELECT 'Biobank', OrderNumber+1 FROM LorisMenu WHERE Label='Imaging';

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES                  
    ('Specimens', 'biobank#specimens', (SELECT ID FROM LorisMenu as L WHERE Label='Biobank'), 1),
    ('Containers', 'biobank#containers', (SELECT ID FROM LorisMenu as L WHERE Label='Biobank'), 2),
    ('Pools', 'biobank#pools', (SELECT ID FROM LorisMenu as L WHERE Label='Biobank'), 3)
;

/*Permissions*/
INSERT INTO permissions (code, description, categoryID) VALUES
    ('biobank_specimen_view', 'Biobank: View Specimen Data', 2),
    ('biobank_specimen_create', 'Biobank: Create Specimen Data', 2),
    ('biobank_specimen_update', 'Biobank: Update Specimen Data', 2),
    ('biobank_specimen_alter', 'Biobank: Alter Specimen Data', 2),
    ('biobank_container_view', 'Biobank: View Container Data', 2),
    ('biobank_container_create', 'Biobank: Create Container Data', 2),
    ('biobank_container_update', 'Biobank: Update Container Data', 2),
    ('biobank_pool_view', 'Biobank: View Pool Data', 2),
    ('biobank_pool_create', 'Biobank: Create Pool Data', 2)
;

INSERT INTO user_perm_rel (userID, permID) VALUES
    ((SELECT ID From users WHERE UserID='admin'), (SELECT permID FROM permissions WHERE code='biobank_specimen_view')),
    ((SELECT ID From users WHERE UserID='admin'), (SELECT permID FROM permissions WHERE code='biobank_specimen_create')),
    ((SELECT ID From users WHERE UserID='admin'), (SELECT permID FROM permissions WHERE code='biobank_specimen_update')),
    ((SELECT ID From users WHERE UserID='admin'), (SELECT permID FROM permissions WHERE code='biobank_specimen_alter')),
    ((SELECT ID From users WHERE UserID='admin'), (SELECT permID FROM permissions WHERE code='biobank_container_view')),
    ((SELECT ID From users WHERE UserID='admin'), (SELECT permID FROM permissions WHERE code='biobank_container_create')),
    ((SELECT ID From users WHERE UserID='admin'), (SELECT permID FROM permissions WHERE code='biobank_container_update')),
    ((SELECT ID From users WHERE UserID='admin'), (SELECT permID FROM permissions WHERE code='biobank_pool_view')),
    ((SELECT ID From users WHERE UserID='admin'), (SELECT permID FROM permissions WHERE code='biobank_pool_create'))
;


/*Config*/
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
    SELECT 'biobankPath', 'Path to Biobank data files', 1, 0, 'text', ID, 'Biobank', 10
    FROM ConfigSettings
    WHERE Name="paths";

/*Specimen*/
INSERT INTO biobank_specimen_attribute_datatype (Datatype)
VALUES  ('boolean'),
        ('number'),
        ('text'),
        ('date'),
        ('time'),
        ('file')
;

INSERT INTO biobank_specimen_process (Label)
VALUES ('Collection'),
       ('Analysis'),
       ('Preparation')
;

/*Container*/
INSERT INTO biobank_container_status (Label)
VALUES  ('Available'),
        ('Reserved'),
        ('Dispensed'),
        ('Discarded'),
        ('Shipped')
;

