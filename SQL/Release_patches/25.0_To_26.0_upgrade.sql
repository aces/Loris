
SELECT 'Running: SQL/Archive/26.0/2020-03-03-schedule_module.sql';

INSERT INTO modules (Name, Active) VALUES ('schedule_module', 'Y');
INSERT INTO permissions (code, description, categoryID) VALUES ('schedule_module', 'Schedule Module: edit and delete the appointment', 2);
INSERT INTO user_perm_rel(UserID,PermID) VALUES (
    (SELECT ID FROM users WHERE UserID='admin'),
    (SELECT permID FROM permissions WHERE code='schedule_module')
);
-- Create appointment_type table
CREATE TABLE `appointment_type` (
  `AppointmentTypeID` int(10) UNSIGNED NOT NULL,
  `Name` varchar(32) NOT NULL,
  PRIMARY KEY (`AppointmentTypeID`),
  UNIQUE KEY (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Insert initial data
INSERT INTO `appointment_type` (`AppointmentTypeID`, `Name`) VALUES
(3, 'Behavioral'),
(2, 'Blood Collection'),
(1, 'MRI'); 

-- Create appointment table
CREATE TABLE `appointment` (
  `AppointmentID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `SessionID` int(10) UNSIGNED NOT NULL,
  `AppointmentTypeID` int(10) UNSIGNED NOT NULL,
  `StartsAt` datetime NOT NULL,
  PRIMARY KEY (`AppointmentID`),
  KEY `AppointmentTypeID` (`AppointmentTypeID`),
  KEY `SessionID` (`SessionID`),
  CONSTRAINT `appointment_belongsToSession` FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`),
  CONSTRAINT `appointment_hasAppointmentType` FOREIGN KEY (`AppointmentTypeID`) REFERENCES `appointment_type` (`AppointmentTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SELECT 'Running: SQL/Archive/26.0/2021-07-28_diagnosis_evolution.sql';

CREATE TABLE `diagnosis_evolution` (
  `DxEvolutionID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `ProjectID` int(10) unsigned NOT NULL,
  `visitLabel` varchar(255) DEFAULT NULL,
  `instrumentName` varchar(255) DEFAULT NULL,
  `sourceField` varchar(255) DEFAULT NULL,
  `orderNumber` int(10) unsigned DEFAULT NULL,
  CONSTRAINT `PK_diagnosis_evolution` PRIMARY KEY (`DxEvolutionID`),
  CONSTRAINT `UK_diagnosis_evolution_Name` UNIQUE KEY `Name` (`Name`),
  CONSTRAINT `FK_diagnosis_evolution_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_diagnosis_evolution_instrumentName` FOREIGN KEY (`instrumentName`) REFERENCES `test_names` (`Test_name`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `candidate_diagnosis_evolution_rel` (
  `CandID` int(6) NOT NULL,
  `DxEvolutionID` int(10) unsigned NOT NULL,
  `Diagnosis` text DEFAULT NULL,
  `Confirmed` enum('Y', 'N') DEFAULT NULL,
  `LastUpdate` datetime NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  CONSTRAINT `PK_candidate_diagnosis_evolution_rel` PRIMARY KEY (`CandID`, `DxEvolutionID`),
  CONSTRAINT `FK_candidate_diagnosis_evolution_rel_CandID` FOREIGN KEY (`CandID`) REFERENCES `candidate` (`CandID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_candidate_diagnosis_evolution_rel_DxEvolutionID` FOREIGN KEY (`DxEvolutionID`) REFERENCES `diagnosis_evolution` (`DxEvolutionID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SELECT 'Running: SQL/Archive/26.0/2022-09-29-NewestDQT.sql';

CREATE TABLE dataquery_queries (
    QueryID int(10) unsigned NOT NULL AUTO_INCREMENT,
    Query JSON NOT NULL,
    PRIMARY KEY (QueryID)
    -- FOREIGN KEY (Owner) REFERENCES users(ID)
);

CREATE TABLE dataquery_query_names (
    QueryID int(10) unsigned NOT NULL,
    UserID int(10) unsigned NOT NULL,
    Name varchar(255) NOT NULL,
    PRIMARY KEY (QueryID, UserID),
    FOREIGN KEY (QueryID) REFERENCES dataquery_queries(QueryID),
    FOREIGN KEY (UserID) REFERENCES users(ID)
);

CREATE TABLE dataquery_run_queries (
    RunID int(10) unsigned NOT NULL AUTO_INCREMENT,
    QueryID int(10) unsigned,
    UserID int(10) unsigned,
    RunTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (RunID),
    FOREIGN KEY (QueryID) REFERENCES dataquery_queries(QueryID),
    FOREIGN KEY (UserID) REFERENCES users(ID)
);
CREATE TABLE dataquery_shared_queries_rel (
    QueryID int(10) unsigned,
    SharedBy int(10) unsigned,
    FOREIGN KEY (QueryID) REFERENCES dataquery_queries(QueryID),
    FOREIGN KEY (SharedBy) REFERENCES users(ID),
    CONSTRAINT unique_share UNIQUE (QueryID, SharedBy)
);

CREATE TABLE dataquery_starred_queries_rel (
    QueryID int(10) unsigned,
    StarredBy int(10) unsigned,
    FOREIGN KEY (QueryID) REFERENCES dataquery_queries(QueryID),
    FOREIGN KEY (StarredBy) REFERENCES users(ID),
    CONSTRAINT unique_pin UNIQUE (QueryID, StarredBy)
);

CREATE TABLE dataquery_run_results (
    RunID int(10) unsigned NOT NULL AUTO_INCREMENT,
    CandID int(6) NOT NULL,
    -- JSON or same format that's streamed in?
    RowData LONGTEXT DEFAULT NULL,

    PRIMARY KEY (RunID, CandID),
    FOREIGN KEY (CandID) REFERENCES candidate(CandID),
    FOREIGN KEY (RunID) REFERENCES dataquery_run_queries(RunID)
);

CREATE TABLE dataquery_study_queries_rel (
    QueryID int(10) unsigned,
    PinnedBy int(10) unsigned,
    -- A top query shows on the top of the dataquery tool similarly
    -- to a saved query but is chosen by admins, a dashboard query
    -- shows the number of matching results on the LORIS dashboard.
    Name varchar(255) NOT NULL,
    PinType enum('topquery', 'dashboard'),
    FOREIGN KEY (QueryID) REFERENCES dataquery_queries(QueryID),
    FOREIGN KEY (PinnedBy) REFERENCES users(ID),
    CONSTRAINT unique_pin UNIQUE (QueryID, PinType)
);

INSERT INTO modules (Name, Active) VALUES ('dataquery', 'Y');

SELECT 'Running: SQL/Archive/26.0/2022-12-05-openidconnect.sql';

CREATE TABLE `openid_connect_providers` (
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

SELECT 'Running: SQL/Archive/26.0/2023-04-25-FixIssueWrongModuleID.sql';

-- NOTE: This SQL patch follows up the running of single use tool `tools/single_use/Convert_LorisMenuID_to_ModuleID.php`
-- that was necessary to upgrade the `issues` table from LORIS version 22 to version 23. The tool forgot
-- to include an upgrade of the `issues_history` table, which is now tackled by this SQL patch.

-- delete from issues_history any orphaned module IDs
DELETE FROM issues_history WHERE fieldChanged='module' AND issueID IN (SELECT issueID FROM issues WHERE module IS NULL);
-- set issues history module ID to correct moduleID, replacing old LorisMenu ID
UPDATE issues_history ih SET newValue=(SELECT i.module FROM issues i WHERE i.issueID=ih.issueID) WHERE fieldChanged='module';

SELECT 'Running: SQL/Archive/26.0/2023-05-01-imaging-eeg-configs.sql';

-- Add the EEG Pipeline Config group
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber)
VALUES ('eeg_pipeline', 'EEG Pipeline settings', 1, 0, 'EEG Pipeline', 15);

-- Add the EEGS3DataPath Config
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber, Parent)
SELECT 'EEGS3DataPath', 'EEG S3 data path for assembly data', 1, 0, 'EEG S3 data path', 15, ID
    FROM ConfigSettings
    WHERE Name = 'eeg_pipeline';

UPDATE
  ConfigSettings cs1,
  (
    SELECT *
    FROM ConfigSettings
    WHERE Name = 'eeg_pipeline'
  ) AS cs2
SET cs1.Parent = cs2.ID
WHERE cs1.Name = 'EEGUploadIncomingPath';

-- Add the Imaging Pipeline Config group
UPDATE ConfigSettings SET OrderNumber = 14 WHERE Name = 'imaging_pipeline';

UPDATE
  ConfigSettings cs1,
  (
    SELECT *
    FROM ConfigSettings
    WHERE Name = 'imaging_pipeline'
  ) AS cs2
SET cs1.Parent = cs2.ID
WHERE cs1.Name = 'MRICodePath';

UPDATE
  ConfigSettings cs1,
  (
    SELECT *
    FROM ConfigSettings
    WHERE Name = 'imaging_pipeline'
  ) AS cs2
SET cs1.Parent = cs2.ID
WHERE cs1.Name = 'MRIUploadIncomingPath';

UPDATE
  ConfigSettings cs1,
  (
    SELECT *
    FROM ConfigSettings
    WHERE Name = 'imaging_pipeline'
  ) AS cs2
SET cs1.Parent = cs2.ID
WHERE cs1.Name = 'MINCToolsPath';

-- Add default value to electrophysiology_uploader UploadDate
ALTER TABLE `electrophysiology_uploader` MODIFY COLUMN `UploadDate` DateTime NOT NULL DEFAULT CURRENT_TIMESTAMP;
SELECT 'Running: SQL/Archive/26.0/2023-06-06-add_NA_to_consent_status.sql';

ALTER TABLE candidate_consent_rel MODIFY COLUMN `Status` enum('yes', 'no', 'not_applicable') DEFAULT NULL;
ALTER TABLE candidate_consent_history MODIFY COLUMN `Status` enum('yes', 'no', 'not_applicable') DEFAULT NULL;
SELECT 'Running: SQL/Archive/26.0/2023-11-07-No-Null-Subgroup.sql';

ALTER TABLE test_names CHANGE Sub_group Sub_group int(11) unsigned not null;

SELECT 'Running: SQL/Archive/26.0/2023-12-02-DQT-AdminPermission.sql';

INSERT INTO permissions (code, description, moduleID)
    VALUES (
      'dataquery_admin',
      'Dataquery Admin',
      (SELECT ID FROM modules WHERE Name='dataquery')
    );

SELECT 'Running: SQL/Archive/26.0/2024-01-29-create-sex-table.sql';

CREATE TABLE `sex` (
  `Name` varchar(255) NOT NULL,
  PRIMARY KEY `Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Stores sex options available for candidates in LORIS';

INSERT INTO sex (Name) VALUES ('Male'), ('Female'), ('Other');

ALTER TABLE candidate
  MODIFY COLUMN sex varchar(255) DEFAULT NULL,
  MODIFY COLUMN ProbandSex varchar(255) DEFAULT NULL,
  ADD KEY `FK_candidate_sex_1` (`Sex`),
  ADD KEY `FK_candidate_sex_2` (`ProbandSex`),
  ADD CONSTRAINT `FK_candidate_sex_1` FOREIGN KEY (`Sex`) REFERENCES `sex` (`Name`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_candidate_sex_2` FOREIGN KEY (`ProbandSex`) REFERENCES `sex` (`Name`) ON DELETE RESTRICT ON UPDATE CASCADE;

SELECT 'Running: SQL/Archive/26.0/2024-01-29-Physiological-Events-Replace-Annotations.sql';

-- Dropping all tables regarding annotations
DROP TABLE physiological_annotation_archive;
DROP TABLE physiological_annotation_rel;
DROP TABLE physiological_annotation_instance;
DROP TABLE physiological_annotation_parameter;
DROP TABLE physiological_annotation_label;
DROP TABLE physiological_annotation_file;
DROP TABLE physiological_annotation_file_type;

-- Event files are always associated to Projects, sometimes exclusively (dataset-scope events.json files)
-- Add ProjectID and make PhysiologicalFileID DEFAULT NULL (ProjectID should ideally not be NULLable)
ALTER TABLE `physiological_event_file`
  CHANGE `PhysiologicalFileID` `PhysiologicalFileID` int(10) unsigned DEFAULT NULL,
  ADD COLUMN `ProjectID` int(10) unsigned DEFAULT NULL AFTER `PhysiologicalFileID`,
  ADD KEY `FK_physiological_event_file_project_id` (`ProjectID`),
  ADD CONSTRAINT `FK_physiological_event_file_project_id`
    FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`);

SELECT 'Running: SQL/Archive/26.0/2024-01-30-HED-Tag-Support.sql';

-- Remove unused column
ALTER TABLE `physiological_task_event` DROP COLUMN `AssembledHED`;

-- Add indices for performance improvement
ALTER TABLE `physiological_task_event` ADD INDEX idx_pte_EventValue (`EventValue`);
ALTER TABLE `physiological_task_event` ADD INDEX idx_pte_TrialType (`TrialType`);

-- Add ProjectID and make PhysiologicalFileID DEFAULT NULL
ALTER TABLE `physiological_parameter_file`
  CHANGE `PhysiologicalFileID` `PhysiologicalFileID` int(10) unsigned DEFAULT NULL,
  ADD COLUMN `ProjectID` int(10) unsigned DEFAULT NULL AFTER `PhysiologicalFileID`,
  ADD KEY `FK_physiological_parameter_file_project_id` (`ProjectID`),
  ADD CONSTRAINT `FK_physiological_parameter_file_project_id`
    FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`);

-- Create `hed_schema` table
CREATE TABLE `hed_schema` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Version` varchar(255) NOT NULL,
  `Description` text NULL,
  `URL` varchar(255) NOT NULL UNIQUE,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create `hed_schema_nodes` table
CREATE TABLE `hed_schema_nodes` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ParentID` int(10) unsigned NULL,
  `SchemaID` int(10) unsigned NOT NULL,
  `Name` varchar(255) NOT NULL,
  `LongName` varchar(255) NOT NULL,
  `Description` text NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_hed_parent_node`
    FOREIGN KEY (`ParentID`)
      REFERENCES `hed_schema_nodes` (`ID`),
  CONSTRAINT `FK_hed_schema` FOREIGN KEY (`SchemaID`) REFERENCES `hed_schema` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create `physiological_task_event_hed_rel` table
CREATE TABLE `physiological_task_event_hed_rel` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PhysiologicalTaskEventID` int(10) unsigned NOT NULL,
  `HEDTagID` int(10) unsigned NULL,     -- Reference to hed_schema_nodes.ID. Can be null to only add parentheses
  `TagValue` text NULL,                 -- For value tags
  `HasPairing` boolean DEFAULT FALSE,   -- Is grouped with #AdditionalMembers# members
  `PairRelID` int(10) unsigned NULL,    -- The `ID` of right side of the pair
  `AdditionalMembers` int(10) unsigned DEFAULT 0, -- Number of additional members to encapsulate
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_physiological_task_event_hed_rel_pair` FOREIGN KEY (`PairRelID`)
    REFERENCES `physiological_task_event_hed_rel` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `FK_physiological_task_event_hed_rel_2` (`HEDTagID`),
  CONSTRAINT `FK_physiological_task_event_hed_rel_2` FOREIGN KEY (`HEDTagID`)
    REFERENCES `hed_schema_nodes` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_physiological_task_event_hed_rel_1` FOREIGN KEY (`PhysiologicalTaskEventID`)
    REFERENCES `physiological_task_event` (`PhysiologicalTaskEventID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create `bids_event_dataset_mapping` table
CREATE TABLE `bids_event_dataset_mapping` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ProjectID` int(10) unsigned NOT NULL,
  `PropertyName` varchar(50) NOT NULL,
  `PropertyValue` varchar(255) NOT NULL,
  `HEDTagID` int(10) unsigned NULL,     -- Reference to hed_schema_nodes.ID. Can be null to only add parentheses
  `TagValue` text NULL,                 -- For value tags
  `Description` TEXT NULL,              -- Level Description
  `HasPairing` BOOLEAN DEFAULT FALSE,   -- Is grouped with #AdditionalMembers# members
  `PairRelID` int(10) unsigned NULL,    -- The `ID` of right side of the pair
  `AdditionalMembers` int(10) unsigned DEFAULT 0, -- Number of additional members to encapsulate
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_bids_event_dataset_mapping_pair` FOREIGN KEY (`PairRelID`)
      REFERENCES `bids_event_dataset_mapping` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_event_dataset_PropertyName_PropertyValue (`PropertyName`, `PropertyValue`),
  CONSTRAINT `FK_project_id` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_dataset_hed_tag_id` FOREIGN KEY (`HEDTagID`) REFERENCES `hed_schema_nodes` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Create `bids_event_file_mapping` table
CREATE TABLE `bids_event_file_mapping` (
   `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
   `EventFileID` int(10) unsigned NOT NULL,
   `PropertyName` varchar(50) NOT NULL,
   `PropertyValue` varchar(255) NOT NULL,
   `HEDTagID` int(10) unsigned NULL,     -- Reference to hed_schema_nodes.ID. Can be null to only add parentheses
   `TagValue` text NULL,                 -- For value tags
   `Description` TEXT NULL,              -- Level Description
   `HasPairing` BOOLEAN DEFAULT FALSE,   -- Is grouped with #AdditionalMembers# members
   `PairRelID` int(10) unsigned NULL,    -- The `ID` of right side of the pair
   `AdditionalMembers` int(10) unsigned DEFAULT 0, -- Number of additional members to encapsulate
   PRIMARY KEY (`ID`),
   CONSTRAINT `FK_bids_event_file_mapping_pair` FOREIGN KEY (`PairRelID`)
       REFERENCES `bids_event_file_mapping` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
   INDEX idx_event_file_PropertyName_PropertyValue (`PropertyName`, `PropertyValue`),
   CONSTRAINT `FK_event_mapping_file_id` FOREIGN KEY (`EventFileID`) REFERENCES `physiological_event_file` (`EventFileID`) ON DELETE CASCADE ON UPDATE CASCADE,
   CONSTRAINT `FK_file_hed_tag_id` FOREIGN KEY (`HEDTagID`) REFERENCES `hed_schema_nodes` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;







SELECT 'Running: SQL/Archive/26.0/2024-02-31-api_docs_permission_visible.sql';

UPDATE permissions SET moduleID = (SELECT ID FROM modules WHERE Name='api_docs'), description = "LORIS API Manual", `action` = "View" WHERE code = "api_docs";


SELECT 'Running: SQL/Archive/26.0/2024-03-11-changePermissionCodeToDictionary.sql';

UPDATE permissions
SET moduleID = (select ID FROM modules WHERE Name = 'dictionary')
WHERE moduleID IN (SELECT ID FROM modules WHERE Name = 'datadict');

SELECT 'Running: SQL/Archive/26.0/2024-04-18-acknowledgements-size-constraints.sql';

ALTER TABLE acknowledgements MODIFY affiliations TEXT DEFAULT NULL;
ALTER TABLE acknowledgements MODIFY degrees TEXT DEFAULT NULL;
ALTER TABLE acknowledgements MODIFY roles TEXT DEFAULT NULL;
SELECT 'Running: SQL/Archive/26.0/2024-05-16-conflict-resolver-use-testname.sql';

ALTER TABLE conflicts_resolved
	CHANGE `TableName` `TestName` varchar(255) NOT NULL;

ALTER TABLE conflicts_unresolved
	CHANGE `TableName` `TestName` varchar(255) NOT NULL;

SELECT 'Running: SQL/Archive/26.0/2024-05-17-rename-chunked-eeg-path.sql';

-- Rename parameter_type name
UPDATE parameter_type
    SET Name="electrophysiology_chunked_dataset_path"
    WHERE Name="electrophyiology_chunked_dataset_path";

SELECT 'Running: SQL/Archive/26.0/2024-06-04-rename_media_write_permission.sql';

-- Renames media_write front display name.
ALTER TABLE
    `permissions`
MODIFY COLUMN
    `action` enum(
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
        'Edit/Upload/Delete',
        'Edit/Upload/Hide'
    )
AFTER `moduleID`;

UPDATE
    `permissions`
SET
    `action` = 'Edit/Upload/Hide'
WHERE
    `code` = 'media_write';
