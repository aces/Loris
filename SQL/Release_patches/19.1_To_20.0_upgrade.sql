INSERT INTO `ConfigSettings`
    (
        `Name`,
        `Description`,
        `Visible`,
        `AllowMultiple`,
        `DataType`,
        `Parent`,
        `Label`,
        `OrderNumber`
    )
SELECT
    'issue_tracker_url',
    'The *new* bug/issue tracker url',
    1,
    0,
    'text',
    (
        SELECT
            `ID`
        FROM
            `ConfigSettings`
        WHERE
            `Name` = 'www'
    ),
    'Issue Tracker URL',
    3
;
INSERT INTO
    `Config` (`ConfigID`, `Value`)
SELECT
    (
        SELECT
            `ID`
        FROM
            `ConfigSettings`
        WHERE
            `Name` = 'issue_tracker_url'
    ),
    COALESCE(
        (
            SELECT
                `Value`
            FROM
                `Config`
            WHERE
                `ConfigID` = (
                    SELECT
                        `ID`
                    FROM
                        `ConfigSettings`
                    WHERE
                        `Name` = 'mantis_url'
                )
        ),
        '/issue_tracker'
    );

UPDATE
    `ConfigSettings`
SET
    `Visible` = FALSE
WHERE
    `Name` = 'mantis_url';

-- Insert into ConfigSettings scan_type_exclude
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple,
DataType, Parent, Label, OrderNumber) SELECT 'excluded_series_description', 'Series description to be excluded from insertion into the database (typically localizers and scouts)', 1, 1, 'text', ID, 'Series description to exclude from imaging insertion', 18 FROM ConfigSettings WHERE Name="imaging_pipeline";

-- Insert into Config default values for scan_type_exclude
INSERT INTO Config (ConfigID, Value) SELECT ID, "localizer" FROM ConfigSettings cs WHERE cs.Name="excluded_series_description";
INSERT INTO Config (ConfigID, Value) SELECT ID, "scout" FROM ConfigSettings cs WHERE cs.Name="excluded_series_description";
ALTER TABLE issues_history DROP FOREIGN KEY `fk_issues_comments_1`;
ALTER TABLE issues_history ADD CONSTRAINT `fk_issues_comments_1` FOREIGN KEY (`issueID`) REFERENCES `issues` (`issueID`) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE issues_comments DROP FOREIGN KEY `fk_issue_comments_1`;
ALTER TABLE issues_comments ADD CONSTRAINT `fk_issue_comments_1` FOREIGN KEY (`issueID`) REFERENCES `issues` (`issueID`) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE issues_comments_history DROP FOREIGN KEY `fk_issues_comments_history`;
ALTER TABLE issues_comments_history ADD CONSTRAINT `fk_issues_comments_history` FOREIGN KEY (`issueCommentID`) REFERENCES `issues_comments` (`issueCommentID`) ON DELETE CASCADE ON UPDATE RESTRICT;
ALTER TABLE genomic_cpg DROP FOREIGN KEY `genomic_cpg_ibfk_1`;
ALTER TABLE genomic_cpg DROP FOREIGN KEY `genomic_cpg_ibfk_2`;
ALTER TABLE genomic_cpg ADD CONSTRAINT `genomic_cpg_ibfk_1` FOREIGN KEY (`sample_label`) REFERENCES `genomic_sample_candidate_rel` (`sample_label`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE genomic_cpg ADD CONSTRAINT `genomic_cpg_ibfk_2` FOREIGN KEY (`cpg_name`) REFERENCES `genomic_cpg_annotation` (`cpg_name`) ON DELETE CASCADE ON UPDATE CASCADE;
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useConsent', 'Enable if the study uses the loris architecture for consent', 1, 0, 'boolean', ID, 'Use consent', 15 FROM ConfigSettings WHERE Name='study';
INSERT INTO Config (ConfigID, Value) SELECT ID, 'false' FROM ConfigSettings WHERE Name='useConsent';

CREATE TABLE `consent` (
  `ConsentID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Label` varchar(255) NOT NULL,
  CONSTRAINT `PK_consent` PRIMARY KEY (`ConsentID`),
  CONSTRAINT `UK_consent_Name` UNIQUE KEY `Name` (`Name`),
  CONSTRAINT `UK_consent_Label` UNIQUE KEY `Label` (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `candidate_consent_rel` (
  `CandidateID` int(6) NOT NULL,
  `ConsentID` integer unsigned NOT NULL,
  `Status` enum('yes','no') DEFAULT NULL,
  `DateGiven` date DEFAULT NULL,
  `DateWithdrawn` date DEFAULT NULL,
  CONSTRAINT `PK_candidate_consent_rel` PRIMARY KEY (`CandidateID`,`ConsentID`),
  CONSTRAINT `FK_candidate_consent_rel_CandidateID` FOREIGN KEY (`CandidateID`) REFERENCES `candidate` (`CandID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_candidate_consent_rel_ConsentID` FOREIGN KEY (`ConsentID`) REFERENCES `consent` (`ConsentID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `candidate_consent_history` (
  `CandidateConsentHistoryID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `EntryDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `DateGiven` date DEFAULT NULL,
  `DateWithdrawn` date DEFAULT NULL,
  `PSCID` varchar(255) NOT NULL,
  `ConsentName` varchar(255) NOT NULL,
  `ConsentLabel` varchar(255) NOT NULL,
  `Status` enum('yes','no') DEFAULT NULL,
  `EntryStaff` varchar(255) DEFAULT NULL,
  CONSTRAINT `PK_candidate_consent_history` PRIMARY KEY (`CandidateConsentHistoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE parameter_session DROP FOREIGN KEY `FK_parameter_session_1`;
ALTER TABLE parameter_session ADD CONSTRAINT `FK_parameter_session_1` FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Removing the config setting if_site of the imaging pipeline section as discussed during a LORIS imaging meeting
DELETE FROM Config WHERE ConfigID=(
    SELECT ID FROM ConfigSettings WHERE Name='if_site'
);
DELETE FROM ConfigSettings WHERE Name='if_site';
UPDATE ConfigSettings 
    SET Name="create_nii", 
        Description="Create NIfTI files if set to 1", 
        Label="NIfTI file creation" 
    WHERE Name="no_nii";
UPDATE Config
    SET Value=IF(
        (SELECT Value FROM ConfigSettings cs WHERE cs.Name="create_nii")=0, 1, 0
    )
    WHERE ConfigID=(
        SELECT ID FROM ConfigSettings cs WHERE cs.Name="create_nii"
    );
-- Change description and label of the ConfigSetting named lookupCenterNameUsing
UPDATE ConfigSettings SET
    Description = "DICOM field (either PatientName or PatientID) to use to get the patient identifiers and the center name of the DICOM study",
    Label = "Patient identifiers and center name lookup variable"
    WHERE Name = "lookupCenterNameUsing";
UPDATE ConfigSettings
    SET Description='Enable generation of horizontal pictures'
    WHERE Name='horizontalPics';

UPDATE ConfigSettings
    SET Description='Enable creation of NIfTI files'
    WHERE Name="create_nii";

UPDATE ConfigSettings
    SET Description='Enable candidate creation in the imaging pipeline'
        WHERE Name='createCandidates';

UPDATE ConfigSettings
    SET Description='Enable use of batch management in the imaging pipeline'
        WHERE Name='is_qsub';

-- Add ComputeDeepQC as a configurable option
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'ComputeDeepQC', 'Determines whether a call is made from LORIS-MRI to the DeepQC app for automatic QC prediction', 1, 0, 'boolean', ID, 'Compute automatic QC', 18 FROM ConfigSettings WHERE Name="imaging_pipeline";

-- default imaging_pipeline settings
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings cs WHERE cs.Name="ComputeDeepQC";
INSERT IGNORE INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='examiner_view' AND m.Label='Examiner';
