
SELECT 'Running: SQL/New_patches/2018-01-17-normalisation_visit.sql';

ALTER TABLE project_rel DROP PRIMARY KEY;
ALTER TABLE project_rel ADD COLUMN `ProjectSubprojectRelID` int(10) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;
ALTER TABLE project_rel ADD CONSTRAINT UK_project_rel_ProjectID_SubprojectID UNIQUE KEY (ProjectID, SubprojectID);

CREATE TABLE `visit` (
  `VisitID` int(10) unsigned NOT NULL auto_increment,
  `VisitName` varchar(100) NOT NULL,
  CONSTRAINT `PK_visit` PRIMARY KEY (`VisitID`),
  CONSTRAINT `UK_visit_name` UNIQUE KEY (`VisitName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `visit_project_subproject_rel` (
  `VisitProjectSubprojectRelID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `VisitID` int(10) unsigned NOT NULL,
  `ProjectSubprojectRelID` int(10) unsigned NOT NULL,
  CONSTRAINT PK_visit_project_subproject_rel PRIMARY KEY (`VisitProjectSubprojectRelID`),
  CONSTRAINT UK_visit_project_subproject_rel_VisitID_ProjectSubprojectRelID UNIQUE KEY (`VisitID`, `ProjectSubprojectRelID`),
  CONSTRAINT FK_visit_project_subproject_rel_VisitID FOREIGN KEY (`VisitID`)
    REFERENCES `visit`(`VisitID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT FK_visit_project_subproject_rel_ProjectSubprojectRelID FOREIGN KEY (`ProjectSubprojectRelID`)
    REFERENCES `project_rel`(`ProjectSubprojectRelID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO visit (SELECT ID, Visit_label FROM Visit_Windows);
INSERT IGNORE INTO visit (SELECT null, Visit_label FROM session WHERE Visit_label NOT IN (SELECT VisitName FROM visit));

-- add visit from config.xml

SELECT 'Running: SQL/New_patches/2018-01-23-qc_module_patch.sql';

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES ('Quality Control','quality_control/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 10);

SELECT 'Running: SQL/New_patches/2018-02-27_normalize_mri_protocol.sql';

-- This patch adds min & max columns for every field in `mri_protocol` & `mri_protocol_checks` which presently can hold range values.
ALTER TABLE
	`mri_protocol`
		ADD COLUMN `TR_min` DECIMAL(10,4) DEFAULT NULL AFTER `Scan_type`,
		ADD COLUMN `TR_max` DECIMAL(10,4) DEFAULT NULL AFTER `TR_min`,
		ADD COLUMN `TE_min` DECIMAL(10,4) DEFAULT NULL AFTER `TR_max`,
		ADD COLUMN `TE_max` DECIMAL(10,4)  DEFAULT NULL AFTER `TE_min`,
		ADD COLUMN `TI_min` DECIMAL(10,4)  DEFAULT NULL AFTER `TE_max`,
		ADD COLUMN `TI_max` DECIMAL(10,4)  DEFAULT NULL AFTER `TI_min`,
		ADD COLUMN `slice_thickness_min` DECIMAL(7,4) DEFAULT NULL AFTER `TI_max`,
		ADD COLUMN `slice_thickness_max` DECIMAL(7,4) DEFAULT NULL AFTER `slice_thickness_min`,
		ADD COLUMN `xspace_min` int(4) DEFAULT NULL AFTER `slice_thickness_max`,
		ADD COLUMN `xspace_max` int(4) DEFAULT NULL AFTER `xspace_min`,
		ADD COLUMN `yspace_min` int(4) DEFAULT NULL AFTER `xspace_max`,
		ADD COLUMN `yspace_max` int(4) DEFAULT NULL AFTER `yspace_min`,
		ADD COLUMN `zspace_min` int(4) DEFAULT NULL AFTER `yspace_max`,
		ADD COLUMN `zspace_max` int(4) DEFAULT NULL AFTER `zspace_min`,
		ADD COLUMN `xstep_min` DECIMAL(9,4) DEFAULT NULL AFTER `zspace_max`,
		ADD COLUMN `xstep_max` DECIMAL(9,4) DEFAULT NULL AFTER `xstep_min`,
    ADD COLUMN `ystep_min` DECIMAL(9,4) DEFAULT NULL AFTER `xstep_max`,
    ADD COLUMN `ystep_max` DECIMAL(9,4) DEFAULT NULL AFTER `ystep_min`,
    ADD COLUMN `zstep_min` DECIMAL(9,4) DEFAULT NULL AFTER `ystep_max`,
    ADD COLUMN `zstep_max` DECIMAL(9,4) DEFAULT NULL AFTER `zstep_min`,
		ADD COLUMN `time_min` int(4) DEFAULT NULL AFTER `zstep_max`,
		ADD COLUMN `time_max` int(4) DEFAULT NULL AFTER `time_min`,
		DROP `FOV_x_range`,
		DROP `FOV_y_range`,
		DROP `FOV_z_range`;

ALTER TABLE
  `mri_protocol_checks`
    ADD COLUMN `ValidMin` int(4) DEFAULT NULL AFTER `Header`,
    ADD COLUMN `ValidMax` int(4) DEFAULT NULL AFTER `ValidMin`;


SELECT 'Running: SQL/New_patches/2018-08-27-BIDSScanTypeTable.sql';

CREATE TABLE `bids_category` (
 `BIDSCategoryID`   int(3)      UNSIGNED NOT NULL AUTO_INCREMENT,
 `BIDSCategoryName` varchar(10)          NOT NULL UNIQUE,
 PRIMARY KEY (`BIDSCategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `bids_category` (BIDSCategoryName) VALUES
      ('anat'),
      ('func'),
      ('dwi'),
      ('fmap');

CREATE TABLE `bids_scan_type_subcategory` (
  `BIDSScanTypeSubCategoryID` int(3)       UNSIGNED NOT NULL AUTO_INCREMENT,
  `BIDSScanTypeSubCategory`   varchar(100)          NOT NULL UNIQUE,
  PRIMARY KEY (`BIDSScanTypeSubCategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `bids_scan_type_subcategory` (BIDSScanTypeSubCategory) VALUES
  ('task-rest');

CREATE TABLE `bids_scan_type` (
  `BIDSScanTypeID` int(3)       UNSIGNED NOT NULL AUTO_INCREMENT,
  `BIDSScanType`   varchar(100)          NOT NULL UNIQUE,
  PRIMARY KEY (`BIDSScanTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `bids_scan_type` (BIDSScanType) VALUES
  ('bold'),
  ('FLAIR'),
  ('T1w'),
  ('T2w'),
  ('dwi');

CREATE TABLE `bids_mri_scan_type_rel` (
  `MRIScanTypeID`             int(10) UNSIGNED NOT NULL,
  `BIDSCategoryID`            int(3)  UNSIGNED DEFAULT NULL,
  `BIDSScanTypeSubCategoryID` int(3)  UNSIGNED DEFAULT NULL,
  `BIDSScanTypeID`            int(3)  UNSIGNED DEFAULT NULL,
  `BIDSEchoNumber`            int(3)  UNSIGNED DEFAULT NULL,
  PRIMARY KEY  (`MRIScanTypeID`),
  KEY `FK_bids_mri_scan_type_rel` (`MRIScanTypeID`),
  CONSTRAINT `FK_bids_mri_scan_type_rel`     FOREIGN KEY (`MRIScanTypeID`)             REFERENCES `mri_scan_type` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_bids_category`              FOREIGN KEY (`BIDSCategoryID`)            REFERENCES `bids_category`(`BIDSCategoryID`),
  CONSTRAINT `FK_bids_scan_type_subcategory` FOREIGN KEY (`BIDSScanTypeSubCategoryID`) REFERENCES `bids_scan_type_subcategory` (`BIDSScanTypeSubCategoryID`),
  CONSTRAINT `FK_bids_scan_type`             FOREIGN KEY (`BIDSScanTypeID`)            REFERENCES `bids_scan_type` (`BIDSScanTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Default schema scan types; make some of them named in a BIDS compliant manner
INSERT INTO bids_mri_scan_type_rel
  (MRIScanTypeID, BIDSCategoryID, BIDSScanTypeSubCategoryID, BIDSScanTypeID, BIDSEchoNumber)
  VALUES
  (
    (SELECT ID FROM mri_scan_type WHERE Scan_type = 'flair'),
    (SELECT BIDSCategoryID FROM bids_category WHERE BIDSCategoryName='anat'),
    NULL,
    (SELECT BIDSScanTypeID FROM bids_scan_type WHERE BIDSSCanType='FLAIR'),
    NULL
  ),
  (
    (SELECT ID FROM mri_scan_type WHERE Scan_type = 'fMRI'),
    (SELECT BIDSCategoryID FROM bids_category WHERE BIDSCategoryName='func'),
    (SELECT BIDSScanTypeSubCategoryID FROM bids_scan_type_subcategory WHERE BIDSScanTypeSubCategory='task-rest'),
    (SELECT BIDSScanTypeID FROM bids_scan_type WHERE BIDSSCanType='bold'),
    NULL
  ),
  (
    (SELECT ID FROM mri_scan_type WHERE Scan_type = 't1'),
    (SELECT BIDSCategoryID FROM bids_category WHERE BIDSCategoryName='anat'),
    NULL,
    (SELECT BIDSScanTypeID FROM bids_scan_type WHERE BIDSSCanType='T1w'),
    NULL
  ),
  (
    (SELECT ID FROM mri_scan_type WHERE Scan_type = 't2'),
    (SELECT BIDSCategoryID FROM bids_category WHERE BIDSCategoryName='anat'),
    NULL,
    (SELECT BIDSScanTypeID FROM bids_scan_type WHERE BIDSSCanType='T2w'),
    NULL
  ),
  (
    (SELECT ID FROM mri_scan_type WHERE Scan_type = 'dti'),
    (SELECT BIDSCategoryID FROM bids_category WHERE BIDSCategoryName='dwi'),
    NULL,
    (SELECT BIDSScanTypeID FROM bids_scan_type WHERE BIDSSCanType='dwi'),
    NULL
  );

SELECT 'Running: SQL/New_patches/2018-08-27-GenderToSex.sql';

ALTER TABLE `candidate` CHANGE COLUMN Gender Sex enum('Male','Female');
ALTER TABLE `candidate` CHANGE COLUMN ProbandGender ProbandSex enum('Male','Female');

ALTER TABLE `tarchive` CHANGE PatientGender PatientSex varchar(255);

SELECT 'Running: SQL/New_patches/2018-11-05-rename_candidate_CenterID_to_RegistrationCenterID.sql';

ALTER TABLE `candidate` DROP FOREIGN KEY `FK_candidate_1`;
ALTER TABLE `candidate` 
    CHANGE COLUMN `CenterID` `RegistrationCenterID` integer unsigned NOT NULL DEFAULT '0';
ALTER TABLE `candidate`
  ADD CONSTRAINT `FK_candidate_1` FOREIGN KEY (`RegistrationCenterID`) REFERENCES `psc` (`CenterID`);


SELECT 'Running: SQL/New_patches/2018-11-29-Add_instrument_manager_permission.sql';

INSERT INTO permissions (code,description,categoryID) VALUES ('instrument_manager_read','Instrument Manager: View module',(SELECT ID FROM permissions_category WHERE Description = 'Permission'));
INSERT INTO permissions (code,description,categoryID) VALUES ('instrument_manager_write','Instrument Manager: Install new instruments via file upload',(SELECT ID FROM permissions_category WHERE Description = 'Permission'));

INSERT IGNORE INTO user_perm_rel
SELECT upr.userID, p.permID FROM user_perm_rel upr JOIN permissions p WHERE upr.permID=1 AND p.code IN ('instrument_manager_read', 'instrument_manager_write');

INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='instrument_manager_read' AND m.Label='Instrument Manager';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='instrument_manager_write' AND m.Label='Instrument Manager';

SELECT 'Running: SQL/New_patches/2019-01-28_Add_Pwned_Password_ConfigSetting.sql';

-- Adds the option to toggle the usage of the Pwned Passwords
-- API (https://haveibeenpwned.com/API/v2#PwnedPasswords) in a project. This
-- is enabled by default to allow for a higher level of security. This
-- setting is added to allow projects to disable the API check in case of
-- networking issues.
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
    'usePwnedPasswordsAPI',
    'Whether to query the Have I Been Pwned password API on password changes to prevent the usage of common and breached passwords',
    1,
    0,
    'boolean',
    ID,
    'Enable "Pwned Password" check',
    22
  FROM
    ConfigSettings
  WHERE
    Name="study";

INSERT INTO Config (ConfigID, Value) SELECT ID, 'true' FROM ConfigSettings WHERE Name="usePwnedPasswordsAPI";

SELECT 'Running: SQL/New_patches/2019-02-08_cleanup_duplicated_data_path_in_Config.sql';

-- Remove entries for mincPath and data from the Config table
DELETE
FROM Config
WHERE ConfigID IN (
  SELECT ID
  FROM ConfigSettings
  WHERE Name IN ('mincPath', 'data')
);

-- Remove entries for mincPath and data from the ConfigSettings table
DELETE
FROM ConfigSettings
WHERE Name IN ('mincPath', 'data');

SELECT 'Running: SQL/New_patches/2019-03-20-session-notnull.sql';

ALTER TABLE `session` 
CHANGE COLUMN `CenterID` `CenterID` INTEGER UNSIGNED NOT NULL,
CHANGE COLUMN `Visit_label` `Visit_label` varchar(255) NOT NULL;
SELECT 'Running: SQL/New_patches/2019-04-04_add_image_type_to_mri_protocol.sql';

-- Add an image_type column to be used for scan identification 
-- in the mri_protocol and mri_protocol_violated_scans tables

ALTER TABLE mri_protocol 
  ADD COLUMN `image_type` varchar(255) default NULL;

ALTER TABLE mri_protocol_violated_scans
  ADD COLUMN `image_type` varchar(255) default NULL;

SELECT 'Running: SQL/New_patches/2019-04-26-Delete_cascades_parameter_type_rel.sql';

ALTER TABLE parameter_type_category_rel DROP FOREIGN KEY `FK_parameter_type_category_rel_1`;
ALTER TABLE parameter_type_category_rel DROP FOREIGN KEY `FK_parameter_type_category_rel_2`;

ALTER TABLE parameter_type_category_rel ADD CONSTRAINT `FK_parameter_type_category_rel_1` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`) ON DELETE CASCADE;
ALTER TABLE parameter_type_category_rel ADD CONSTRAINT `FK_parameter_type_category_rel_2` FOREIGN KEY (`ParameterTypeCategoryID`) REFERENCES `parameter_type_category` (`ParameterTypeCategoryID`) ON DELETE CASCADE;

SELECT 'Running: SQL/New_patches/2019-05-03-deprecate_useprojects.sql';

DELETE cs, c FROM ConfigSettings cs JOIN Config c ON c.ConfigID=cs.ID WHERE cs.Name='useProjects';

-- if Project table is empty, add default 'loris' project
INSERT INTO Project (Name)
(SELECT 'loris' FROM DUAL
WHERE NOT EXISTS (SELECT * FROM Project));

-- associate all subprojects to the loris project by default if project table was empty
INSERT INTO project_rel (ProjectID,SubprojectID)
SELECT ProjectID, SubprojectID 
FROM Project JOIN subproject 
WHERE Project.Name='loris';

-- if the loris project was added, set all candidates to that default project
UPDATE candidate SET ProjectID=(SELECT ProjectID FROM Project WHERE Name='loris') WHERE ProjectID IS NULL AND Entity_type='Human';

SELECT 'Running: SQL/New_patches/2019-05-15-LorisMenuPermissions_QC_and_datarelease.sql';

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_release_upload' AND m.Label='Data Release';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_release_edit_file_access' AND m.Label='Data Release';

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_team_helper' AND m.Label='Quality Control';


SELECT 'Running: SQL/New_patches/2019-05-22-ChangePublicationPathsToWebPathType.sql';

-- The publication paths were set to text in earlier versions of LORIS. They
-- should have the 'web_path' type so that they are properly validated in LORIS.
UPDATE ConfigSettings SET DataType="web_path" WHERE Name LIKE "publication%";

SELECT 'Running: SQL/New_patches/2019-05-23-correct_type_ValidMin_ValidMax_of_mri_protocol_checks.sql';

-- Change the type of mri_protocol_checks' ValidMin and ValidMax columns to be decimals 
-- instead of INT as these columns can contain decimal values.
ALTER TABLE mri_protocol_checks CHANGE `ValidMin` `ValidMin` decimal(10,4) DEFAULT NULL;
ALTER TABLE mri_protocol_checks CHANGE `ValidMax` `ValidMax` decimal(10,4) DEFAULT NULL;

SELECT 'Running: SQL/New_patches/2019-06-06-AddActiveToNotificationSpool.sql';

-- ----------------------------------------------------------------------------------------------
--
-- Adds the Active column to the notification spool table. Active log entries refer to the 
-- entries of the last upload associated to a given upload ID. The entries that belong to 
-- previous uploads will have their Active column set to 'N'.
--
-- ----------------------------------------------------------------------------------------------

ALTER TABLE notification_spool ADD COLUMN Active enum('Y', 'N') NOT NULL DEFAULT 'Y' AFTER Origin;

SELECT 'Running: SQL/New_patches/2019-06-13-LorisMenuPermissions_IssueTracker.sql';

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='issue_tracker_developer' AND m.Label='Issue Tracker';
