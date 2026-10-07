-- 28.0 -> 29.0 upgrade patch
-- Consolidates the SQL changes from SQL/New_patches and keeps the script safe to re-run.

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Core schema additions
-- From: 2024-10-13_meg-ctf-head-shape-tables.sql
CREATE TABLE IF NOT EXISTS `meg_ctf_head_shape_file` (
    `ID` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `Path` VARCHAR(255) NOT NULL,
    `Blake2bHash` VARCHAR(128) NOT NULL,
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `meg_ctf_head_shape_point` (
    `ID` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `FileID` INT(10) UNSIGNED NOT NULL,
    `Name` VARCHAR(255) NOT NULL,
    `X` DECIMAL(10, 6) NOT NULL,
    `Y` DECIMAL(10, 6) NOT NULL,
    `Z` DECIMAL(10, 6) NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_meg_ctf_head_shape_FileID`
      FOREIGN KEY (`FileID`)
      REFERENCES `meg_ctf_head_shape_file` (`ID`)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- From: 2026-02-04_ephys_browser_file_type.sql
CREATE TABLE IF NOT EXISTS `ephys_browser_file_type` (
  `Type` varchar(12) NOT NULL PRIMARY KEY,
  CONSTRAINT `FK_ephys_browser_file_type`
    FOREIGN KEY (`Type`)
    REFERENCES `ImagingFileTypes` (`type`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- From: 2025-09-11_add_data_cache_table.sql
CREATE TABLE IF NOT EXISTS `cached_data_type` (
    `CachedDataTypeID` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (`CachedDataTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `cached_data` (
   `CachedDataID` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
   `CachedDataTypeID` INT(10) UNSIGNED NOT NULL,
   `Value` TEXT NOT NULL,
   `LastUpdate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY (`CachedDataID`),
   CONSTRAINT `FK_cached_data_type` FOREIGN KEY (`CachedDataTypeID`)
       REFERENCES `cached_data_type` (`CachedDataTypeID`)
       ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- From: 2026-05-28-Add-policiesI18n.sql
CREATE TABLE IF NOT EXISTS policiesI18n (
  PolicyID INT NOT NULL,
  LanguageID INT(10) UNSIGNED NOT NULL,
  Content TEXT NULL,
  SwalTitle VARCHAR(255) NULL,
  HeaderButtonText VARCHAR(255) NULL,
  AcceptButtonText VARCHAR(255) NULL,
  DeclineButtonText VARCHAR(255) NULL,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (PolicyID, LanguageID),
  CONSTRAINT policiesI18n_policy_fk
    FOREIGN KEY (PolicyID)
    REFERENCES policies (PolicyID)
    ON DELETE CASCADE,
  CONSTRAINT policiesI18n_language_fk
    FOREIGN KEY (LanguageID)
    REFERENCES language (language_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `parameter_project` (
   `ParameterProjectID` int(10) unsigned NOT NULL auto_increment,
   `ProjectID` int(10) unsigned NOT NULL default '0',
   `ParameterTypeID` int(10) unsigned NOT NULL default '0',
   `Value` text default NULL,
   `InsertTime` int(10) unsigned NOT NULL default '0',
   PRIMARY KEY (`ParameterProjectID`),
   UNIQUE KEY `project_type` (`ProjectID`,`ParameterTypeID`),
   KEY `parameter_value` (`ParameterTypeID`,`Value`(64)),
   CONSTRAINT `FK_parameter_project_2` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`),
   CONSTRAINT `FK_parameter_project_1` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `hed_tag_endorsement` (
 `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `HEDRelID` int(10) unsigned NOT NULL,
 `HEDTable` enum(
   'physiological_task_event_hed_rel',
   'bids_event_dataset_mapping',
   'bids_event_file_mapping'
   ) NOT NULL,
 `EndorsedBy` int(10) unsigned NOT NULL,
 `EndorsementStatus` enum(
   'Endorsed',
   'Caveat',
   'Comment'
   ) NOT NULL,
 `EndorsementComment` TEXT DEFAULT NULL,
 `EndorsedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `LastUpdate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`ID`),
 CONSTRAINT `FK_endorsed_by_user`
   FOREIGN KEY (`EndorsedBy`) REFERENCES `users` (`ID`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `hed_tag_endorsement_history` (
 `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `EndorsementID` int(10) unsigned NOT NULL,
 `Action` enum(
   'INSERT',
   'UPDATE',
   'DELETE'
   ) NOT NULL,
 `HEDRelID` int(10) unsigned NOT NULL,
 `HEDTable` enum(
   'physiological_task_event_hed_rel',
   'bids_event_dataset_mapping',
   'bids_event_file_mapping'
   ) NOT NULL,
 `EndorsedBy` int(10) unsigned NOT NULL,
 `EndorsementStatus` enum(
   'Endorsed',
   'Caveat',
   'Comment'
   ) NOT NULL,
 `EndorsementComment` TEXT DEFAULT NULL,
 `EndorsedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`ID`),
 CONSTRAINT `FK_endorsement_id`
   FOREIGN KEY (`EndorsementID`) REFERENCES `hed_tag_endorsement` (`ID`) ON UPDATE CASCADE,
 CONSTRAINT `FK_endorsed_by_user_history`
   FOREIGN KEY (`EndorsedBy`) REFERENCES `users` (`ID`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `hed_tag_history` (
 `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `HEDTableID` int(10) unsigned NOT NULL,
 `HEDTable` enum(
   'physiological_task_event_hed_rel',
   'bids_event_dataset_mapping',
   'bids_event_file_mapping'
   ) NOT NULL,
 `HEDReferenceID` int(10) unsigned NOT NULL,
 `TaggedBy` int(10) unsigned DEFAULT NULL,
 `PropertyName` varchar(50) DEFAULT NULL,
 `PropertyValue` varchar(255) DEFAULT NULL,
 `HEDTagID` int(10) unsigned DEFAULT NULL,
 `TagValue` TEXT NULL,
 `Description` TEXT NULL,
 `HasPairing` BOOLEAN DEFAULT FALSE,
 `PairRelID` int(10) unsigned NULL,
 `AdditionalMembers` int(10) unsigned DEFAULT 0,
 `ModificationType` enum('insert', 'update', 'delete') NOT NULL,
 `ModifiedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`ID`),
 CONSTRAINT `FK_hed_tagged_by_history`
   FOREIGN KEY (`TaggedBy`) REFERENCES `users` (`ID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `physiological_task_event_history` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PhysiologicalTaskEventID` int(10) unsigned NOT NULL,
  `PhysiologicalFileID` int(10) unsigned NOT NULL,
  `EventFileID` int(10) unsigned NOT NULL,
  `InsertTime` timestamp NOT NULL,
  `Onset` decimal(11,6) DEFAULT NULL,
  `Duration` decimal(11,6) DEFAULT NULL,
  `Channel` TEXT DEFAULT NULL,
  `EventCode` int(10) DEFAULT NULL,
  `EventValue` varchar(255) DEFAULT NULL,
  `EventSample` decimal(11,6) DEFAULT NULL,
  `EventType` varchar(50) DEFAULT NULL,
  `TrialType` varchar(255) DEFAULT NULL,
  `ResponseTime` time DEFAULT NULL,
  `ModifiedBy` int(10) unsigned DEFAULT NULL,
  `ModificationType` enum('insert', 'update', 'delete') NOT NULL,
  `ModifiedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_physiological_task_event_modified_by_history`
    FOREIGN KEY (`ModifiedBy`) REFERENCES `users` (`ID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Add new columns and alter existing columns safely
-- From: 2024-10-07-Issuetracker-Status-Update.sql
SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'issues'
    AND column_name = 'status'
);
SET @stmt := IF(@col_exists > 0,
  'ALTER TABLE issues MODIFY COLUMN status enum(\'new\',\'acknowledged\',\'feedback\',\'assigned\',\'resolved\',\'closed\',\'rejected\') DEFAULT NULL',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- From: 2024-10-31-Data_Release_Hide_File.sql
SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'data_release'
    AND column_name = 'hidden_by_userid'
);
SET @stmt := IF(@col_exists = 0,
  'ALTER TABLE data_release ADD COLUMN hidden_by_userid int(10) unsigned NULL DEFAULT NULL',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists := (
  SELECT COUNT(*)
  FROM information_schema.key_column_usage
  WHERE table_schema = DATABASE()
    AND table_name = 'data_release'
    AND constraint_name = 'FK_hidden_by_userid'
);
SET @stmt := IF(@fk_exists = 0,
  'ALTER TABLE data_release ADD CONSTRAINT FK_hidden_by_userid FOREIGN KEY (hidden_by_userid) REFERENCES users (ID)',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- From: 2024-11-29-Participant_Status_Required_Comments.sql
SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'participant_status_options'
    AND column_name = 'commentRequired'
);
SET @stmt := IF(@col_exists = 0,
  'ALTER TABLE participant_status_options ADD COLUMN commentRequired tinyint(1) DEFAULT NULL',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE participant_status_options
SET commentRequired = 1
WHERE Description NOT IN ('Active', 'Complete') AND parentID IS NULL;

SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'physiological_file'
    AND column_name = 'HeadShapeFileID'
);
SET @stmt := IF(@col_exists = 0,
  'ALTER TABLE physiological_file ADD COLUMN HeadShapeFileID INT(10) UNSIGNED DEFAULT NULL',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists := (
  SELECT COUNT(*)
  FROM information_schema.key_column_usage
  WHERE table_schema = DATABASE()
    AND table_name = 'physiological_file'
    AND constraint_name = 'FK_head_shape_HeadShapeFileID'
);
SET @stmt := IF(@fk_exists = 0,
  'ALTER TABLE physiological_file ADD CONSTRAINT FK_head_shape_HeadShapeFileID FOREIGN KEY (HeadShapeFileID) REFERENCES meg_ctf_head_shape_file (ID)',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'physiological_task_event'
    AND column_name = 'Channel'
);
SET @stmt := IF(@col_exists = 0,
  'ALTER TABLE physiological_task_event ADD COLUMN Channel TEXT DEFAULT NULL',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- From: 2026-02-12_fix-physio-event-response-time.sql
SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'physiological_task_event'
    AND column_name = 'ResponseTime'
);
SET @stmt := IF(@col_exists > 0,
  'ALTER TABLE physiological_task_event MODIFY COLUMN ResponseTime decimal(11,6) DEFAULT NULL',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- From: 2026-02-12_fix-physio-event-sample-type.sql
SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'physiological_task_event'
    AND column_name = 'EventSample'
);
SET @stmt := IF(@col_exists > 0,
  'ALTER TABLE physiological_task_event MODIFY COLUMN EventSample int(10) DEFAULT NULL',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- From: 2026-03-13_fix-physio-file-default-date.sql
SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'physiological_file'
    AND column_name = 'AcquisitionTime'
);
SET @stmt := IF(@col_exists > 0,
  'ALTER TABLE physiological_file MODIFY COLUMN AcquisitionTime DATETIME DEFAULT NULL',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE physiological_file
SET AcquisitionTime = NULL
WHERE AcquisitionTime = '1970-01-01 00:00:01';

-- From: 2026-06-14_rename_hide_video_field_document_repository.sql / 2026-07-02-docs-repo-video-to-file.sql
SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'document_repository'
    AND column_name = 'hide_video'
);
SET @col2_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'document_repository'
    AND column_name = 'hide_file'
);
SET @stmt := IF(@col_exists > 0 AND @col2_exists = 0,
  'ALTER TABLE document_repository CHANGE COLUMN hide_video hide_file TINYINT(1) NULL DEFAULT 0',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- From: 2026-06-15-Add-Sex-Colours.sql
SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'sex'
    AND column_name = 'Colour'
);
SET @stmt := IF(@col_exists = 0,
  'ALTER TABLE sex ADD COLUMN Colour VARCHAR(50) NULL',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sex_row_num := 0;
UPDATE sex s
JOIN (
    SELECT Name, (@sex_row_num := @sex_row_num + 1) AS row_num
    FROM (SELECT Name FROM sex ORDER BY Name LIMIT 6) ordered_names
) ordered_sex ON ordered_sex.Name = s.Name
SET s.Colour = CASE ordered_sex.row_num
    WHEN 1 THEN '#2FA4E7'
    WHEN 2 THEN '#1C70B6'
    WHEN 3 THEN '#4AE8C2'
    WHEN 4 THEN '#7900DB'
    WHEN 5 THEN '#FF8000'
    WHEN 6 THEN '#D90074'
    ELSE s.Colour
END
WHERE ordered_sex.row_num <= 6;

-- From: 2025-12-16-remove-scan-done.sql
SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'session'
    AND column_name = 'scan_done'
);
SET @stmt := IF(@col_exists > 0,
  'ALTER TABLE session DROP COLUMN scan_done',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. Data inserts and updates
INSERT INTO `cached_data_type` (`Name`)
SELECT 'projects_disk_space'
WHERE NOT EXISTS (SELECT 1 FROM `cached_data_type` WHERE `Name` = 'projects_disk_space');

INSERT INTO `ImagingFileTypes` (type, description)
SELECT 'ctf', 'CTF data format (MEG)'
WHERE NOT EXISTS (SELECT 1 FROM `ImagingFileTypes` WHERE `type` = 'ctf');

INSERT INTO `ephys_browser_file_type` (`Type`)
SELECT 'set' WHERE NOT EXISTS (SELECT 1 FROM `ephys_browser_file_type` WHERE `Type` = 'set');
INSERT INTO `ephys_browser_file_type` (`Type`)
SELECT 'bdf' WHERE NOT EXISTS (SELECT 1 FROM `ephys_browser_file_type` WHERE `Type` = 'bdf');
INSERT INTO `ephys_browser_file_type` (`Type`)
SELECT 'vhdr' WHERE NOT EXISTS (SELECT 1 FROM `ephys_browser_file_type` WHERE `Type` = 'vhdr');
INSERT INTO `ephys_browser_file_type` (`Type`)
SELECT 'vsm' WHERE NOT EXISTS (SELECT 1 FROM `ephys_browser_file_type` WHERE `Type` = 'vsm');
INSERT INTO `ephys_browser_file_type` (`Type`)
SELECT 'edf' WHERE NOT EXISTS (SELECT 1 FROM `ephys_browser_file_type` WHERE `Type` = 'edf');
INSERT INTO `ephys_browser_file_type` (`Type`)
SELECT 'cnt' WHERE NOT EXISTS (SELECT 1 FROM `ephys_browser_file_type` WHERE `Type` = 'cnt');
INSERT INTO `ephys_browser_file_type` (`Type`)
SELECT 'ctf' WHERE NOT EXISTS (SELECT 1 FROM `ephys_browser_file_type` WHERE `Type` = 'ctf');
INSERT INTO `ephys_browser_file_type` (`Type`)
SELECT 'archive' WHERE NOT EXISTS (SELECT 1 FROM `ephys_browser_file_type` WHERE `Type` = 'archive');

INSERT INTO permissions (moduleID, code, action, description, categoryID)
SELECT ID, 'data_release_hide', 'Edit', 'Hidden Releases', 2
FROM modules
WHERE Name = 'data_release'
  AND NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'data_release_hide');

INSERT INTO permissions (moduleID, code, action, description, categoryID)
SELECT ID, 'data_release_delete', 'Delete', 'Releases', 2
FROM modules
WHERE Name = 'data_release'
  AND NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'data_release_delete');

INSERT INTO user_perm_rel (userID, permID)
SELECT (SELECT ID FROM users WHERE UserID = 'admin'), (SELECT permID FROM permissions WHERE code = 'data_release_hide')
WHERE NOT EXISTS (
  SELECT 1
  FROM user_perm_rel upr
  JOIN permissions p ON p.permID = upr.permID
  WHERE upr.userID = (SELECT ID FROM users WHERE UserID = 'admin')
    AND p.code = 'data_release_hide'
);

INSERT INTO user_perm_rel (userID, permID)
SELECT (SELECT ID FROM users WHERE UserID = 'admin'), (SELECT permID FROM permissions WHERE code = 'data_release_delete')
WHERE NOT EXISTS (
  SELECT 1
  FROM user_perm_rel upr
  JOIN permissions p ON p.permID = upr.permID
  WHERE upr.userID = (SELECT ID FROM users WHERE UserID = 'admin')
    AND p.code = 'data_release_delete'
);

-- From: 2026-01-04-Update_Login_Setup_Link.sql
UPDATE Config
SET Value = REPLACE(Value, 'https://github.com/aces/Loris/wiki/Setup', 'https://acesloris.readthedocs.io/en/latest')
WHERE ConfigID = (SELECT ID FROM ConfigSettings WHERE Name = 'StudyDescription');

-- From: 2026-01-10_fix-meg-ref-mag-channel-type.sql
UPDATE physiological_channel_type
SET ChannelTypeName = 'MEGREFMAG'
WHERE ChannelTypeName = 'MEGGREFMAG';

-- From: 2026-04-21_add-eegchunkspath-config.sql
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
SELECT 'EEGChunksPath', 'Path to store the EEG chunks for Visualization', 1, 0, 'text', ID, 'EEG chunks path', 16
FROM ConfigSettings
WHERE Name = 'eeg_pipeline'
  AND NOT EXISTS (SELECT 1 FROM ConfigSettings WHERE Name = 'EEGChunksPath');

INSERT INTO Config (ConfigID, Value)
SELECT cPath.ID, dPathConfig.Value
FROM ConfigSettings cPath
JOIN ConfigSettings dPath ON dPath.Name = 'dataDirBasepath'
JOIN Config dPathConfig ON dPathConfig.ConfigID = dPath.ID
WHERE cPath.Name = 'EEGChunksPath'
  AND NOT EXISTS (SELECT 1 FROM Config c WHERE c.ConfigID = cPath.ID);

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
SELECT 'login_logo_left', 'Path for top left logo on the login page.', 1, 0, 'text', ID, 'Login Top Left Logo', 3
FROM ConfigSettings
WHERE Name = 'study'
  AND NOT EXISTS (SELECT 1 FROM ConfigSettings WHERE Name = 'login_logo_left');

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
SELECT 'login_logo_right', 'Path for top right logo on the login page.', 1, 0, 'text', ID, 'Login Top Right Logo', 3
FROM ConfigSettings
WHERE Name = 'study'
  AND NOT EXISTS (SELECT 1 FROM ConfigSettings WHERE Name = 'login_logo_right');

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
SELECT 'login_logo_left_link', 'Optional link to redirect when clicking on top left logo', 1, 0, 'text', ID, 'Login Top Left Logo Link', 4
FROM ConfigSettings
WHERE Name = 'study'
  AND NOT EXISTS (SELECT 1 FROM ConfigSettings WHERE Name = 'login_logo_left_link');

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
SELECT 'login_logo_right_link', 'Optional link to redirect when clicking on top right logo', 1, 0, 'text', ID, 'Login Top Right Logo Link', 4
FROM ConfigSettings
WHERE Name = 'study'
  AND NOT EXISTS (SELECT 1 FROM ConfigSettings WHERE Name = 'login_logo_right_link');

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
SELECT 'partner_logos', 'Logos for partners to be displayed in the homepage', 1, 1, 'text', ID, 'Partner Logos', 4
FROM ConfigSettings
WHERE Name = 'study'
  AND NOT EXISTS (SELECT 1 FROM ConfigSettings WHERE Name = 'partner_logos');

INSERT INTO Config (ConfigID, Value)
SELECT (SELECT ID FROM ConfigSettings WHERE Name = 'login_logo_left'), '/images/LORIS_logo_white.svg'
WHERE NOT EXISTS (SELECT 1 FROM Config WHERE ConfigID = (SELECT ID FROM ConfigSettings WHERE Name = 'login_logo_left'));

INSERT INTO Config (ConfigID, Value)
SELECT (SELECT ID FROM ConfigSettings WHERE Name = 'login_logo_right'), '/images/GitHub-Mark-Light-64px.png'
WHERE NOT EXISTS (SELECT 1 FROM Config WHERE ConfigID = (SELECT ID FROM ConfigSettings WHERE Name = 'login_logo_right'));

INSERT INTO Config (ConfigID, Value)
SELECT (SELECT ID FROM ConfigSettings WHERE Name = 'login_logo_left_link'), '/'
WHERE NOT EXISTS (SELECT 1 FROM Config WHERE ConfigID = (SELECT ID FROM ConfigSettings WHERE Name = 'login_logo_left_link'));

INSERT INTO Config (ConfigID, Value)
SELECT (SELECT ID FROM ConfigSettings WHERE Name = 'login_logo_right_link'), 'https://github.com/aces/Loris'
WHERE NOT EXISTS (SELECT 1 FROM Config WHERE ConfigID = (SELECT ID FROM ConfigSettings WHERE Name = 'login_logo_right_link'));

DELETE FROM Config WHERE ConfigID = (SELECT ID FROM ConfigSettings WHERE Name = 'useScanDone');
DELETE FROM ConfigSettings WHERE Name = 'useScanDone';

-- 4. Parameter and tagging-related updates
INSERT IGNORE INTO `parameter_type_category` (Name, Type)
VALUES ('Project Parameters', 'Metavars');

INSERT IGNORE INTO parameter_type (Name, Type, Description, SourceFrom, Queryable, IsFile) VALUES
  ('ChannelDelimiter', 'text', 'Channel name separator', 'parameter_project', 1, 0);

INSERT INTO parameter_type_category_rel (ParameterTypeID, ParameterTypeCategoryID)
SELECT pt.ParameterTypeID, ptc.ParameterTypeCategoryID
FROM parameter_type pt, parameter_type_category ptc
WHERE ptc.Name = 'Project Parameters'
  AND pt.Name = 'ChannelDelimiter'
  AND NOT EXISTS (
    SELECT 1
    FROM parameter_type_category_rel ptr
    WHERE ptr.ParameterTypeID = pt.ParameterTypeID
      AND ptr.ParameterTypeCategoryID = ptc.ParameterTypeCategoryID
  );

SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'physiological_task_event_hed_rel'
    AND column_name = 'TaggedBy'
);
SET @stmt := IF(@col_exists = 0,
  'ALTER TABLE physiological_task_event_hed_rel ADD COLUMN TaggedBy int(10) unsigned DEFAULT NULL',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'bids_event_dataset_mapping'
    AND column_name = 'TaggedBy'
);
SET @stmt := IF(@col_exists = 0,
  'ALTER TABLE bids_event_dataset_mapping ADD COLUMN TaggedBy int(10) unsigned DEFAULT NULL',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'bids_event_file_mapping'
    AND column_name = 'TaggedBy'
);
SET @stmt := IF(@col_exists = 0,
  'ALTER TABLE bids_event_file_mapping ADD COLUMN TaggedBy int(10) unsigned DEFAULT NULL',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists := (
  SELECT COUNT(*)
  FROM information_schema.key_column_usage
  WHERE table_schema = DATABASE()
    AND table_name = 'physiological_task_event_hed_rel'
    AND constraint_name = 'FK_pte_tagged_by_user'
);
SET @stmt := IF(@fk_exists = 0,
  'ALTER TABLE physiological_task_event_hed_rel ADD CONSTRAINT FK_pte_tagged_by_user FOREIGN KEY (TaggedBy) REFERENCES users (ID)',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists := (
  SELECT COUNT(*)
  FROM information_schema.key_column_usage
  WHERE table_schema = DATABASE()
    AND table_name = 'bids_event_dataset_mapping'
    AND constraint_name = 'FK_bed_tagged_by_user'
);
SET @stmt := IF(@fk_exists = 0,
  'ALTER TABLE bids_event_dataset_mapping ADD CONSTRAINT FK_bed_tagged_by_user FOREIGN KEY (TaggedBy) REFERENCES users (ID)',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists := (
  SELECT COUNT(*)
  FROM information_schema.key_column_usage
  WHERE table_schema = DATABASE()
    AND table_name = 'bids_event_file_mapping'
    AND constraint_name = 'FK_bef_tagged_by_user'
);
SET @stmt := IF(@fk_exists = 0,
  'ALTER TABLE bids_event_file_mapping ADD CONSTRAINT FK_bef_tagged_by_user FOREIGN KEY (TaggedBy) REFERENCES users (ID)',
  'SELECT 1');
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. Charset conversion and cleanup for utf8mb4 support
-- From: 2026-07-13-Add-utf8mb4-to-history-table.sql
SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE electrophysiology_uploader
    DROP FOREIGN KEY IF EXISTS FK_eegupload_UploadedBy;
ALTER TABLE server_processes
    DROP FOREIGN KEY IF EXISTS FK_task_1;
ALTER TABLE issues
    DROP FOREIGN KEY IF EXISTS fk_issues_1,
    DROP FOREIGN KEY IF EXISTS fk_issues_2,
    DROP FOREIGN KEY IF EXISTS fk_issues_6,
    DROP FOREIGN KEY IF EXISTS fk_issues_8;
ALTER TABLE issues_watching
    DROP FOREIGN KEY IF EXISTS fk_issues_watching_1;

ALTER TABLE history CONVERT TO CHARACTER SET utf8mb4;
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4;
ALTER TABLE electrophysiology_uploader CONVERT TO CHARACTER SET utf8mb4;
ALTER TABLE server_processes CONVERT TO CHARACTER SET utf8mb4;
ALTER TABLE issues CONVERT TO CHARACTER SET utf8mb4;
ALTER TABLE issues_watching CONVERT TO CHARACTER SET utf8mb4;
ALTER TABLE issues_categories CONVERT TO CHARACTER SET utf8mb4;

ALTER TABLE electrophysiology_uploader
    ADD CONSTRAINT `FK_eegupload_UploadedBy` FOREIGN KEY (`UploadedBy`) REFERENCES `users` (`UserID`);
ALTER TABLE server_processes
    ADD CONSTRAINT `FK_task_1` FOREIGN KEY (`userid`) REFERENCES `users` (`UserID`);
ALTER TABLE issues
    ADD CONSTRAINT `fk_issues_1` FOREIGN KEY (`reporter`) REFERENCES `users` (`UserID`),
    ADD CONSTRAINT `fk_issues_2` FOREIGN KEY (`assignee`) REFERENCES `users` (`UserID`),
    ADD CONSTRAINT `fk_issues_6` FOREIGN KEY (`lastUpdatedBy`) REFERENCES `users` (`UserID`),
    ADD CONSTRAINT `fk_issues_8` FOREIGN KEY (`category`) REFERENCES `issues_categories` (`categoryName`);
ALTER TABLE issues_watching
    ADD CONSTRAINT `fk_issues_watching_1` FOREIGN KEY (`userID`) REFERENCES `users` (`UserID`);

SET FOREIGN_KEY_CHECKS = 1;
