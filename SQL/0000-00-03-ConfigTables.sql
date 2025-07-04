--
-- Table structure for table `ConfigSettings`
--

CREATE TABLE `ConfigSettings` (
    `ID` int(11) NOT NULL AUTO_INCREMENT,
    `Name` varchar(255) NOT NULL,
    `Description` varchar(255) DEFAULT NULL,
    `Visible` tinyint(1) DEFAULT '0',
    `AllowMultiple` tinyint(1) DEFAULT '0',
    `DataType` ENUM('text','boolean','email','instrument','textarea','scan_type','date_format','lookup_center','path','web_path', 'log_level') DEFAULT NULL,
    `Parent` int(11) DEFAULT NULL,
    `Label` varchar(255) DEFAULT NULL,
    `OrderNumber` int(11) DEFAULT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `Config` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ConfigID` int(11) NOT NULL,
  `Value` text,
  PRIMARY KEY (`ID`),
  KEY `fk_Config_1_idx` (`ConfigID`),
  CONSTRAINT `fk_Config_1`
  FOREIGN KEY (`ConfigID`)
    REFERENCES `ConfigSettings` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Filling ConfigSettings table
--

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('study', 'Settings related to details of the study', 1, 0, 'Study', 1);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'title', 'Full descriptive title of the study', 1, 0, 'text', ID, 'Study title', 1 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'studylogo', 'Filename containing logo of the study. File should be located under the htdocs/images/ folder', 1, 0, 'text', ID, 'Study logo', 2 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'startYear', "Start year for study recruitment or data collection", 1, 0, 'text', ID, 'Start year', 5 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'endYear', "End year for study recruitment or data collection", 1, 0, 'text', ID, 'End year', 6 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'ageMin', 'Minimum candidate age in years (0+)', 1, 0, 'text', ID, 'Minimum candidate age', 7 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'ageMax', 'Maximum candidate age in years', 1, 0, 'text', ID, 'Maximum candidate age', 8 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'dobFormat', "Format of the Date of Birth", 1, 0, 'date_format', ID, 'DOB Format', 9 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'dodFormat', 'Format of the Date of Death', 1, 0, 'date_format', ID, 'DOD Format', 10 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useProband', "Enable for proband data collection", 1, 0, 'boolean', ID, 'Use proband', 11 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useFamilyID', 'Enable if family members are recruited for the study', 1, 0, 'boolean', ID, 'Use family', 12 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useExternalID', "Enable if data is used for blind data distribution, or from external data sources", 1, 0, 'boolean', ID, 'Use external ID', 13 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useEDC', 'Use EDC (Expected Date of Confinement) for birthdate estimations if the study involves neonatals', 1, 0, 'boolean', ID, 'Use EDC', 14 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useScreening', "Enable if there is a Screening stage with its own distinct instruments, administered before the Visit stage", 1, 0, 'boolean', ID, 'Use screening', 15 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useConsent', 'Enable if the study uses the loris architecture for consent', 1, 0, 'boolean', ID, 'Use consent', 16 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'additional_user_info', 'Display additional user profile fields on the User accounts page (e.g. Institution, Position, Country, Address)', 1, 0, 'boolean', ID, 'Additional user information', 17 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'excluded_instruments', "Instruments to be excluded from the Data Dictionary and download via the Data Query Tool", 1, 1, 'instrument', ID, 'Excluded instruments', 18 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'InstrumentResetting', 'Allows resetting of instrument data', 1, 0, 'boolean', ID, 'Instrument Resetting', 20 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'SupplementalSessionStatus', 'Display supplemental session status information on Timepoint List page', 1, 0, 'boolean', ID, 'Use Supplemental Session Status', 21 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useScanDone', 'Used for identifying timepoints that have (or should have) imaging data', 1, 0, 'boolean', ID, 'Use Scan Done', 22 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'allowPrenatalTimepoints', 'Determines whether creation of timepoints prior to Date of Birth is allowed', 1, 0, 'boolean', ID, 'Allow Prenatal Timepoints', 23 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'ImagingUploaderAutoLaunch', "Allows running the ImagingUpload pre-processing scripts", 1, 0, 'boolean', ID, 'ImagingUploader Auto Launch',24 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'citation_policy', 'Citation Policy for Acknowledgements module', 1, 0, 'textarea', ID, 'Citation Policy', 25 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'CSPAdditionalHeaders', 'Extensions to the Content-security policy allow only for self-hosted content', 1, 0, 'text', ID, 'Content-Security Extensions', 26 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'usePwnedPasswordsAPI', 'Whether to query the Have I Been Pwned password API on password changes to prevent the usage of common and breached passwords', 1, 0, 'boolean', ID, 'Enable "Pwned Password" check', 27 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'dateDisplayFormat', 'The date format to use throughout LORIS for displaying date information - formats for date inputs are browser- and locale-dependent.', 1, 0, 'text', ID, 'Date display format', 28 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'adminContactEmail', 'An email address that users can write to in order to report issues or ask question', 1, 0, 'text', ID, 'Administrator Email', 29 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'UserMaximumDaysInactive', 'The maximum number of days since last login before making a user inactive', 1, 0, 'text', ID, 'Maximum Days Before Making User Inactive', 30 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useDoB', 'Use DoB (Date of Birth)', 1, 0, 'boolean', ID, 'Use DoB', 31 FROM ConfigSettings WHERE Name="study";

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('paths', 'Specify directories where LORIS-related files are stored or created. Take care when editing these fields as changing them incorrectly can cause certain modules to lose functionality.', 1, 0, 'Paths', 2);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'imagePath', 'Path to images for display in Imaging Browser (e.g. /data/$project/data/) ', 1, 0, 'text', ID, 'Images', 9 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'base', 'The base filesystem path where LORIS is installed', 1, 0, 'text', ID, 'Base', 1 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'DownloadPath', 'Where files are downloaded', 1, 0, 'text', ID, 'Downloads', 4 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'log', 'Path to logs (relative path starting from /var/www/$projectname)', 1, 0, 'text', ID, 'Logs', 2 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'GenomicDataPath', 'Path to Genomic data files', 1, 0, 'text', ID, 'Genomic Data Path', 8 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'mediaPath', 'Path to uploaded media files', 1, 0, 'text', ID, 'Media', 9 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'publication_uploads', 'Path to uploaded publications', 1, 0, 'web_path', ID, 'Publications', 10 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'publication_deletions', 'Path to deleted publications', 1, 0, 'web_path', ID, 'Deleted Publications', 11 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'documentRepositoryPath', 'Path to uploaded document repository files', 1, 0, 'web_path', ID, 'Document Repository Upload Path', 13 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'dataReleasePath', 'Path to uploaded data release files', 1, 0, 'web_path', ID, 'Data release Upload Path', 14 FROM ConfigSettings WHERE Name="paths";


INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('gui', 'Settings related to the overall display of LORIS', 1, 0, 'GUI', 3);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'StudyDescription', 'Description of the Study', 1, 0, 'textarea', ID , 'Study Description', 2 FROM ConfigSettings WHERE Name="gui";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useEEGBrowserVisualizationComponents', 'Whether to enable the visualization components on the EEG Browser module', 1, 0, 'boolean', ID, 'Enable the EEG Browser components', 4 FROM ConfigSettings WHERE Name="gui";


INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('www', 'Web address settings', 1, 0, 'WWW', 4);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'host', 'Host', 1, 0, 'text', ID, 'Host', 1 FROM ConfigSettings WHERE Name="www";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'issue_tracker_url', 'URL of the prefered issue tracker for this study', 1, 0, 'text', ID, 'Issue tracker URL', 3 FROM ConfigSettings WHERE Name="www";


INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('dashboard', 'Settings that affect the appearance of the dashboard and its charts', 1, 0, 'Dashboard', 5);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'projectDescription', 'Description of the study displayed in main dashboard panel', 1, 0, 'textarea', ID, 'Project Description', 1 FROM ConfigSettings WHERE Name="dashboard";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'recruitmentTarget', 'Target number of participants for the study', 1, 0, 'text', ID, 'Target number of participants', 2 FROM ConfigSettings WHERE Name="dashboard";

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('imaging_modules', 'DICOM Archive and Imaging Browser settings', 1, 0, 'Imaging Modules', 6);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'patientIDRegex', 'Regex for masking the Patient ID header field', 1, 0, 'text', ID, 'Patient ID regex', 1 FROM ConfigSettings WHERE Name="imaging_modules";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'patientNameRegex', 'Regex for masking the Patient Name header field', 1, 0, 'text', ID, 'Patient name regex', 2 FROM ConfigSettings WHERE Name="imaging_modules";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'LegoPhantomRegex', 'Regex for identifying a Lego Phantom scan header', 1, 0, 'text', ID, 'Lego phantom regex', 3 FROM ConfigSettings WHERE Name="imaging_modules";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'LivingPhantomRegex', 'Regex to be used on Living Phantom scan header', 1, 0, 'text', ID, 'Living phantom regex', 4 FROM ConfigSettings WHERE Name="imaging_modules";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'showTransferStatus', 'Show transfer status in the DICOM Archive table', 1, 0, 'boolean', ID, 'Show transfer status', 5 FROM ConfigSettings WHERE Name="imaging_modules";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useAdvancedPermissions', 'Restricts access to data based on both sites and projects and require a special permission to access data not affiliated to a session (SessionID null). Keeping this setting to NO should ensure backwards compatibility (access to all data when module loads)', 1, 0, 'boolean', ID, 'Use Advanced Permissions', 6 FROM ConfigSettings WHERE Name="imaging_modules";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'tblScanTypes', 'Scan types from the mri_scan_type table that the project wants to see displayed in Imaging Browser table', 1, 1, 'scan_type', ID, 'Imaging Browser Tabulated Scan Types', 7 FROM ConfigSettings WHERE Name="imaging_modules";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'ImagingBrowserLinkedInstruments', 'Instruments that the users want to see linked from Imaging Browser', 1, 1, 'instrument', ID, 'Imaging Browser Links to Instruments', 8 FROM ConfigSettings WHERE Name="imaging_modules";

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('statistics', 'Statistics module settings', 1, 0, 'Statistics', 7);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'excludedMeasures', 'Instruments to be excluded from Statistics calculations', 1, 1, 'instrument', ID, 'Excluded instruments', 1 FROM ConfigSettings WHERE Name="statistics";


INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('mail', 'LORIS email settings for notifications sent to users', 1, 0, 'Email', 8);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'From', 'Sender email address header (e.g. admin@myproject.loris.ca)', 1, 0, 'email', ID, 'From', 1 FROM ConfigSettings WHERE Name="mail";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'Reply-to', 'Reply-to email address header (e.g. admin@myproject.loris.ca)', 1, 0, 'email', ID, 'Reply-to', 2 FROM ConfigSettings WHERE Name="mail";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'X-MimeOLE', 'X-MimeOLE', 1, 0, 'text', ID, 'X-MimeOLE', 3 FROM ConfigSettings WHERE Name="mail";


INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('uploads', 'Settings related to file uploading', 1, 0, 'Uploads', '9');

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'FileGroup', 'Determines the group permission for new subdirectories created for uploaded files', 1, 0, 'text', ID, 'File Group for Uploads', 1 FROM ConfigSettings WHERE Name="uploads";


INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('APIKeys', 'Specify any API keys required for LORIS', 1, 0, 'API Keys', 10);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'JWTKey', 'Secret key for signing JWT tokens on this server. This should be unique and never shared with anyone. ', 1, 0, 'text', ID, 'JWT Secret Key', 1 FROM ConfigSettings WHERE Name="APIKeys";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'reCAPTCHAPrivate', 'Private Key for Google reCAPTCHA', 1, 0, 'text', ID, 'reCAPTCHA Private Key', 2 FROM ConfigSettings WHERE Name="APIKeys";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'reCAPTCHAPublic', 'Public Key for Google reCaptcha', 1, 0, 'text', ID, 'reCAPTCHA Public Key', 3 FROM ConfigSettings WHERE Name="APIKeys";

-- Issue_Tracker attachments for issues.
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'IssueTrackerDataPath', 'Path to Issue Tracker data files', 1, 0, 'web_path', ID, 'Issue Tracker Data Path', 8 FROM ConfigSettings WHERE Name="paths";

-- Loris-MRI/Imaging Pipeline options from the $profile (commonly "prod") file
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('imaging_pipeline', 'Imaging Pipeline settings', 1, 0, 'Imaging Pipeline', 14);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'dataDirBasepath', 'Base Path to the data directory of Loris-MRI', 1, 0, 'text', ID, 'Loris-MRI Data Directory', 1 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'prefix', 'Study prefix or study name', 1, 0, 'text', ID, 'Study Name', 2 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'mail_user', 'User to be notified during imaging pipeline execution', 1, 0, 'text', ID, 'User to notify when executing the pipeline', 3 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'get_dicom_info', 'Full path to get_dicom_info.pl', 1, 0, 'text', ID, 'Full path to get_dicom_info.pl script', 4 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'horizontalPics', 'Enable generation of horizontal pictures', 1, 0, 'boolean', ID, 'Horizontal pictures creation', 5 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'create_nii', 'Enable creation of NIfTI files', 1, 0, 'boolean', ID, 'NIfTI file creation', 6 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'converter', 'If converter is set to dcm2mnc, the c-version of dcm2mnc will be used. If however you want to use any of the various versions of the converter, you will have to specify what it is called and the uploader will try to invoke it', 1, 0, 'text', ID, 'DICOM converter tool to use (dcm2mnc or dcm2niix)', 7 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'tarchiveLibraryDir', 'Location of storing the library of used tarchives. If this is not set, they will not be moved', 1, 0, 'text', ID, 'Path to Tarchives', 8 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'lookupCenterNameUsing', 'DICOM field (either PatientName or PatientID) to use to get the patient identifiers and the center name of the DICOM study', 1, 0, 'lookup_center', ID, 'Patient identifiers and center name lookup variable', 9 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'createCandidates', 'Enable candidate creation in the imaging pipeline', 1, 0, 'boolean', ID, 'Enable candidate creation', 10 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'createVisit', 'Enable visit creation in the imaging pipeline', 1, 0, 'boolean', ID, 'Enable visit creation', 11 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'default_project', 'Default project used when creating scan candidate or visit', 1, 0, 'text', ID, 'Default project', 12 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'default_cohort', 'Default cohort used when creating scan visit', 1, 0, 'text', ID, 'Default cohort', 13 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'default_bids_vl', 'Default visit label to use when no visit label set in the BIDS dataset', 1, 0, 'text', ID, 'Default visit label for BIDS dataset', 14 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'is_qsub', 'Enable use of batch management in the imaging pipeline', 1, 0, 'boolean', ID, 'Project batch management used', 15 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'use_legacy_dicom_study_importer', 'Use the legacy DICOM study importer instead of the new one', 1, 0, 'boolean', ID, 'Use legacy DICOM study importer', 15 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'DTI_volumes', 'Number of volumes in native DTI acquisitions', 1, 0, 'text', ID, 'Number of volumes in native DTI acquisitions', 16 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 't1_scan_type', 'Scan type of native T1 acquisition (as in the mri_scan_type table)', 1, 0, 'text', ID, 'Scan type of native T1 acquisition', 17 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'reject_thresh', 'Max number of directions that can be rejected to PASS QC', 1, 0, 'text', ID, 'Max number of DTI rejected directions for passing QC', 18 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'niak_path', 'Path to niak quarantine to use if mincdiffusion will be run (option -runMincdiffusion set when calling DTIPrep_pipeline.pl)', 1, 0, 'text', ID, 'NIAK Path', 19 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'QCed2_step', 'DTIPrep protocol step at which a secondary QCed dataset is produced (for example one without motion correction and eddy current correction would be saved at INTERLACE_outputDWIFileNameSuffix step of DTIPrep)', 1, 0, 'text', ID, 'Secondary QCed dataset', 20 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'excluded_series_description', 'Series description to be excluded from insertion into the database (typically localizers and scouts)', 1, 1, 'text', ID, 'Series description to exclude from imaging insertion', 21 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'ComputeDeepQC', 'Determines whether a call is made from LORIS-MRI to the DeepQC app for automatic QC prediction', 1, 0, 'boolean', ID, 'Compute automatic QC', 22 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'MriConfigFile', 'Name of the Perl MRI config file (stored in dicom-archive/.loris_mri/)', 1, 0, 'text', ID, 'Name of the Perl MRI config file', 23 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'EnvironmentFile', 'Name of the environment file that need to be sourced for the imaging pipeline', 1, 0, 'text', ID, 'Name of the environment file', 24 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'compute_snr_modalities', 'Modalities for which the SNR should be computed when running the insertion MRI scripts', 1, 1, 'scan_type', ID, 'Modalities on which SNR should be calculated', 25 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'reference_scan_type_for_defacing', 'Scan type to use as a reference for registration when defacing anatomical images (typically a T1W image)', 1, 0, 'scan_type', ID, 'Scan type to use as a reference for defacing (typically a T1W image)', 26 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'modalities_to_deface', 'Modalities for which defacing should be run and defaced image inserted in the database', 1, 1, 'scan_type', ID, 'Modalities on which to run the defacing pipeline', 27 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'MriPythonConfigFile', 'Name of the Python MRI config file (stored in dicom-archive/.loris_mri/)', 1, 0, 'text', ID, 'Name of the Python MRI config file', 28 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'MRICodePath', 'Path to directory where Loris-MRI (git) code is installed', 1, 0, 'text', ID, 'LORIS-MRI code', 6 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'MRIUploadIncomingPath', 'Path to the upload directory for incoming MRI studies', 1, 0, 'text', ID, 'MRI Incoming Directory', 7 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'MINCToolsPath', 'Path to the MINC tools', 1, 0, 'web_path', ID, 'Path to the MINC tools', 12 FROM ConfigSettings WHERE Name="imaging_pipeline";

-- MINC to BIDS converter settings
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('minc2bids', 'Settings related to converting MINC to BIDS LORIS-MRI tool script', 1, 0,  'MINC to BIDS Converter Tool Options', 13);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_dataset_authors', 'Authors for the BIDS dataset', 1, 1, 'text', ID, 'BIDS Dataset Authors', 1 FROM ConfigSettings WHERE Name='minc2bids';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_acknowledgments_text', 'Acknowledgments to be added in the dataset_description.json file of the BIDS dataset created out of the MINC files', 1, 0, 'text', ID, 'BIDS Dataset Acknowledgments', 2 FROM ConfigSettings WHERE Name='minc2bids';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_readme_text', 'Content to be added to the README of the BIDS dataset generated out of the MINC files', 1, 0, 'textarea', ID, 'BIDS Dataset README', 3 FROM ConfigSettings WHERE Name='minc2bids';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_validator_options_to_ignore', 'Options to be ignored for BIDS validation', 1, 1, 'text', ID, 'BIDS Validation options to ignore', 4 FROM ConfigSettings WHERE Name='minc2bids';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('logs', 'Settings related to logging', 1, 0, 'Log Settings', 12);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'database_log_level', 'Verbosity of database logging', 1, 0, 'log_level', ID, 'Database Log Level', 3 FROM ConfigSettings WHERE Name='logs';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'request_log_level', 'Verbosity of HTTP request logs', 1, 0, 'log_level', ID, 'HTTP Request Log Level', 3 FROM ConfigSettings WHERE Name='logs';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'exception_log_level', 'Verbosity of PHP exception logging', 1, 0, 'log_level', ID, 'Exception Log Level', 3 FROM ConfigSettings WHERE Name='logs';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'profiler_log_level', 'Verbosity of performance profiler logging', 1, 0, 'log_level', ID, 'Profiler Log Level', 3 FROM ConfigSettings WHERE Name='logs';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('aws', 'Settings related to AWS services', 1, 0, 'AWS Settings', 13);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'AWS_S3_Endpoint', 'Endpoint to use for accessing files stored in S3. Endpoint or region are required for S3 support.', 1, 0, 'text', ID, 'AWS S3 Endpoint', 3 FROM ConfigSettings WHERE Name='aws';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'AWS_S3_Region', 'AWS Region to use for accessing files stored in S3. Endpoint or region are required for S3 support.', 1, 0, 'text', ID, 'AWS S3 Region', 3 FROM ConfigSettings WHERE Name='aws';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'AWS_S3_Default_Bucket', 'Default bucket for LORIS to use for accessing files in S3.', 1, 0, 'text', ID, 'AWS S3 Default Bucket', 3 FROM ConfigSettings WHERE Name='aws';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('eeg_pipeline', 'EEG Pipeline settings', 1, 0, 'EEG Pipeline', 15);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'EEGS3DataPath', 'EEG S3 data path for assembly data', 1, 0, 'text', ID, 'EEG S3 data path', 15 FROM ConfigSettings WHERE Name = 'eeg_pipeline';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'EEGUploadIncomingPath', 'Path to the upload directory for incoming EEG studies', 1, 0, 'text', ID, 'EEG Incoming Directory', 7 FROM ConfigSettings WHERE Name="eeg_pipeline";

-- REDCap settings
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('redcap', 'Settings related to REDCap interoperability', 1, 0, 'REDCap', 16);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'redcap_issue_assignee', 'REDCap main issue assignee in issue tracker', 1, 0, 'text', parent_config.ID, 'Main issue assignee', 1 FROM ConfigSettings parent_config LEFT JOIN ConfigSettings child_config ON (parent_config.ID = child_config.Parent) WHERE parent_config.Name = 'redcap';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'redcap_importable_instrument', 'REDCap instrument names from which data should be imported in LORIS', 1, 1, 'text', parent_config.ID, 'Importable instrument names', 2 FROM ConfigSettings parent_config LEFT JOIN ConfigSettings child_config ON (parent_config.ID = child_config.Parent) WHERE parent_config.Name = 'redcap';

--
-- Filling Config table with default values
--

INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings WHERE Name="additional_user_info";
INSERT INTO Config (ConfigID, Value) SELECT ID, "Example Study" FROM ConfigSettings WHERE Name="title";
INSERT INTO Config (ConfigID, Value) SELECT ID, "<h3>Example Study Description</h3>\r\n <p>This is a sample description for this study, because it is a new LORIS install that has not yet customized this text.</p>\r\n <p>A LORIS administrator can customize this text in the configuration module, under the configuration option labeled \"Study Description\"</p>\r\n <h3>Useful Links</h3>\r\n <ul>\r\n <li><a href=\"https://github.com/aces/Loris\" >LORIS GitHub Repository</a></li>\r\n <li><a href=\"https://github.com/aces/Loris/wiki/Setup\" >LORIS Setup Guide</a></li>\r\n <li><a href=\"https://www.youtube.com/watch?v=2Syd_BUbl5A\" >A video of a loris on YouTube</a></li>\r\n </ul>" FROM ConfigSettings WHERE Name="StudyDescription";
INSERT INTO Config (ConfigID, Value) SELECT ID, "images/neurorgb_web.jpg" FROM ConfigSettings WHERE Name="studylogo";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useEDC";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useDoB";
INSERT INTO Config (ConfigID, Value) SELECT ID, 8 FROM ConfigSettings WHERE Name="ageMin";
INSERT INTO Config (ConfigID, Value) SELECT ID, 11 FROM ConfigSettings WHERE Name="ageMax";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useFamilyID";
INSERT INTO Config (ConfigID, Value) SELECT ID, YEAR(NOW()) FROM ConfigSettings WHERE Name="startYear";
INSERT INTO Config (ConfigID, Value) SELECT ID, YEAR(NOW())+10 FROM ConfigSettings WHERE Name="endYear";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useExternalID";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useProband";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useScreening";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useConsent";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="SupplementalSessionStatus";
INSERT INTO Config (ConfigID, Value) SELECT ID, "true" FROM ConfigSettings WHERE Name="useScanDone";
INSERT INTO Config (ConfigID, Value) SELECT ID, "true" FROM ConfigSettings WHERE Name="allowPrenatalTimepoints";
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings WHERE Name="ImagingUploaderAutoLaunch";
INSERT INTO Config (ConfigID, Value) SELECT ID, "Customize this text with your citation policy (via Configuration module)" FROM ConfigSettings WHERE Name="citation_policy";
INSERT INTO Config (ConfigID, Value) SELECT ID, "" FROM ConfigSettings WHERE Name="CSPAdditionalHeaders";
INSERT INTO Config (ConfigID, Value) SELECT ID, "Ymd" FROM ConfigSettings WHERE Name="dobFormat";
INSERT INTO Config (ConfigID, Value) SELECT ID, "Ymd"  FROM ConfigSettings WHERE Name="dodFormat";
INSERT INTO Config (ConfigID, Value) SELECT ID, "365" FROM ConfigSettings WHERE Name="UserMaximumDaysInactive";


INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/%PROJECTNAME%/data/" FROM ConfigSettings WHERE Name="imagePath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "%LORISROOT%" FROM ConfigSettings WHERE Name="base";
INSERT INTO Config (ConfigID, Value) SELECT ID, "tools/logs/" FROM ConfigSettings WHERE Name="log";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/%PROJECTNAME%/bin/mri/" FROM ConfigSettings WHERE Name="MRICodePath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/incoming/" FROM ConfigSettings WHERE Name="MRIUploadIncomingPath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/Genomic-Data/" FROM ConfigSettings WHERE Name="GenomicDataPath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/uploads/" FROM ConfigSettings WHERE Name="mediaPath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/publication_uploads/" FROM ConfigSettings WHERE Name="publication_uploads";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/publication_uploads/to_be_deleted/" FROM ConfigSettings WHERE Name="publication_deletions";
INSERT INTO Config (ConfigID, Value) SELECT ID, "%MINCToolsPath%" FROM ConfigSettings WHERE Name="MINCToolsPath";

INSERT INTO Config (ConfigID, Value) SELECT ID, 'false' FROM ConfigSettings WHERE Name="useEEGBrowserVisualizationComponents";

INSERT INTO Config (ConfigID, Value) SELECT ID, "localhost" FROM ConfigSettings WHERE Name="host";

INSERT INTO Config (ConfigID, Value) SELECT ID, "This database provides an on-line mechanism to store both imaging and behavioural data collected from various locations. Within this framework, there are several tools that will make this process as efficient and simple as possible. For more detailed information regarding any aspect of the database, please click on the Help icon at the top right. Otherwise, feel free to contact us at the DCC. We strive to make data collection almost fun." FROM ConfigSettings WHERE Name="projectDescription";

INSERT INTO Config (ConfigID, Value) SELECT ID, "." FROM ConfigSettings WHERE Name="patientIDRegex";
INSERT INTO Config (ConfigID, Value) SELECT ID, "." FROM ConfigSettings WHERE Name="patientNameRegex";
INSERT INTO Config (ConfigID, Value) SELECT ID, "(?i)phantom" FROM ConfigSettings WHERE Name="LegoPhantomRegex";
INSERT INTO Config (ConfigID, Value) SELECT ID, "(?i)phantom" FROM ConfigSettings WHERE Name="LivingPhantomRegex";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="showTransferStatus";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useAdvancedPermissions";
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, GROUP_CONCAT(mst.MriScanTypeName) FROM ConfigSettings cs JOIN mri_scan_type mst WHERE cs.Name="tblScanTypes" AND mst.MriScanTypeID=44;
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, GROUP_CONCAT(mst.MriScanTypeName) FROM ConfigSettings cs JOIN mri_scan_type mst WHERE cs.Name="tblScanTypes" AND mst.MriScanTypeID=45;
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, "mri_parameter_form" FROM ConfigSettings cs WHERE cs.Name="ImagingBrowserLinkedInstruments";
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, "radiology_review" FROM ConfigSettings cs WHERE cs.Name="ImagingBrowserLinkedInstruments";

INSERT INTO Config (ConfigID, Value) SELECT ID, "radiology_review" FROM ConfigSettings WHERE Name="excludedMeasures";
INSERT INTO Config (ConfigID, Value) SELECT ID, "mri_parameter_form" FROM ConfigSettings WHERE Name="excludedMeasures";


INSERT INTO Config (ConfigID, Value) SELECT ID, "no-reply@example.com" FROM ConfigSettings WHERE Name="From";
INSERT INTO Config (ConfigID, Value) SELECT ID, "no-reply@example.com" FROM ConfigSettings WHERE Name="Reply-to";
INSERT INTO Config (ConfigID, Value) SELECT ID, "Produced by LorisDB" FROM ConfigSettings WHERE Name="X-MimeOLE";


INSERT INTO Config (ConfigID, Value) SELECT ID, "S3cret" FROM ConfigSettings WHERE Name="JWTKey";


INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/%PROJECTNAME%/data/" FROM ConfigSettings cs WHERE cs.Name="dataDirBasepath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "project" FROM ConfigSettings cs WHERE cs.Name="prefix";
INSERT INTO Config (ConfigID, Value) SELECT ID, "yourname\@example.com" FROM ConfigSettings cs WHERE cs.Name="mail_user";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/get_dicom_info.pl" FROM ConfigSettings cs WHERE cs.Name="get_dicom_info";
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings cs WHERE cs.Name="horizontalPics";
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings cs WHERE cs.Name="create_nii";
INSERT INTO Config (ConfigID, Value) SELECT ID, "dcm2mnc" FROM ConfigSettings cs WHERE cs.Name="converter";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/dicomlib/" FROM ConfigSettings cs WHERE cs.Name="tarchiveLibraryDir";
INSERT INTO Config (ConfigID, Value) SELECT ID, "PatientName" FROM ConfigSettings cs WHERE cs.Name="lookupCenterNameUsing";
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings cs WHERE cs.Name="createCandidates";
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings cs WHERE cs.Name="is_qsub";
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings cs WHERE cs.Name="use_legacy_dicom_study_importer";
INSERT INTO Config (ConfigID, Value) SELECT ID, 65 FROM ConfigSettings cs WHERE cs.Name="DTI_volumes";
INSERT INTO Config (ConfigID, Value) SELECT ID, "adniT1" FROM ConfigSettings cs WHERE cs.Name="t1_scan_type";
INSERT INTO Config (ConfigID, Value) SELECT ID, 19 FROM ConfigSettings cs WHERE cs.Name="reject_thresh";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/opt/niak-0.6.4.1/" FROM ConfigSettings cs WHERE cs.Name="niak_path";
INSERT INTO Config (ConfigID, Value) SELECT ID, "INTERLACE_outputDWIFileNameSuffix" FROM ConfigSettings cs WHERE cs.Name="QCed2_step";
INSERT INTO Config (ConfigID, Value) SELECT ID, "localizer" FROM ConfigSettings cs WHERE cs.Name="excluded_series_description";
INSERT INTO Config (ConfigID, Value) SELECT ID, "scout" FROM ConfigSettings cs WHERE cs.Name="excluded_series_description";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/issue_tracker" FROM ConfigSettings WHERE Name="issue_tracker_url";
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings cs WHERE cs.Name="ComputeDeepQC";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'prod' FROM ConfigSettings cs WHERE cs.Name="mriConfigFile";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'database_config.py' FROM ConfigSettings cs WHERE cs.Name="mriPythonConfigFile";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'environment' FROM ConfigSettings cs WHERE cs.Name="EnvironmentFile";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'flair' FROM ConfigSettings WHERE Name="compute_snr_modalities";
INSERT INTO Config (ConfigID, Value) SELECT ID, 't1'    FROM ConfigSettings WHERE Name="compute_snr_modalities";
INSERT INTO Config (ConfigID, Value) SELECT ID, 't2'    FROM ConfigSettings WHERE Name="compute_snr_modalities";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'pd'    FROM ConfigSettings WHERE Name="compute_snr_modalities";
INSERT INTO Config (ConfigID, Value) SELECT ID, 't1'    FROM ConfigSettings WHERE Name="reference_scan_type_for_defacing";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'flair' FROM ConfigSettings WHERE Name="modalities_to_deface";
INSERT INTO Config (ConfigID, Value) SELECT ID, 't1'    FROM ConfigSettings WHERE Name="modalities_to_deface";
INSERT INTO Config (ConfigID, Value) SELECT ID, 't2'    FROM ConfigSettings WHERE Name="modalities_to_deface";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'pd'    FROM ConfigSettings WHERE Name="modalities_to_deface";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'false'  FROM ConfigSettings WHERE Name="usePwnedPasswordsAPI";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'Y-m-d H:i:s'  FROM ConfigSettings WHERE Name="dateDisplayFormat";
INSERT INTO Config (ConfigID, Value) SELECT ID, '/data/issue_tracker/' FROM ConfigSettings WHERE Name="IssueTrackerDataPath";
INSERT INTO Config (ConfigID, Value) SELECT ID, ''  FROM ConfigSettings WHERE Name="adminContactEmail";

INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_dataset_authors';
INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_acknowledgments_text';
INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_readme_text';
INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_validator_options_to_ignore';
