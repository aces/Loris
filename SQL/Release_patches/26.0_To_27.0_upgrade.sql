SET FOREIGN_KEY_CHECKS = 0;
-- create new permissions to upload and to hide files
INSERT INTO permissions (code, description, moduleID, action, categoryID) VALUES
    (
        'document_repository_categories', 
        'Categories', 
        (SELECT ID FROM modules WHERE Name='document_repository'),
        'Edit/Upload/Delete',
        2
    ),
    (
        'document_repository_hidden', 
        'Restricted files', 
        (SELECT ID FROM modules WHERE Name='document_repository'), 
        'View',
        2
    );

UPDATE permissions
    SET code='document_repository_upload_edit' WHERE code='document_repository_edit';

-- give categories and hide permissions to admin
INSERT INTO user_perm_rel (userID, permID) VALUES
	((SELECT ID FROM users WHERE UserID='admin'), (SELECT permID FROM permissions WHERE code='document_repository_categories')),
	((SELECT ID FROM users WHERE UserID='admin'), (SELECT permID FROM permissions WHERE code='document_repository_hidden'));


-- create column to hide files
ALTER TABLE document_repository
    ADD COLUMN hidden_file enum('yes','no') DEFAULT NULL;INSERT INTO notification_modules
(module_name, operation_type, as_admin, template_file, description)
VALUES
('media', 'digest', 'N', 'media_upload_digest.tpl', 'Media: Email Digest of Recently Uploaded Files');

INSERT INTO notification_modules_services_rel VALUES (
	LAST_INSERT_ID(), 
	(SELECT id FROM notification_services WHERE service='email_text')
	);

INSERT INTO permissions (code, description, moduleID, action) VALUES 
	('media_upload_digest',
	'Media files: Access to recently uploaded media notifications digest.',
	(SELECT ID FROM modules where Name = 'media'),
	'Edit'
	);

INSERT INTO user_perm_rel (userID, permID) VALUES 
(
    (SELECT ID FROM users WHERE UserID='admin'),
    (SELECT permID FROM permissions WHERE code='media_upload_digest')
);

INSERT INTO notification_modules_perm_rel (notification_module_id, perm_id) VALUES
(
    (SELECT id from notification_modules where description = 'Media: Email Digest of Recently Uploaded Files'),
    (SELECT permID FROM permissions WHERE code='media_upload_digest')
);INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useDoB', 'Use DoB (Date of Birth)', 1, 0, 'boolean', ID, 'Use DoB', 31 FROM ConfigSettings WHERE Name="study";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useDoB";
ALTER TABLE `issues`
    ADD `description` longtext DEFAULT NULL
    AFTER `category`;

ALTER TABLE `issues_history`
    MODIFY `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','candID', 'description') NOT NULL DEFAULT 'comment';
CREATE TABLE `instrument_data` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`Data`)),
  PRIMARY KEY (`ID`)
);

-- we abuse the ID of the flag column for data migration
-- by making it the same as the id in the new table, even
-- though they're different primary keys
INSERT INTO instrument_data SELECT ID, Data FROM flag WHERE Data IS NOT NULL;

ALTER TABLE flag ADD COLUMN DataID int(10) unsigned;
ALTER TABLE flag ADD FOREIGN KEY (DataID) REFERENCES instrument_data(ID);

-- from this point forward they won't necessarily be the same id, but we don't
-- care anymore now that the data is migrated and foreign keys were enforced
UPDATE flag SET DataID=ID WHERE Data IS NOT NULL;

-- FIXME: Put in a cleanup patch
-- ALTER TABLE flag DROP COLUMN Data;
-- Reclaim the space that was used by the column
-- OPTIMIZE TABLE flag;
ALTER TABLE test_battery ADD COLUMN DoubleDataEntryEnabled enum("Y", "N") DEFAULT "N";

UPDATE test_battery SET DoubleDataEntryEnabled = 'Y' WHERE Test_name IN (
    SELECT Value from Config WHERE ConfigID = (SELECT ID FROM ConfigSettings WHERE Name = 'DoubleDataEntryInstruments')
);

DELETE FROM Config WHERE ConfigID IN (SELECT ID FROM ConfigSettings WHERE Name = 'DoubleDataEntryInstruments');

DELETE FROM ConfigSettings WHERE Name = 'DoubleDataEntryInstruments';
-- Rename foreign key fields for consistency

ALTER TABLE `mri_scan_type`
  CHANGE `ID` `MriScanTypeID` int(11) unsigned NOT NULL auto_increment;

ALTER TABLE `mri_scan_type`
  CHANGE `Scan_type` `MriScanTypeName` VARCHAR(255) NOT NULL;

ALTER TABLE `mri_protocol`
  CHANGE `Scan_type` `MriScanTypeID` int(10) unsigned NOT NULL;

ALTER TABLE `mri_protocol_checks`
  CHANGE `Scan_type` `MriScanTypeID` int(11) unsigned DEFAULT NULL;

ALTER TABLE `mri_violations_log`
  CHANGE `Scan_type` `MriScanTypeID` int(11) unsigned DEFAULT NULL;

ALTER TABLE `files`
  CHANGE `AcquisitionProtocolID` `MriScanTypeID` int(10) unsigned default NULL;

-- Add unique constraints on table that benefit from them

ALTER TABLE `mri_protocol_group_target`
  ADD CONSTRAINT `UK_mri_protocol_group_target`
    UNIQUE (`ProjectID`, `CohortID`, `Visit_label`);

ALTER TABLE `mri_scan_type`
  ADD CONSTRAINT `UK_mri_scan_type_name`
    UNIQUE KEY `MriScanTypeName` (`MriScanTypeName`);

-- Drop wrong default

ALTER TABLE `mri_protocol`
  ALTER `MriScanTypeID` DROP DEFAULT;

-- Add missing foreign key constraints

ALTER TABLE `mri_protocol`
  ADD CONSTRAINT `FK_mri_protocol_scan_type`
    FOREIGN KEY (`MriScanTypeID`) REFERENCES `mri_scan_type` (`MriScanTypeID`);

ALTER TABLE `mri_violations_log`
  ADD CONSTRAINT `FK_mri_violations_log_scan_type`
    FOREIGN KEY (`MriScanTypeID`) REFERENCES `mri_scan_type` (`MriScanTypeID`);

-- Rename the existing constraints for consistency

ALTER TABLE `mri_protocol_checks`
  DROP FOREIGN KEY `FK_mriProtocolChecks_ScanType`,
  ADD CONSTRAINT `FK_mri_protocol_checks_scan_type`
    FOREIGN KEY (`MriScanTypeID`) REFERENCES `mri_scan_type` (`MriScanTypeID`);
-- Drop nonsensical defaults and put use right type for others.

ALTER TABLE `users`
  ALTER `Privilege` SET DEFAULT 0;

ALTER TABLE `candidate`
  ALTER `CandID` DROP DEFAULT;

ALTER TABLE `candidate`
  ALTER `RegistrationCenterID` DROP DEFAULT;

ALTER TABLE `session`
  ALTER `CandID` DROP DEFAULT;

ALTER TABLE `instrument_subtests`
  ALTER `Order_number` SET DEFAULT 0;

ALTER TABLE `flag`
  ALTER `SessionID` DROP DEFAULT;

ALTER TABLE `tarchive`
  ALTER `AcquisitionCount` SET DEFAULT 0;

ALTER TABLE `tarchive`
  ALTER `NonDicomFileCount` SET DEFAULT 0;

ALTER TABLE `tarchive`
  ALTER `DicomFileCount` SET DEFAULT 0;

ALTER TABLE `tarchive`
  ALTER `sumTypeVersion` SET DEFAULT 0;

ALTER TABLE `tarchive`
  ALTER `uploadAttempt` SET DEFAULT 0;

ALTER TABLE `tarchive`
  ALTER `PendingTransfer` SET DEFAULT 0;

ALTER TABLE `tarchive_series`
  ALTER `TarchiveID` DROP DEFAULT;

ALTER TABLE `tarchive_series`
  ALTER `SeriesNumber` SET DEFAULT 0;

ALTER TABLE `tarchive_series`
  ALTER `NumberOfFiles` SET DEFAULT 0;

ALTER TABLE `tarchive_files`
  ALTER `TarchiveID` DROP DEFAULT;

ALTER TABLE `hrrt_archive`
  ALTER `EcatFileCount` SET DEFAULT 0;

ALTER TABLE `hrrt_archive`
  ALTER `NonEcatFileCount` SET DEFAULT 0;

ALTER TABLE `hrrt_archive_files`
  ALTER `HrrtArchiveID` DROP DEFAULT;

ALTER TABLE `mri_processing_protocol`
  ALTER `InsertTime` SET DEFAULT 0;

ALTER TABLE `files`
  ALTER `SessionID` DROP DEFAULT;

ALTER TABLE `files`
  ALTER `InsertTime` SET DEFAULT 0;

ALTER TABLE `files`
  ALTER `SourceFileID` DROP DEFAULT;

ALTER TABLE `mri_upload`
  ALTER `InsertionComplete` SET DEFAULT 0;

ALTER TABLE `mri_upload`
  ALTER `IsTarchiveValidated` SET DEFAULT 0;

ALTER TABLE `document_repository_categories`
  ALTER `parent_id` DROP DEFAULT;

ALTER TABLE `document_repository`
  ALTER `EARLI` SET DEFAULT 0;

ALTER TABLE `document_repository`
  ALTER `hide_video` SET DEFAULT 0;

ALTER TABLE `notification_types`
  ALTER `private` SET DEFAULT 0;

ALTER TABLE `notification_spool`
  ALTER `NotificationTypeID` DROP DEFAULT;

ALTER TABLE `notification_spool`
  CHANGE `ProcessID` `ProcessID` int(11) DEFAULT NULL;

ALTER TABLE `participant_status`
  ALTER `CandID` DROP DEFAULT;

ALTER TABLE `participant_status_history`
  ALTER `CandID` DROP DEFAULT;

ALTER TABLE `certification`
  ALTER `examinerID` DROP DEFAULT;

ALTER TABLE `media`
  ALTER `hide_file` SET DEFAULT 0;

ALTER TABLE `parameter_type`
  ALTER `Queryable` SET DEFAULT 1;

ALTER TABLE `parameter_type`
  ALTER `IsFile` SET DEFAULT 0;

ALTER TABLE `parameter_type_category_rel`
  ALTER `ParameterTypeID` DROP DEFAULT;

ALTER TABLE `parameter_type_category_rel`
  ALTER `ParameterTypeCategoryID` DROP DEFAULT;

ALTER TABLE `parameter_candidate`
  ALTER `CandID` DROP DEFAULT;

ALTER TABLE `parameter_candidate`
  ALTER `ParameterTypeID` DROP DEFAULT;

ALTER TABLE `parameter_candidate`
  ALTER `InsertTime` SET DEFAULT 0;

ALTER TABLE `parameter_session`
  ALTER `SessionID` DROP DEFAULT;

ALTER TABLE `parameter_session`
  ALTER `ParameterTypeID` DROP DEFAULT;

ALTER TABLE `parameter_session`
  ALTER `InsertTime` SET DEFAULT 0;

ALTER TABLE `SNP_candidate_rel`
  ALTER `SNPID` DROP DEFAULT;

ALTER TABLE `SNP_candidate_rel`
  ALTER `CandID` DROP DEFAULT;

ALTER TABLE `feedback_mri_predefined_comments`
  ALTER `CommentTypeID` DROP DEFAULT;

ALTER TABLE `feedback_mri_comments`
  ALTER `CommentTypeID` DROP DEFAULT;
ALTER TABLE `issues`
    ADD `instrument` int(10) unsigned DEFAULT NULL
    AFTER `description`;

ALTER TABLE `issues`
    ADD CONSTRAINT `fk_issues_instrument`
    FOREIGN KEY (`instrument`) REFERENCES `test_names` (`ID`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `issues_history`
    MODIFY `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','candID', 'description','watching','instrument') NOT NULL DEFAULT 'comment';
ALTER TABLE `issues_history`
    MODIFY `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','candID', 'description', 'watching') NOT NULL DEFAULT 'comment';
ALTER TABLE flag ADD COLUMN TestID int(10) unsigned AFTER test_name;
ALTER TABLE flag ADD CONSTRAINT FOREIGN KEY (TestID) REFERENCES test_names(ID);

UPDATE flag f SET TestID=(SELECT ID FROM test_names tn WHERE f.test_name=tn.test_name);

ALTER TABLE flag MODIFY COLUMN TestID int(10) unsigned NOT NULL;
ALTER TABLE data_release
ADD COLUMN ProjectID INT(10) UNSIGNED NULL DEFAULT NULL,
ADD CONSTRAINT FK_ProjectID
FOREIGN KEY (ProjectID) REFERENCES Project (ProjectID);INSERT INTO notification_modules (module_name, operation_type, as_admin, template_file, description) VALUES
    ('issue_tracker', 'create/edit', 'N', 'issue_change.tpl', 'Notify for all issues created or edited');

INSERT INTO notification_modules_services_rel (module_id, service_id) VALUES
    ((SELECT id FROM notification_modules WHERE module_name='issue_tracker' AND operation_type='create/edit'), (SELECT id FROM notification_services WHERE service='email_text'));
-- --------------------------------------------------------------
-- redcap module

INSERT IGNORE INTO modules (Name, Active) VALUES ('redcap', 'N');

-- --------------------------------------------------------------
-- redcap notifications table

CREATE TABLE `redcap_notification` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `complete` char(1) NOT NULL,
  `project_id` varchar(50) NOT NULL,
  `record` varchar(20) NOT NULL COMMENT 'PSCID',
  `redcap_event_name` varchar(50) NOT NULL COMMENT 'Visit_label',
  `instrument` varchar(150) NOT NULL COMMENT 'Test_name',
  `username` varchar(100) NOT NULL,
  `redcap_url` varchar(255) NOT NULL,
  `project_url` varchar(255) NOT NULL,
  `received_dt` datetime NOT NULL,
  `handled_dt` datetime NULL,
  PRIMARY KEY (`id`),
  KEY `i_redcap_notif_received_dt` (`received_dt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------------
-- redcap examiner

INSERT INTO examiners (full_name) VALUES ('REDCap');
INSERT IGNORE INTO examiners_psc_rel (examinerID, centerID, active, pending_approval)
    SELECT e.examinerID, p.CenterID, "Y", "N" from psc p JOIN examiners e WHERE e.Full_name = "REDCap";

-- --------------------------------------------------------------
-- redcap importable instrument list in config module

INSERT IGNORE INTO ConfigSettings (Name, Description, Visible, Label, OrderNumber)
  SELECT 'redcap', 'Settings related to REDCap interoperability', 1, 'REDCap', MAX(OrderNumber) + 1
  FROM ConfigSettings
  WHERE Parent IS NULL;

-- add a main assignee to all redcap created issue

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
  SELECT
    'redcap_issue_assignee',
    'REDCap main issue assignee in issue tracker',
    1,
    0,
    'text',
    parent_config.ID,
    'Main issue assignee',
    COALESCE(MAX(child_config.OrderNumber), 0) +1
  FROM ConfigSettings parent_config
    LEFT JOIN ConfigSettings child_config ON (parent_config.ID = child_config.Parent)
  WHERE parent_config.Name = 'redcap';

-- instruments must be added to this list before they can be imported, else they wil be ignored.

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
  SELECT
    'redcap_importable_instrument',
    'REDCap instrument names from which data should be imported in LORIS',
    1,
    1,
    'text',
    parent_config.ID,
    'Importable instrument names',
    COALESCE(MAX(child_config.OrderNumber), 0) +1
  FROM ConfigSettings parent_config
  LEFT JOIN ConfigSettings child_config ON (parent_config.ID = child_config.Parent)
  WHERE parent_config.Name = 'redcap';CREATE TABLE Login_Summary_Statistics (
    Title VARCHAR(255),
    Project VARCHAR(255),
    Value INT,
    QueryOrder INT,
     PRIMARY KEY (Title, Project)
);

ALTER TABLE dataquery_study_queries_rel
MODIFY COLUMN PinType enum('topquery','dashboard', 'loginpage') DEFAULT NULL;

ALTER TABLE Project
ADD COLUMN showSummaryOnLogin BOOLEAN DEFAULT TRUE;UPDATE permissions SET code = 'imaging_uploader_allsites', description='Imaging Scans - All Sites' WHERE code='imaging_uploader';
INSERT INTO permissions (code, description, moduleID, `action`, categoryID)
SELECT 'imaging_uploader_ownsites', 'Imaging Scans - Own Sites', ID, 'View/Upload', 2 FROM modules WHERE Name='imaging_uploader';
INSERT INTO permissions (code, description, moduleID, `action`, categoryID)
SELECT 'imaging_uploader_nosessionid', 'Uploads with No Session Information', ID, 'View', 2 FROM modules WHERE Name='imaging_uploader';

INSERT IGNORE INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) 
SELECT 'useAdvancedPermissions', 'Restricts access to data based on both sites and projects and require a special permission to access data not affiliated to a session (SessionID null). Keeping this setting to NO should ensure backwards compatibility (access to all data when module loads)', 1, 0, 'boolean', ID, 'Use Advanced Permissions', 6 FROM ConfigSettings WHERE Name='imaging_modules';
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useAdvancedPermissions";
INSERT INTO permissions (code, description, moduleID, `action`, categoryID)
SELECT 'dicom_archive_nosessionid', 'DICOMs with no session ID', ID, 'View', 2 FROM modules WHERE Name='dicom_archive';

INSERT INTO permissions (code, description, moduleID, `action`, categoryID)
SELECT 'dicom_archive_view_ownsites', 'DICOMs - Own Sites', ID, 'View', 2 FROM modules WHERE Name='dicom_archive';UPDATE permissions
    SET description = 'Create/Edit/Close Own Issues and Comment on All Issues'
    WHERE code = 'issue_tracker_reporter';
-- Change FKs from CandID to CandidateID which is now candidate.ID
ALTER TABLE CNV DROP constraint CNV_ibfk_3;
UPDATE CNV SET CandID=(SELECT ID from candidate c WHERE c.CandID=CNV.CandID);
ALTER TABLE CNV CHANGE CandID CandidateID int(10) unsigned DEFAULT NULL;
ALTER TABLE CNV ADD CONSTRAINT CNV_ibfk_3 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

ALTER TABLE candidate_consent_rel DROP CONSTRAINT `FK_candidate_consent_rel_CandidateID`;
UPDATE candidate_consent_rel SET CandidateID=(SELECT ID from candidate c WHERE c.CandID=candidate_consent_rel.CandidateID);
ALTER TABLE candidate_consent_rel CHANGE CandidateID CandidateID int(10) unsigned NOT NULL;
ALTER TABLE candidate_consent_rel ADD CONSTRAINT FK_candidate_consent_rel_CandidateID FOREIGN KEY (CandidateID) REFERENCES candidate(ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE participant_status DROP CONSTRAINT `fk_participant_status_3`;
UPDATE participant_status SET CandID=(SELECT ID from candidate c WHERE c.CandID=participant_status.CandID);
ALTER TABLE participant_status CHANGE CandID CandidateID int(10) unsigned NOT NULL;
ALTER TABLE participant_status ADD CONSTRAINT FK_participant_status_3 FOREIGN KEY (CandidateID) REFERENCES candidate(ID) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE dataquery_run_results DROP CONSTRAINT `dataquery_run_results_ibfk_1`;
UPDATE dataquery_run_results SET CandID=(SELECT ID from candidate c WHERE c.CandID=dataquery_run_results.CandID);
ALTER TABLE dataquery_run_results CHANGE CandID CandidateID int(10) unsigned NOT NULL;
ALTER TABLE dataquery_run_results ADD CONSTRAINT dataquery_run_results_ibfk_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

ALTER TABLE issues DROP CONSTRAINT `fk_issues_3`;
UPDATE issues SET CandID=(SELECT ID from candidate c WHERE c.CandID=issues.CandID);
ALTER TABLE issues CHANGE CandID CandidateID int(10) unsigned DEFAULT NULL;
ALTER TABLE issues ADD CONSTRAINT fk_issues_3 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

ALTER TABLE session DROP CONSTRAINT `fk_session_1`;
UPDATE session SET CandID=(SELECT ID from candidate c WHERE c.CandID=session.CandID);
ALTER TABLE session CHANGE CandID CandidateID int(10) unsigned NOT NULL;
ALTER TABLE session ADD CONSTRAINT fk_session_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

ALTER TABLE genomic_candidate_files_rel DROP CONSTRAINT `genomic_candidate_files_rel_ibfk_1`;
UPDATE genomic_candidate_files_rel SET CandID=(SELECT ID from candidate c WHERE c.CandID=genomic_candidate_files_rel.CandID);
ALTER TABLE genomic_candidate_files_rel CHANGE CandID CandidateID int(10) unsigned NOT NULL;
ALTER TABLE genomic_candidate_files_rel ADD CONSTRAINT genomic_candidate_files_rel_ibfk_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

ALTER TABLE mri_scanner DROP CONSTRAINT `FK_mri_scanner_1`;
UPDATE mri_scanner SET CandID=(SELECT ID from candidate c WHERE c.CandID=mri_scanner.CandID);
ALTER TABLE mri_scanner CHANGE CandID CandidateID int(10) unsigned DEFAULT NULL;
ALTER TABLE mri_scanner ADD CONSTRAINT FK_mri_scanner_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

ALTER TABLE genomic_sample_candidate_rel DROP CONSTRAINT `genomic_sample_candidate_rel_ibfk_1`;
UPDATE genomic_sample_candidate_rel SET CandID=(SELECT ID from candidate c WHERE c.CandID=genomic_sample_candidate_rel.CandID);
ALTER TABLE genomic_sample_candidate_rel CHANGE CandID CandidateID int(10) unsigned NOT NULL;
ALTER TABLE genomic_sample_candidate_rel ADD CONSTRAINT `genomic_sample_candidate_rel_ibfk_1` FOREIGN KEY (CandidateID) REFERENCES `candidate`(`ID`);

ALTER TABLE SNP_candidate_rel DROP CONSTRAINT `fk_SNP_candidate_rel_2`;
UPDATE SNP_candidate_rel SET CandID=(SELECT ID from candidate c WHERE c.CandID=SNP_candidate_rel.CandID);
ALTER TABLE SNP_candidate_rel CHANGE CandID CandidateID int(10) unsigned NOT NULL;
ALTER TABLE SNP_candidate_rel ADD CONSTRAINT `fk_SNP_candidate_rel_2` FOREIGN KEY (CandidateID) REFERENCES candidate(ID) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE parameter_candidate DROP CONSTRAINT `FK_parameter_candidate_2`;
UPDATE parameter_candidate SET CandID=(SELECT ID from candidate c WHERE c.CandID=parameter_candidate.CandID);
ALTER TABLE parameter_candidate CHANGE CandID CandidateID int(10) unsigned NOT NULL;
ALTER TABLE parameter_candidate ADD CONSTRAINT FK_parameter_candidate_2 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);


ALTER TABLE candidate_diagnosis_evolution_rel DROP FOREIGN KEY FK_candidate_diagnosis_evolution_rel_CandID;
ALTER TABLE candidate_diagnosis_evolution_rel DROP PRIMARY KEY;
UPDATE candidate_diagnosis_evolution_rel AS rel
JOIN candidate AS c ON rel.CandID = c.CandID
SET rel.CandID = c.ID;
ALTER TABLE candidate_diagnosis_evolution_rel
CHANGE CandID CandidateID INT(10) UNSIGNED NOT NULL;
ALTER TABLE candidate_diagnosis_evolution_rel
ADD CONSTRAINT PK_candidate_diagnosis_evolution_rel PRIMARY KEY (CandidateID, DxEvolutionID);
ALTER TABLE candidate_diagnosis_evolution_rel
ADD CONSTRAINT FK_candidate_diagnosis_evolution_rel_CandID
FOREIGN KEY (CandidateID) REFERENCES candidate(ID)
ON DELETE RESTRICT ON UPDATE RESTRICT;


-- Changes references to candidate.CandID that were NOT FK. Add FK
UPDATE feedback_bvl_thread SET CandID=(SELECT ID from candidate c WHERE c.CandID=feedback_bvl_thread.CandID);
ALTER TABLE feedback_bvl_thread CHANGE CandID CandidateID int(10) unsigned DEFAULT NULL;
ALTER TABLE feedback_bvl_thread ADD CONSTRAINT FK_feedback_bvl_thread_candidate_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

UPDATE mri_violations_log SET CandID=(SELECT ID from candidate c WHERE c.CandID=mri_violations_log.CandID);
ALTER TABLE mri_violations_log CHANGE CandID CandidateID int(10) unsigned DEFAULT NULL;
ALTER TABLE mri_violations_log ADD CONSTRAINT FK_mri_violations_log_candidate_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

UPDATE mri_protocol_violated_scans SET CandID=(SELECT ID from candidate c WHERE c.CandID=mri_protocol_violated_scans.CandID);
ALTER TABLE mri_protocol_violated_scans CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE mri_protocol_violated_scans ADD CONSTRAINT FK_mri_protocol_violated_scans_candidate_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

UPDATE participant_status_history SET CandID=(SELECT ID from candidate c WHERE c.CandID=participant_status_history.CandID);
ALTER TABLE participant_status_history CHANGE CandID CandidateID int(10) unsigned NOT NULL;
ALTER TABLE participant_status_history ADD CONSTRAINT FK_participant_status_history_candidate_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

UPDATE family SET CandID=(SELECT ID from candidate c WHERE c.CandID=family.CandID);
ALTER TABLE family CHANGE CandID CandidateID int(10) unsigned NOT NULL;
ALTER TABLE family ADD CONSTRAINT FK_family_candidate_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);


-- Change candidate's PK to ID
ALTER TABLE candidate DROP PRIMARY KEY, ADD PRIMARY KEY(ID);
ALTER TABLE permissions CHANGE `action` `action` enum (
      'Close',
      'Create',
      'Create/Edit',
      'Delete',
      'Download',
      'Edit',
      'Edit/Upload',
      'Edit/Upload/Delete',
      'Edit/Upload/Hide',
      'Upload',
      'View', 
      'View/Create',
      'View/Create/Edit',
      'View/Download',
      'View/Edit',
      'View/Edit/Comment',
      'View/Edit/Comment/Close',
      'View/Upload' 
      );

UPDATE permissions SET code = 'issue_tracker_own_issue', description = 'Issues - Own', action = 'View/Edit/Comment/Close'
WHERE code = 'issue_tracker_reporter';
UPDATE permissions SET code = 'issue_tracker_all_issue', description = 'Issues - All Sites', action = 'View/Edit/Comment'
WHERE code = 'issue_tracker_developer';

INSERT INTO permissions (code, description, moduleID, action, categoryID) VALUES
('issue_tracker_site_issue','Issues - Own Sites',(SELECT ID FROM modules WHERE Name = 'issue_tracker'),'View/Edit/Comment',2),
('issue_tracker_close_site_issue','Issues - Own Sites',(SELECT ID FROM modules WHERE Name = 'issue_tracker'),'Close',2),
('issue_tracker_close_all_issue','Issues - All Sites',(SELECT ID FROM modules WHERE Name = 'issue_tracker'),'Close',2);
ALTER TABLE issues_history CHANGE `fieldChanged` `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','CandidateID','candID','description','watching','instrument') NOT NULL DEFAULT 'comment';

UPDATE issues_history SET `fieldChanged` = 'CandidateID' WHERE `fieldChanged` = 'candID';

ALTER TABLE issues_history CHANGE `fieldChanged` `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','CandidateID', 'description','watching','instrument') NOT NULL DEFAULT 'comment';

UPDATE issues_history
JOIN candidate ON issues_history.newValue = candidate.CandID
SET issues_history.newValue = candidate.ID WHERE issues_history.fieldChanged = 'CandidateID';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'profiler_log_level', 'Verbosity of performance profiler logging', 1, 0, 'log_level', ID, 'Profiler Log Level', 3 FROM ConfigSettings WHERE Name='logs';

UPDATE `test_battery` SET `DoubleDataEntryEnabled`='N' WHERE `DoubleDataEntryEnabled` IS NULL;
ALTER TABLE `test_battery` MODIFY `DoubleDataEntryEnabled` enum('Y','N') NOT NULL DEFAULT 'N';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
  SELECT 'use_legacy_dicom_study_importer', 'Use the legacy DICOM study importer instead of the new one', 1, 0, 'boolean', ID, 'Use legacy DICOM study importer', 15
  FROM ConfigSettings
  WHERE Name="imaging_pipeline";

INSERT INTO Config (ConfigID, Value)
  SELECT ID, 1
  FROM ConfigSettings cs
  WHERE cs.Name='use_legacy_dicom_study_importer';
INSERT INTO permissions (code, description, ModuleID, action, categoryID)
VALUES ('view_instrument_data', 'Data', 
(SELECT ID FROM modules WHERE Name = 'instruments'), 'View', 2);
INSERT IGNORE INTO user_perm_rel (userID, permID) 
SELECT users.ID, permissions.permID FROM users 
CROSS JOIN permissions WHERE users.userID='admin';CREATE TABLE `openid_connect_providers` (
    `OpenIDProviderID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `Name` varchar(255) NOT NULL,
    `BaseURI` text NOT NULL, -- the provider's base uri that hosts .well-known/openid-configuration
    `ClientID` text NOT NULL,
    `ClientSecret` text NOT NULL,
    `RedirectURI` text NOT NULL, -- our local redirectURI that the provider is configured to authorize
                                 -- should be something like "https://something.loris.ca/oidc/callback"
    PRIMARY KEY (`OpenIDProviderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `openid_connect_csrf` (
    `State` varchar(64) NOT NULL UNIQUE,
    `OpenIDProviderID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `Nonce` varchar(64) NOT NULL,
    `Created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`State`),
    CONSTRAINT `FK_openid_provider` FOREIGN KEY (`OpenIDProviderID`) REFERENCES `openid_connect_providers` (`OpenIDProviderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
SET FOREIGN_KEY_CHECKS = 1;
