
SELECT 'Running: SQL/New_patches/2018-05-18-adding_physiological_all_sites_permissions.sql';

INSERT INTO permissions 
    (
        code, 
        description, 
        categoryID
    ) VALUES (
        'electrophysiology_browser_view_allsites',
        'View all-sites Electrophysiology Browser pages',
        (SELECT ID FROM permissions_category WHERE Description='Permission')
    );

INSERT INTO permissions
    (
        code,
        description,
        categoryID
    ) VALUES (
        'electrophysiology_browser_view_site',
        'View own site Electrophysiology Browser pages',
        (SELECT ID FROM permissions_category WHERE Description='Permission')
    );

INSERT INTO user_perm_rel
    (
      UserID,
      PermID
    ) VALUES (
      (SELECT ID FROM users WHERE UserID='admin'),
      (SELECT permID FROM permissions WHERE code='electrophysiology_browser_view_allsites')
    );

INSERT INTO user_perm_rel
    (
      UserID,
      PermID
    ) VALUES (
      (SELECT ID FROM users WHERE UserID='admin'),
      (SELECT permID FROM permissions WHERE code='electrophysiology_browser_view_site')
    );

SELECT 'Running: SQL/New_patches/2019-02-08-multiple_mri_protocols.sql';

-- ####################################################################################
--
-- SQL patch used to allow the usage of multiple MRI protocols within a given
-- study
--
-- ####################################################################################

-- -----------------------------------------------------------------------------------
--
-- mri_protocol_group table
--
-- By default, there is only one MRI protocol group
--
-- -----------------------------------------------------------------------------------
CREATE TABLE `mri_protocol_group` (
    `MriProtocolGroupID`   INT(4) UNSIGNED NOT NULL AUTO_INCREMENT,
    `Name`                 VARCHAR(255)    NOT NULL UNIQUE,
    PRIMARY KEY (`MriProtocolGroupID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4;
INSERT INTO `mri_protocol_group` (`Name`) VALUES('Default MRI protocol group');


-- -----------------------------------------------------------------------------------
--
-- mri_protocol_group_target table
--
-- Specify the MRI protocol group (or set of lines in mri_protocol) to use to
-- identify the type of a given scan based on the candidate's project
-- ID, the session's subproject ID and visit label.
--
-- By default, all scans use the default MRI protocol group for scan type
-- identification purposes
--
-- -----------------------------------------------------------------------------------
CREATE TABLE `mri_protocol_group_target` (
     `MriProtocolGroupTargetID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
     `MriProtocolGroupID`       INT(4)  UNSIGNED NOT NULL,
     `ProjectID`                INT(10) UNSIGNED DEFAULT NULL,
     `SubprojectID`             INT(10) UNSIGNED DEFAULT NULL,
     `Visit_label`              VARCHAR(255)     DEFAULT NULL,
     PRIMARY KEY (`MriProtocolGroupTargetID`),
     CONSTRAINT `FK_mri_protocol_group_target_1` FOREIGN KEY (`MriProtocolGroupID`) REFERENCES `mri_protocol_group` (`MriProtocolGroupID`),
     CONSTRAINT `FK_mri_protocol_group_target_2` FOREIGN KEY (`ProjectID`)          REFERENCES `Project` (`ProjectID`),
     CONSTRAINT `FK_mri_protocol_group_target_3` FOREIGN KEY (`SubprojectID`)       REFERENCES `subproject` (`SubprojectID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4;
INSERT INTO `mri_protocol_group_target` (`MriProtocolGroupID`, `ProjectID`, `SubprojectID`, `Visit_label`)
    VALUES((SELECT MriProtocolGroupID FROM mri_protocol_group WHERE Name='Default MRI protocol group'), NULL, NULL, NULL);



-- -----------------------------------------------------------------------------------
--
-- mri_protocol_checks_group table
--
-- By default, there is only one MRI protocol checks group
--
-- -----------------------------------------------------------------------------------
CREATE TABLE `mri_protocol_checks_group` (
    `MriProtocolChecksGroupID`   INT(4) UNSIGNED NOT NULL AUTO_INCREMENT,
    `Name`                       VARCHAR(255)    NOT NULL UNIQUE,
    PRIMARY KEY (`MriProtocolChecksGroupID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4;
INSERT INTO `mri_protocol_checks_group` (`Name`) VALUES('Default MRI protocol checks group');


-- -----------------------------------------------------------------------------------
--
-- mri_protocol_checks_group_target table
--
-- Specify the MRI protocol checks group (or set of lines in mri_protocol_checks)
-- to use to perform MRI protocol checks for a given scan based on the candidate's
-- project ID, the session's subproject ID and visit label.
--
-- By default, all scans use the default MRI protocol checks group
--
-- -----------------------------------------------------------------------------------
CREATE TABLE `mri_protocol_checks_group_target` (
     `MriProtocolChecksGroupTargetID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
     `MriProtocolChecksGroupID`       INT(4)  UNSIGNED NOT NULL,
     `ProjectID`                      INT(10) UNSIGNED DEFAULT NULL,
     `SubprojectID`                   INT(10) UNSIGNED DEFAULT NULL,
     `Visit_label`                    VARCHAR(255)     DEFAULT NULL,
     PRIMARY KEY(`MriProtocolChecksGroupTargetID`),
     CONSTRAINT `FK_mri_protocol_checks_group_target_1` FOREIGN KEY (`MriProtocolChecksGroupID`) REFERENCES `mri_protocol_checks_group` (`MriProtocolChecksGroupID`),
     CONSTRAINT `FK_mri_protocol_checks_group_target_2` FOREIGN KEY (`ProjectID`)                REFERENCES `Project` (`ProjectID`),
     CONSTRAINT `FK_mri_protocol_checks_group_target_3` FOREIGN KEY (`SubprojectID`)             REFERENCES `subproject` (`SubprojectID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4;

INSERT INTO `mri_protocol_checks_group_target` (`MriProtocolChecksGroupID`, `ProjectID`, `SubprojectID`, `Visit_label`)
    VALUES((SELECT MriProtocolChecksGroupID FROM mri_protocol_checks_group WHERE Name='Default MRI protocol checks group'), NULL, NULL, NULL);

-- -----------------------------------------------------------------
-- Addition of a new column in table mri_protocol to identify the
-- MRI protocol group that a given line is associated to
-- -----------------------------------------------------------------
ALTER TABLE `mri_protocol` ADD COLUMN `MriProtocolGroupID` INT(4) UNSIGNED NOT NULL;
UPDATE mri_protocol SET MriProtocolGroupID=(SELECT MriProtocolGroupID FROM mri_protocol_group WHERE Name='Default MRI protocol group');
ALTER TABLE `mri_protocol` ADD CONSTRAINT `FK_mri_protocol_group_ID_1` FOREIGN KEY (`MriProtocolGroupID`) REFERENCES `mri_protocol_group` (`MriProtocolGroupID`);

-- -----------------------------------------------------------------------
-- Addition of a new column in table mri_protocol_checks to identify the
-- MRI protocol group that a given line is associated to
-- -----------------------------------------------------------------------
ALTER TABLE `mri_protocol_checks` ADD COLUMN `MriProtocolChecksGroupID` INT(4) UNSIGNED NOT NULL;
UPDATE mri_protocol_checks SET MriProtocolChecksGroupID=(SELECT MriProtocolChecksGroupID FROM mri_protocol_checks_group WHERE Name='Default MRI protocol checks group');
ALTER TABLE `mri_protocol_checks` ADD CONSTRAINT `FK_mri_protocol_checks_group_ID_1` FOREIGN KEY (`MriProtocolChecksGroupID`) REFERENCES `mri_protocol_checks_group` (`MriProtocolChecksGroupID`);

-- ----------------------------------------------------------------------------------
-- Addition of a new column in table mri_protocol_violated_scans to identify the
-- MRI protocol group that was used when trying to identify the scan type (will be NULL
-- unless exactly 1 group was used to identify the scan, according to the contents
-- of table mri_protocol_group_target)
-- ----------------------------------------------------------------------------------
ALTER TABLE `mri_protocol_violated_scans` ADD COLUMN `MriProtocolGroupID` INT(4) UNSIGNED DEFAULT NULL;
UPDATE mri_protocol_violated_scans SET MriProtocolGroupID=(SELECT MriProtocolGroupID FROM mri_protocol_group WHERE Name='Default MRI protocol group');
ALTER TABLE `mri_protocol_violated_scans` ADD CONSTRAINT `FK_mri_violated_2` FOREIGN KEY (`MriProtocolGroupID`) REFERENCES `mri_protocol_group` (`MriProtocolGroupID`);

-- -----------------------------------------------------------------------------------
-- Addition of a new column in table mri_violations_log to identify the
-- group of MRI protocol checks that was used when performing the MRI protocol checks
-- -----------------------------------------------------------------------------------
ALTER TABLE `mri_violations_log` ADD COLUMN `MriProtocolChecksGroupID` INT(4) UNSIGNED NOT NULL;
UPDATE mri_violations_log SET MriProtocolChecksGroupID=(SELECT MriProtocolChecksGroupID FROM mri_protocol_checks_group WHERE Name='Default MRI protocol checks group');
ALTER TABLE `mri_violations_log` ADD CONSTRAINT `FK_mri_checks_group_1` FOREIGN KEY (`MriProtocolChecksGroupID`) REFERENCES `mri_protocol_checks_group` (`MriProtocolChecksGroupID`);


SELECT 'Running: SQL/New_patches/2019-07-02-Add_Edit_DoB_Permissions.sql';

INSERT INTO permissions (code, description, categoryID) VALUES
    ("candidate_dob_edit","Edit dates of birth",2);
    
INSERT INTO user_perm_rel VALUES
    (1, (SELECT permID FROM permissions WHERE code='candidate_dob_edit'));

SELECT 'Running: SQL/New_patches/2019-07-04-add_DoD_feature.sql';

ALTER TABLE candidate
    ADD COLUMN DoD date default NULL;

 -- candidate_dod_edit permission
INSERT IGNORE INTO permissions (code, description, categoryID) VALUES
    ('candidate_dod_edit', "Edit dates of death", 2);

INSERT IGNORE INTO user_perm_rel (userID, permID) VALUES
    (1, (SELECT permID FROM permissions where code='candidate_dod_edit'));

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
    SELECT 'dodFormat', 'Format of the Date of Death', 1, 0, 'text', ID, 'DOD Format', 10 FROM ConfigSettings WHERE Name="study";

INSERT INTO Config (ConfigID, Value) SELECT ID, 'YMd'  FROM ConfigSettings WHERE Name="dodFormat";

SELECT 'Running: SQL/New_patches/2019-07-05-Add_Language_feature.sql';

ALTER TABLE `session`
    ADD COLUMN `languageID` integer unsigned DEFAULT NULL,
    ADD CONSTRAINT `FK_session_4` FOREIGN KEY (`languageID`) REFERENCES `language` (`language_id`);

SELECT 'Running: SQL/New_patches/2019-08-06-Add_date_display_format_config_setting.sql';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'dateDisplayFormat', 'The date format to use throughout LORIS for displaying date information - formats for date inputs are browser- and locale-dependent.', 1, 0, 'text', ID, 'Date display format', 27 FROM ConfigSettings WHERE Name="study";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'Y-m-d H:i:s'  FROM ConfigSettings WHERE Name="dateDisplayFormat";

SELECT 'Running: SQL/New_patches/2019-10-09-move_MINCToolsPath_configuration_to_Config_tables.sql';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'MINCToolsPath', 'Path to the MINC tools', 1, 0, 'web_path', ID, 'Path to the MINC tools', 12 FROM ConfigSettings WHERE Name="paths";
INSERT INTO Config (ConfigID, Value) SELECT ID, "%MINCToolsPath%" FROM ConfigSettings WHERE Name="MINCToolsPath";

SELECT 'Running: SQL/New_patches/2019-10-29-adding_issues_attachments_table.sql';

CREATE TABLE `issues_attachments` (
    `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `issueID` int(11) unsigned NOT NULL,
    `file_hash` varchar(64) NOT NULL,
    `date_added` timestamp NOT NULL DEFAULT current_timestamp(),
    `file_name` varchar(255) NOT NULL DEFAULT '',
    `deleted` tinyint(1) NOT NULL DEFAULT 0,
    `user` varchar(255) NOT NULL DEFAULT '',
    `description` text DEFAULT NULL,
    `file_size` int(20) DEFAULT NULL,
    `mime_type` varchar(255) NOT NULL DEFAULT '',
    CONSTRAINT `fk_issues_attachments_issue` FOREIGN KEY (`issueID`) REFERENCES `issues` (`issueID`),
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
VALUES('IssueTrackerDataPath', 'Path to Issue Tracker data files', 1, 0, 'web_path', 26, 'Issue Tracker Data Path', 8);

INSERT INTO Config (ConfigID, Value)
SELECT
    ID,
    '/data/issue_tracker/'
FROM
    ConfigSettings
WHERE
        Name = "IssueTrackerDataPath";

SELECT 'Running: SQL/New_patches/2019-11-26-AddOtherSexEnum.sql';

ALTER TABLE
    `candidate`
MODIFY COLUMN
    `Sex` enum(
        'Male',
        'Female',
        'Other'
    )
DEFAULT NULL;

ALTER TABLE
    `candidate`
MODIFY COLUMN
    `ProbandSex` enum(
        'Male',
        'Female',
        'Other'
    )
DEFAULT NULL;

SELECT 'Running: SQL/New_patches/2019-11-29-Add_upload_directory_configuration.sql';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'documentRepositoryPath', 'Path to uploaded document repository files', 1, 0, 'text', cs1.ID, 'Document Repository Upload Path', MAX(cs2.OrderNumber)+1 FROM ConfigSettings cs1 JOIN ConfigSettings cs2 WHERE cs1.Name="paths" AND cs2.parent=cs1.ID;
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'dataReleasePath', 'Path to uploaded data release files', 1, 0, 'text', cs1.ID, 'Data Release Upload Path', MAX(cs2.OrderNumber)+1 FROM ConfigSettings cs1 JOIN ConfigSettings cs2 WHERE cs1.Name="paths" AND cs2.parent=cs1.ID;

-- For backwards compatibility, check the previous base and default to same folder as previous setting
SELECT Value INTO @base FROM Config c JOIN ConfigSettings cs ON cs.ID=c.ConfigID WHERE cs.Name="base";

INSERT INTO Config (ConfigID, Value) SELECT ID, CONCAT(@base,"modules/document_repository/user_uploads/") FROM ConfigSettings WHERE Name="documentRepositoryPath";
INSERT INTO Config (ConfigID, Value) SELECT ID, CONCAT(@base,"modules/data_release/user_uploads/") FROM ConfigSettings WHERE Name="dataReleasePath";


SELECT 'Running: SQL/New_patches/2019-12-05-AddModuleTable.sql';

CREATE TABLE `modules` (
  `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Active` enum('Y','N') NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `modules_id` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO modules (Name, Active) VALUES ('acknowledgements', 'Y');
INSERT INTO modules (Name, Active) VALUES ('api', 'Y');
INSERT INTO modules (Name, Active) VALUES ('behavioural_qc', 'Y');
INSERT INTO modules (Name, Active) VALUES ('brainbrowser', 'Y');
INSERT INTO modules (Name, Active) VALUES ('bvl_feedback', 'Y');
INSERT INTO modules (Name, Active) VALUES ('candidate_list', 'Y');
INSERT INTO modules (Name, Active) VALUES ('candidate_parameters', 'Y');
INSERT INTO modules (Name, Active) VALUES ('configuration', 'Y');
INSERT INTO modules (Name, Active) VALUES ('conflict_resolver', 'Y');
INSERT INTO modules (Name, Active) VALUES ('create_timepoint', 'Y');
INSERT INTO modules (Name, Active) VALUES ('dashboard', 'Y');
INSERT INTO modules (Name, Active) VALUES ('data_release', 'Y');
INSERT INTO modules (Name, Active) VALUES ('datadict', 'Y');
INSERT INTO modules (Name, Active) VALUES ('dataquery', 'Y');
INSERT INTO modules (Name, Active) VALUES ('dicom_archive', 'Y');
INSERT INTO modules (Name, Active) VALUES ('document_repository', 'Y');
INSERT INTO modules (Name, Active) VALUES ('examiner', 'Y');
INSERT INTO modules (Name, Active) VALUES ('genomic_browser', 'Y');
INSERT INTO modules (Name, Active) VALUES ('help_editor', 'Y');
INSERT INTO modules (Name, Active) VALUES ('imaging_browser', 'Y');
INSERT INTO modules (Name, Active) VALUES ('imaging_qc', 'Y');
INSERT INTO modules (Name, Active) VALUES ('imaging_uploader', 'Y');
INSERT INTO modules (Name, Active) VALUES ('instrument_builder', 'Y');
INSERT INTO modules (Name, Active) VALUES ('instrument_list', 'Y');
INSERT INTO modules (Name, Active) VALUES ('instrument_manager', 'Y');
INSERT INTO modules (Name, Active) VALUES ('instruments', 'Y');
INSERT INTO modules (Name, Active) VALUES ('issue_tracker', 'Y');
INSERT INTO modules (Name, Active) VALUES ('login', 'Y');
INSERT INTO modules (Name, Active) VALUES ('media', 'Y');
INSERT INTO modules (Name, Active) VALUES ('mri_violations', 'Y');
INSERT INTO modules (Name, Active) VALUES ('new_profile', 'Y');
INSERT INTO modules (Name, Active) VALUES ('next_stage', 'Y');
INSERT INTO modules (Name, Active) VALUES ('publication', 'Y');
INSERT INTO modules (Name, Active) VALUES ('server_processes_manager', 'Y');
INSERT INTO modules (Name, Active) VALUES ('statistics', 'Y');
INSERT INTO modules (Name, Active) VALUES ('survey_accounts', 'Y');
INSERT INTO modules (Name, Active) VALUES ('timepoint_list', 'Y');
INSERT INTO modules (Name, Active) VALUES ('user_accounts', 'Y');

SELECT 'Running: SQL/New_patches/2020-01-16-ModuleManager.sql';

INSERT INTO modules (Name, Active) VALUES ('module_manager', 'Y');
INSERT INTO permissions (code, description, categoryID) VALUES('module_manager_view', 'Module Manager: access the module', 2);
INSERT INTO permissions (code, description, categoryID) VALUES('module_manager_edit', 'Module Manager: edit installed modules', 2);
INSERT INTO user_perm_rel(UserID,PermID) VALUES (
    (SELECT ID FROM users WHERE UserID='admin'),
    (SELECT permID FROM permissions WHERE code='module_manager_view')
);
INSERT INTO user_perm_rel(UserID,PermID) VALUES (
    (SELECT ID FROM users WHERE UserID='admin'),
    (SELECT permID FROM permissions WHERE code='module_manager_edit')
);

SELECT 'Running: SQL/New_patches/2020-01-20-adding_electrophysiology_browser_to_modules_table.sql';

INSERT INTO modules (Name, Active) VALUES ('electrophysiology_browser', 'Y');


SELECT 'Running: SQL/New_patches/2020-02-18-MyPrefModule.sql';

INSERT INTO modules (Name, Active) VALUES ('my_preferences', 'Y');

SELECT 'Running: SQL/New_patches/2020-02-24-CandidateProfileModule.sql';

INSERT INTO modules (Name, Active) VALUES ('candidate_profile', 'Y');

SELECT 'Running: SQL/New_patches/2020-04-20-Rename_highlander_permission.sql';

UPDATE permissions SET description = 'Superuser - supersedes all permissions' WHERE code = 'superuser';

SELECT 'Running: SQL/New_patches/2020-04-27-AddViolatedScansOwnSitePermission.sql';

INSERT INTO permissions (code, description, categoryID) VALUES
    ('violated_scans_view_ownsite','Violated Scans: View Violated Scans from own site','2');
    
INSERT INTO user_perm_rel VALUES
    (
     (SELECT ID FROM users WHERE UserID='admin'),
     (SELECT permID FROM permissions WHERE code='violated_scans_view_ownsite')
    );

SELECT 'Running: SQL/New_patches/2020-05-08-ChangeDefaultMPCGForMriViolationsLog.sql';


-- ----------------------------------------------------------------------------------------
-- Change default value of column MriProtocolChecksGroupID for table mri_violations_log
--
-- Reason: the imaging browser allows one to set the Caveat of a scan to true and this 
-- creates an entry in the mri_violations_log table. This entry is not tied to any record
-- in table mri_protocol_checks_group, thus the nullable MriProtocolChecksGroupID.
--
-- ----------------------------------------------------------------------------------------
ALTER TABLE mri_violations_log CHANGE COLUMN `MriProtocolChecksGroupID` `MriProtocolChecksGroupID` INT(4) UNSIGNED DEFAULT NULL;


SELECT 'Running: SQL/New_patches/2020-05-11-AddViolationsResolved.sql';

-- ------------------------------------------------------------------------------------
--                                                                                   --
-- This SQL patch examines every record in table mri_violations_log that has         --
-- column `Header` set to 'Manual Caveat Set by <username>'. If there is not a       --
-- corresponding record in table violations_resolved that flags this violation       --
-- as having been inserted with flag, it adds it.                                    --
--                                                                                   --
-- ------------------------------------------------------------------------------------

INSERT INTO violations_resolved (hash, ExtID, TypeTable, User, ChangeDate, Resolved)
  SELECT 
      md5(concat_WS(':', MincFile, PatientName, SeriesUID, TimeRun)), 
      LogID, 
      'mri_violations_log',
      SUBSTRING_INDEX(Header, ' ', -1),
      TimeRun,
      'inserted_flag'
  FROM mri_violations_log
  WHERE Header LIKE 'Manual Caveat Set by %'
  AND NOT EXISTS (
      SELECT 1 
      FROM violations_resolved 
      WHERE ExtID=LogID
      AND TypeTable='mri_violations_log'
  );

SELECT 'Running: SQL/New_patches/2020-05-15-RemoveObsoleteMriViolationsLog.sql';

-- -----------------------------------------------------------------------------------
-- When you set the Caveat flag of a scan to true in the imaging browser, a record
-- is created in table mri_violations_log to indicate that there is a manual caveat 
-- for that scan. If you subsequently set the Caveat back to false, this record is not
-- deleted. This PR deletes those obsolete entries in table mri_violations_log
-- -----------------------------------------------------------------------------------

DELETE mvl
FROM mri_violations_log AS mvl
WHERE mvl.Header LIKE 'Manual Caveat Set by%'
AND (
    SELECT f.Caveat
    FROM files f
    WHERE f.File = mvl.MincFile
    AND f.SeriesUID = mvl.SeriesUID
) = 0;

-- ----------------------------------------------------------------------------------
-- The Caveat column of table files is used to indicate whether a file (scan) has
-- a manual caveat or a caveat that was created by the MRI pipeline. When a scan has
-- both types of caveat and you set the manual caveat to false in the imaging browser,
-- the value of the Caveat column will be set to 0. This is a bug, since the scan still
-- has a caveat set by the MRI pipeline associated to it.
-- This patch will correct those Caveat values that are set to 0 when they should have
-- a value of 1.
-- ---------------------------------------------------------------------------------------
UPDATE files f
SET f.Caveat=1
WHERE f.Caveat=0
AND EXISTS (
    SELECT 1
    FROM mri_violations_log mvl
    JOIN parameter_type pt
      ON (pt.Name=mvl.Header)
    JOIN parameter_file pf
      ON (pf.ParameterTypeID=pt.ParameterTypeID)
    WHERE mvl.SeriesUID = f.SeriesUID
    AND pf.FileID = f.FileID
    AND pf.Value = mvl.Value
);

SELECT 'Running: SQL/New_patches/2018-07-23-battery_manager_permissions.sql';

-- Add view permission for battery manager
INSERT INTO permissions (code, description, categoryID)
       VALUES (
           'battery_manager_view',
           'View Battery Manager',
           (SELECT ID FROM permissions_category WHERE Description = 'Permission')
       );

-- Add edit permission for battery manager
INSERT INTO permissions (code, description, categoryID)
       VALUES (
           'battery_manager_edit',
           'Add, activate, and deactivate entries in Test Battery',
           (SELECT ID FROM permissions_category WHERE Description = 'Permission')
       );

-- Give view permission to admin
INSERT INTO user_perm_rel (userID, permID)
SELECT ID, permID FROM users u JOIN permissions p
WHERE UserID='admin' AND code = 'battery_manager_view';

-- Give edit permission to admin
INSERT INTO user_perm_rel (userID, permID)
SELECT ID, permID FROM users u JOIN permissions p
WHERE UserID='admin' AND code = 'battery_manager_edit';

INSERT INTO modules (Name, Active) VALUES ('battery_manager', 'Y');
