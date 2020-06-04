ALTER TABLE users ADD COLUMN Password_hash varchar(255) AFTER Password_md5;
UPDATE permissions SET code='document_repository_view', description='View and upload files in Document Repository' WHERE code='file_upload';

INSERT INTO permissions (code,description,categoryID) VALUES ('document_repository_delete','Delete files in Document Repository','2');

ALTER TABLE feedback_mri_predefined_comments ADD COLUMN FieldName varchar(255);
UPDATE feedback_mri_predefined_comments SET FieldName='Red_artifact' WHERE Comment='red artifact';
UPDATE feedback_mri_predefined_comments SET FieldName='Green_artifact' WHERE Comment='green artifact';
UPDATE feedback_mri_predefined_comments SET FieldName='Blue_artifact' WHERE Comment='blue artifact';
UPDATE feedback_mri_predefined_comments SET FieldName='Motion_Slice_Wise' WHERE Comment='slice wise artifact (DWI ONLY)';
UPDATE feedback_mri_predefined_comments SET FieldName='Motion_Gradient_Wise' WHERE Comment='gradient wise artifact (DWI ONLY)';
UPDATE feedback_mri_predefined_comments SET FieldName='Noisy_scan' WHERE Comment='noisy scan';
UPDATE feedback_mri_predefined_comments SET FieldName='Checkerboard' WHERE Comment='checkerboard artifact';
UPDATE feedback_mri_predefined_comments SET FieldName='Horizontal_striping' WHERE Comment='horizontal intensity striping (Venetian blind effect, DWI ONLY)';
UPDATE feedback_mri_predefined_comments SET FieldName='Diagonal_striping' WHERE Comment='diagonal striping (NRRD artifact, DWI ONLY)';
UPDATE feedback_mri_predefined_comments SET FieldName='High_intensity_in_acquisition_direction' WHERE Comment='high intensity in direction of acquisition';
UPDATE feedback_mri_predefined_comments SET FieldName='Signal_loss' WHERE Comment='signal loss (dark patches)';
UPDATE feedback_mri_predefined_comments SET FieldName='Susceptibility_anatomy' WHERE Comment='susceptibility artifact due to anatomy';
UPDATE feedback_mri_predefined_comments SET FieldName='Too_few_remaining_gradients' WHERE Comment='Too few remaining gradients (DWI ONLY)';
UPDATE feedback_mri_predefined_comments SET FieldName='No_b0_left' WHERE Comment='No b0 remaining after DWIPrep (DWI ONLY)';
UPDATE feedback_mri_predefined_comments SET FieldName='No_gradient_info' WHERE Comment='No gradient information available from scanner (DWI ONLY)';
UPDATE feedback_mri_predefined_comments SET FieldName='Incorrect_diffusion_directions' WHERE Comment='Incorrect diffusion direction (DWI ONLY)';
UPDATE feedback_mri_predefined_comments SET FieldName='Duplicate_series' WHERE Comment='Duplicate series';
UPDATE feedback_mri_predefined_comments SET FieldName='Large_AP_wrap' WHERE Comment='Large AP wrap around, affecting brain';
UPDATE feedback_mri_predefined_comments SET FieldName='Medium_AP_wrap' WHERE Comment='Medium AP wrap around, no affect on brain';
UPDATE feedback_mri_predefined_comments SET FieldName='Small_AP_wrap' WHERE Comment='Small AP wrap around, no affect on brain';
UPDATE feedback_mri_predefined_comments SET FieldName='Tight_LR_brain' WHERE Comment='Too tight LR, affecting brain';
UPDATE feedback_mri_predefined_comments SET FieldName='Base_cerebellum_cut' WHERE Comment='Base of cerebellum cut off';
UPDATE feedback_mri_predefined_comments SET FieldName='Top_brain_cut' WHERE Comment='Top of brain cut off';
UPDATE feedback_mri_predefined_comments SET FieldName='Missing_slices' WHERE Comment='missing slices';
UPDATE feedback_mri_predefined_comments SET FieldName='Reduced_range_bright_pixel' WHERE Comment='reduced dynamic range due to bright artifact/pixel';
UPDATE feedback_mri_predefined_comments SET FieldName='Intensity_difference' WHERE Comment='slice to slice intensity differences';
UPDATE feedback_mri_predefined_comments SET FieldName='Susceptibility_ear_canal' WHERE Comment='susceptibilty artifact above the ear canals.';
UPDATE feedback_mri_predefined_comments SET FieldName='Susceptibility_dental_work' WHERE Comment='susceptibilty artifact due to dental work';
UPDATE feedback_mri_predefined_comments SET FieldName='Sagittal_ghosts' WHERE Comment='sagittal ghosts';
UPDATE feedback_mri_predefined_comments SET FieldName='Slight_ringing_artefacts' WHERE Comment='slight ringing artefacts';
UPDATE feedback_mri_predefined_comments SET FieldName='Severe_ringing_artefacts' WHERE Comment='severe ringing artefacts';
UPDATE feedback_mri_predefined_comments SET FieldName='Movement_eyes' WHERE Comment='movement artefact due to eyes';
UPDATE feedback_mri_predefined_comments SET FieldName='Movement_cartoid_flow' WHERE Comment='movement artefact due to carotid flow';
UPDATE feedback_mri_predefined_comments SET FieldName='Slight_movement' WHERE Comment='slight movement between packets';
UPDATE feedback_mri_predefined_comments SET FieldName='Large_movement' WHERE Comment='large movement between packets';
UPDATE feedback_mri_predefined_comments SET FieldName='Tight_LR_scalp' WHERE Comment='Too tight LR, cutting into scalp';
UPDATE feedback_mri_predefined_comments SET FieldName='Top_scalp_cut' WHERE Comment='Top of scalp cut off';
UPDATE feedback_mri_predefined_comments SET FieldName='Missing_top_third' WHERE Comment='missing top third - minc conversion?';
UPDATE feedback_mri_predefined_comments SET FieldName='Copy_prev_data' WHERE Comment='copy of prev data';
-- Add permissions
INSERT INTO permissions (code, description, categoryID) VALUES ('genomic_browser_view_site','View Genomic Browser data from own site','2'); 
INSERT INTO permissions (code, description, categoryID) VALUES ('genomic_browser_view_allsites','View Genomic Browser data across all sites','2'); 

-- Add menu item
INSERT INTO LorisMenu (Parent, Label, Link, Visible, OrderNumber) VALUES ('5', 'Genomic Browser', 'main.php?test_name=genomic_browser', NULL, 6);

-- Add menu permissions
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='genomic_browser_view_site' AND m.Label='Genomic Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='genomic_browser_view_allsites' AND m.Label='Genomic Browser';

-- Add tables
--
-- Table structure for table `gene`
--
CREATE TABLE `gene` (
  `GeneID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Symbol` varchar(255) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `NCBIID` varchar(255) DEFAULT NULL,
  `OfficialSymbol` varchar(255) DEFAULT NULL,
  `OfficialName` text,
  `GenomeLocID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`GeneID`),
  KEY `geneGenomeLocID` (`GenomeLocID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `genome_loc`
--
CREATE TABLE `genome_loc` (
  `GenomeLocID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Chromosome` varchar(255) DEFAULT NULL,
  `Strand` varchar(255) DEFAULT NULL,
  `EndLoc` int(11) DEFAULT NULL,
  `Size` int(11) DEFAULT NULL,
  `StartLoc` int(11) DEFAULT NULL,
  PRIMARY KEY (`GenomeLocID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `genotyping_platform`
--
CREATE TABLE `genotyping_platform` (
  `PlatformID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Description` text,
  `TechnologyType` varchar(255) DEFAULT NULL,
  `Provider` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PlatformID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `SNP`
--
CREATE TABLE `SNP` (
  `SNPID` bigint(20) NOT NULL AUTO_INCREMENT,
  `CandID` int(6) DEFAULT NULL,
  `rsID` varchar(9) DEFAULT NULL,
  `Description` text,
  `SNPExternalName` varchar(255) DEFAULT NULL,
  `SNPExternalSource` varchar(255) DEFAULT NULL,
  `ObservedBase` enum('A','C','T','G') DEFAULT NULL,
  `ReferenceBase` enum('A','C','T','G') DEFAULT NULL,
  `ArrayReport` enum('Normal','Pending','Uncertain') DEFAULT NULL,
  `Markers` varchar(255) DEFAULT NULL,
  `ArrayReportDetail` varchar(255) DEFAULT NULL,
  `ValidationMethod` varchar(50) DEFAULT NULL,
  `Validated` enum('0','1') DEFAULT NULL,
  `FunctionPrediction` enum('exonic','ncRNAexonic','splicing','UTR3','UTR5') DEFAULT NULL,
  `Damaging` enum('D','NA') DEFAULT NULL,
  `GenotypeQuality` int(4) DEFAULT NULL,
  `ExonicFunction` enum('nonsynonymous','unknown') DEFAULT NULL,
  `PlatformID` bigint(20) DEFAULT NULL,
  `GenomeLocID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`SNPID`),
  FOREIGN KEY (`PlatformID`) REFERENCES genotyping_platform(`PlatformID`),
  FOREIGN KEY (`GenomeLocID`) REFERENCES genome_loc(`GenomeLocID`),
  FOREIGN KEY (`CandID`) REFERENCES candidate(`CandID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `CNV`
--
CREATE TABLE `CNV` (
  `CNVID` bigint(20) NOT NULL AUTO_INCREMENT,
  `CandID` int(6) DEFAULT NULL,
  `Description` text,
  `Type` enum('gain','loss','unknown') DEFAULT NULL,
  `EventName` varchar(255) DEFAULT NULL,
  `Common_CNV` enum('Y','N') DEFAULT NULL,
  `Characteristics` enum('Benign','Pathogenic','Unknown') DEFAULT NULL,
  `CopyNumChange` int(11) DEFAULT NULL,
  `Inheritance` enum('de novo','NA','unclassified','unknown','maternal','paternal') DEFAULT NULL,
  `ArrayReport` enum('Normal','Abnormal','Pending','Uncertain') DEFAULT NULL,
  `Markers` varchar(255) DEFAULT NULL,
  `ArrayReportDetail` varchar(255) DEFAULT NULL,
  `ValidationMethod` varchar(50) DEFAULT NULL,
  `PlatformID` bigint(20) DEFAULT NULL,
  `GenomeLocID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`CNVID`),
  FOREIGN KEY (`PlatformID`) REFERENCES genotyping_platform(`PlatformID`),
  FOREIGN KEY (`GenomeLocID`) REFERENCES genome_loc(`GenomeLocID`),
  FOREIGN KEY (`CandID`) REFERENCES candidate(`CandID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'InstrumentResetting', 'Allows resetting of instrument data', 1, 0, 'boolean', ID, 'Instrument Resetting', 15 FROM ConfigSettings WHERE Name="study";
UPDATE permissions SET code='examiner_view', description='Add and certify examiners' WHERE code='certification';
UPDATE permissions SET code='examiner_multisite', description='Across all sites add and certify examiners' WHERE code='certification_multisite';

UPDATE LorisMenu SET Label='Examiner', Link='main.php?test_name=examiner' WHERE Label='Certification';

ALTER TABLE users DROP COLUMN Examiner;INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'SupplementalSessionStatus', 'Display supplemental session status information on Timepoint List page', 1, 0, 'boolean', ID, 'Use Supplemental Session Status', 18 FROM ConfigSettings WHERE Name="study";

INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="SupplementalSessionStatus";
ALTER TABLE mri_upload ADD COLUMN Processed tinyint(1) NOT NULL DEFAULT '0' AFTER SourceLocation;
ALTER TABLE mri_upload ADD COLUMN CurrentlyProcessed tinyint(1) NOT NULL DEFAULT '0';
ALTER TABLE mri_upload ADD COLUMN PatientName VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE mri_upload ADD COLUMN IsTarchiveValidated tinyint(1) NOT NULL DEFAULT '0' AFTER IsValidated;
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'MRIUploadIncomingPath', '"Path to the Directory of Uploaded Scans', 1, 0, 'text', ID, 'MRI-Upload Directory', 7 FROM ConfigSettings WHERE Name="paths";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/MRI-Upload/" FROM ConfigSettings WHERE Name="MRIUploadIncomingPath";
INSERT INTO permissions (code, description, categoryID) VALUES ('training', 'View and complete training', 2);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) SELECT 'Training', 'main.php?test_name=training', ID, 4 FROM LorisMenu WHERE Label='Clinical';

INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='training' AND m.Label='Training';

CREATE TABLE `certification_training` (
    `ID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `TestID` int(10) UNSIGNED NOT NULL,
    `Title` varchar(255) NOT NULL,
    `Content` text,
    `TrainingType` enum('text', 'pdf', 'video', 'quiz') NOT NULL,
    `OrderNumber` INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_certification_training` FOREIGN KEY (`TestID`) REFERENCES `test_names` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `certification_training_quiz_questions` (
    `ID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `TestID` int(10) unsigned NOT NULL,
    `Question` varchar(255) NOT NULL,
    `OrderNumber` INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_certification_training_quiz_questions` FOREIGN KEY (`TestID`) REFERENCES `test_names` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `certification_training_quiz_answers` (
    `ID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `QuestionID` INTEGER UNSIGNED NOT NULL,
    `Answer` varchar(255) NOT NULL,
    `Correct` boolean NOT NULL,
    `OrderNumber` INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_certification_training_quiz_answers` FOREIGN KEY (`QuestionID`) REFERENCES `certification_training_quiz_questions` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;ALTER TABLE notification_spool ADD COLUMN `Origin` varchar(255) DEFAULT NULL;
ALTER TABLE notification_spool ADD COLUMN `ProcessID` int(11) NOT NULL DEFAULT '0' AFTER NotificationTypeID;
ALTER TABLE notification_spool ADD COLUMN `TimeSpooledNew` datetime DEFAULT NULL AFTER TimeSpooled;
ALTER TABLE notification_spool ADD COLUMN `Error` enum('Y','N') default NULL AFTER Message;

INSERT INTO notification_types (Type,private,Description) VALUES
    ('minc insertion',1,'Insertion of the mincs into the mri-table'),
    ('tarchive loader',1,'calls specific Insertion Scripts'),
    ('tarchive validation',1,'Validation of the dicoms After uploading'),
    ('mri upload runner',1,'Validation of DICOMS before uploading'),
    ('mri upload processing class ',1,'Validation and execution of DicomTar.pl and TarchiveLoader');

UPDATE notification_spool SET TimeSpooledNew=FROM_UNIXTIME(TimeSpooled);
ALTER table notification_spool DROP COLUMN TimeSpooled;
ALTER table notification_spool CHANGE COLUMN TimeSpooledNew TimeSpooled datetime DEFAULT NULL;


DROP TABLE IF EXISTS `server_processes`;
CREATE TABLE `server_processes` (
  `id`                int(11) unsigned NOT NULL AUTO_INCREMENT,
  `pid`               int(11) unsigned NOT NULL,
  `type`              enum('mri_upload') NOT NULL,
  `stdout_file`       varchar(255) DEFAULT NULL,
  `stderr_file`       varchar(255) DEFAULT NULL,
  `exit_code_file`    varchar(255) DEFAULT NULL,
  `exit_code`         varchar(255) DEFAULT NULL,
  `userid`            varchar(255) NOT NULL,
  `start_time`        timestamp NULL,
  `end_time`          timestamp NULL,
  `exit_text`         text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_task_1` (`userid`),
  CONSTRAINT `FK_task_1` FOREIGN KEY (`userid`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO permissions (code,description,categoryID) VALUES ('server_processes_manager','View and manage server processes','2');

INSERT INTO user_perm_rel (userID, permID) VALUES (1, (SELECT permID FROM permissions WHERE code = 'server_processes_manager'));

INSERT INTO LorisMenu (Parent, Label, Link, Visible, OrderNumber) VALUES (6, 'Server Processes Manager', 'main.php?test_name=server_processes_manager', NULL, 6);

INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='server_processes_manager' AND m.Label='Server Processes Manager';
ALTER TABLE user_login_history DROP FOREIGN KEY FK_user_login_history_1;
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'ImagingUploaderAutoLaunch',"Allows running the ImagingUpload pre-processing scripts", 1, 0, 'boolean', ID, 'ImagingUploader Auto Launch', 19 FROM ConfigSettings WHERE Name="study";
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings WHERE Name="ImagingUploaderAutoLaunch";
ALTER TABLE mri_upload CHANGE COLUMN SourceLocation UploadLocation VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE mri_upload ADD COLUMN DecompressedLocation VARCHAR(255) NOT NULL DEFAULT '' AFTER UploadLocation; 
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useScanDone', 'Determines whether or not "Scan Done" should be used in Loris', 1, 0, 'boolean', ID, 'Use Scan Done', 19 FROM ConfigSettings WHERE Name="study";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'true' FROM ConfigSettings WHERE Name='useScanDone';
-- add allowPrenatalTimepoints
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'allowPrenatalTimepoints', 'Determines whether creation of timepoints prior to Date of Birth is allowed', 1, 0, 'boolean', ID, 'Allow Prenatal Timepoints', 20 FROM ConfigSettings WHERE Name="study";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'true' FROM ConfigSettings WHERE Name='allowPrenatalTimepoints';

-- add Uploads setting category
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('uploads', 'Settings related to file uploading', 1, 0, 'Uploads', '9'); 

-- add FileGroup setting under Uploads
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'FileGroup', 'Determines the group permission for new subdirectories created for uploaded files', 1, 0, 'text', ID, 'File Group for Uploads', 1 FROM ConfigSettings WHERE Name="uploads";
ALTER TABLE mri_upload ADD COLUMN `IsPhantom` enum('N','Y') NOT NULL DEFAULT 'N';
