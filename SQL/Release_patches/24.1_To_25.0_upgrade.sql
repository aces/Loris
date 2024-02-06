
SELECT 'Running: SQL/Archive/25.0/2021-03-01-publication-add-columns.sql';

ALTER TABLE publication
    ADD COLUMN journal varchar(255) DEFAULT NULL,
    ADD COLUMN doi text DEFAULT NULL,
    ADD COLUMN datePublication date DEFAULT NULL,
    ADD COLUMN link varchar(255) DEFAULT NULL,
    ADD COLUMN publishingStatus enum('In Progress','Published') DEFAULT NULL,
    ADD COLUMN project int(10) unsigned DEFAULT NULL,
    ADD CONSTRAINT `FK_publication_project`
    FOREIGN KEY (project) REFERENCES Project(ProjectID);

SELECT 'Running: SQL/Archive/25.0/2021-09-13_fix_project_primary_key.sql';

-- Add a unique constraint on Project.Name
CREATE UNIQUE INDEX `u_ProjectName` ON `Project` (`Name`);


SELECT 'Running: SQL/Archive/25.0/2021-12-01-make_subproject_titles_unique.sql';

ALTER TABLE subproject ADD UNIQUE (`title`);

SELECT 'Running: SQL/Archive/25.0/2022-03-03-AddHEDTags.sql';

-- ############################## CAPTURE HEDVersion ########################## --
-- HEDVersion from dataset_description.json to be added to parameter_type
-- Entry in physiological_parameter_file will be added on dataset import**
INSERT INTO parameter_type (Name, Type, Description, SourceFrom) VALUES
    ('HEDVersion', 'text', 'HED Schema Version','physiological_parameter_file')
;

-- ############################## HANDLE EVENT FILES ########################## --
-- Create `physiological_event_file` table
CREATE TABLE `physiological_event_file` (
    `EventFileID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PhysiologicalFileID` int(10) unsigned NOT NULL,
    `FileType` varchar(20) NOT NULL,
    `FilePath` varchar(255) DEFAULT NULL,
    `LastUpdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `LastWritten` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`EventFileID`),
    KEY `FK_physio_file_ID` (`PhysiologicalFileID`),
    KEY `FK_event_file_type` (`FileType`),
    CONSTRAINT `FK_event_file_type` FOREIGN KEY (`FileType`) REFERENCES `ImagingFileTypes` (`type`),
    CONSTRAINT `FK_physio_file_ID` FOREIGN KEY (`PhysiologicalFileID`) REFERENCES `physiological_file` (`PhysiologicalFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
;

-- Create reference to EventFileID in `physiological_task_event` table
SET FOREIGN_KEY_CHECKS= 0;
ALTER TABLE physiological_task_event
    ADD COLUMN `EventFileID` int(10) unsigned NOT NULL AFTER PhysiologicalFileID,
    ADD KEY `FK_event_file` (`EventFileID`),
    ADD CONSTRAINT `FK_event_file` FOREIGN KEY (`EventFileID`) REFERENCES `physiological_event_file` (`EventFileID`)
;

-- Create column for assembled HEd tags in `physiological_task_event` table
ALTER TABLE physiological_task_event
    ADD COLUMN `AssembledHED` text DEFAULT NULL
;

-- Insert files into `physiological_event_file` table
INSERT INTO physiological_event_file (PhysiologicalFileID, FilePath, FileType)
    SELECT DISTINCT PhysiologicalFileID, FilePath, 'tsv' FROM physiological_task_event
;

-- Update EventFileID reference in `physiological_task_event` table
UPDATE physiological_task_event te
    SET EventFileID=(SELECT EventFileID FROM physiological_event_file WHERE PhysiologicalFileID=te.PhysiologicalFileID)
;
SET FOREIGN_KEY_CHECKS= 1;

-- Delete FilePath column in `physiological_task_event` table
ALTER TABLE physiological_task_event
    DROP COLUMN FilePath
;


-- ############################## EVENT FILES ARCHIVE ########################## --
CREATE TABLE `physiological_event_archive` (
    `EventArchiveID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PhysiologicalFileID` int(10) unsigned NOT NULL,
    `Blake2bHash` varchar(128) NOT NULL,
    `FilePath` varchar(255) NOT NULL,
    PRIMARY KEY (`EventArchiveID`),
    KEY `FK_phy_file_ID` (`PhysiologicalFileID`),
    CONSTRAINT `FK_phy_file_ID` FOREIGN KEY (`PhysiologicalFileID`) REFERENCES `physiological_file` (`PhysiologicalFileID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8
;


-- ############################## CAPTURE EVENT PARAMETERS ########################## --
CREATE TABLE `physiological_event_parameter` (
    `EventParameterID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `EventFileID` int(10) unsigned NOT NULL,
    `ParameterName` varchar(255) NOT NULL,
    `Description` text DEFAULT NULL,
    `LongName` varchar(255) DEFAULT NULL,
    `Units` varchar(50) DEFAULT NULL,
    `isCategorical` enum('Y', 'N') DEFAULT NULL,
    `HED` text DEFAULT NULL,
    PRIMARY KEY (`EventParameterID`),
    KEY `FK_event_file_ID` (`EventFileID`),
    CONSTRAINT `FK_event_file_ID` FOREIGN KEY (`EventFileID`) REFERENCES `physiological_event_file` (`EventFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
;

CREATE TABLE `physiological_event_parameter_category_level` (
    `CategoricalLevelID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `EventParameterID` int(10) unsigned NOT NULL,
    `LevelName` varchar(255) NOT NULL,
    `Description` text DEFAULT NULL,
    `HED` text DEFAULT NULL,
    PRIMARY KEY (`CategoricalLevelID`),
    KEY `FK_event_param_ID` (`EventParameterID`),
    CONSTRAINT `FK_event_param_ID` FOREIGN KEY (`EventParameterID`) REFERENCES `physiological_event_parameter` (`EventParameterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
;

SELECT 'Running: SQL/Archive/25.0/2022-11-22-eeg-additional-events-table.sql';

-- Create `physiological_task_event_opt` table
-- tracks additional events from bids archives
CREATE TABLE `physiological_task_event_opt` (
    `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PhysiologicalTaskEventID` int(10) unsigned NOT NULL,
    `PropertyName`             varchar(50) NOT NULL,
    `PropertyValue`            varchar(255) NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_event_task_opt`
        FOREIGN KEY (`PhysiologicalTaskEventID`)
        REFERENCES `physiological_task_event` (`PhysiologicalTaskEventID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
SELECT 'Running: SQL/Archive/25.0/2022-11-24-electrode-coord-system.sql';

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

SELECT 'Running: SQL/Archive/25.0/2022-12-01-subprojects_no_more.sql';

ALTER TABLE subproject RENAME TO cohort;
ALTER TABLE project_subproject_rel RENAME TO project_cohort_rel;
ALTER TABLE visit_project_subproject_rel RENAME TO visit_project_cohort_rel;

ALTER TABLE cohort CHANGE `SubprojectID` `CohortID` int(10) unsigned NOT NULL auto_increment;
ALTER TABLE project_cohort_rel CHANGE `ProjectSubprojectRelID` `ProjectCohortRelID` int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE project_cohort_rel CHANGE `SubprojectID` `CohortID` int(10) unsigned NOT NULL;
ALTER TABLE session CHANGE `SubprojectID` `CohortID` int(10) unsigned DEFAULT NULL;
ALTER TABLE test_battery CHANGE `SubprojectID` `CohortID` int(10) unsigned DEFAULT NULL;
ALTER TABLE mri_protocol_checks_group_target CHANGE `SubprojectID` `CohortID` int(10) unsigned DEFAULT NULL;
ALTER TABLE mri_protocol_group_target CHANGE `SubprojectID` `CohortID` int(10) unsigned DEFAULT NULL;
ALTER TABLE visit_project_cohort_rel CHANGE `VisitProjectSubprojectRelID` `VisitProjectCohortRelID` int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE visit_project_cohort_rel CHANGE `ProjectSubprojectRelID` `ProjectCohortRelID` int(10) unsigned NOT NULL;


/**
REVERT PATCH

ALTER TABLE cohort RENAME TO subproject;
ALTER TABLE project_cohort_rel RENAME TO project_subproject_rel;
ALTER TABLE visit_project_cohort_rel RENAME TO visit_project_subproject_rel;

ALTER TABLE subproject CHANGE `CohortID` `SubprojectID` int(10) unsigned NOT NULL auto_increment;
ALTER TABLE project_subproject_rel CHANGE `ProjectCohortRelID` `ProjectSubprojectRelID` int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE project_subproject_rel CHANGE `CohortID` `SubprojectID` int(10) unsigned NOT NULL;
ALTER TABLE session CHANGE `CohortID` `SubprojectID` int(10) unsigned DEFAULT NULL;
ALTER TABLE test_battery CHANGE `CohortID` `SubprojectID` int(10) unsigned DEFAULT NULL;
ALTER TABLE mri_protocol_checks_group_target CHANGE `CohortID` `SubprojectID` int(10) unsigned DEFAULT NULL;
ALTER TABLE mri_protocol_group_target CHANGE `CohortID` `SubprojectID` int(10) unsigned DEFAULT NULL;
ALTER TABLE visit_project_subproject_rel CHANGE `VisitProjectCohortRelID` `VisitProjectSubprojectRelID` int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE visit_project_subproject_rel CHANGE `ProjectCohortRelID` `ProjectSubprojectRelID` int(10) unsigned NOT NULL;
 */

SELECT 'Running: SQL/Archive/25.0/2022-12-05-AddVizConfig.sql';

-- Adds the option to toggle the EEG Browser visualization components (disabled by default).
INSERT INTO ConfigSettings
  (
    Name,
    Description,
    Visible,
    AllowMultiple,
    DataType,
    Parent,
    Label,
    OrderNumber
  )
  SELECT
    'useEEGBrowserVisualizationComponents',
    'Whether to enable the visualization components on the EEG Browser module',
    1,
    0,
    'boolean',
    ID,
    'Enable the EEG Browser components',
    4
  FROM
    ConfigSettings
  WHERE
    Name="gui";

INSERT INTO Config (ConfigID, Value) SELECT ID, 'false' FROM ConfigSettings WHERE Name="useEEGBrowserVisualizationComponents";

SELECT 'Running: SQL/Archive/25.0/2022-12-20-instrumentpermissions.sql';

CREATE TABLE `testnames_permissions_rel` (
    `TestID` int(10) unsigned NOT NULL,
    `permID` int(10) unsigned NOT NULL,
    PRIMARY KEY  (`TestID`,`permID`),
    CONSTRAINT `FK_testnames_permissions_rel_test` FOREIGN KEY (`TestID`) REFERENCES `test_names` (`ID`),
    CONSTRAINT `FK_testnames_permissions_rel_perm` FOREIGN KEY (`permID`) REFERENCES `permissions` (`permID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SELECT 'Running: SQL/Archive/25.0/2022-12-20-project-name-not-null.sql';

ALTER TABLE `Project`
MODIFY `Name` VARCHAR(255) NOT NULL;

SELECT 'Running: SQL/Archive/25.0/2023-01-19_add_index_on_violations_resolved.sql';

CREATE INDEX `i_violations_resolved_extid_type` ON `violations_resolved` (`ExtID`, `TypeTable`);


SELECT 'Running: SQL/Archive/25.0/2023-01-31-add-date-stage-change.sql';

ALTER TABLE session
	ADD COLUMN Date_status_change date DEFAULT NULL AFTER Date_visit;
SELECT 'Running: SQL/Archive/25.0/2023-02-17-imaging-new-config.sql';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'createVisit', 'Enable visit creation in the imaging pipeline', 1, 0, 'boolean', ID, 'Enable visit creation', 11 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'default_project', 'Default project used when creating scan candidate or visit', 1, 0, 'text', ID, 'Default project', 12 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'default_cohort', 'Default cohort used when creating scan visit', 1, 0, 'text', ID, 'Default cohort', 13 FROM ConfigSettings WHERE Name="imaging_pipeline";

UPDATE ConfigSettings SET Label = 'Enable candidate creation' WHERE Name = 'createCandidates';

UPDATE ConfigSettings SET OrderNumber = 14 WHERE Name = 'default_bids_vl';
UPDATE ConfigSettings SET OrderNumber = 15 WHERE Name = 'is_qsub';
UPDATE ConfigSettings SET OrderNumber = 16 WHERE Name = 'DTI_volumes';
UPDATE ConfigSettings SET OrderNumber = 17 WHERE Name = 't1_scan_type';
UPDATE ConfigSettings SET OrderNumber = 18 WHERE Name = 'reject_thresh';
UPDATE ConfigSettings SET OrderNumber = 19 WHERE Name = 'niak_path';
UPDATE ConfigSettings SET OrderNumber = 20 WHERE Name = 'QCed2_step';
UPDATE ConfigSettings SET OrderNumber = 21 WHERE Name = 'excluded_series_description';
UPDATE ConfigSettings SET OrderNumber = 22 WHERE Name = 'ComputeDeepQC';
UPDATE ConfigSettings SET OrderNumber = 23 WHERE Name = 'MriConfigFile';
UPDATE ConfigSettings SET OrderNumber = 24 WHERE Name = 'EnvironmentFile';
UPDATE ConfigSettings SET OrderNumber = 25 WHERE Name = 'compute_snr_modalities';
UPDATE ConfigSettings SET OrderNumber = 26 WHERE Name = 'reference_scan_type_for_defacing';
UPDATE ConfigSettings SET OrderNumber = 27 WHERE Name = 'modalities_to_deface';
UPDATE ConfigSettings SET OrderNumber = 28 WHERE Name = 'MriPythonConfigFile';

SELECT 'Running: SQL/Archive/25.0/2023-02-24-electrophysiology_uploader.sql';

-- Create EEG upload table
CREATE TABLE `electrophysiology_uploader` (
    `UploadID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `UploadedBy` varchar(255) NOT NULL,
    `UploadDate` DateTime NOT NULL,
    `UploadLocation` varchar(255) NOT NULL,
    `Status` enum('Not Started', 'Extracted', 'In Progress', 'Complete', 'Failed', 'Archived') DEFAULT 'Not Started',
    `SessionID` int(10) unsigned,
    `Checksum` varchar(40) DEFAULT NULL,
    `MetaData` TEXT DEFAULT NULL,
    PRIMARY KEY (`UploadID`),
    KEY (`SessionID`),
    CONSTRAINT `FK_eegupload_SessionID`
        FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`),
    CONSTRAINT `FK_eegupload_UploadedBy`
        FOREIGN KEY (`UploadedBy`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Add to module table
INSERT INTO modules (Name, Active) VALUES ('electrophysiology_uploader', 'Y');

-- Add new configurations for eeg uploader
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
    SELECT 'EEGUploadIncomingPath', 'Path to the upload directory for incoming EEG studies', 1, 0, 'text', ID, 'EEG Incoming Directory', 7 FROM ConfigSettings WHERE Name="paths";

-- Add new permissions for eeg uploader
INSERT INTO permissions (code, description, moduleID, action, categoryID) VALUES
    ('monitor_eeg_uploads','Monitor EEG uploads',(SELECT ID FROM modules WHERE Name='electrophysiology_uploader'),NULL,'2');

SELECT 'Running: SQL/Archive/25.0/2023-02-28_create_max_days_inactive_config_for_users.sql';

INSERT INTO ConfigSettings
    (
        Name,
        Description,
        Visible,
        AllowMultiple,
        DataType,
        Parent,
        Label,
        OrderNumber
    )
    SELECT
        'UserMaximumDaysInactive',
        'The maximum number of days since last login before making a user inactive',
        1,
        0,
        'text',
        ID,
        'Maximum Days Before Making User Inactive',
        30
    FROM ConfigSettings
    WHERE Name="study";

INSERT INTO Config (ConfigID, Value) SELECT ID, "365" FROM ConfigSettings WHERE Name="UserMaximumDaysInactive";

SELECT 'Running: SQL/Archive/25.0/2023-04-24_add_phase_enc_dir_and_echo_number_to_MRICandidateErrors.sql';

-- ---------------------------------------------------------------------------------------------
-- alter MRICandidateErrors table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE MRICandidateErrors ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)  DEFAULT NULL;
ALTER TABLE MRICandidateErrors ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;
