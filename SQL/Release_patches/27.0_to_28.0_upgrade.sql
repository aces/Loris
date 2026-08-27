CREATE TABLE `mri_upload_server_processes_rel` (
  `UploadID` int(10) unsigned NOT NULL,
  `ProcessID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`UploadID`,`ProcessID`),
  CONSTRAINT `UK_mri_upload_server_processes_rel_ProcessID`
    UNIQUE KEY `ProcessID` (`ProcessID`),
  CONSTRAINT `FK_mri_upload_server_processes_rel_UploadID`
    FOREIGN KEY (`UploadID`) REFERENCES `mri_upload` (`UploadID`),
  CONSTRAINT `FK_mri_upload_server_processes_rel_ProcessID`
    FOREIGN KEY (`ProcessID`) REFERENCES `server_processes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `flag_editors` (
  `userID` int(10) unsigned NOT NULL default '0',
  `CommentID` VARCHAR(255) NOT NULL default '',
  `editDate` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`userID`,`CommentID`),
  KEY `FK_flag_editors_2` (`CommentID`),
  CONSTRAINT `FK_flag_editors_2`
  FOREIGN KEY (`CommentID`)
    REFERENCES `flag` (`CommentID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_flag_editors_1`
  FOREIGN KEY (`userID`)
    REFERENCES `users` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO flag_editors (userID, CommentID)
SELECT users.ID, CommentID from flag JOIN users ON flag.UserID = users.UserID;

ALTER TABLE flag DROP COLUMN UserID;INSERT INTO modules (Name, Active) VALUES ('biobank', 'Y');

INSERT INTO `permissions` (code, description, moduleID, action, categoryID) VALUES
    ('biobank_specimen_view','View Specimen Data',(SELECT ID FROM modules WHERE Name='biobank'), 'View', '2'),
    ('biobank_specimen_create','Create Specimens',(SELECT ID FROM modules WHERE Name='biobank'), 'Create', '2'),
    ('biobank_specimen_update','Process Specimens',(SELECT ID FROM modules WHERE Name='biobank'), 'Edit', '2'),
    ('biobank_specimen_alter','Edit Specimen Data',(SELECT ID FROM modules WHERE Name='biobank'), 'Edit', '2'),
    ('biobank_container_view','View Container Data',(SELECT ID FROM modules WHERE Name='biobank'), 'View', '2'),
    ('biobank_container_create','Create Containers',(SELECT ID FROM modules WHERE Name='biobank'), 'Create', '2'),
    ('biobank_container_update','Edit Container Data',(SELECT ID FROM modules WHERE Name='biobank'), 'Edit', '2'),
    ('biobank_pool_view','View Pool Data',(SELECT ID FROM modules WHERE Name='biobank'), 'View', '2'),
    ('biobank_pool_create','Create Pools',(SELECT ID FROM modules WHERE Name='biobank'), 'Create', '2'),
    ('biobank_fullsiteaccess','Full Site Access',(SELECT ID FROM modules WHERE Name='biobank'), 'View', '2'),
    ('biobank_fullprojectaccess','Full Project Access',(SELECT ID FROM modules WHERE Name='biobank'), 'View', '2');
CREATE TABLE menu_categories (
	name varchar(255) NOT NULL PRIMARY KEY,
	orderby integer unsigned default 1
);

INSERT INTO menu_categories (name, orderby) VALUES
('Candidate', 1),
('Clinical', 2),
('Electrophysiology', 3),
('Genomics', 4),
('Imaging', 5),
('Reports', 6),
('Tools', 7),
('Admin', 8);
CREATE TABLE policies (
    PolicyID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Version INT NOT NULL,
    ModuleID INT NOT NULL, -- Show in the header for a module
    PolicyRenewalTime INT DEFAULT 7, -- Number of days before the policy is renewed
    PolicyRenewalTimeUnit enum('D','Y','M','H') DEFAULT 'D', -- Unit of the renewal time
    Content TEXT NULL,
    SwalTitle VARCHAR(255) DEFAULT 'Terms of Use',
    HeaderButton enum('Y','N') DEFAULT 'Y',
    HeaderButtonText VARCHAR(255) DEFAULT 'Terms of Use',
    Active enum('Y','N') DEFAULT 'Y',
    AcceptButtonText VARCHAR(255) DEFAULT 'Accept',
    DeclineButtonText VARCHAR(255) DEFAULT 'Decline',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_policy_decision (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    PolicyID INT NOT NULL,
    Decision enum('Accepted','Declined') NOT NULL,
    DecisionDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO modules (`Name`, `Active`) VALUES ('policy_tracker','Y');-- add new table for actions
CREATE TABLE `permissions_action` (
  `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL UNIQUE,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- fill out already known actions
INSERT INTO `permissions_action` VALUES
  (1, "View"),
  (2, "Create"),
  (3, "Edit"),
  (4, "Delete"),
  (5, "Comment"),
  (6, "Close"),
  (7, "Hide"),
  (8, "Download"),
  (9, "Upload");

-- relation between "permissions" and "permissions_action"
CREATE TABLE `perm_perm_action_rel` (
  `permID` int(10) unsigned NOT NULL default '0',
  `actionID` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`permID`,`actionID`),
  KEY `FK_perm_perm_action_rel_2` (`permID`),
  CONSTRAINT `FK_perm_perm_action_rel_2`
  FOREIGN KEY (`permID`)
    REFERENCES `permissions` (`permID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_perm_perm_action_rel_1`
  FOREIGN KEY (`actionID`)
    REFERENCES `permissions_action` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- run "tools/single_use/migrate_permission_actions.php" migrate script after that.
-- Publication Lead Investigators do not need to be collaborators
ALTER TABLE publication
ADD COLUMN LeadInvestigatorEmail VARCHAR(255) NULL,
ADD COLUMN LeadInvestigator VARCHAR(255) NULL;

UPDATE publication
SET LeadInvestigator = (SELECT Name FROM publication_collaborator WHERE PublicationCollaboratorID = LeadInvestigatorID),
    LeadInvestigatorEmail = (SELECT Email FROM publication_collaborator WHERE PublicationCollaboratorID = LeadInvestigatorID)
WHERE LeadInvestigatorID IS NOT NULL;

ALTER TABLE publication
DROP FOREIGN KEY `FK_publication_LeadInvestigatorID`;

ALTER TABLE publication_collaborator
DROP INDEX `UK_publication_collaborator_Email`;

-- Remove the LeadInvestigatorID column from publication
ALTER TABLE publication
DROP COLUMN LeadInvestigatorID;

DELETE FROM publication_collaborator
WHERE PublicationCollaboratorID NOT IN (SELECT PublicationCollaboratorID FROM publication_collaborator_rel);-- Get module IDs
SELECT `ID` FROM `modules` WHERE modules.Name = 'dqt' INTO @dqtID;
SELECT `ID` FROM `modules` WHERE modules.Name = 'dataquery' INTO @dataqueryID;

-- Duplicate current dataquery_view permission to dqt_view (for legacy)
INSERT INTO `permissions` (code, description, moduleID, categoryID)
SELECT 'dqt_view', CONCAT(`description`, ' (legacy)'), @dqtID, `categoryID`
FROM `permissions`
WHERE permissions.code = 'dataquery_view';

-- Update moduleID for previous permission
UPDATE `permissions` SET moduleID = @dataqueryID
WHERE permissions.code = 'dataquery_view';

-- Get permission IDs
SELECT `permID` FROM `permissions` WHERE permissions.code = 'dqt_view' INTO @dqtPermID;
SELECT `permID` FROM `permissions` WHERE permissions.code = 'dataquery_view' INTO @dataqueryPermID;

-- Duplicate existing perm_perm_action_rel
INSERT INTO `perm_perm_action_rel` (permID, actionID)
SELECT @dqtPermID, actionID
FROM perm_perm_action_rel
WHERE permID = @dataqueryPermID;

-- Duplicate existing user_perm_rel
INSERT INTO `user_perm_rel` (userID, permID)
SELECT userID, @dqtPermID
FROM user_perm_rel
WHERE permID = @dataqueryPermID;


ALTER TABLE users ADD COLUMN TOTPSecret binary(64) DEFAULT NULL AFTER PasswordChangeRequired;
ALTER table ConfigSettings ADD COLUMN Multilingual boolean DEFAULT false;
UPDATE ConfigSettings SET Multilingual=true WHERE Name='projectDescription';

CREATE TABLE `ConfigI18n` (
  `Value` text NOT NULL,
  `ConfigID` int(11) DEFAULT NULL,
  `LanguageID` int(10) unsigned DEFAULT NULL,
  KEY `ConfigID` (`ConfigID`),
  KEY `LanguageID` (`LanguageID`),
  CONSTRAINT `ConfigI18n_ibfk_1` FOREIGN KEY (`ConfigID`) REFERENCES `ConfigSettings` (`ID`),
  CONSTRAINT `ConfigI18n_ibfk_2` FOREIGN KEY (`LanguageID`) REFERENCES `language` (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample translation of projectDescription for testing. We do not have a
-- foreign key value in the 'language' table to add it to RB.
-- INSERT INTO ConfigI18n VALUES ('このデータベースは、様々な場所で収集された画像データと行動データの両方をオンラインで保存するための仕組みを提供します。このフレームワークには、このプロセスを可能な限り効率的かつシンプルにするためのツールがいくつか用意されています。データベースに関する詳細な情報については、右上のヘルプアイコンをクリックしてください。それ以外の場合は、DCCまでお気軽にお問い合わせください。私たちは、データ収集を楽しいものにすることを目指しています。', 48, 2)
UPDATE notification_modules 
	SET Description='Issue Tracker: All issues created or edited' 
	WHERE module_name='issue_tracker' AND operation_type='create/edit';
-- Widen the site alias from 3 characters to 4 characters.
ALTER TABLE `psc` MODIFY COLUMN `Alias` char(4) NOT NULL DEFAULT '';
-- Add column to track associated channel names
ALTER TABLE physiological_task_event ADD COLUMN `Channel` TEXT DEFAULT NULL;

-- Create parameter_project table to track parameters and channel delimiter
CREATE TABLE `parameter_project` (
   `ParameterProjectID` int(10) unsigned NOT NULL auto_increment,
   `ProjectID` int(10) unsigned NOT NULL default '0',
   `ParameterTypeID` int(10) unsigned NOT NULL default '0',
   `Value` text default NULL,
   `InsertTime` int(10) unsigned NOT NULL default '0',
   PRIMARY KEY  (`ParameterProjectID`),
   UNIQUE KEY `project_type` (`ProjectID`,`ParameterTypeID`),
   KEY `parameter_value` (`ParameterTypeID`,`Value`(64)),
   CONSTRAINT `FK_parameter_project_2` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`),
   CONSTRAINT `FK_parameter_project_1` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT IGNORE INTO `parameter_type_category` (Name, Type)
VALUES ('Project Parameters', 'Metavars');

-- Add channel delimiter, taken from events.json to DB
INSERT IGNORE INTO parameter_type (Name, Type, Description, SourceFrom, Queryable, IsFile) VALUES
  ('ChannelDelimiter', 'text', 'Channel name separator', 'parameter_project', 1, 0);

INSERT INTO parameter_type_category_rel (ParameterTypeID, ParameterTypeCategoryID)
SELECT pt.ParameterTypeID, ptc.ParameterTypeCategoryID
FROM parameter_type pt, parameter_type_category ptc
WHERE ptc.Name='Project Parameters' AND pt.Name IN ('ChannelDelimiter');


-- Add TaggedBy column (user FK). NULL signifies it came with the dataset
ALTER TABLE physiological_task_event_hed_rel
  ADD COLUMN TaggedBy int(10) unsigned DEFAULT NULL;
ALTER TABLE bids_event_dataset_mapping
  ADD COLUMN TaggedBy int(10) unsigned DEFAULT NULL;
ALTER TABLE bids_event_file_mapping
  ADD COLUMN TaggedBy int(10) unsigned DEFAULT NULL;
-- ADD FK constraint
ALTER TABLE physiological_task_event_hed_rel
  ADD CONSTRAINT `FK_pte_tagged_by_user`
    FOREIGN KEY (`TaggedBy`) REFERENCES `users` (`ID`);
ALTER TABLE bids_event_dataset_mapping
  ADD CONSTRAINT `FK_bed_tagged_by_user`
    FOREIGN KEY (`TaggedBy`) REFERENCES `users` (`ID`);
ALTER TABLE bids_event_file_mapping
  ADD CONSTRAINT `FK_bef_tagged_by_user`
    FOREIGN KEY (`TaggedBy`) REFERENCES `users` (`ID`);

-- Create `hed_tag_endorsement` table
CREATE TABLE `hed_tag_endorsement` (
 `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `HEDRelID` int(10) unsigned NOT NULL,   -- TODO: Manually handle ON DELETE CASCADE
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

-- Create `hed_tag_endorsement_history` table
CREATE TABLE `hed_tag_endorsement_history` (
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

-- Create `hed_tag_history` table
CREATE TABLE `hed_tag_history` (
 `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `HEDTableID` int(10) unsigned NOT NULL,
 `HEDTable` enum(
   'physiological_task_event_hed_rel',
   'bids_event_dataset_mapping',
   'bids_event_file_mapping'
   ) NOT NULL,
 `HEDReferenceID` int(10) unsigned NOT NULL, -- PhysiologicalTaskEventID, ProjectID, EventFileID
 `TaggedBy` int(10) unsigned DEFAULT NULL,
 `PropertyName` varchar(50) DEFAULT NULL,
 `PropertyValue` varchar(255) DEFAULT NULL,
 `HEDTagID` int(10) unsigned DEFAULT NULL,   -- Reference to hed_schema_nodes.ID. Can be null to only add parentheses
 `TagValue` TEXT NULL,
 `Description` TEXT NULL,
 `HasPairing` BOOLEAN DEFAULT FALSE,   -- Is grouped with #AdditionalMembers# members
 `PairRelID` int(10) unsigned NULL,    -- The `ID` of right side of the pair
 `AdditionalMembers` int(10) unsigned DEFAULT 0,
 `ModificationType` enum('insert', 'update', 'delete') NOT NULL,
 `ModifiedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`ID`),
 CONSTRAINT `FK_hed_tagged_by_history`
   FOREIGN KEY (`TaggedBy`) REFERENCES `users` (`ID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create `physiological_task_event_history` table
CREATE TABLE `physiological_task_event_history` (
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

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) VALUES('login_logo_left', 'Path for top left logo on the login page.', 1, 0, 'text', 1, 'Login Top Left Logo', 3);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) VALUES('login_logo_right', 'Path for top right logo on the login page.', 1, 0, 'text', 1, 'Login Top Right Logo', 3);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) VALUES('login_logo_left_link', 'Optional link to redirect when clicking on top left logo', 1, 0, 'text', 1, 'Login Top Left Logo Link', 4);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) VALUES('login_logo_right_link', 'Optional link to redirect when clicking on top right logo', 1, 0, 'text', 1, 'Login Top Right Logo Link', 4);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) VALUES('partner_logos', 'Logos for partners to be displayed in the homepage', 1, 1, 'text', 1, 'Partner Logos', 4);

INSERT INTO Config (ConfigID, Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name="login_logo_left"), "/images/LORIS_logo_white.svg");
INSERT INTO Config (ConfigID, Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name="login_logo_right"), "/images/GitHub-Mark-Light-64px.png");
INSERT INTO Config (ConfigID, Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name="login_logo_left_link"), "/");
INSERT INTO Config (ConfigID, Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name="login_logo_right_link"), "https://github.com/aces/Loris");-- Step 1: Add the column allowing NULL (temporarily)
-- This allows the operation to succeed on a table that already has existing rows.
ALTER TABLE biobank_specimen_protocol_attribute_rel
ADD COLUMN OrderIndex INT UNSIGNED NULL;

-- Step 2: Populate the existing rows with unique, non-NULL OrderIndex values.
-- This uses a variable-based method to assign a sequential number (0, 1, 2, ...)
-- to each row within the same SpecimenProtocolID group.

SET @r := -1;
SET @g := 0;

-- A temporary table/derived table is used to calculate the unique index for each group
UPDATE biobank_specimen_protocol_attribute_rel AS t1
INNER JOIN (
    SELECT
        t2.SpecimenProtocolID,
        t2.SpecimenAttributeID,
        @r := CASE WHEN @g = t2.SpecimenProtocolID THEN @r + 1 ELSE 0 END AS new_OrderIndex,
        @g := t2.SpecimenProtocolID AS current_group
    FROM
        biobank_specimen_protocol_attribute_rel AS t2
    ORDER BY
        t2.SpecimenProtocolID, t2.SpecimenAttributeID

) AS ranked_data
ON t1.SpecimenProtocolID = ranked_data.SpecimenProtocolID
AND t1.SpecimenAttributeID = ranked_data.SpecimenAttributeID
SET t1.OrderIndex = ranked_data.new_OrderIndex;

-- Step 3: Enforce the constraints (NOT NULL and UNIQUE).
-- Now that every row has a valid, unique value, these operations will succeed.

-- 3a. Add the UNIQUE Constraint
ALTER TABLE biobank_specimen_protocol_attribute_rel
ADD CONSTRAINT UK_SpecimenProtocolId_OrderIndex
UNIQUE (SpecimenProtocolID, OrderIndex);

-- 3b. Change the Column to NOT NULL
ALTER TABLE biobank_specimen_protocol_attribute_rel
MODIFY COLUMN OrderIndex INT UNSIGNED NOT NULL;
SET FOREIGN_KEY_CHECKS = 0;

-- ======================================================
-- Fix `CommentID` in `flag` table
-- ======================================================
ALTER TABLE `flag`
MODIFY `CommentID` VARCHAR(255) NOT NULL;

-- ======================================================
-- Fix `CommentID` and `userID` in `flag_editors` table
-- ======================================================
ALTER TABLE `flag_editors`
MODIFY `CommentID` VARCHAR(255) NOT NULL,
MODIFY `userID` INT(10) UNSIGNED NOT NULL;

SET FOREIGN_KEY_CHECKS = 1;
UPDATE ConfigSettings SET Multilingual=true WHERE Name IN ('projectDescription', 'StudyDescription', 'title');
