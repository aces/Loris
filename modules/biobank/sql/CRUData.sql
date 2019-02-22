-- INSERTS --


/* Ref table values have not been determined for CRU */

DROP TABLE IF EXISTS `biobank_cru_quality`;
DROP TABLE IF EXISTS `biobank_cru_ra`;

CREATE TABLE `biobank_cru_quality` (
  `Label` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `biobank_cru_ra` (
  `Label` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `biobank_cru_quality` (Label)
VALUES ('Good'), ('Bad'), ('Ugly')
;

INSERT INTO `biobank_cru_ra` (Label)
VALUES ('Henri'), ('Rida'), ('Zaliqa')
;

/*Global*/
INSERT INTO biobank_reference_table (TableName, ColumnName)
VALUES 	('biobank_cru_quality', 'Label'),
        ('biobank_cru_ra', 'Label')
;


/*Container*/
INSERT INTO biobank_unit (Label)
VALUES 	('µL'), 
        ('10⁶/mL'), 
        ('mL')
;

INSERT INTO biobank_container_capacity (Quantity, UnitId)
VALUES 	(10, (select UnitID from biobank_unit where Label='mL')),
        (1000, (select UnitID from biobank_unit where Label='µL'))
;

INSERT INTO biobank_container_dimension (X, Y, Z)
VALUES 	(1, 5, 1),
        (6, 1, 1),
        (4, 4, 1),
        (1, 3, 1),
        (4, 1, 1),
        (6, 4, 1),
        (10, 10, 1)
;

INSERT INTO biobank_container_type (Type, Descriptor, Label, `Primary`, ContainerCapacityID, ContainerDimensionID)
VALUES 	('Freezer', '5 Shelf', 'Freezer - 5 Shelf', 0, NULL,
          (select ContainerDimensionID from biobank_container_dimension where X=1 and Y=5 and Z=1)),
        ('Shelf', '6 Rack', 'Shelf - 6 Rack', 0, NULL,
          (select ContainerDimensionID from biobank_container_dimension where X=6 and Y=1 and Z=1)),
        ('Rack', '16 Box', 'Rack - 16 Box', 0, NULL,
          (select ContainerDimensionID from biobank_container_dimension where X=4 and Y=4 and Z=1)),
        ('Freezer', '3 Shelf', 'Freezer - 3 Shelf', 0, NULL,
          (select ContainerDimensionID from biobank_container_dimension where X=1 and Y=3 and Z=1)),
        ('Shelf', '4 Rack', 'Shelf - 4 Rack', 0, NULL,
          (select ContainerDimensionID from biobank_container_dimension where X=4 and Y=1 and Z=1)),
        ('Rack', '28 Box', 'Rack - 28 Box', 0, NULL,
          (select ContainerDimensionID from biobank_container_dimension where X=6 and Y=4 and Z=1)),
        ('Matrix Box', '10x10', 'Matrix Box - 10x10', 0, NULL, 
          (select ContainerDimensionID from biobank_container_dimension where X=10 and Y=10 and Z=1)),
        ('Tube', 'Red Top Tube', 'Red Top Tube (RTT)', 1,	
          (select ContainerCapacityID from biobank_container_capacity where Quantity=10 
          and UnitID=(select UnitID from biobank_unit where Label='mL')), 
          NULL),
        ('Tube', 'Green Top Tube', 'Green Top Tube (GTT)', 1,
          (select ContainerCapacityID from biobank_container_capacity where Quantity=10 
          and UnitID=(select UnitID from biobank_unit where Label='mL')), 
          NULL),
        ('Tube', 'Purple Top Tube', 'Purple Top Tube (PTT)', 1,
          (select ContainerCapacityID from biobank_container_capacity where Quantity=10 
          and UnitID=(select UnitID from biobank_unit where Label='mL')), 
          NULL),
        ('Tube', 'Cryotube', 'Cryotube Vial', 1,
          (select ContainerCapacityID from biobank_container_capacity where Quantity=1000 
          and UnitID=(select UnitID from biobank_unit where Label='µL')), 
          NULL)
;

/*Specimen*/
INSERT INTO biobank_specimen_type (Label, ParentSpecimenTypeID, FreezeThaw, Regex)
VALUES 	('Blood', NULL, 0, '/^\\d{10}$/'),
        ('Urine', NULL, 0, null),
        ('Serum', (select SpecimenTypeID from (select * from biobank_specimen_type) as bst where Label='Blood'), 1, null),
        ('Plasma', (select SpecimenTypeID from (select * from biobank_specimen_type) as bst where Label='Blood'), 1, null),
        ('DNA', (select SpecimenTypeID from (select * from biobank_specimen_type) as bst where Label='Blood'), 1, null),
        ('PBMC', (select SpecimenTypeID from (select * from biobank_specimen_type) as bst where Label='Blood'), 0, null),
        ('RNA', (select SpecimenTypeID from (select * from biobank_specimen_type) as bst where Label='PBMC'), 0, null),
        ('CSF', NULL, 1, NULL),
        ('Muscle Biopsy', NULL, 0, NULL),
        ('Skin Biopsy', NULL, 0, NULL),
        ('Buccal Swab', NULL, 0, NULL)
;

INSERT INTO biobank_specimen_protocol (Label, SpecimenTypeID)
VALUES ('BLD_001', (SELECT SpecimenTypeID FROM biobank_specimen_type WHERE Label='Blood')),
       ('BLD_002', (SELECT SpecimenTypeID FROM biobank_specimen_type WHERE Label='Blood')),
       ('URI_001', (SELECT SpecimenTypeID FROM biobank_specimen_type WHERE Label='Urine')),
       ('DNA_001', (SELECT SpecimenTypeID FROM biobank_specimen_type WHERE Label='DNA')),
       ('PBM_001', (SELECT SpecimenTypeID FROM biobank_specimen_type WHERE Label='PBMC')),
       ('CSF_001', (SELECT SpecimenTypeID FROM biobank_specimen_type WHERE Label='CSF'))
;

INSERT INTO biobank_specimen_method (Label, SpecimenTypeID)
VALUES ('BLD_101', (SELECT SpecimenTypeID FROM biobank_specimen_type WHERE Label='Blood')),
       ('BLD_102', (SELECT SpecimenTypeID FROM biobank_specimen_type WHERE Label='Blood')),
       ('URI_101', (SELECT SpecimenTypeID FROM biobank_specimen_type WHERE Label='Urine')),
       ('DNA_101', (SELECT SpecimenTypeID FROM biobank_specimen_type WHERE Label='DNA')),
       ('PBM_101', (SELECT SpecimenTypeID FROM biobank_specimen_type WHERE Label='PBMC')),
       ('CSF_101', (SELECT SpecimenTypeID FROM biobank_specimen_type WHERE Label='CSF'))
;

INSERT INTO biobank_specimen_attribute (Label, DatatypeID, ReferenceTableID)
VALUES 	('Quality', (SELECT DatatypeID FROM biobank_datatype WHERE Datatype='text'), 
          (SELECT ReferenceTableID FROM biobank_reference_table WHERE TableName='biobank_cru_quality'
           AND ColumnName='Label')),
        ('Processed By', (SELECT DatatypeID FROM biobank_datatype WHERE Datatype='text'),
          (SELECT ReferenceTableID FROM biobank_reference_table WHERE TableName='biobank_cru_ra'
           AND ColumnName='Label')),
        ('Hemodialysis Index', (SELECT DatatypeID FROM biobank_datatype WHERE Datatype='number'), NULL),
        ('Concentration', (SELECT DatatypeID FROM biobank_datatype WHERE Datatype='number'), NULL),
        ('260/280 Ratio', (SELECT DatatypeID FROM biobank_datatype WHERE Datatype='number'), NULL),
        ('Analysis File', (SELECT DatatypeID FROM biobank_datatype WHERE Datatype='file'), NULL)
;

INSERT INTO biobank_specimen_type_attribute_rel (SpecimenTypeID, SpecimenAttributeID, Required)
VALUES 	((select SpecimenTypeID from biobank_specimen_type where Label='Blood'), 
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Quality'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='Urine'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Quality'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='Serum'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Quality'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='Serum'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Processed By'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='Serum'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Hemodialysis Index'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='Plasma'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Quality'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='Plasma'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Processed By'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='Plasma'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Hemodialysis Index'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='DNA'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Quality'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='DNA'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Processed By'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='DNA'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Concentration'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='DNA'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='260/280 Ratio'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='PBMC'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Quality'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='PBMC'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Processed By'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='CSF'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Quality'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='CSF'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Processed By'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='Muscle Biopsy'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Quality'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='Skin Biopsy'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Quality'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='Buccal Swab'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Quality'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='Buccal Swab'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Processed By'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='Buccal Swab'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='Concentration'), 1),
        ((select SpecimenTypeID from biobank_specimen_type where Label='Buccal Swab'),
           (select SpecimenAttributeID from biobank_specimen_attribute where Label='260/280 ratio'), 1)
;

INSERT INTO biobank_specimen_protocol_attribute_rel (SpecimenProtocolID, SpecimenAttributeID, Required)
VALUES 	(1, 1, 1),
        (2, 1, 1),
        (3, 1, 1),
        (4, 1, 1),
        (1, 2, 1),
        (3, 2, 1),
        (4, 2, 0),
        (3, 3, 0),
        (4, 3, 1),
        (1, 4, 0),
        (4, 5, 0)
;

INSERT INTO biobank_specimen_method_attribute_rel (SpecimenMethodID, SpecimenAttributeID, Required)
VALUES 	(1, 6, 1),
        (2, 1, 1),
        (3, 1, 1),
        (4, 1, 1),
        (1, 2, 1),
        (3, 2, 1),
        (4, 2, 0),
        (3, 3, 0),
        (4, 3, 1),
        (1, 4, 0),
        (4, 5, 0)
;

INSERT INTO biobank_specimen_type_unit_rel (SpecimenTypeID, UnitID)
VALUES ((select SpecimenTypeID from biobank_specimen_type where Label='Blood'), 
         (select UnitID from biobank_unit where Label='mL')),
       ((select SpecimenTypeID from biobank_specimen_type where Label='Urine'), 
         (select UnitID from biobank_unit where Label='mL')),
       ((select SpecimenTypeID from biobank_specimen_type where Label='Serum'), 
         (select UnitID from biobank_unit where Label='µL')),
       ((select SpecimenTypeID from biobank_specimen_type where Label='Plasma'), 
         (select UnitID from biobank_unit where Label='µL')),
       ((select SpecimenTypeID from biobank_specimen_type where Label='DNA'), 
         (select UnitID from biobank_unit where Label='µL')),
       ((select SpecimenTypeID from biobank_specimen_type where Label='PBMC'), 
         (select UnitID from biobank_unit where Label='10⁶/mL')),
       ((select SpecimenTypeID from biobank_specimen_type where Label='RNA'), 
         (select UnitID from biobank_unit where Label='µL')),
       ((select SpecimenTypeID from biobank_specimen_type where Label='CSF'),
         (select UnitID from biobank_unit where Label='µL'))
;
