ALTER TABLE users DROP COLUMN Password_md5;-- This script put all unique records from LorisMenuPermissions in a
-- temporary table before adding foreign keys and unique constraint
-- to the table.
-- It also remove duplicates from LorisMenu table and add unique
-- constraint on Parent and Label column

CREATE TEMPORARY TABLE tmp_lmp AS 
  SELECT DISTINCT MenuId, PermID FROM LorisMenuPermissions;

DELETE FROM LorisMenuPermissions;

ALTER TABLE `LorisMenuPermissions` 
CHANGE COLUMN `MenuID` `MenuID` INT(10) UNSIGNED NOT NULL,
CHANGE COLUMN `PermID` `PermID` INT(10) UNSIGNED NOT NULL,
ADD PRIMARY KEY (`MenuID`, `PermID`);

ALTER TABLE `LorisMenuPermissions` 
ADD CONSTRAINT `fk_LorisMenuPermissions_1`
  FOREIGN KEY (`MenuID`)
  REFERENCES `LorisMenu` (`ID`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_LorisMenuPermissions_2`
  FOREIGN KEY (`PermID`)
  REFERENCES `permissions` (`permID`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

INSERT IGNORE INTO LorisMenuPermissions SELECT MenuID, PermID FROM tmp_lmp;
DROP TABLE tmp_lmp;

-- Remove duplicates in the LorisMenu
DELETE FROM LorisMenu USING LorisMenu, LorisMenu lm1 
  WHERE LorisMenu.ID < lm1.ID AND LorisMenu.Parent = lm1.Parent AND LorisMenu.Label = lm1.Label;

ALTER TABLE `LorisMenu` 
ADD INDEX `fk_LorisMenu_1_idx` (`Parent` ASC),
ADD UNIQUE INDEX `index3` (`Parent` ASC, `Label` ASC);
ALTER TABLE `LorisMenu` 
ADD CONSTRAINT `fk_LorisMenu_1`
  FOREIGN KEY (`Parent`)
  REFERENCES `LorisMenu` (`ID`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

DELETE FROM media USING media, media m1 
  WHERE media.date_uploaded < m1.date_uploaded AND media.file_name = m1.file_name;

ALTER TABLE `media`
ADD UNIQUE INDEX `file_name` (`file_name`);
ALTER TABLE flag ADD `Data` TEXT;
SET @parentID = (SELECT ID FROM ConfigSettings WHERE Name = 'APIKeys');

-- Cleanup 
DELETE FROM ConfigSettings WHERE Name='reCAPTCHAPrivate';
DELETE FROM ConfigSettings WHERE Name='reCAPTCHAPublic';
DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='reCAPTCHAPrivate');
DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='reCAPTCHAPublic');

-- Insert
INSERT INTO ConfigSettings (`Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`) VALUES (
  'reCAPTCHAPrivate', 'Private Key for Google reCAPTCHA', 1, 0, 'text', @parentID, 'reCAPTCHA Private Key', 2
);
INSERT INTO ConfigSettings (`Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`) VALUES (
  'reCAPTCHAPublic', 'Public Key for Google reCAPTCHA', 1, 0, 'text', @parentID, 'reCAPTCHA Public Key', 3
);
ALTER TABLE issues_categories CONVERT TO CHARACTER SET utf8;
ALTER TABLE issues_categories MODIFY COLUMN categoryName varchar(255);
-- This can take quite a while to execute depending on the row count of the CNV table 
ALTER TABLE CNV ADD FOREIGN KEY (`CandID`) REFERENCES `candidate` (`CandID`);
-- Insert necessary values into configsettings and config
INSERT INTO ConfigSettings (Name,Description,Visible,AllowMultiple,DataType,Parent,Label,OrderNumber) Values ("dobFormat","Format of the Date of Birth", 1, 0, "text", 1, "DOB Format:", 8);
INSERT INTO Config (ConfigID,Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name='dobFormat'),"YMd");
-- This is for LORIS instance that source the schema of LORIS v15.04.
-- The ExonicFunction column got added in 15.10 but there was a missing patch.
SET @s = (SELECT IF(
    (SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE table_name = 'SNP'
        AND table_schema = DATABASE()
        AND column_name = 'ExonicFunction'
    ) > 0,
    "SELECT 'conform' as 'SNP table structure check'",
    "ALTER TABLE SNP ADD `ExonicFunction` enum('nonsynonymous','unknown') DEFAULT NULL AFTER `Damaging`"
));

PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
WARNINGS;
SET SQL_NOTES=1;

SELECT 'Removing unused indexes to change the storage engine for help table' as 'Step #1';
ALTER TABLE `help` 
DROP INDEX `content`,
DROP INDEX `topic`;
ALTER TABLE `help` ENGINE = InnoDB;

SELECT 'Droping unused table help_related_links' as 'Step #2';
DROP TABLE help_related_links;


SELECT 'Adding foreign key between Config and ConfigSettings' as 'Step #3';
SELECT 'Config records not associated with a valid ConfigSettings.id will be deleted' as 'ATTENTION';
DELETE FROM `Config` WHERE ConfigID IS NULL;
ALTER TABLE `Config` CHANGE `ConfigID` `ConfigID` int(11) NOT NULL;
ALTER TABLE `Config` 
  ADD INDEX `fk_Config_1_idx` (`ConfigID` ASC);
ALTER TABLE `Config` 
  ADD CONSTRAINT `fk_Config_1`
  FOREIGN KEY (`ConfigID`)
    REFERENCES `ConfigSettings` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

SELECT 'Adding foreign key between permissions and permissions_category' as 'Step #4';
SELECT 'permissions.categoryID not associated with a valid permissions_category.id will be set to 2 (Permission)' as 'ATTENTION';
UPDATE permissions SET categoryID = 2 WHERE categoryID NOT IN (SELECT id FROM permissions_category);
ALTER TABLE `permissions` 
  CHANGE COLUMN `categoryID` `categoryID` INT(10) NOT NULL DEFAULT 2;
ALTER TABLE `permissions` 
  ADD INDEX `fk_permissions_1_idx` (`categoryID` ASC);
ALTER TABLE `permissions` 
  ADD CONSTRAINT `fk_permissions_1`
  FOREIGN KEY (`categoryID`)
    REFERENCES `permissions_category` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


SELECT 'Adding foreign key between candidate and caveat_options' as 'Step #5';
SELECT 'List of candidate(s) with innexistant flagged_reason in the canveat_options table. Those flagged_reason will be set to NULL' as 'ATTENTION';
SELECT c.candid, c.flagged_reason 
  FROM candidate c
  WHERE NOT EXISTS (
    SELECT ID FROM caveat_options WHERE c.flagged_reason = ID
  ) AND c.flagged_reason IS NOT NULL;
ALTER TABLE `candidate` 
  ADD INDEX `FK_candidate_2_idx` (`flagged_reason` ASC);
ALTER TABLE `candidate` 
  ADD CONSTRAINT `FK_candidate_2`
  FOREIGN KEY (`flagged_reason`)
    REFERENCES `caveat_options` (`ID`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

SELECT 'Dropping duplicate index CandidateCenterID in the candidate table' as 'Step #6';
ALTER TABLE `candidate` 
  DROP INDEX `CandidateCenterID` ;

SELECT 'Adding index PSCID in the candidate table' as 'Step #7';
ALTER TABLE `candidate` 
  ADD INDEX `PSCID` (`PSCID` ASC);

SELECT 'Adding foreign key between document_repository_categories and document_repository tables' as 'Step #8';
SELECT 'document_repository.File_category not associated with a valid document_repository_categories.id will be set to NULL' as 'ATTENTION';
UPDATE document_repository SET File_category = NULL WHERE File_category NOT IN (SELECT id FROM document_repository_categories);
ALTER TABLE `document_repository` 
  CHANGE COLUMN `File_category` `File_category` INT(3) UNSIGNED NULL DEFAULT NULL;
ALTER TABLE `document_repository`
  ADD INDEX `fk_document_repository_1_idx` (`File_category` ASC);
ALTER TABLE `document_repository`
  ADD CONSTRAINT `fk_document_repository_1`
  FOREIGN KEY (`File_category`)
    REFERENCES `document_repository_categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

SELECT 'Adding foreign key between document_repository_categories and document_repository tables' as 'Step #9';
SELECT 'session_status records not associated with a valid session.id will be deleted' as 'ATTENTION';
DELETE FROM session_status WHERE SessionID NOT IN (SELECT id FROM `session`);
ALTER TABLE `session_status` 
  CHANGE COLUMN `SessionID` `SessionID` INT(10) UNSIGNED NOT NULL ;
ALTER TABLE `session_status` 
  ADD CONSTRAINT `fk_session_status_1`
  FOREIGN KEY (`SessionID`)
    REFERENCES `session` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

SELECT 'Adding foreign key between participant_status and participant_status_options tables' as 'Step #10';
SELECT 'participant_status.participant_status not associated with a valid participant_status_options.id will be set to NULL' as 'ATTENTION';
SELECT 'participant_status.participant_suboptions not associated with a valid participant_status_options.id will be set to NULL' as 'ATTENTION';
UPDATE participant_status SET participant_status = NULL WHERE participant_status NOT IN (SELECT id FROM participant_status_options);
UPDATE participant_status SET participant_suboptions = NULL WHERE participant_suboptions NOT IN (SELECT id FROM participant_status_options);
ALTER TABLE `participant_status` 
CHANGE COLUMN `participant_status` `participant_status` INT(10) UNSIGNED NULL DEFAULT NULL ,
CHANGE COLUMN `participant_suboptions` `participant_suboptions` INT(10) UNSIGNED NULL DEFAULT NULL ;
ALTER TABLE `participant_status` 
  ADD INDEX `fk_participant_status_1_idx` (`participant_status` ASC),
  ADD INDEX `fk_participant_status_2_idx` (`participant_suboptions` ASC);
ALTER TABLE `participant_status` 
  ADD CONSTRAINT `fk_participant_status_1`
  FOREIGN KEY (`participant_status`)
    REFERENCES `participant_status_options` (`ID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_participant_status_2`
  FOREIGN KEY (`participant_suboptions`)
    REFERENCES `participant_status_options` (`ID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

SELECT 'Adding foreign key between participant_status and candidate tables' as 'Step #11';
SELECT 'participant_status records not associated with a valid candidate.candid will be deleted' as 'ATTENTION';
DELETE FROM participant_status WHERE CandID NOT IN (SELECT candid FROM candidate);
ALTER TABLE `participant_status` 
  ADD CONSTRAINT `fk_participant_status_3`
  FOREIGN KEY (`CandID`)
    REFERENCES `candidate` (`CandID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

SELECT 'Change the parameter_type_category primary key to conform all the other int(11) unsigned NOT NULL AUTO_INCREMENT columns' as 'Step #12'; 
ALTER TABLE parameter_type_category CHANGE `ParameterTypeCategoryID` `ParameterTypeCategoryID` int(11) unsigned NOT NULL AUTO_INCREMENT;

SELECT 'Changes storage engine to InnoDB for participant_* tables' as 'Step #13';
ALTER TABLE `participant_status` ENGINE = InnoDB;
ALTER TABLE `participant_status_options` ENGINE = InnoDB;
ALTER TABLE `participant_emails` ENGINE = InnoDB;
ALTER TABLE `participant_accounts` ENGINE = InnoDB;
ALTER TABLE `participant_status_history` ENGINE = InnoDB;
ALTER TABLE `consent_info_history` ENGINE = InnoDB;

SELECT 'Changes default chatset to utf8 for participant_* tables' as 'Step #14';
ALTER TABLE `participant_status` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `participant_status_options` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `participant_emails` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `participant_accounts` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `participant_status_history` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `consent_info_history` CONVERT TO CHARACTER SET utf8;

SELECT 'Adding ignored foreign key between participant_emails and test_names tables' as 'Step #15';
ALTER TABLE `participant_emails` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `participant_emails`
  ADD CONSTRAINT `fk_participant_emails_1`
  FOREIGN KEY (`Test_name`)
    REFERENCES `test_names` (`Test_name`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

SELECT 'Changes storage engine to InnoDB for remaining tables' as 'Step #16';
ALTER TABLE `ExternalLinkTypes` ENGINE = InnoDB;
ALTER TABLE `ExternalLinks` ENGINE = InnoDB;
ALTER TABLE `empty_queries` ENGINE = InnoDB;
ALTER TABLE `data_release` ENGINE = InnoDB;
ALTER TABLE `data_release_permissions` ENGINE = InnoDB;

SELECT 'Changes default chatset to utf8 for remaining tables' as 'Step #17';
ALTER TABLE `ExternalLinkTypes` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `ExternalLinks` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `empty_queries` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `data_release` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `data_release_permissions` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `Visit_Windows` CONVERT TO CHARACTER SET utf8;

SELECT 'Dropping duplicate index SessionCenterID in the session table' as 'Step #18';
ALTER TABLE `session`
  DROP INDEX `SessionCenterID` ;

SELECT 'Rectifying some discrepancies' as 'Step #19';
UPDATE ConfigSettings SET OrderNumber = 1 WHERE Name = 'JWTKey';
ALTER TABLE `certification_history` COMMENT='primaryVals should always contain a valid certID from the certification table';
ALTER TABLE `session_status` COMMENT='Used if SupplementalSessionStatus configSettings is true';
ALTER TABLE `tarchive_find_new_uploads` COMMENT='This table is used by Loris-MRI/find_uploads_tarchive to store the last time the script was ran for that location';

SELECT 'Patch completed' as 'Status';
-- Add scan_type to ENUM
ALTER TABLE ConfigSettings MODIFY COLUMN DataType ENUM('text', 'boolean', 'email', 'instrument', 'textarea', 'scan_type');

-- Change Dicom Archive name to Imaging Modules
UPDATE ConfigSettings SET Name='imaging_modules', Description='DICOM Archive and Imaging Browser settings', Label='Imaging Modules' WHERE Name ='dicom_archive';

-- Add Imaging Browser to Imaging Modules
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'tblScanTypes', 'Scan types from the mri_scan_type table that the project wants to see displayed in Imaging Browser table', 1, 1, 'scan_type', ID, 'Imaging Browser Tabulated Scan Types', 6 FROM ConfigSettings WHERE Name="imaging_modules";

-- default imaging_browser settings
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, GROUP_CONCAT(mst.Scan_Type) FROM ConfigSettings cs JOIN mri_scan_type mst WHERE cs.Name="tblScanTypes" AND mst.ID=44;
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, GROUP_CONCAT(mst.Scan_Type) FROM ConfigSettings cs JOIN mri_scan_type mst WHERE cs.Name="tblScanTypes" AND mst.ID=45;


-- Loris-MRI/Imaging Pipeline options from the $profile (commonly "prod") file
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('imaging_pipeline', 'Imaging Pipeline settings', 1, 0, 'Imaging Pipeline', 12);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'dataDirBasepath', 'Base Path to the data directory of Loris-MRI', 1, 0, 'text', ID, 'Loris-MRI Data Directory', 1 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'prefix', 'Study prefix or study name', 1, 0, 'text', ID, 'Study Name', 2 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'mail_user', 'User to be notified during imaging pipeline execution', 1, 0, 'text', ID, 'User to notify when executing the pipeline', 3 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'get_dicom_info', 'Full path to get_dicom_info.pl', 1, 0, 'text', ID, 'Full path to get_dicom_info.pl script', 4 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'horizontalPics', 'Generate horizontal pictures', 1, 0, 'boolean', ID, 'Horizontal pictures creation', 5 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'no_nii', 'Create NIFTII files if set to 0', 1, 0, 'boolean', ID, 'NIFTII file creation', 6 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'converter', 'If converter is set to dcm2mnc, the c-version of dcm2mnc will be used. If however you want to use any of the various versions of the converter, you will have to specify what it is called and the uploader will try to invoke it', 1, 0, 'text', ID, 'dcm2mnc binary to use when converting', 7 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'tarchiveLibraryDir', 'Location of storing the library of used tarchives. If this is not set, they will not be moved', 1, 0, 'text', ID, 'Path to Tarchives', 8 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'lookupCenterNameUsing', 'The element of the tarchive table to be used in getPSC(), being either PatientID or PatientName', 1, 0, 'text', ID, 'Center name lookup variable', 9 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'createCandidates', 'Creation of candidates if set to 1', 1, 0, 'boolean', ID, 'Upload creation of candidates', 10 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'is_qsub', 'Do not use batch management if qsub is set to 0', 1, 0, 'boolean', ID, 'Project batch management used', 11 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'if_site', 'Use site if set to 1', 1, 0, 'boolean', ID, 'If site is used', 12 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'DTI_volumes', 'Number of volumes in native DTI acquisitions', 1, 0, 'text', ID, 'Number of volumes in native DTI acquisitions', 13 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 't1_scan_type', 'Scan type of native T1 acquisition (as in the mri_scan_type table)', 1, 0, 'text', ID, 'Scan type of native T1 acquisition', 14 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'reject_thresh', 'Max number of directions that can be rejected to PASS QC', 1, 0, 'text', ID, 'Max number of DTI rejected directions for passing QC', 15 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'niak_path', 'Path to niak quarantine to use if mincdiffusion will be run (option -runMincdiffusion set when calling DTIPrep_pipeline.pl)', 1, 0, 'text', ID, 'NIAK Path', 16 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'QCed2_step', 'DTIPrep protocol step at which a secondary QCed dataset is produced (for example one without motion correction and eddy current correction would be saved at INTERLACE_outputDWIFileNameSuffix step of DTIPrep)', 1, 0, 'text', ID, 'Secondary QCed dataset', 17 FROM ConfigSettings WHERE Name="imaging_pipeline";


-- default imaging_pipeline settings
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/DATA/location" FROM ConfigSettings cs WHERE cs.Name="dataDirBasepath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "project" FROM ConfigSettings cs WHERE cs.Name="prefix";
INSERT INTO Config (ConfigID, Value) SELECT ID, "yourname\@example.com" FROM ConfigSettings cs WHERE cs.Name="mail_user";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/get_dicom_info.pl" FROM ConfigSettings cs WHERE cs.Name="get_dicom_info";
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings cs WHERE cs.Name="horizontalPics";
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings cs WHERE cs.Name="no_nii";
INSERT INTO Config (ConfigID, Value) SELECT ID, "dcm2mnc" FROM ConfigSettings cs WHERE cs.Name="converter";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/dicomlib/" FROM ConfigSettings cs WHERE cs.Name="tarchiveLibraryDir";
INSERT INTO Config (ConfigID, Value) SELECT ID, "PatientName" FROM ConfigSettings cs WHERE cs.Name="lookupCenterNameUsing";
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings cs WHERE cs.Name="createCandidates";
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings cs WHERE cs.Name="is_qsub";
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings cs WHERE cs.Name="if_site";
INSERT INTO Config (ConfigID, Value) SELECT ID, 65 FROM ConfigSettings cs WHERE cs.Name="DTI_volumes";
INSERT INTO Config (ConfigID, Value) SELECT ID, "adniT1" FROM ConfigSettings cs WHERE cs.Name="t1_scan_type";
INSERT INTO Config (ConfigID, Value) SELECT ID, 19 FROM ConfigSettings cs WHERE cs.Name="reject_thresh";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/opt/niak-0.6.4.1/" FROM ConfigSettings cs WHERE cs.Name="niak_path";
INSERT INTO Config (ConfigID, Value) SELECT ID, "INTERLACE_outputDWIFileNameSuffix" FROM ConfigSettings cs WHERE cs.Name="QCed2_step";
-- Add a permission to Imaging Broswer to give access to users to view phantoms data only
INSERT INTO permissions (code,description,categoryID) VALUES ('imaging_browser_phantom_allsites', 'Can access only phantom data from all sites in Imaging Browser', 2);
INSERT INTO permissions (code,description,categoryID) VALUES ('imaging_browser_phantom_ownsite', 'Can access only phantom data from own sites in Imaging Browser', 2);
INSERT INTO user_perm_rel (userID,permID) SELECT u.ID, p.permID FROM users u JOIN permissions p WHERE u.UserID='admin' AND p.code = 'imaging_browser_phantom_allsites';
INSERT INTO user_perm_rel (userID,permID) SELECT u.ID, p.permID FROM users u JOIN permissions p WHERE u.UserID='admin' AND p.code = 'imaging_browser_phantom_ownsite';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_phantom_allsites' AND m.Label='Imaging Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_phantom_ownsite' AND m.Label='Imaging Browser';


-- ad phone to users
ALTER TABLE users ADD COLUMN `Phone` varchar(15) default NULL;

-- Associates modules with the service available for each
CREATE TABLE `notification_modules` (
      `id` int(10) unsigned auto_increment NOT NULL,
      `module_name` varchar(100) NOT NULL,
      `operation_type` varchar(100) NOT NULL,
      `as_admin` enum('Y','N') NOT NULL DEFAULT 'N',
      `template_file` varchar(100) NOT NULL,
      `description` varchar(255) DEFAULT NULL,
      PRIMARY KEY (`id`),
      KEY (`module_name`),
      UNIQUE(module_name,operation_type)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Associates modules with the service available for each
CREATE TABLE `notification_services` (
      `id` int(10) unsigned auto_increment NOT NULL,
      `service` VARCHAR(50) NOT NULL,
      PRIMARY KEY (`id`),
      UNIQUE(service)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- saves users preferences for notification type
CREATE TABLE `notification_modules_services_rel` (
      `module_id` int(10) unsigned NOT NULL,
      `service_id` int(10) unsigned NOT NULL,
      PRIMARY KEY (`module_id`,`service_id`),
      KEY `FK_notification_modules_services_rel_1` (`module_id`),
      KEY `FK_notification_modules_services_rel_2` (`service_id`),
      CONSTRAINT `FK_notification_modules_services_rel_1` FOREIGN KEY (`module_id`) REFERENCES `notification_modules` (`id`),
      CONSTRAINT `FK_notification_modules_services_rel_2` FOREIGN KEY (`service_id`) REFERENCES `notification_services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- saves users preferences for notification type
CREATE TABLE `users_notifications_rel` (
      `user_id` int(10) unsigned NOT NULL,
      `module_id` int(10) unsigned NOT NULL,
      `service_id` int(10) unsigned NOT NULL,
      PRIMARY KEY (`user_id`,`module_id`,`service_id`),
      KEY `FK_notifications_users_rel_1` (`user_id`),
      KEY `FK_notifications_users_rel_2` (`module_id`),
      KEY `FK_notifications_users_rel_3` (`service_id`),
      CONSTRAINT `FK_notifications_users_rel_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`),
      CONSTRAINT `FK_notifications_users_rel_2` FOREIGN KEY (`module_id`) REFERENCES `notification_modules` (`id`),
      CONSTRAINT `FK_notifications_users_rel_3` FOREIGN KEY (`service_id`) REFERENCES `notification_services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- history log
CREATE TABLE `notification_history` (
      `id` int(10) unsigned auto_increment NOT NULL,
      `module_id` int(10) unsigned NOT NULL,
      `service_id` int(10) unsigned NOT NULL,
      `date_sent` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `trigger_user` int(10) unsigned NOT NULL,
      `target_user` int(10) unsigned NOT NULL,
      PRIMARY KEY (`id`),
      KEY `FK_notification_history_1` (`trigger_user`),
      KEY `FK_notification_history_2` (`target_user`),
      CONSTRAINT `FK_notification_history_1` FOREIGN KEY (`trigger_user`) REFERENCES `users` (`ID`) ON UPDATE CASCADE ON DELETE CASCADE ,
      CONSTRAINT `FK_notification_history_2` FOREIGN KEY (`target_user`) REFERENCES `users` (`ID`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- basic notification service
INSERT INTO notification_services (service) VALUES
('email_text');

-- Pre-implemented notifications
INSERT INTO notification_modules (module_name, operation_type, as_admin, template_file, description) VALUES
  ('media', 'upload', 'N', 'notifier_media_upload.tpl', 'Media: New File Uploaded'),
  ('media', 'download', 'N', 'notifier_media_download.tpl', 'Media: File Downloaded'),
  ('document_repository', 'new_category', 'N', 'notifier_document_repository_new_category.tpl', 'Document Repository: New Category'),
  ('document_repository', 'upload', 'N', 'notifier_document_repository_upload.tpl', 'Document Repository: New Document Uploaded'),
  ('document_repository', 'delete', 'N', 'notifier_document_repository_delete.tpl', 'Document Repository: Document Deleted'),
  ('document_repository', 'edit', 'N', 'notifier_document_repository_edit.tpl', 'Document Repository: Document Edited');

-- enable doc repo basic text emails
INSERT INTO notification_modules_services_rel SELECT nm.id, ns.id FROM notification_modules nm JOIN notification_services ns WHERE nm.module_name='document_repository' AND ns.service='email_text';

-- Transfer Document repository notifications to new system
INSERT INTO users_notifications_rel SELECT u.ID, nm.id, ns.id FROM users u JOIN notification_modules nm JOIN notification_services ns WHERE nm.module_name='document_repository' AND ns.service='email_text' AND u.Doc_Repo_Notifications='Y';

-- permissions for each notification module
CREATE TABLE `notification_modules_perm_rel` (
      `notification_module_id` int(10) unsigned NOT NULL,
      `perm_id` int(10) unsigned NOT NULL default '0',
      CONSTRAINT `FK_notification_modules_perm_rel_1` FOREIGN KEY (`notification_module_id`) REFERENCES `notification_modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT `FK_notification_modules_perm_rel_2` FOREIGN KEY (`perm_id`) REFERENCES `permissions` (`permID`) ON DELETE CASCADE ON UPDATE CASCADE,
      PRIMARY KEY (`notification_module_id`,`perm_id`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- populate notification perm table
INSERT INTO notification_modules_perm_rel SELECT nm.id, p.permID FROM notification_modules nm JOIN permissions p WHERE nm.module_name='media' AND (p.code='media_write' OR p.code='media_read');
INSERT INTO notification_modules_perm_rel SELECT nm.id, p.permID FROM notification_modules nm JOIN permissions p WHERE nm.module_name='document_repository' AND (p.code='document_repository_view' OR p.code='document_repository_delete');
ALTER TABLE issues DROP FOREIGN KEY `fk_issues_5`;
ALTER TABLE issues ADD CONSTRAINT `fk_issues_5` FOREIGN KEY (`centerID`) REFERENCES `psc` (`CenterID`);
WARNINGS;
SET SQL_NOTES=1;

SELECT 'Delete duplicate entries' as 'Step #1';
DELETE 
FROM 
	instrument_subtests 
USING 
	instrument_subtests,
	instrument_subtests to_keep 
WHERE 
	instrument_subtests.ID < to_keep.ID 
	AND instrument_subtests.Test_name = to_keep.Test_name
	AND instrument_subtests.Subtest_name = to_keep.Subtest_name;

SELECT 'Alter instrument_subtests to force unique Subtest_name' as 'Step #2';
ALTER TABLE `instrument_subtests`
ADD UNIQUE KEY `unique_index` (`Test_name`, `Subtest_name`);

SELECT 'Patch complete' as 'Status';
CREATE TEMPORARY TABLE
    project_rel_tmp
AS
    SELECT DISTINCT
        ProjectID, SubprojectID
    FROM
        project_rel;

DELETE FROM project_rel;

INSERT INTO
    project_rel (ProjectID, SubprojectID)
SELECT
    ProjectID, SubprojectID
FROM
    project_rel_tmp;

ALTER TABLE `project_rel` ADD PRIMARY KEY( `ProjectID`, `SubprojectID`);
ALTER table parameter_file MODIFY Value LONGTEXT;

-- The OneTimePassword storage capacity should be extended according to new key generation logic

ALTER TABLE participant_accounts MODIFY COLUMN OneTimePassword VARCHAR(16) ;
-- Removing reliability statistics as it is more project specific
DELETE FROM `StatisticsTabs`  WHERE `SubModuleName`='stats_reliability';ALTER TABLE project_rel MODIFY COLUMN ProjectID int(2) NOT NULL;
ALTER TABLE project_rel MODIFY COLUMN SubprojectID int(2) NOT NULL;
