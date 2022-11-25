-- -----------------------------------------------------
-- ADDED
-- Table `physiological_coord_system_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_type` (
  `PhysiologicalCoordSystemTypeID`  INT(10)     UNSIGNED  NOT NULL AUTO_INCREMENT,
  `Name`                            VARCHAR(20)           NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalCoordSystemTypeID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- insert
INSERT INTO physiological_coord_system_type
  (`Name`)
  VALUES
  ('Not registered'),
  ('MEG'),
  ('EEG'),
  ('iEEG'),
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

-- insert
INSERT INTO physiological_coord_system_name
  (`Name`, `Orientation`, `Origin`)
  VALUES
  ('Not registered', NULL, NULL),
  ('ACPC', 'RAS', 'anterior commissure'),
  ('Allen Institute', 'RAS', 'Bregma point'),
  ('Analyze', 'LAS', ''),
  ('BTi/4D', 'ALS', 'between the ears'),
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

INSERT INTO physiological_coord_system_unit
  (`Name`, `Symbol`)
  VALUES
  ('Not registered', NULL),
  ('Millimeter', 'mm'),
  ('Centimeter', 'cm'),
  ('Meter', 'm');

-- -----------------------------------------------------
-- ADDED
-- Table `physiological_coord_system`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system` (
  `PhysiologicalCoordSystemID`  INT(10)     UNSIGNED  NOT NULL AUTO_INCREMENT,
  `CoordNameID`                 INT(10)     UNSIGNED  NOT NULL,
  `CoordTypeID`                 INT(10)     UNSIGNED  NOT NULL,
  `CoordUnitID`                 INT(10)     UNSIGNED  NOT NULL,
  `FilePath`                    VARCHAR(255)          NULL,
  `CoordNASX`                   DECIMAL(12,6)         NOT NULL,
  `CoordNASY`                   DECIMAL(12,6)         NOT NULL,
  `CoordNASZ`                   DECIMAL(12,6)         NOT NULL,
  `CoordLPAX`                   DECIMAL(12,6)         NOT NULL,
  `CoordLPAY`                   DECIMAL(12,6)         NOT NULL,
  `CoordLPAZ`                   DECIMAL(12,6)         NOT NULL,
  `CoordRPAX`                   DECIMAL(12,6)         NOT NULL,
  `CoordRPAY`                   DECIMAL(12,6)         NOT NULL,
  `CoordRPAZ`                   DECIMAL(12,6)         NOT NULL,
  PRIMARY KEY (`PhysiologicalCoordSystemID`),
  CONSTRAINT `FK_PhysCoordSystemType_type`
    FOREIGN KEY (`CoordTypeID`)
    REFERENCES `physiological_coord_system_type` (`PhysiologicalCoordSystemTypeID`),
  CONSTRAINT `FK_PhysCoordSystemName_name`
    FOREIGN KEY (`CoordNameID`)
    REFERENCES `physiological_coord_system_name` (`PhysiologicalCoordSystemNameID`),
  CONSTRAINT `FK_PhysCoordSystemUnit_unit`
    FOREIGN KEY (`CoordUnitID`)
    REFERENCES `physiological_coord_system_unit` (`PhysiologicalCoordSystemUnitID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- insert a dummy (`not registered` coord system)
INSERT INTO physiological_coord_system
  (
    `CoordNameID`, `CoordTypeID`, `CoordUnitID`, `FilePath`,
    `CoordNASX`, `CoordNASY`, `CoordNASZ`,
    `CoordLPAX`, `CoordLPAY`, `CoordLPAZ`,
    `CoordRPAX`, `CoordRPAY`, `CoordRPAZ`
  )
  VALUES
  (
    (SELECT PhysiologicalCoordSystemNameID FROM physiological_coord_system_name WHERE Name = 'Not registered'),
    (SELECT PhysiologicalCoordSystemTypeID FROM physiological_coord_system_type WHERE Name = 'Not registered'),
    (SELECT PhysiologicalCoordSystemUnitID FROM physiological_coord_system_unit WHERE Name = 'Not registered'),
    NULL,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0
  );


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
  CONSTRAINT `FK_phys_coord_system_electrode_rel_phys_file`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`),
  CONSTRAINT `FK_phys_coord_system_electrode_rel_electrode`
    FOREIGN KEY (`PhysiologicalElectrodeID`)
    REFERENCES `physiological_electrode` (`PhysiologicalElectrodeID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


-- need insert before altering `physiological_electrode`
-- migrate/init every coord system already present to 'not registered'
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

-- `InsertTime` and `PhysiologicalFileID` will be moved
-- to the relation table `physiological_coord_system_electrode_rel`
ALTER TABLE physiological_electrode
  DROP COLUMN InsertTime;

ALTER TABLE physiological_electrode
  DROP FOREIGN KEY FK_phys_file_FileID_3;
ALTER TABLE physiological_electrode
  DROP COLUMN PhysiologicalFileID;
