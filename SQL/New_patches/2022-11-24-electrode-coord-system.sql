-- -----------------------------------------------------
-- ADDED
-- Table `physiological_coord_system_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_type` (
  `PhysiologicalCoordSystemTypeID`  INT(10)     UNSIGNED  NOT NULL AUTO_INCREMENT,
  `Name`                            VARCHAR(20)           NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalCoordSystemTypeID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- insert 5
INSERT INTO physiological_coord_system_type
  (`Name`)
  VALUES
  ('Not registered'),
  ('Fiducials'),
  ('AnatomicalLandmark'),
  ('HeadCoil'),
  ('DigitizedHeadPoints');


-- -----------------------------------------------------
-- ADDED
-- Table `physiological_coord_system_name`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_name` (
  `PhysiologicalCoordSystemNameID`  INT(10)     UNSIGNED  NOT NULL AUTO_INCREMENT,
  `Name`                            VARCHAR(25)           NOT NULL UNIQUE,
  `Orientation`                     VARCHAR(5)            NULL,
  `Origin`                          VARCHAR(50)           NULL,
  PRIMARY KEY (`PhysiologicalCoordSystemNameID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- insert 19
INSERT INTO physiological_coord_system_name
  (`Name`, `Orientation`, `Origin`)
  VALUES
  ('Not registered', NULL, NULL),
  ('ACPC', 'RAS', 'anterior commissure'),
  ('Allen Institute', 'RAS', 'Bregma point'),
  ('Analyze', 'LAS', ''),
  ('BTi/4D', 'ALS', 'between the ears'),
  ('CTF', 'ALS', 'between the ears'),
  ('CTF MRI', 'ALS', 'between the ears'),
  ('CTF gradiometer', 'ALS', 'between the ears'),
  ('CapTrak', 'RAS', 'approximately between the ears'),
  ('Chieti ITAB', 'RAS', 'between the ears'),
  ('DICOM', 'LPS', 'centre of MRI gradient coil'),
  ('EEGLAB', 'ALS', 'between the ears'),
  ('FreeSurfer', 'RAS',	'center of isotropic 1mm 256x256x256 volume'),
  ('MNI', 'RAS', 'anterior commissure'),
  ('NIfTI', 'RAS', ''),
  ('Neuromag/Elekta/Megin', 'RAS', 'between the ears'),
  ('Paxinos-Franklin', 'RSP', 'Bregma point'),
  ('Scanner RAS (scanras)', 'RAS', 'scanner origin'),
  ('Talairach-Tournoux', 'RAS', 'anterior commissure'),
  ('Yokogawa', 'ALS', 'center of device');

-- -----------------------------------------------------
-- ADDED
-- Table `physiological_coord_unit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_unit` (
  `PhysiologicalCoordSystemUnitID`  INT(10)     UNSIGNED  NOT NULL AUTO_INCREMENT,
  `Name`                            VARCHAR(20)           NOT NULL UNIQUE,
  `Symbol`                          VARCHAR(5)            NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalCoordSystemUnitID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- insert 4
INSERT INTO physiological_coord_system_unit
  (`Name`, `Symbol`)
  VALUES
  ('Not registered', NULL),
  ('Millimeter', 'mm'),
  ('Centimeter', 'cm'),
  ('Meter', 'm');

-- -----------------------------------------------------
-- ADDED Value
-- to already existing `physiological_modality`
-- -----------------------------------------------------

INSERT INTO physiological_modality (`PhysiologicalModality`)
  VALUES ('Not registered');

-- -----------------------------------------------------
-- ADDED
-- Table `physiological_coord_system`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system` (
  `PhysiologicalCoordSystemID`  INT(10)     UNSIGNED  NOT NULL AUTO_INCREMENT,
  `NameID`                      INT(10)     UNSIGNED  NOT NULL,
  `TypeID`                      INT(10)     UNSIGNED  NOT NULL,
  `UnitID`                      INT(10)     UNSIGNED  NOT NULL,
  `ModalityID`                  INT(5)      UNSIGNED  NOT NULL,
  `FilePath`                    VARCHAR(255)          NULL,
  PRIMARY KEY (`PhysiologicalCoordSystemID`),
  CONSTRAINT `FK_PhysCoordSystemType_type`
    FOREIGN KEY (`TypeID`)
    REFERENCES `physiological_coord_system_type` (`PhysiologicalCoordSystemTypeID`),
  CONSTRAINT `FK_PhysCoordSystemName_name`
    FOREIGN KEY (`NameID`)
    REFERENCES `physiological_coord_system_name` (`PhysiologicalCoordSystemNameID`),
  CONSTRAINT `FK_PhysCoordSystemUnit_unit`
    FOREIGN KEY (`UnitID`)
    REFERENCES `physiological_coord_system_unit` (`PhysiologicalCoordSystemUnitID`),
  CONSTRAINT `FK_PhysCoordSystemModality_modality`
    FOREIGN KEY (`ModalityID`)
    REFERENCES `physiological_modality` (`PhysiologicalModalityID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- insert a dummy (`not registered` coord system)
INSERT INTO physiological_coord_system
  (`NameID`, `TypeID`, `UnitID`, `ModalityID`, `FilePath`)
  VALUES
  (
    (SELECT PhysiologicalCoordSystemNameID
      FROM physiological_coord_system_name
      WHERE Name = 'Not registered'),
    (SELECT PhysiologicalCoordSystemTypeID
      FROM physiological_coord_system_type
      WHERE Name = 'Not registered'),
    (SELECT PhysiologicalCoordSystemUnitID
      FROM physiological_coord_system_unit
      WHERE Name = 'Not registered'),
    (SELECT PhysiologicalModalityID
      FROM physiological_modality
      WHERE PhysiologicalModality = 'Not registered'),
    NULL
  );

-- -----------------------------------------------------
-- ADDED
-- Table `point_3d`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `point_3d` (
  `Point3DID` INT(10) UNSIGNED  NOT NULL AUTO_INCREMENT,
  `X`         DOUBLE            NULL,
  `Y`         DOUBLE            NULL,
  `Z`         DOUBLE            NULL,
  PRIMARY KEY (`Point3DID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- -----------------------------------------------------
-- ADDED
-- Table `physiological_coord_system_point_3d_rel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_point_3d_rel` (
  `PhysiologicalCoordSystemID` INT(10)     UNSIGNED NOT NULL,
  `Point3DID`                  INT(10)     UNSIGNED NOT NULL,
  `Name`                       VARCHAR(50)          NULL,
  PRIMARY KEY (`PhysiologicalCoordSystemID`, `Point3DID`),
  CONSTRAINT `fk_phys_coord_system_point_3d_rel_coord_system`
    FOREIGN KEY (`PhysiologicalCoordSystemID`)
    REFERENCES `physiological_coord_system` (`PhysiologicalCoordSystemID`),
  CONSTRAINT `fk_phys_coord_system_point_3d_rel_point`
    FOREIGN KEY (`Point3DID`)
    REFERENCES `point_3d` (`Point3DID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- -----------------------------------------------------
-- ADDED
-- Table `physiological_coord_system_electrode_rel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_electrode_rel` (
  `PhysiologicalCoordSystemID`  INT(10)    UNSIGNED   NOT NULL,
  `PhysiologicalElectrodeID`    INT(10)    UNSIGNED   NOT NULL,
  `PhysiologicalFileID`         INT(10)    UNSIGNED   NOT NULL,
  `InsertTime`                  TIMESTAMP             NOT NULL   DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (
    `PhysiologicalCoordSystemID`,
    `PhysiologicalElectrodeID`
  ),
  CONSTRAINT `FK_phys_coord_system_electrode_rel_coord_system`
    FOREIGN KEY (`PhysiologicalCoordSystemID`)
    REFERENCES `physiological_coord_system` (`PhysiologicalCoordSystemID`),
  CONSTRAINT `FK_phys_coord_system_electrode_rel_electrode`
    FOREIGN KEY (`PhysiologicalElectrodeID`)
    REFERENCES `physiological_electrode` (`PhysiologicalElectrodeID`),
  CONSTRAINT `FK_phys_coord_system_electrode_rel_phys_file`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`)
    ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- need insert before altering `physiological_electrode`
-- migrate/init every coord system already present to 'not registered' state
INSERT INTO physiological_coord_system_electrode_rel
  (PhysiologicalCoordSystemID, PhysiologicalElectrodeID, PhysiologicalFileID, InsertTime)
  SELECT DISTINCT
    -- PhysiologicalCoordSystemID = not registered
    (
      SELECT pcs.PhysiologicalCoordSystemID
      FROM physiological_coord_system AS pcs
      INNER JOIN physiological_coord_system_name AS pcsn
      WHERE pcsn.Name = 'Not registered'
    ) AS 'PhysiologicalCoordSystemID',
    -- PhysiologicalElectrodeID, PhysiologicalFileID, InsertTime
    PhysiologicalElectrodeID,
    PhysiologicalFileID,
    InsertTime
  FROM physiological_electrode;

-- -----------------------------------------------------
-- ALTERED
-- Table `physiological_electrode`
-- -----------------------------------------------------

-- Table point3D manages coordinates now
-- move coordinates to point_3d table

-- copy distinct coordinate to `point_3d` table
INSERT INTO point_3d
  (X, Y, Z)
  SELECT distinct X, Y, Z
  FROM physiological_electrode;

-- add the point3DID column to `physiological_electrode` table
ALTER TABLE physiological_electrode
  ADD Point3DID INT(10) UNSIGNED NOT NULL;

-- update the point3DID in `physiological_electrode` table
UPDATE point_3d as p, physiological_electrode as e
  SET e.Point3DID = p.Point3DID
  WHERE p.X = e.X
    AND p.Y = e.Y
    AND p.Z = e.Z;

-- add foreign key to validate change
ALTER TABLE physiological_electrode
  ADD CONSTRAINT `FK_phys_electrode_point_3d`
  FOREIGN KEY (`Point3DID`) REFERENCES `point_3d`(`Point3DID`);

-- drop coordinate from `physiological_electrode` table
ALTER TABLE physiological_electrode
  DROP COLUMN X;
ALTER TABLE physiological_electrode
  DROP COLUMN Y;
ALTER TABLE physiological_electrode
  DROP COLUMN Z;


-- `InsertTime` and `PhysiologicalFileID` will be moved
-- to the relation table `physiological_coord_system_electrode_rel`
ALTER TABLE physiological_electrode
  DROP COLUMN InsertTime;

ALTER TABLE physiological_electrode
  DROP FOREIGN KEY FK_phys_file_FileID_3;
ALTER TABLE physiological_electrode
  DROP COLUMN PhysiologicalFileID;
