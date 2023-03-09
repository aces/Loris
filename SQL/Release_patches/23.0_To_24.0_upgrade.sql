SELECT 'Running: SQL/Archive/24.0/2019-07-01_fix_project_in_session.sql';

-- Populate new session field with pre recorded candidate project
ALTER TABLE candidate DROP FOREIGN KEY `FK_candidate_RegistrationProjectID`;
ALTER TABLE candidate CHANGE `RegistrationProjectID` `RegistrationProjectID` int(10) unsigned NOT NULL;
ALTER TABLE candidate ADD CONSTRAINT `FK_candidate_RegistrationProjectID` FOREIGN KEY (`RegistrationProjectID`) REFERENCES `Project` (`ProjectID`) ON UPDATE CASCADE;

UPDATE session s JOIN candidate c ON s.CandID=c.CandID SET ProjectID=c.RegistrationProjectID WHERE ProjectID IS NULL;

ALTER TABLE `session` DROP FOREIGN KEY `FK_session_ProjectID`;
ALTER TABLE `session` CHANGE `ProjectID` `ProjectID` int(10) unsigned NOT NULL;
ALTER TABLE `session` ADD CONSTRAINT `FK_session_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`);

SELECT 'Running: SQL/Archive/24.0/2019-09-18_DocRepoEdit.sql';

INSERT INTO `permissions` (code,description,categoryID) VALUES ('document_repository_edit','Upload and edit files in Document Repository','2');
UPDATE `permissions` SET description='Document Repository: View' WHERE code='document_repository_view';
UPDATE `permissions` SET description='Document Repository: Edit and upload' WHERE code='document_repository_edit';
UPDATE `permissions` SET description='Document Repository: Delete' WHERE code='document_repository_delete';

SELECT 'Running: SQL/Archive/24.0/2019-12-17-RemovePasswordExpiry.sql';

ALTER TABLE users ADD COLUMN PasswordChangeRequired TINYINT(1) NOT NULL DEFAULT 0;
UPDATE users SET PasswordChangeRequired=1 WHERE Password_expiry < CURDATE();

SELECT 'Running: SQL/Archive/24.0/2020-01-07-publication_users_edit_perm_rel_pk.sql';

ALTER TABLE `publication_users_edit_perm_rel`
ADD CONSTRAINT `PK_publication_users_edit_perm_rel` PRIMARY KEY(`PublicationID`, `UserID`);

SELECT 'Running: SQL/Archive/24.0/2020-02-10-AddConsentGrouping.sql';

CREATE TABLE `consent_group` (
  `ConsentGroupID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Label` varchar(255) NOT NULL,
  CONSTRAINT `PK_consent_group` PRIMARY KEY (`ConsentGroupID`),
  CONSTRAINT `UK_consent_group_Name` UNIQUE KEY `Name` (`Name`),
  CONSTRAINT `UK_consent_group_Label` UNIQUE KEY `Label` (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `consent_group` (`ConsentGroupID`, `Name`, `Label`) VALUES ('1', 'main_consent', 'Main consent');

ALTER TABLE `consent` ADD `ConsentGroupID` integer unsigned NOT NULL DEFAULT 1;
ALTER TABLE `consent` ADD CONSTRAINT `FK_consent_ConsentGroupID` FOREIGN KEY (`ConsentGroupID`) REFERENCES `consent_group` (`ConsentGroupID`) ON DELETE RESTRICT ON UPDATE CASCADE;

SELECT 'Running: SQL/Archive/24.0/2020-02-10_NewModulePermissions.sql';

INSERT INTO permissions (code,description,categoryID) VALUES
('imaging_quality_control_view','Imaging Quality Control: View module',(SELECT ID FROM permissions_category WHERE Description='Permission'));
INSERT INTO permissions (code,description,categoryID) VALUES
('behavioural_quality_control_view','Behavioural Quality Control: View module',(SELECT ID FROM permissions_category WHERE Description='Permission'));
INSERT INTO permissions (code,description,categoryID) VALUES
('survey_accounts_view','Survey Accounts: View module',(SELECT ID FROM permissions_category WHERE Description='Permission'));
-- Grant new permission codes to users who had the old ones.
INSERT INTO user_perm_rel SELECT userID, (SELECT permID FROM permissions WHERE code='survey_accounts_view') FROM user_perm_rel WHERE permID=(SELECT permID FROM permissions WHERE code='user_accounts');
INSERT INTO user_perm_rel SELECT userID, (SELECT permID FROM permissions WHERE code='behavioural_quality_control_view') FROM user_perm_rel WHERE permID=(SELECT permID FROM permissions WHERE code='quality_control');
INSERT INTO user_perm_rel SELECT userID, (SELECT permID FROM permissions WHERE code='imaging_quality_control_view') FROM user_perm_rel WHERE permID=(SELECT permID FROM permissions WHERE code='user_accounts');

SELECT 'Running: SQL/Archive/24.0/2020-02-25_Add-Admin-Contact-Email.sql';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'adminContactEmail', 'An email address that users can write to in order to report issues or ask question', 1, 0, 'text', ID, 'Administrator Email', 27 FROM ConfigSettings WHERE Name="study";
INSERT INTO Config (ConfigID, Value) SELECT ID, ''  FROM ConfigSettings WHERE Name="adminContactEmail";

SELECT 'Running: SQL/Archive/24.0/2020-03-09-SQL_patch_for_HRRT_PET_images_insertion.sql';

-- Create the hrrt_archive and hrrt_archive_files tables
CREATE TABLE `hrrt_archive` (
  `HrrtArchiveID`     INT(11)          NOT NULL AUTO_INCREMENT,
  `SessionID`         INT(10) unsigned          DEFAULT NULL,
  `EcatFileCount`     INT(11)          NOT NULL DEFAULT '0',
  `NonEcatFileCount`  INT(11)          NOT NULL DEFAULT '0',
  `DateAcquired`      DATE                      DEFAULT NULL,
  `DateArchived`      DATETIME                  DEFAULT NULL,
  `PatientName`       VARCHAR(50)      NOT NULL DEFAULT '',
  `CenterName`        VARCHAR(50)      NOT NULL DEFAULT '',
  `CreatingUser`      VARCHAR(50)      NOT NULL DEFAULT '',
  `Blake2bArchive`    VARCHAR(255)              DEFAULT NULL,
  `ArchiveLocation`   VARCHAR(255)              DEFAULT NULL,
  PRIMARY KEY (`HrrtArchiveID`),
  KEY `patNam` (`CenterName`(10),`PatientName`(30)),
  KEY `FK_hrrt_archive_sessionID` (`SessionID`),
  CONSTRAINT `FK_hrrt_archive_sessionID`
    FOREIGN KEY (`SessionID`)
    REFERENCES `session` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `hrrt_archive_files` (
  `HrrtArchiveFileID` INT(11)      NOT NULL AUTO_INCREMENT,
  `HrrtArchiveID`     INT(11)      NOT NULL DEFAULT '0',
  `Blake2bHash`       VARCHAR(255) NOT NULL,
  `FileName`          VARCHAR(255) NOT NULL,
  PRIMARY KEY (`HrrtArchiveFileID`),
  KEY `HrrtArchiveID` (`HrrtArchiveID`),
  CONSTRAINT `hrrt_archive_files_ibfk_1`
    FOREIGN KEY (`HrrtArchiveID`)
    REFERENCES  `hrrt_archive` (`HrrtArchiveID`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- Create the mri_upload_rel table
CREATE TABLE `mri_upload_rel` (
  `UploadRelID`   INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `UploadID`      INT(10) UNSIGNED NOT NULL,
  `HrrtArchiveID` INT(11) DEFAULT NULL,
  PRIMARY KEY (`UploadRelID`),
  KEY `FK_mriuploadrel_UploadID` (`UploadID`),
  KEY `FK_mriuploadrel_HrrtArchiveID` (`HrrtArchiveID`),
  CONSTRAINT `FK_mriuploadrel_UploadID`
    FOREIGN KEY (`UploadID`)
    REFERENCES `mri_upload` (`UploadID`),
  CONSTRAINT `FK_mriuploadrel_HrrtArchiveID`
    FOREIGN KEY (`HrrtArchiveID`)
    REFERENCES `hrrt_archive` (`HrrtArchiveID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Insert into notification type 'hrrt pet new series'
INSERT INTO notification_types SET
  Type        = 'hrrt pet new series',
  private     = 0,
  Description = 'New HRRT PET studies inserted into the database';


-- Alter files table to add a HrrtArchiveID field that links HRRT MINC files
-- to hrrt_archive tables
ALTER TABLE files
  ADD COLUMN `HrrtArchiveID` INT(11) DEFAULT NULL,
  ADD KEY `FK_files_HrrtArchiveID_1` (`HrrtArchiveID`),
  ADD CONSTRAINT `FK_files_HrrtArchiveID`
    FOREIGN KEY (`HrrtArchiveID`) REFERENCES `hrrt_archive` (`HrrtArchiveID`);

SELECT 'Running: SQL/Archive/24.0/2020-03-26_add_account_request_date_to_users_table.sql';

-- add a new column to the users table to store the date at which
-- the user requested an account
ALTER TABLE users
  ADD COLUMN account_request_date DATE DEFAULT NULL;

-- determine the account_request_date based on what is present in the history
-- table for when the user was inserted the first time in the history table
UPDATE users u, history h
  SET u.account_request_date=h.changeDate
  WHERE
    h.tbl='users'  AND
    h.col='UserID' AND
    h.old IS NULL  AND
    u.UserID=h.new;

SELECT 'Running: SQL/Archive/24.0/2020-06-16-Add_Date_Format_to_ConfigSettings_DataType.sql';

-- Add date_format option to DataType
ALTER TABLE ConfigSettings
	MODIFY COLUMN `DataType` enum('text','boolean','email','instrument','textarea','scan_type','date_format','lookup_center','path','web_path') DEFAULT NULL;

-- Update DataType of dobFormat
UPDATE ConfigSettings
	SET DataType='date_format' WHERE Name='dobFormat';

-- Update DataType of dodFormat
UPDATE ConfigSettings
	SET DataType='date_format' WHERE Name='dodFormat';

-- Convert old date casing combos to supported format
UPDATE Config SET Value='Ymd'
	WHERE LOWER(Value)='ymd'
	AND ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='dobFormat');

UPDATE Config SET Value='Ymd'
        WHERE LOWER(Value)='ymd'
        AND ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='dodFormat');

UPDATE Config SET Value='Ym'
	WHERE LOWER(Value)='ym'
	AND ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='dobFormat');

UPDATE Config SET Value='Ym'
        WHERE LOWER(Value)='ym'
        AND ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='dodFormat');

SELECT 'Running: SQL/Archive/24.0/2020-07-14_NewModuleDQT.sql';

INSERT INTO modules (Name, Active) VALUES ('dqt', 'Y');

SELECT 'Running: SQL/Archive/24.0/2020-07-22_RenameBatteryManagerPermissions.sql';

UPDATE permissions SET description='Battery Manager: Edit Test Entries' WHERE code='battery_manager_edit';
UPDATE permissions SET description='Battery Manager: View Test Entries' WHERE code='battery_manager_view';

SELECT 'Running: SQL/Archive/24.0/2020-07-29_Required_elements_completed_flag_column.sql';

ALTER TABLE flag
    ADD COLUMN `Required_elements_completed` enum('Y','N') NOT NULL default 'N';

SELECT 'Running: SQL/Archive/24.0/2020-08-10_add_AcquisitionDate_to_files.sql';


ALTER TABLE files ADD COLUMN `AcquisitionDate` date DEFAULT NULL;

UPDATE
  files f,
  parameter_file pf,
  parameter_type pt
SET
  f.AcquisitionDate=pf.Value
WHERE
  f.FileID=pf.FileID
  AND pf.ParameterTypeID=pt.ParameterTypeID
  AND pt.Name='acquisition_date';

SELECT 'Running: SQL/Archive/24.0/2020-08-11_adding_api_docs_module.sql';

INSERT IGNORE INTO modules (Name, Active) VALUES ('api_docs', 'Y');
INSERT IGNORE INTO permissions (Code, Description,CategoryID) VALUES ('api_docs', 'API Documentation: View LORIS API Manual',2);

SELECT 'Running: SQL/Archive/24.0/2020-10-29-session-current-stage-default.sql';

UPDATE `session` set Current_stage = 'Not Started' WHERE Current_stage IS NULL;
ALTER TABLE `session` MODIFY Current_stage enum('Not Started','Screening','Visit','Approval','Subject','Recycling Bin') NOT NULL DEFAULT 'Not Started';

SELECT 'Running: SQL/Archive/24.0/2021-01-31-renaming_permissions.sql';

ALTER TABLE permissions
    ADD COLUMN `moduleID` int(11) unsigned AFTER `description`,
    ADD COLUMN `action` enum (
    'View',
    'Create',
    'Edit',
    'Download',
    'Upload',
    'Delete',
    'View/Create',
    'View/Edit',
    'View/Download',
    'View/Upload',
    'View/Create/Edit',
    'Create/Edit',
    'Edit/Upload',
    'Edit/Upload/Delete') AFTER `moduleID`;

UPDATE permissions SET description='User Accounts - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='user_accounts'), action='View/Create/Edit' WHERE code='user_accounts';
UPDATE permissions SET description='User Accounts - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='user_accounts'), action='View/Create/Edit' WHERE code='user_accounts_multisite';
UPDATE permissions SET description='Help documentation', moduleID=(SELECT ID FROM modules WHERE Name='help_editor'), action='Edit' WHERE code='context_help';
UPDATE permissions SET description='Feedback Threads', moduleID=(SELECT ID FROM modules WHERE Name='bvl_feedback'), action='Create/Edit' WHERE code='bvl_feedback';
UPDATE permissions SET description='Status', moduleID=(SELECT ID FROM modules WHERE Name='imaging_browser'), action='Edit' WHERE code='imaging_browser_qc';
UPDATE permissions SET description='Send to DCC', moduleID=(SELECT ID FROM modules WHERE Name='instrument_list') WHERE code='send_to_dcc';
UPDATE permissions SET description='Reverse Send from DCC', moduleID=(SELECT ID FROM modules WHERE Name='instrument_list') WHERE code='unsend_to_dcc';
UPDATE permissions SET description='Candidates and Timepoints - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='candidate_list'), action='View' WHERE code='access_all_profiles';
UPDATE permissions SET description='Candidates and Timepoints - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='candidate_list'), action='View/Create' WHERE code='data_entry';
UPDATE permissions SET description='Add and Certify Examiners - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='examiner') WHERE code='examiner_view';
UPDATE permissions SET description='Add and Certify Examiners - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='examiner') WHERE code='examiner_multisite';
UPDATE permissions SET description='Resolve Conflicts', moduleID=(SELECT ID FROM modules WHERE Name='conflict_resolver') WHERE code='conflict_resolver';
UPDATE permissions SET description='Parameter Type Descriptions', moduleID=(SELECT ID FROM modules WHERE Name='datadict'), action='View' WHERE code='data_dict_view';
UPDATE permissions SET description='Violated Scans - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='mri_violations'), action='View' WHERE code='violated_scans_view_allsites';
UPDATE permissions SET description='Settings', moduleID=(SELECT ID FROM modules WHERE Name='configuration'), action='View/Edit' WHERE code='config';
UPDATE permissions SET description='Imaging Scans - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='imaging_browser'), action='View' WHERE code='imaging_browser_view_site';
UPDATE permissions SET description='Imaging Scans - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='imaging_browser'), action='View' WHERE code='imaging_browser_view_allsites';
UPDATE permissions SET description='DICOMs - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='dicom_archive'), action='View' WHERE code='dicom_archive_view_allsites';
UPDATE permissions SET description='Instrument Forms', moduleID=(SELECT ID FROM modules WHERE Name='instrument_builder'), action='Create/Edit' WHERE code='instrument_builder';
UPDATE permissions SET description='Parameter Type Descriptions', moduleID=(SELECT ID FROM modules WHERE Name='datadict'), action='Edit' WHERE code='data_dict_edit';
UPDATE permissions SET description='Candidate Information', moduleID=(SELECT ID FROM modules WHERE Name='candidate_parameters'), action='View' WHERE code='candidate_parameter_view';
UPDATE permissions SET description='Candidate Information', moduleID=(SELECT ID FROM modules WHERE Name='candidate_parameters'), action='Edit' WHERE code='candidate_parameter_edit';
UPDATE permissions SET description='Genomic Data - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='genomic_browser'), action='View' WHERE code='genomic_browser_view_site';
UPDATE permissions SET description='Genomic Data - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='genomic_browser'), action='View' WHERE code='genomic_browser_view_allsites';
UPDATE permissions SET description='Documents', moduleID=(SELECT ID FROM modules WHERE Name='document_repository'), action='View' WHERE code='document_repository_view';
UPDATE permissions SET description='Documents', moduleID=(SELECT ID FROM modules WHERE Name='document_repository'), action='Delete' WHERE code='document_repository_delete';
UPDATE permissions SET description='Processes', moduleID=(SELECT ID FROM modules WHERE Name='server_processes_manager'), action='View' WHERE code='server_processes_manager';
UPDATE permissions SET description='Imaging Scans', moduleID=(SELECT ID FROM modules WHERE Name='imaging_uploader'), action='View/Upload' WHERE code='imaging_uploader';
UPDATE permissions SET description='Acknowledgee List', moduleID=(SELECT ID FROM modules WHERE Name='acknowledgements'), action='View' WHERE code='acknowledgements_view';
UPDATE permissions SET description='Acknowledgee List', moduleID=(SELECT ID FROM modules WHERE Name='acknowledgements'), action='Edit' WHERE code='acknowledgements_edit';
UPDATE permissions SET description='Cross-Modality Data', moduleID=(SELECT ID FROM modules WHERE Name='dataquery'), action='View/Download' WHERE code='dataquery_view';
UPDATE permissions SET description='Genomic Files', moduleID=(SELECT ID FROM modules WHERE Name='genomic_browser'), action='Upload' WHERE code='genomic_data_manager';
UPDATE permissions SET description='Candidate Media Files', moduleID=(SELECT ID FROM modules WHERE Name='media'), action='Edit/Upload/Delete' WHERE code='media_write';
UPDATE permissions SET description='Candidate Media Files', moduleID=(SELECT ID FROM modules WHERE Name='media'), action='View/Download' WHERE code='media_read';
UPDATE permissions SET description='Create/Edit Own Issues and Comment on All Issues', moduleID=(SELECT ID FROM modules WHERE Name='issue_tracker') WHERE code='issue_tracker_reporter';
UPDATE permissions SET description='Close/Edit/Re-assign/Comment on All Issues', moduleID=(SELECT ID FROM modules WHERE Name='issue_tracker') WHERE code='issue_tracker_developer';
UPDATE permissions SET description='Phantom Scans - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='imaging_browser'), action='View' WHERE code='imaging_browser_phantom_allsites';
UPDATE permissions SET description='Phantom Scans - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='imaging_browser'), action='View' WHERE code='imaging_browser_phantom_ownsite';
UPDATE permissions SET description='Release Files', moduleID=(SELECT ID FROM modules WHERE Name='data_release'), action='View' WHERE code='data_release_view';
UPDATE permissions SET description='Release Files', moduleID=(SELECT ID FROM modules WHERE Name='data_release'), action='Upload' WHERE code='data_release_upload';
UPDATE permissions SET description='Grant Other Users Access to Releases', moduleID=(SELECT ID FROM modules WHERE Name='data_release') WHERE code='data_release_edit_file_access';
UPDATE permissions SET description='Installed Instruments', moduleID=(SELECT ID FROM modules WHERE Name='instrument_manager'), action='View' WHERE code='instrument_manager_read';
UPDATE permissions SET description='Upload and Install Instruments', moduleID=(SELECT ID FROM modules WHERE Name='instrument_manager') WHERE code='instrument_manager_write';
UPDATE permissions SET description='Publication Projects', moduleID=(SELECT ID FROM modules WHERE Name='publication'), action='View' WHERE code='publication_view';
UPDATE permissions SET description='Propose Publication Projects', moduleID=(SELECT ID FROM modules WHERE Name='publication') WHERE code='publication_propose';
UPDATE permissions SET description='Accept/Reject Publication Projects', moduleID=(SELECT ID FROM modules WHERE Name='publication') WHERE code='publication_approve';
UPDATE permissions SET description='Dates of Birth', moduleID=(SELECT ID FROM modules WHERE Name='candidate_parameters'), action='Edit' WHERE code='candidate_dob_edit';
UPDATE permissions SET description='EEGs - All Sites', moduleID=(SELECT ID FROM modules WHERE Name='electrophysiology_browser'), action='View' WHERE code='electrophysiology_browser_view_allsites';
UPDATE permissions SET description='EEGs - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='electrophysiology_browser'), action='View' WHERE code='electrophysiology_browser_view_site';
UPDATE permissions SET description='Battery Entries', moduleID=(SELECT ID FROM modules WHERE Name='battery_manager'), action='View' WHERE code='battery_manager_view';
UPDATE permissions SET description='Battery Entries', moduleID=(SELECT ID FROM modules WHERE Name='battery_manager'), action='Create/Edit' WHERE code='battery_manager_edit';
UPDATE permissions SET description='Installed Modules', moduleID=(SELECT ID FROM modules WHERE Name='module_manager'), action='View' WHERE code='module_manager_view';
UPDATE permissions SET description='Installed Modules', moduleID=(SELECT ID FROM modules WHERE Name='module_manager'), action='Edit' WHERE code='module_manager_edit';
UPDATE permissions SET description='Dates of Death', moduleID=(SELECT ID FROM modules WHERE Name='candidate_parameters'), action='Edit' WHERE code='candidate_dod_edit';
UPDATE permissions SET description='Violated Scans - Own Sites', moduleID=(SELECT ID FROM modules WHERE Name='mri_violations'), action='View' WHERE code='violated_scans_view_ownsite';
UPDATE permissions SET description='Documents', moduleID=(SELECT ID FROM modules WHERE Name='document_repository'), action='Edit/Upload' WHERE code='document_repository_edit';
UPDATE permissions SET description='Candidate Surveys', moduleID=(SELECT ID FROM modules WHERE Name='survey_accounts'), action='View' WHERE code='survey_accounts_view';
UPDATE permissions SET description='Flagged Imaging Entries', moduleID=(SELECT ID FROM modules WHERE Name='imaging_qc'), action='View' WHERE code='imaging_quality_control_view';
UPDATE permissions SET description='Flagged Behavioural Entries', moduleID=(SELECT ID FROM modules WHERE Name='behavioural_qc'), action='View' WHERE code='behavioural_quality_control_view';
UPDATE permissions SET description='LORIS API Manual', moduleID=(SELECT ID FROM modules WHERE Name='api_docs'), action='View' WHERE code='api_docs';


SELECT 'Running: SQL/Archive/24.0/2021-02-19_electrophysiology_annotation_tables.sql';

-- Create physiological_annotation_file_type table
CREATE TABLE `physiological_annotation_file_type` (
    `FileType`        VARCHAR(20)   NOT NULL UNIQUE,
    `Description` VARCHAR(255),
    PRIMARY KEY (`FileType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create physiological_annotation_file table
CREATE TABLE `physiological_annotation_file` (
    `AnnotationFileID`    INT(10)      UNSIGNED NOT NULL AUTO_INCREMENT,
    `PhysiologicalFileID` INT(10)      UNSIGNED NOT NULL,
    `FileType`            VARCHAR(20)  NOT NULL,
    `FilePath`            VARCHAR(255),
    `LastUpdate`          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `LastWritten`         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`AnnotationFileID`),
    CONSTRAINT `FK_phys_file_ID`
        FOREIGN KEY (`PhysiologicalFileID`)
        REFERENCES `physiological_file` (`PhysiologicalFileID`),
    CONSTRAINT `FK_annotation_file_type`
        FOREIGN KEY (`FileType`)
        REFERENCES `physiological_annotation_file_type` (`FileType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create annotation_archive which will store archives of all the annotation files for
-- Front-end download
CREATE TABLE `physiological_annotation_archive` (
  `AnnotationArchiveID` INT(10) UNSIGNED NOT NULL   AUTO_INCREMENT,
  `PhysiologicalFileID` INT(10) UNSIGNED NOT NULL,
  `Blake2bHash`         VARCHAR(128)     NOT NULL,
  `FilePath`            VARCHAR(255)     NOT NULL,
  PRIMARY KEY (`AnnotationArchiveID`),
  CONSTRAINT `FK_physiological_file_ID`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create annotation_parameter table
-- Note: This corresponds with the JSON annotation files
CREATE TABLE `physiological_annotation_parameter` (
    `AnnotationParameterID` INT(10)      UNSIGNED NOT NULL AUTO_INCREMENT,
    `AnnotationFileID`      INT(10)      UNSIGNED NOT NULL,
    `Description`           TEXT         NOT NULL,
    `Sources`               VARCHAR(255),
    `Author`                VARCHAR(50),
    PRIMARY KEY (`AnnotationParameterID`),
    CONSTRAINT `FK_annotation_file_ID`
        FOREIGN KEY (`AnnotationFileID`)
        REFERENCES `physiological_annotation_file` (`AnnotationFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create an annotation_label_type table
CREATE TABLE `physiological_annotation_label` (
  `AnnotationLabelID`    INT(5)       UNSIGNED NOT NULL      AUTO_INCREMENT,
  `LabelName`            VARCHAR(255)          NOT NULL      UNIQUE,
  `LabelDescription`         VARCHAR(255)          DEFAULT NULL,
  PRIMARY KEY (`AnnotationLabelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create annotation_tsv table
-- Note: This corresponds with the .tsv annotation files
CREATE TABLE `physiological_annotation_instance` (
    `AnnotationInstanceID`  INT(10)         UNSIGNED NOT NULL AUTO_INCREMENT,
    `AnnotationFileID`      INT(10)         UNSIGNED NOT NULL,
    `AnnotationParameterID` INT(10)         UNSIGNED NOT NULL,
    `Onset`                 DECIMAL(10, 4),
    `Duration`              DECIMAL(10, 4)  DEFAULT 0,
    `AnnotationLabelID`     INT(5)          UNSIGNED NOT NULL,
    `Channels`              TEXT,
    `AbsoluteTime`          TIMESTAMP,
    `Description`           VARCHAR(255),
    PRIMARY KEY (`AnnotationInstanceID`),
    CONSTRAINT `FK_annotation_parameter_ID`
        FOREIGN KEY (`AnnotationParameterID`)
        REFERENCES `physiological_annotation_parameter` (`AnnotationParameterID`),
    CONSTRAINT `FK_annotation_file`
        FOREIGN KEY (`AnnotationFileID`)
        REFERENCES `physiological_annotation_file` (`AnnotationFileID`),
    CONSTRAINT `FK_annotation_label_ID`
        FOREIGN KEY (`AnnotationLabelID`)
        REFERENCES `physiological_annotation_label` (`AnnotationLabelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Insert into annotation_file_type
INSERT INTO physiological_annotation_file_type
    (FileType, Description)
    VALUES
    ('tsv',  'TSV File Type, contains information about each annotation'),
    ('json', 'JSON File Type, metadata for annotations');

-- Insert into annotation_label_type
INSERT INTO physiological_annotation_label
    (AnnotationLabelID, LabelName, LabelDescription)
    VALUES
    (1,  'artifact',            'artifactual data'),
    (2,  'motion',              'motion related artifact'),
    (3,  'flux_jump',           'artifactual data due to flux jump'),
    (4,  'line_noise',          'artifactual data due to line noise (e.g., 50Hz)'),
    (5,  'muscle',              'artifactual data due to muscle activity'),
    (6,  'epilepsy_interictal', 'period deemed interictal'),
    (7,  'epilepsy_preictal',   'onset of preictal state prior to onset of epilepsy'),
    (8,  'epilepsy_seizure',    'onset of epilepsy'),
    (9,  'epilepsy_postictal',  'postictal seizure period'),
    (10, 'epileptiform',        'unspecified epileptiform activity'),
    (11, 'epileptiform_single', 'a single epileptiform graphoelement (including possible slow wave)'),
    (12, 'epileptiform_run',    'a run of one or more epileptiform graphoelements'),
    (13, 'eye_blink',           'Eye blink'),
    (14, 'eye_movement',        'Smooth Pursuit / Saccadic eye movement'),
    (15, 'eye_fixation',        'Fixation onset'),
    (16, 'sleep_N1',            'sleep stage N1'),
    (17, 'sleep_N2',            'sleep stage N2'),
    (18, 'sleep_N3',            'sleep stage N3'),
    (19, 'sleep_REM',           'REM sleep'),
    (20, 'sleep_wake',          'sleep stage awake'),
    (21, 'sleep_spindle',       'sleep spindle'),
    (22, 'sleep_k-complex',     'sleep K-complex'),
    (23, 'scorelabeled',        'a global label indicating that the EEG has been annotated with SCORE.');

UPDATE physiological_output_type SET OutputTypeName='derivative' WHERE OutputTypeName='derivatives';

SELECT 'Running: SQL/Archive/24.0/2021-03-15_change_parameter_file_Value_longtext.sql';

ALTER TABLE parameter_file MODIFY Value LONGTEXT;


SELECT 'Running: SQL/Archive/24.0/2021-03-31-NewDictionaryModule.sql';

INSERT INTO modules (Name, Active) VALUES ('dictionary', 'Y');

SELECT 'Running: SQL/Archive/24.0/2021-04-23-annotation_permissions.sql';

INSERT INTO `permissions` (`code`, `description`, `moduleID`, `action`, `categoryID`) VALUES ('electrophysiology_browser_edit_annotations', 'Annotations', (SELECT ID FROM modules WHERE Name='electrophysiology_browser'), 'Create/Edit', 2);

SELECT 'Running: SQL/Archive/24.0/2021-05-20-Electrophysiology-split-files.sql';

INSERT INTO `ImagingFileTypes` VALUE ('archive', 'Archive file');

ALTER TABLE `physiological_file`
    ADD COLUMN `Index` INT(5) DEFAULT NULL,
    ADD COLUMN `ParentID` INT(10) unsigned DEFAULT NULL,
    ADD CONSTRAINT `FK_ParentID` FOREIGN KEY (`ParentID`) REFERENCES `physiological_file` (`PhysiologicalFileID`);

CREATE TABLE `physiological_split_file` (
  `ID`        INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `Index`     INT(5)           NOT NULL,
  `ArchiveID` INT(10) UNSIGNED NOT NULL,
  `FileType`  VARCHAR(12)      DEFAULT NULL,
  `FilePath`  VARCHAR(255)     NOT NULL,
  `Duration`  DECIMAL(10,3)    NOT NULL,
  CONSTRAINT `FK_ArchiveID`
    FOREIGN KEY (`ArchiveID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`),
  CONSTRAINT `FK_ImagingFileTypes`
    FOREIGN KEY (`FileType`)
    REFERENCES `ImagingFileTypes` (`type`),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SELECT 'Running: SQL/Archive/24.0/2021-06-11_exported_files_BIDS_tables.sql';

--
-- Add necessary file types in ImagingFileTypes
--
INSERT INTO ImagingFileTypes (type, description) VALUES
('json',   'JSON file'),
('readme', 'README file'),
('tsv',    'Tab separated values (TSV) file'),
('bval',   'NIfTI DWI file with b-values'),
('bvec',   'NIfTI DWI file with b-vectors');


--
-- Create table to store PhaseEncodingDirection possible values
--
CREATE TABLE `bids_phase_encoding_direction` (
  `BIDSPhaseEncodingDirectionID`   int(3) unsigned NOT NULL AUTO_INCREMENT,
  `BIDSPhaseEncodingDirectionName` varchar(3) NOT NULL,
  PRIMARY KEY (`BIDSPhaseEncodingDirectionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO bids_phase_encoding_direction (BIDSPhaseEncodingDirectionName) VALUES
('i'),
('i-'),
('j'),
('j-'),
('k'),
('k-');


--
-- Alter table bids_mri_scan_type_rel to add a PhaseEncodingDirection field
--
ALTER TABLE bids_mri_scan_type_rel ADD COLUMN BIDSPhaseEncodingDirectionID int(3) unsigned DEFAULT NULL;
ALTER TABLE bids_mri_scan_type_rel
    ADD CONSTRAINT `FK_bids_phase_encoding_direction`
        FOREIGN KEY (`BIDSPhaseEncodingDirectionID`)
            REFERENCES `bids_phase_encoding_direction` (`BIDSPhaseEncodingDirectionID`);


--
-- Table structure for `bids_file_level_category`
--
CREATE TABLE `bids_export_file_level_category` (
  `BIDSExportFileLevelCategoryID`   int(10) unsigned NOT NULL AUTO_INCREMENT,
  `BIDSExportFileLevelCategoryName` varchar(12) NOT NULL,
  PRIMARY KEY (`BIDSExportFileLevelCategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO bids_export_file_level_category (BIDSExportFileLevelCategoryName) VALUES
  ('study'),
  ('image'),
  ('session');



--
-- BIDS non-imaging file types
--
CREATE TABLE `bids_export_non_imaging_file_category` (
  `BIDSNonImagingFileCategoryID`   int(10) unsigned NOT NULL AUTO_INCREMENT,
  `BIDSNonImagingFileCategoryName` varchar(40) NOT NULL,
  PRIMARY KEY (`BIDSNonImagingFileCategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO bids_export_non_imaging_file_category (BIDSNonImagingFileCategoryName) VALUES
  ('dataset_description'),
  ('README'),
  ('bids-validator-config'),
  ('participants_list_file'),
  ('session_list_of_scans');


--
-- Table structure for table `bids_export_files`
--
CREATE TABLE `bids_export_files` (
  `BIDSExportedFileID`            int(10) unsigned NOT NULL AUTO_INCREMENT,
  `BIDSExportFileLevelCategoryID` int(10) unsigned NOT NULL,
  `FileID`                        int(10) unsigned DEFAULT NULL,
  `SessionID`                     int(10) unsigned DEFAULT NULL,
  `BIDSNonImagingFileCategoryID`  int(10) unsigned DEFAULT NULL,
  `BIDSCategoryID`                int(3)  unsigned DEFAULT NULL,
  `FileType`                      varchar(12) NOT NULL,
  `FilePath`                      varchar(255) NOT NULL,
  PRIMARY KEY (`BIDSExportedFileID`),
  CONSTRAINT `FK_bef_BIDSExportFileLevelID`        FOREIGN KEY (`BIDSExportFileLevelCategoryID`) REFERENCES `bids_export_file_level_category` (`BIDSExportFileLevelCategoryID`),
  CONSTRAINT `FK_bef_FileID`                       FOREIGN KEY (`FileID`)                        REFERENCES `files`   (`FileID`),
  CONSTRAINT `FK_bef_SessionID`                    FOREIGN KEY (`SessionID`)                     REFERENCES `session` (`ID`),
  CONSTRAINT `FK_bef_BIDSNonImagingFileCategoryID` FOREIGN KEY (`BIDSNonImagingFileCategoryID`)  REFERENCES `bids_export_non_imaging_file_category` (`BIDSNonImagingFileCategoryID`),
  CONSTRAINT `FK_bef_ModalityType`                 FOREIGN KEY (`BIDSCategoryID`)                REFERENCES `bids_category` (`BIDSCategoryID`),
  CONSTRAINT `FK_bef_FileType`                     FOREIGN KEY (`FileType`)                      REFERENCES `ImagingFileTypes` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



SELECT 'Running: SQL/Archive/24.0/2021-06-17_mnc2bids_Config_Settings.sql';

-- MINC to BIDS converter settings
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('minc2bids', 'Settings related to converting MINC to BIDS LORIS-MRI tool script', 1, 0,  'MINC to BIDS Converter Tool Options', 13);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_dataset_authors', 'Authors for the BIDS dataset', 1, 1, 'text', ID, 'BIDS Dataset Authors', 1 FROM ConfigSettings WHERE Name='minc2bids';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_acknowledgments_text', 'Acknowledgments to be added in the dataset_description.json file of the BIDS dataset created out of the MINC files', 1, 0, 'text', ID, 'BIDS Dataset Acknowledgments', 2 FROM ConfigSettings WHERE Name='minc2bids';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_readme_text', 'Content to be added to the README of the BIDS dataset generated out of the MINC files', 1, 0, 'textarea', ID, 'BIDS Dataset README', 3 FROM ConfigSettings WHERE Name='minc2bids';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_validator_options_to_ignore', 'Options to be ignored for BIDS validation', 1, 1, 'text', ID, 'BIDS Validation options to ignore', 4 FROM ConfigSettings WHERE Name='minc2bids';

-- Default values for mnc2bids config settings
INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_dataset_authors';
INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_acknowledgments_text';
INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_readme_text';
INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_validator_options_to_ignore';

SELECT 'Running: SQL/Archive/24.0/2021-06-23_set_default_ScannerID_to_NULL.sql';

ALTER TABLE mri_protocol MODIFY ScannerID int(10) unsigned default NULL;
UPDATE mri_protocol SET ScannerID=NULL WHERE ScannerID=0;

SELECT 'Running: SQL/Archive/24.0/2021-06-25_add_alias_column_to_parameter_type_for_bids_parameter_names.sql';

ALTER TABLE parameter_type ADD COLUMN `Alias` VARCHAR(255) DEFAULT NULL AFTER Name;
ALTER TABLE parameter_type MODIFY COLUMN `SourceFrom` VARCHAR(255);
ALTER TABLE parameter_type ADD UNIQUE `name_sourceFrom_index` (`Name`, `SourceFrom`);


INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('slice_thickness','SliceThickness','text','Nominal reconstructed slice thickness (for tomographic imaging) or depth of field (for optical non-tomographic imaging), in mm. DICOM:0018_0050','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SliceThickness', Description='Nominal reconstructed slice thickness (for tomographic imaging) or depth of field (for optical non-tomographic imaging), in mm. DICOM:0018_0050';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0018:el_0x0015','BodyPartExamined','text','Text description of the part of the body examined. Some IODs support the Anatomic Region Sequence (0008,2218), which can provide a more comprehensive mechanism for specifying the body part being examined. DICOM:0018_0015','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='BodyPartExamined', Description='Text description of the part of the body examined. Some IODs support the Anatomic Region Sequence (0008,2218), which can provide a more comprehensive mechanism for specifying the body part being examined. DICOM:0018_0015';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition:num_slices','NumberOfSlices','text','The maximum number of Slices that may exist in this Series. DICOM:0054_0081','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='NumberOfSlices', Description='The maximum number of Slices that may exist in this Series. DICOM:0054_0081';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('pixel_bandwidth','PixelBandwidth','text','Reciprocal of the total sampling period, in hertz per pixel. DICOM:0018_0095','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PixelBandwidth', Description='Reciprocal of the total sampling period, in hertz per pixel. DICOM:0018_0095';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition_matrix','AcquisitionMatrixPE','text','Dimensions of the acquired frequency/phase data before reconstruction. Multi-valued: frequency rowsfrequency columnsphase rowsphase columns. DICOM:0018_1310','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='AcquisitionMatrixPE', Description='Dimensions of the acquired frequency/phase data before reconstruction. Multi-valued: frequency rowsfrequency columnsphase rowsphase columns. DICOM:0018_1310';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('study_id','StudyID','text','User or equipment generated Study identifier. DICOM:0020_0010','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='StudyID', Description='User or equipment generated Study identifier. DICOM:0020_0010';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('modality','Modality','text','Type of equipment that originally acquired the data used to create images or related objects. DICOM:0008_0060','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='Modality', Description='Type of equipment that originally acquired the data used to create images or related objects. DICOM:0008_0060';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('sequence_variant','SequenceVariant','text','Variant of the Scanning Sequence. DICOM:0018_0021','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SequenceVariant', Description='Variant of the Scanning Sequence. DICOM:0018_0021';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('mr_acquisition_type','MRAcquisitionType','text','Identification of data encoding scheme. DICOM:0018_0023','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='MRAcquisitionType', Description='Identification of data encoding scheme. DICOM:0018_0023';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0028:el_0x0002','SamplesPerPixel','text','Number of samples (planes) in this image. DICOM:0028_0002','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SamplesPerPixel', Description='Number of samples (planes) in this image. DICOM:0028_0002';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('patient_name','PatientName','text','Set of identifiers used to determine to which candidate the scan belongs to. DICOM:0010_0010','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientName', Description='Set of identifiers used to determine to which candidate the scan belongs to. DICOM:0010_0010';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0028:el_0x0004','PhotometricInterpretation','text','Specifies the intended interpretation of the pixel data. DICOM:0028_0004','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PhotometricInterpretation', Description='Specifies the intended interpretation of the pixel data. DICOM:0028_0004';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition:start_time','PerformedProcedureStepStartTime','text','Time on which the Performed Procedure Step started. DICOM:0040_0245','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PerformedProcedureStepStartTime', Description='Time on which the Performed Procedure Step started. DICOM:0040_0245';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('number_of_phase_encoding_steps','PhaseEncodingSteps','text','Total number of lines in k-space in the \"y\" direction collected during acquisition. DICOM:0018_0089','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PhaseEncodingSteps', Description='Total number of lines in k-space in the \"y\" direction collected during acquisition. DICOM:0018_0089';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('percent_phase_field_of_view','PercentPhaseFOV','text','Ratio of field of view dimension in phase direction to field of view dimension in frequency direction, expressed as a percent. DICOM:0018_0094','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PercentPhaseFOV', Description='Ratio of field of view dimension in phase direction to field of view dimension in frequency direction, expressed as a percent. DICOM:0018_0094';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('study:field_value','ValueField','text','The field within a Data Element that contains the Value(s) of that Data Element. DICOM:0000_0060','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ValueField', Description='The field within a Data Element that contains the Value(s) of that Data Element. DICOM:0000_0060';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('largest_pixel_image_value','LargestPixelImageValue','text','The maximum actual pixel value encountered in this image. DICOM:0028_0107','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='LargestPixelImageValue', Description='The maximum actual pixel value encountered in this image. DICOM:0028_0107';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('software_versions','SoftwareVersions','text','Manufacturers designation of software version of the equipment that produced the composite instances. DICOM:0018_1020','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SoftwareVersions', Description='Manufacturers designation of software version of the equipment that produced the composite instances. DICOM:0018_1020';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('spacing_between_slices','SpacingBetweenSlices','text','Spacing between slices, in mm, measured from center-to-center of each slice along the normal to the first image. The sign of the Spacing Between Slices (0018,0088) determines the direction of stacking. The normal is determined by the cross product of the direction cosines of the first row and first column of the first frame, such that a positive spacing indicates slices are stacked behind the first slice and a negative spacing indicates slices are stacked in front of the first slice. DICOM:0018_0088','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SpacingBetweenSlices', Description='Spacing between slices, in mm, measured from center-to-center of each slice along the normal to the first image. The sign of the Spacing Between Slices (0018,0088) determines the direction of stacking. The normal is determined by the cross product of the direction cosines of the first row and first column of the first frame, such that a positive spacing indicates slices are stacked behind the first slice and a negative spacing indicates slices are stacked in front of the first slice. DICOM:0018_0088';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('transmitting_coil','TransmitCoilName','text','Name of transmit coil used. DICOM:0018_1251','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='TransmitCoilName', Description='Name of transmit coil used. DICOM:0018_1251';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('cols','Columns','text','Number of columns in the image. DICOM:0028_0011','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='Columns', Description='Number of columns in the image. DICOM:0028_0011';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('number_of_averages','NumberOfAverages','text','Number of times a given pulse sequence is repeated before any parameter is changed. DICOM:0018_0083','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='NumberOfAverages', Description='Number of times a given pulse sequence is repeated before any parameter is changed. DICOM:0018_0083';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('scanning_sequence','ScanningSequence','text','Description of the type of data taken. DICOM:0018_0020','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ScanningSequence', Description='Description of the type of data taken. DICOM:0018_0020';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('pixel_representation','PixelRepresentation','text','Data representation of the pixel samples. Each sample shall have the same pixel representation. DICOM:0028_0103','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PixelRepresentation', Description='Data representation of the pixel samples. Each sample shall have the same pixel representation. DICOM:0028_0103';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('phase_encoding_direction','InPlanePhaseEncodingDirectionDICOM','text','The axes of the in-plane phase encoding with respect to the frame. DICOM:0018_1312','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='InPlanePhaseEncodingDirectionDICOM', Description='The axes of the in-plane phase encoding with respect to the frame. DICOM:0018_1312';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition:dose_units','DoseUnits','text','Dose axis units. DICOM:3004_0002','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='DoseUnits', Description='Dose axis units. DICOM:3004_0002';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('manufacturer','Manufacturer','text','Manufacturer of the equipment that produced the composite instances. Corresponds to DICOM Tag 0008, 0070 Manufacturer','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='Manufacturer', Description='Manufacturer of the equipment that produced the composite instances. Corresponds to DICOM Tag 0008, 0070 Manufacturer';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('bits_allocated','BitsAllocated','text','Number of bits allocated for each pixel sample. Each sample shall have the same number of bits allocated. DICOM:0028_0100','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='BitsAllocated', Description='Number of bits allocated for each pixel sample. Each sample shall have the same number of bits allocated. DICOM:0028_0100';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('imaged_nucleus','ImagedNucleus','text','Nucleus that is resonant at the imaging frequency. Examples: 31P, 1H. DICOM:0018_0085','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ImagedNucleus', Description='Nucleus that is resonant at the imaging frequency. Examples: 31P, 1H. DICOM:0018_0085';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('image_position_patient','ImagePositionPatient','text','The x, y, and z coordinates of the upper left hand corner (center of the first voxel transmitted) of the image, in mm. DICOM:0020_0032','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ImagePositionPatient', Description='The x, y, and z coordinates of the upper left hand corner (center of the first voxel transmitted) of the image, in mm. DICOM:0020_0032';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('sequence_name','SequenceName','text','Any arbitrary name of a molecular sequence. DICOM:0018_0024','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SequenceName', Description='Any arbitrary name of a molecular sequence. DICOM:0018_0024';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('series_number','SeriesNumber','text','A number that identifies this Series. DICOM:0020_0011','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SeriesNumber', Description='A number that identifies this Series. DICOM:0020_0011';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('slice_location','SliceLocation','text','Relative position of the image plane expressed in mm. DICOM:0020_1041','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SliceLocation', Description='Relative position of the image plane expressed in mm. DICOM:0020_1041';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('window_center','WindowCenter','text','Preferred value for Window Center (0028,1050) in the image instances produced by this reconstruction protocol element. DICOM:0028_1050','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='WindowCenter', Description='Preferred value for Window Center (0028,1050) in the image instances produced by this reconstruction protocol element. DICOM:0028_1050';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('echo_time','EchoTime','text','Time in ms between the middle of the excitation pulse and the peak of the echo produced (kx=0). In the case of segmented k-space, the TE(eff) is the time between the middle of the excitation pulse to the peak of the echo that is used to cover the center of k-space (i.e.,-kx=0, ky=0). DICOM:0018_0081','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='EchoTime', Description='Time in ms between the middle of the excitation pulse and the peak of the echo produced (kx=0). In the case of segmented k-space, the TE(eff) is the time between the middle of the excitation pulse to the peak of the echo that is used to cover the center of k-space (i.e.,-kx=0, ky=0). DICOM:0018_0081';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('manufacturer_model_name','ManufacturersModelName','text',"Manufacturer's model name of the equipment that produced the composite instances. Corresponds to DICOM Tag 0008, 1090 Manufacturers Model Name",'parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ManufacturersModelName', Description="Manufacturer's model name of the equipment that produced the composite instances. Corresponds to DICOM Tag 0008, 1090 Manufacturers Model Name";

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicominfo:image_type','ImageType','text','Image identification characteristics. DICOM:0008_0008','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ImageType', Description='Image identification characteristics. DICOM:0008_0008';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('window_width','WindowWidth','text','Window Width for display. DICOM:0028_1051','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='WindowWidth', Description='Window Width for display. DICOM:0028_1051';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('repetition_time','RepetitionTime','text','The period of time in msec between the beginning of a pulse sequence and the beginning of the succeeding (essentially identical) pulse sequence. Required except when Scanning Sequence (0018,0020) is EP and Sequence Variant (0018,0021) is not SK.','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='RepetitionTime', Description='The period of time in msec between the beginning of a pulse sequence and the beginning of the succeeding (essentially identical) pulse sequence. Required except when Scanning Sequence (0018,0020) is EP and Sequence Variant (0018,0021) is not SK.';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('receiving_coil','ReceiveCoilName','text','Name of receive coil used. DICOM:0018_1250','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ReceiveCoilName', Description='Name of receive coil used. DICOM:0018_1250';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('sar','SAR','text','Calculated whole body Specific Absorption Rate in watts/kilogram. DICOM:0018_1316','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SAR', Description='Calculated whole body Specific Absorption Rate in watts/kilogram. DICOM:0018_1316';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('patient_position','PatientPosition','text',"Description of imaging subject's position relative to the equipment. DICOM:0018_5100",'parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientPosition', Description="Description of imaging subject's position relative to the equipment. DICOM:0018_5100";

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('window_center_width_explanation','WindowCenterWidthExplanation','text','Explanation of the Window Center and Width. DICOM:0028_1055','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='WindowCenterWidthExplanation', Description='Explanation of the Window Center and Width. DICOM:0028_1055';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('high_bit','HighBit','text','Most significant bit for pixel sample data. Each sample shall have the same high bit. DICOM:0028_0102','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='HighBit', Description='Most significant bit for pixel sample data. Each sample shall have the same high bit. DICOM:0028_0102';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('rows','Rows','text','Number of rows in the image. DICOM:0028_0010','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='Rows', Description='Number of rows in the image. DICOM:0028_0010';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition_number','AcquisitionNumber','text','A number identifying the single continuous gathering of data over a period of time that resulted in this image or instance, which may include multiple bed positions. This number is not required to be unique across SOP Instances in a series. DICOM:0020_0012','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='AcquisitionNumber', Description='A number identifying the single continuous gathering of data over a period of time that resulted in this image or instance, which may include multiple bed positions. This number is not required to be unique across SOP Instances in a series. DICOM:0020_0012';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('echo_numbers','EchoNumber','text','The echo number used in generating this image. In the case of segmented k-space, it is the effective Echo Number. DICOM:0018_0086','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='EchoNumber', Description='The echo number used in generating this image. In the case of segmented k-space, it is the effective Echo Number. DICOM:0018_0086';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('percent_sampling','PercentSampling','text','Fraction of acquisition matrix lines acquired, expressed as a percent. DICOM:0018_0093','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PercentSampling', Description='Fraction of acquisition matrix lines acquired, expressed as a percent. DICOM:0018_0093';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('image_orientation_patient','ImageOrientationPatientDICOM','text','The direction cosines of the first row and the first column with respect to the patient. DICOM:0020_0037','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ImageOrientationPatientDICOM', Description='The direction cosines of the first row and the first column with respect to the patient. DICOM:0020_0037';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('instance_number','InstanceNumber','text','A number that identifies this SOP Instance. DICOM:0020_0013','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='InstanceNumber', Description='A number that identifies this SOP Instance. DICOM:0020_0013';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('echo_train_length','EchoTrainLength','text','Number of lines in k-space acquired per excitation of the same volume regardless of the type of echo or the number of frames derived from them. DICOM:0018_0091','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='EchoTrainLength', Description='Number of lines in k-space acquired per excitation of the same volume regardless of the type of echo or the number of frames derived from them. DICOM:0018_0091';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('bits_stored','BitsStored','text','Number of bits stored for each pixel sample. Each sample shall have the same number of bits stored. See PS 3.5 for further explanation. DICOM:0028_0101','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='BitsStored', Description='Number of bits stored for each pixel sample. Each sample shall have the same number of bits stored. See PS 3.5 for further explanation. DICOM:0028_0101';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('protocol_name','ProtocolName','text','Description of the conditions under which the Series was performed. DICOM:0018_1030','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ProtocolName', Description='Description of the conditions under which the Series was performed. DICOM:0018_1030';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('series_description','SeriesDescription','text','User provided description of the Series. DICOM:0008_103E','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SeriesDescription', Description='User provided description of the Series. DICOM:0008_103E';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('magnetic_field_strength','MagneticFieldStrength','text','Nominal field strength of MR magnet in Tesla. DICOM:0018_0087','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='MagneticFieldStrength', Description='Nominal field strength of MR magnet in Tesla. DICOM:0018_0087';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0020:el_0x1002','ImagesInAcquisition','text','Number of images that resulted from this acquisition of data. DICOM:0020_1002','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ImagesInAcquisition', Description='Number of images that resulted from this acquisition of data. DICOM:0020_1002';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0018:el_0x0025','AngioFlag','text','Angio Image Indicator. Primary image for Angio processing. Enumerated Values: Y Image is Angio N Image is not Angio. DICOM:0018_0025','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='AngioFlag', Description='Angio Image Indicator. Primary image for Angio processing. Enumerated Values: Y Image is Angio N Image is not Angio. DICOM:0018_0025';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0018:el_0x9075','DiffusionDirectionality','text','Specifies whether diffusion conditions for the frame are directional, or isotropic with respect to direction. DICOM:0018_9075','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='DiffusionDirectionality', Description='Specifies whether diffusion conditions for the frame are directional, or isotropic with respect to direction. DICOM:0018_9075';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('study_instance_uid','StudyInstanceUID','text','Unique identifier for the Study. DICOM:0020_000D','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='StudyInstanceUID', Description='Unique identifier for the Study. DICOM:0020_000D';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('pixel_spacing','PixelSpacing','text','Physical distance in the patient between the center of each pixel, specified by a numeric pair - adjacent row spacing (delimiter) adjacent column spacing in mm. DICOM:0028_0030','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PixelSpacing', Description='Physical distance in the patient between the center of each pixel, specified by a numeric pair - adjacent row spacing (delimiter) adjacent column spacing in mm. DICOM:0028_0030';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('patient:weight','PatientWeight','text','Weight of the patient in kilograms. DICOM:0010_1030','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientWeight', Description='Weight of the patient in kilograms. DICOM:0010_1030';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('variable_flip_angle_flag','VariableFlipAngle','text','Flip angle variation applied during image acquisition. DICOM:0018_1315','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='VariableFlipAngle', Description='Flip angle variation applied during image acquisition. DICOM:0018_1315';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0010:el_0x1030','PatientWeight','text','Weight of the patient in kilograms. DICOM:0010_1030','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientWeight', Description='Weight of the patient in kilograms. DICOM:0010_1030';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('imaging_frequency','ImagingFrequency','text','Precession frequency in MHz of the nucleus being imaged. DICOM:0018_0084','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ImagingFrequency', Description='Precession frequency in MHz of the nucleus being imaged. DICOM:0018_0084';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition:flip_angle','FlipAngle','text','Steady state angle in degrees to which the magnetic vector is flipped from the magnetic vector of the primary field. DICOM:0018_1314','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='FlipAngle', Description='Steady state angle in degrees to which the magnetic vector is flipped from the magnetic vector of the primary field. DICOM:0018_1314';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('series_instance_uid','SeriesInstanceUID','text','Unique identifier for the Series that is part of the Study identified in Study Instance UID (0020,000D), if present, and contains the referenced object instance(s). DICOM:0020_000E','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SeriesInstanceUID', Description='Unique identifier for the Series that is part of the Study identified in Study Instance UID (0020,000D), if present, and contains the referenced object instance(s). DICOM:0020_000E';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('smallest_pixel_image_value','SmallestPixelImageValue','text','The minimum actual pixel value encountered in this image. DICOM:0028_0106','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SmallestPixelImageValue', Description='The minimum actual pixel value encountered in this image. DICOM:0028_0106';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('inversion_time','InversionTime','text','Time in msec after the middle of inverting RF pulse to middle of excitation pulse to detect the amount of longitudinal magnetization. Required if Scanning Sequence (0018,0020) has values of IR. DICOM:0018_0082','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='InversionTime', Description='Time in msec after the middle of inverting RF pulse to middle of excitation pulse to detect the amount of longitudinal magnetization. Required if Scanning Sequence (0018,0020) has values of IR. DICOM:0018_0082';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0018:el_0x0022','ScanOptions','text','Parameters of scanning sequence. DICOM:0018_0022','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ScanOptions', Description='Parameters of scanning sequence. DICOM:0018_0022';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0020:el_0x0100','TemporalPositionIdentifier','text','Temporal order of a dynamic or functional set of Images. DICOM:0020_0100','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='TemporalPositionIdentifier', Description='Temporal order of a dynamic or functional set of Images. DICOM:0020_0100';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0008:el_0x9209','AcquisitionContrast','text','Indication of acquisition contrast used with frames in the SOP Instance. DICOM:0008_9209','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='AcquisitionContrast', Description='Indication of acquisition contrast used with frames in the SOP Instance. DICOM:0008_9209';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition_time','AcquisitionTime','text','The time the acquisition of data that resulted in this image started. DICOM:0008_0032','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='AcquisitionTime', Description='The time the acquisition of data that resulted in this image started. DICOM:0008_0032';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0018:el_0x1090','CardiacNumberOfImages','text','Number of images per cardiac cycle. DICOM:0018_1090','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='CardiacNumberOfImages', Description='Number of images per cardiac cycle. DICOM:0018_1090';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0028:el_0x0006','PlanarConfiguration','text','Indicates whether the pixel data are encoded color-by-plane or color-by-pixel. DICOM:0028_0006','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PlanarConfiguration', Description='Indicates whether the pixel data are encoded color-by-plane or color-by-pixel. DICOM:0028_0006';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0008:el_0x0064','ConversionType','text','Describes the kind of image conversion. DICOM:0008_0064','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ConversionType', Description='Describes the kind of image conversion. DICOM:0008_0064';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0020:el_0x0020','PatientOrientation','text','Patient direction of the rows and columns of the image. DICOM:0020_0020','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientOrientation', Description='Patient direction of the rows and columns of the image. DICOM:0020_0020';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0008:el_0x1032','ProcedureCodeSequence','text','A Sequence that conveys the type of procedure performed. DICOM:0008_1032','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ProcedureCodeSequence', Description='A Sequence that conveys the type of procedure performed. DICOM:0008_1032';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0010:el_0x1020','PatientHeight','text',"Patient's height or length in meters. DICOM:0010_1020",'parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientHeight', Description="Patient's height or length in meters. DICOM:0010_1020";

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0032:el_0x1064','StudyInstance','text','A sequence that conveys the requested procedure. One or more Items may be included in this Sequence. DICOM:0032_1064','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='StudyInstance', Description='A sequence that conveys the requested procedure. One or more Items may be included in this Sequence. DICOM:0032_1064';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('image_date','ContentDate','text','The date the data creation was started. For instance, this is the date the pixel data is created, not the date the data is acquired. DICOM:0008_0023','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ContentDate', Description='The date the data creation was started. For instance, this is the date the pixel data is created, not the date the data is acquired. DICOM:0008_0023';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition_date','AcquisitionDate','text','The date the acquisition of data that resulted in this image started. DICOM:0008_0022','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='AcquisitionDate', Description='The date the acquisition of data that resulted in this image started. DICOM:0008_0022';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('series_date','SeriesDate','text','Date the Series started. DICOM:0008_0021','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SeriesDate', Description='Date the Series started. DICOM:0008_0021';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('image_time','ContentTime','text','The time the data creation was started. For instance, this is the time the pixel data is created, not the time the data is acquired. DICOM:0008_0033','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ContentTime', Description='The time the data creation was started. For instance, this is the time the pixel data is created, not the time the data is acquired. DICOM:0008_0033';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('series_time','SeriesTime','text','Time the Series started. DICOM:0008_0031','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SeriesTime', Description='Time the Series started. DICOM:0008_0031';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('study_date','StudyDate','text','Date the Study started. DICOM:0008_0020','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='StudyDate', Description='Date the Study started. DICOM:0008_0020';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('study_time','StudyTime','text','Time the Study started. DICOM:0008_0030','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='StudyTime', Description='Time the Study started. DICOM:0008_0030';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('device_serial_number','DeviceSerialNumber','text',"Manufacturer's serial number of the device. DICOM:0018_1000",'parameter_file')
    ON DUPLICATE KEY UPDATE Alias='DeviceSerialNumber', Description="Manufacturer's serial number of the device. DICOM:0018_1000";

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('frame_of_reference_uid','FrameOfReferenceUID','text','Uniquely identifies the frame of reference for a Series. shall be used to uniquely identify a frame of reference for a series. Each series shall have a single Frame of Reference UID. However, multiple Series within a Study may share a Frame of Reference. DICOM:0020_0052','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='FrameOfReferenceUID', Description='Uniquely identifies the frame of reference for a Series. shall be used to uniquely identify a frame of reference for a series. Each series shall have a single Frame of Reference UID. However, multiple Series within a Study may share a Frame of Reference. DICOM:0020_0052';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('image_comments','ImageComments','text','User-defined comments about the image. DICOM:0020_4000','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ImageComments', Description='User-defined comments about the image. DICOM:0020_4000';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0028:el_0x1053','RescaleSlope','text','m in the equation specified by Rescale Intercept (0028,1052). DICOM:0028_1053','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='RescaleSlope', Description='m in the equation specified by Rescale Intercept (0028,1052). DICOM:0028_1053';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0028:el_0x1054','RescaleType','text','Specifies the output units of Rescale Slope (0028,1053) and Rescale Intercept (0028,1052). DICOM:0028_1054','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='RescaleType', Description='Specifies the output units of Rescale Slope (0028,1053) and Rescale Intercept (0028,1052). DICOM:0028_1054';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0028:el_0x1052','RescaleIntercept','text','The value b in relationship between stored values (SV) and pixel value units (U) defined in Units (0054,1001): U = m*SV+b. DICOM:0028_1052','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='RescaleIntercept', Description='The value b in relationship between stored values (SV) and pixel value units (U) defined in Units (0054,1001): U = m*SV+b. DICOM:0028_1052';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('institution_name','InstitutionName','text','Institution or organization to which the identified individual is responsible or accountable May also refer to the institution or organization at which the relevant equipment is located. DICOM:0008_0080','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='InstitutionName', Description='Institution or organization to which the identified individual is responsible or accountable May also refer to the institution or organization at which the relevant equipment is located. DICOM:0008_0080';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('study_description','StudyDescription','text','Institution-generated description or classification of the Study (component) performed. DICOM:0008_1030','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='StudyDescription', Description='';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('operator_name','OperatorName','text','Name(s) of the operator(s) who supporting this Series. DICOM:0008_1070','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='OperatorName', Description='Name(s) of the operator(s) who supporting this Series. DICOM:0008_1070';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('patient_id','PatientID','text','A primary identifier for the patient. In the case of imaging a group of small animals simultaneously, the single value of this identifier corresponds to the identification of the entire group. DICOM:0010_0020','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientID', Description='A primary identifier for the patient. In the case of imaging a group of small animals simultaneously, the single value of this identifier corresponds to the identification of the entire group. DICOM:0010_0020';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('patient_dob','PatientsBirthDate','text','Birth date of the patient. DICOM:0010_0030','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientsBirthDate', Description='Birth date of the patient. DICOM:0010_0030';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('effective_series_duration','EffectiveDuration','text','Total time in seconds that data was actually taken for the entire Multi-frame image. DICOM:0018_0072','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='EffectiveDuration', Description='Total time in seconds that data was actually taken for the entire Multi-frame image. DICOM:0018_0072';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('spatial_resolution','SpatialResolution','text','The inherent limiting resolution in mm of the acquisition equipment for high contrast objects for the data gathering and reconstruction technique chosen. If variable across the images of the series, the value at the image center. DICOM:0018_1050','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SpatialResolution', Description='The inherent limiting resolution in mm of the acquisition equipment for high contrast objects for the data gathering and reconstruction technique chosen. If variable across the images of the series, the value at the image center. DICOM:0018_1050';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('fov_dimensions','FieldOfViewDimensions','text','Dimensions of the field of view, in mm. If Field of View Shape (0018,1147) is: RECTANGLE: row dimension followed by column. ROUND: diameter. HEXAGONAL: diameter of a circumscribed circle. DICOM:0018_1149','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='FieldOfViewDimensions', Description='Dimensions of the field of view, in mm. If Field of View Shape (0018,1147) is: RECTANGLE: row dimension followed by column. ROUND: diameter. HEXAGONAL: diameter of a circumscribed circle. DICOM:0018_1149';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('laterality','Laterality','text','Laterality of (paired) body part examined. Required if the body part examined is a paired structure and Image Laterality (0020,0062) or Frame Laterality (0020,9072) are not sent. DICOM:0020_0060','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='Laterality', Description='Laterality of (paired) body part examined. Required if the body part examined is a paired structure and Image Laterality (0020,0062) or Frame Laterality (0020,9072) are not sent. DICOM:0020_0060';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('position_reference_indicator','PositionReferenceIndicator','text','Part of the imaging target used as a reference. DICOM:0020_1040','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PositionReferenceIndicator', Description='Part of the imaging target used as a reference. DICOM:0020_1040';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('pixel_padding_value','PixelPaddingValue','text','Value of pixels added to non-rectangular image to pad to rectangular format. DICOM:0028_0120','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PixelPaddingValue', Description='Value of pixels added to non-rectangular image to pad to rectangular format. DICOM:0028_0120';

SELECT 'Running: SQL/Archive/24.0/2021-07-19-log_level.sql';

ALTER TABLE `ConfigSettings` MODIFY COLUMN `DataType` ENUM('text','boolean','email','instrument','textarea','scan_type','date_format','lookup_center','path','web_path', 'log_level');

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('logs', 'Settings related to logging', 1, 0, 'Log Settings', 12);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'database_log_level', 'Verbosity of database logging', 1, 0, 'log_level', ID, 'Database Log Level', 3 FROM ConfigSettings WHERE Name='logs';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'request_log_level', 'Verbosity of HTTP request logs', 1, 0, 'log_level', ID, 'HTTP Request Log Level', 3 FROM ConfigSettings WHERE Name='logs';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'exception_log_level', 'Verbosity of PHP exception logging', 1, 0, 'log_level', ID, 'Exception Log Level', 3 FROM ConfigSettings WHERE Name='logs';


SELECT 'Running: SQL/Archive/24.0/2021-07-28_add_EchoTime_field_to_violation_tables.sql';

ALTER TABLE MRICandidateErrors ADD `EchoTime` double DEFAULT NULL AFTER `Reason`;
ALTER TABLE mri_violations_log ADD `EchoTime` double DEFAULT NULL AFTER `ValidRegex`;

SELECT 'Running: SQL/Archive/24.0/2021-07-29_modify_center_name_in_mri_protocol.sql';

-- Add a new CenterID column
ALTER TABLE mri_protocol
ADD COLUMN `CenterID` integer unsigned DEFAULT NULL
AFTER `Center_name`;

ALTER TABLE mri_protocol ADD FOREIGN KEY (`CenterID`) REFERENCES psc(`CenterID`);

-- Populate the CenterID column using Center_name (equivalent to MRI_alias in the psc table)
UPDATE mri_protocol
INNER JOIN psc ON (Center_name = MRI_alias)
SET mri_protocol.CenterID = psc.CenterID;

SELECT 'Running: SQL/Archive/24.0/2021-07-29-physiological_task_event_columns_types.sql';

ALTER TABLE `physiological_task_event`
MODIFY COLUMN EventValue varchar(255),
MODIFY COLUMN EventSample decimal(11,6);

SELECT 'Running: SQL/Archive/24.0/2021-07-30-physiological_parameter_file_columns_types.sql';

ALTER TABLE `physiological_parameter_file`
MODIFY COLUMN Value TEXT;

SELECT 'Running: SQL/Archive/24.0/2021-08-21_issue_tracker_description_change.sql';

UPDATE ConfigSettings SET Description='URL of the preferred issue tracker for this study' WHERE Name='issue_tracker_url' AND Description='The *new* bug/issue tracker url';

SELECT 'Running: SQL/Archive/24.0/2021-08-25-physiological_annotation_schema_changes.sql';

ALTER TABLE `physiological_annotation_label`
MODIFY COLUMN LabelDescription TEXT;

ALTER TABLE `physiological_annotation_label`
ADD COLUMN AnnotationFileID INT(10) UNSIGNED DEFAULT NULL AFTER AnnotationLabelID;

DROP INDEX LabelName ON `physiological_annotation_label`;

ALTER TABLE `physiological_annotation_parameter`
MODIFY COLUMN Author VARCHAR(255);

CREATE TABLE `physiological_annotation_rel` (
    `AnnotationTSV`  INT(10)    UNSIGNED NOT NULL,
    `AnnotationJSON` INT(10)    UNSIGNED NOT NULL,
    PRIMARY KEY (`AnnotationTSV`, `AnnotationJSON`),
    CONSTRAINT `FK_AnnotationTSV`
        FOREIGN KEY (`AnnotationTSV`)
        REFERENCES `physiological_annotation_file` (`AnnotationFileID`),
    CONSTRAINT `FK_AnnotationJSON`
        FOREIGN KEY (`AnnotationJSON`)
        REFERENCES `physiological_annotation_file` (`AnnotationFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


SELECT 'Running: SQL/Archive/24.0/2021-08-27_conflict_resolved_unique_key.sql';

-- Add UNIQUE key to ConflictID so we can use REPLACE INTO ...
ALTER TABLE conflicts_resolved ADD UNIQUE KEY (ConflictID);


SELECT 'Running: SQL/Archive/24.0/2021-09-07_dqt_drop_old_dataquery.sql';

-- Store the modules.ID of the dqt module into @dqt
SELECT `ID` FROM `modules` where modules.Name = 'dqt' INTO @dqt;
-- Update moduleID of dataquery_view to be @dqt
UPDATE permissions SET moduleID = @dqt WHERE permissions.code = 'dataquery_view';
-- Delete the old dataquery from modules
DELETE FROM `modules` where modules.Name = 'dataquery';

SELECT 'Running: SQL/Archive/24.0/2021-09-28-Unique_examiners.sql';

-- Note: For projects with duplicate examiners, patch must be run AFTER running
-- tools/single_use/Remove_duplicate_examiners.php

-- Remove constraint on full name
-- Change userID to be unique
-- Make full name / userID combined unique
ALTER TABLE examiners
	DROP INDEX `full_name`,
	DROP INDEX `FK_examiners_2`,
	ADD UNIQUE KEY `unique_examiner` (`full_name`,`userID`),
	ADD UNIQUE KEY `FK_examiners_2` (`userID`);
SELECT 'Running: SQL/Archive/24.0/2021-10-01-visits_in_database.sql';

ALTER TABLE visit ADD COLUMN `VisitLabel` VARCHAR(200) UNIQUE;
UPDATE visit SET VisitLabel=VisitName WHERE VisitLabel IS NULL;
ALTER TABLE visit CHANGE `VisitLabel` `VisitLabel` VARCHAR(200) UNIQUE NOT NULL;

SELECT 'Running: SQL/Archive/24.0/2021-11-23-Electrophysiology_electrodes_nullable_xyz.sql';

ALTER TABLE physiological_electrode MODIFY COLUMN `X` decimal(12,6) DEFAULT NULL;
ALTER TABLE physiological_electrode MODIFY COLUMN `Y` decimal(12,6) DEFAULT NULL;
ALTER TABLE physiological_electrode MODIFY COLUMN `Z` decimal(12,6) DEFAULT NULL;

SELECT 'Running: SQL/Archive/24.0/2022-01-04-add_config_for_python_config_file.sql';


UPDATE ConfigSettings SET Description='Name of the Perl MRI config file (stored in dicom-archive/.loris_mri/)', Label='Name of the Perl MRI config file' WHERE Name="MriConfigFile";
UPDATE ConfigSettings SET Label='DICOM converter tool to use (dcm2mnc or dcm2niix)' WHERE Name="converter";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'MriPythonConfigFile', 'Name of the Python MRI config file (stored in dicom-archive/.loris_mri/)', 1, 0, 'text', ID, 'Name of the Python MRI config file', 25 FROM ConfigSettings WHERE Name="imaging_pipeline";

INSERT INTO Config (ConfigID, Value) SELECT ID, 'database_config.py' FROM ConfigSettings cs WHERE cs.Name="mriPythonConfigFile";

SELECT 'Running: SQL/Archive/24.0/2022-01-26-S3Support.sql';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('aws', 'Settings related to AWS services', 1, 0, 'AWS Settings', 13);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'AWS_S3_Endpoint', 'Endpoint to use for accessing files stored in S3. Endpoint or region are required for S3 support.', 1, 0, 'text', ID, 'AWS S3 Endpoint', 3 FROM ConfigSettings WHERE Name='aws';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'AWS_S3_Region', 'AWS Region to use for accessing files stored in S3. Endpoint or region are required for S3 support.', 1, 0, 'text', ID, 'AWS S3 Region', 3 FROM ConfigSettings WHERE Name='aws';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'AWS_S3_Default_Bucket', 'Default bucket for LORIS to use for accessing files in S3.', 1, 0, 'text', ID, 'AWS S3 Default Bucket', 3 FROM ConfigSettings WHERE Name='aws';


