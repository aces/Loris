CREATE TABLE `ConfigSettings` (
    `ID` int(11) NOT NULL AUTO_INCREMENT,
    `Name` varchar(255) NOT NULL,
    `Description` varchar(255) DEFAULT NULL,
    `Visible` tinyint(1) DEFAULT '0',
    `AllowMultiple` tinyint(1) DEFAULT '0',
    `DataType` ENUM('text', 'boolean', 'email', 'instrument', 'textarea') DEFAULT NULL,
    `Parent` int(11) DEFAULT NULL,
    `Label` varchar(255) DEFAULT NULL,
    `OrderNumber` int(11) DEFAULT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Config` (
    `ID` int(11) NOT NULL AUTO_INCREMENT,
    `ConfigID` int(11) DEFAULT NULL,
    `Value` text DEFAULT NULL,
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Filling ConfigSettings table
--

-- study
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('study', 'Settings related to details of the study', 1, 0, 'Study', 1);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'additional_user_info', 'Display additional user profile fields on the User accounts page (e.g. Institution, Position, Country, Address)', 1, 0, 'boolean', ID, 'Additional user information', 14 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'title', 'Full descriptive title of the study', 1, 0, 'text', ID, 'Study title', 1 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'studylogo', 'Filename containing logo of the study. File should be located under the htdocs/images/ folder', 1, 0, 'text', ID, 'Study logo', 2 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useEDC', 'Use EDC (Expected Date of Confinement) for birthdate estimations if the study involves neonatals', 1, 0, 'boolean', ID, 'Use EDC', 12 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'ageMin', 'Minimum candidate age in years (0+)', 1, 0, 'text', ID, 'Minimum candidate age', 7 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'ageMax', 'Maximum candidate age in years', 1, 0, 'text', ID, 'Maximum candidate age', 8 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'multipleSites', 'Enable if there is there more than one site in the project', 1, 0, 'boolean', ID, 'Multiples sites', 3 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useFamilyID', 'Enable if family members are recruited for the study', 1, 0, 'boolean', ID, 'Use family', 10 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'startYear', "Start year for study recruitment or data collection", 1, 0, 'text', ID, 'Start year', 5 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'endYear', "End year for study recruitment or data collection", 1, 0, 'text', ID, 'End year', 6 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useExternalID', "Enable if data is used for blind data distribution, or from external data sources", 1, 0, 'boolean', ID, 'Use external ID', 11 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useProband', "Enable for proband data collection", 1, 0, 'boolean', ID, 'Use proband', 9 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useProjects', "Enable if the study involves more than one project, where each project has multiple cohorts/subprojects", 1, 0, 'boolean', ID, 'Use projects', 4 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useScreening', "Enable if there is a Screening stage with its own distinct instruments, administered before the Visit stage", 1, 0, 'boolean', ID, 'Use screening', 13 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'excluded_instruments', "Instruments to be excluded from the Data Dictionary and download via the Data Query Tool", 1, 1, 'instrument', ID, 'Excluded instruments', 15 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'DoubleDataEntryInstruments', "Instruments for which double data entry should be enabled", 1, 1, 'instrument', ID, 'Double data entry instruments', 16 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'InstrumentResetting', 'Allows resetting of instrument data', 1, 0, 'boolean', ID, 'Instrument Resetting', 17 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'SupplementalSessionStatus', 'Display supplemental session status information on Timepoint List page', 1, 0, 'boolean', ID, 'Use Supplemental Session Status', 18 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useScanDone', 'Determines whether or not "Scan Done" should be used in Loris', 1, 0, 'boolean', ID, 'Use Scan Done', 19 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'allowPrenatalTimepoints', 'Determines whether creation of timepoints prior to Date of Birth is allowed', 1, 0, 'boolean', ID, 'Allow Prenatal Timepoints', 20 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'ImagingUploaderAutoLaunch', "Allows running the ImagingUpload pre-processing scripts", 1, 0, 'boolean', ID, 'ImagingUploader Auto Launch',21 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'citation_policy', 'Citation Policy for Acknowledgements module', 1, 0, 'textarea', ID, 'Citation Policy', 22 FROM ConfigSettings WHERE Name="study";

-- paths
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('paths', 'Specify directories where LORIS-related files are stored or created. Take care when editing these fields as changing them incorrectly can cause certain modules to lose functionality.', 1, 0, 'Paths', 2);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'imagePath', 'Path to images for display in Imaging Browser (e.g. /data/$project/data/) ', 1, 0, 'text', ID, 'Images', 9 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'base', 'The base filesystem path where LORIS is installed', 1, 0, 'text', ID, 'Base', 1 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'data', 'Path to main imaging data directory (e.g. /data/$project/data/) ', 1, 0, 'text', ID, 'Imaging data', 5 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'extLibs', 'Path to external libraries', 1, 0, 'text', ID, 'External libraries', 3 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'mincPath', 'Path to MINC files (e.g. /data/$project/data/)', 1, 0, 'text', ID, 'MINC files', 8 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'DownloadPath', 'Where files are downloaded', 1, 0, 'text', ID, 'Downloads', 4 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'log', 'Path to logs (relative path starting from /var/www/$projectname)', 1, 0, 'text', ID, 'Logs', 2 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'IncomingPath', 'Path for imaging data transferred to the project server (e.g. /data/incoming/$project/)', 1, 0, 'text', ID, 'Incoming data', 7 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'MRICodePath', 'Path to directory where Loris-MRI (git) code is installed', 1, 0, 'text', ID, 'LORIS-MRI code', 6 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'MRIUploadIncomingPath', '"Path to the Directory of Uploaded Scans', 1, 0, 'text', ID, 'MRI-Upload Directory', 7 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'GenomicDataPath', 'Path to Genomic data files', 1, 0, 'text', ID, 'Genomic Data Path', 8 FROM ConfigSettings WHERE Name="paths";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT
  'mediaPath', 'Path to uploaded media files', 1, 0, 'text', ID, 'Media', 9 FROM ConfigSettings WHERE Name="paths";

-- gui
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('gui', 'Settings related to the overall display of LORIS', 1, 0, 'GUI', 3);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'css', 'CSS file used for rendering (default main.css)', 1, 0, 'text', ID, 'CSS file', 1 FROM ConfigSettings WHERE Name="gui";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'rowsPerPage', 'Number of table rows to display per page', 1, 0, 'text', ID, 'Table rows per page', 2 FROM ConfigSettings WHERE Name="gui";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'StudyDescription', 'Description of the Study', 1, 0, 'textarea', ID , 'Study Description', 2 FROM ConfigSettings WHERE Name="gui";

-- www
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('www', 'Web address settings', 1, 0, 'WWW', 4);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'host', 'Host', 1, 0, 'text', ID, 'Host', 1 FROM ConfigSettings WHERE Name="www";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'url', 'Main URL where LORIS can be accessed', 1, 0, 'text', ID, 'Main LORIS URL', 2 FROM ConfigSettings WHERE Name="www";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'mantis_url', 'Bug tracker URL', 1, 0, 'text', ID, 'Bug tracker URL', 3 FROM ConfigSettings WHERE Name="www";

-- dashboard
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('dashboard', 'Settings that affect the appearance of the dashboard and its charts', 1, 0, 'Dashboard', 5);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'projectDescription', 'Description of the study displayed in main dashboard panel', 1, 0, 'textarea', ID, 'Project Description', 1 FROM ConfigSettings WHERE Name="dashboard";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'recruitmentTarget', 'Target number of participants for the study', 1, 0, 'text', ID, 'Target number of participants', 2 FROM ConfigSettings WHERE Name="dashboard";

-- dicom_archive
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('dicom_archive', 'DICOM Archive settings', 1, 0, 'DICOM Archive', 6);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'patientIDRegex', 'Regex for masking the Patient ID header field', 1, 0, 'text', ID, 'Patient ID regex', 1 FROM ConfigSettings WHERE Name="dicom_archive";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'patientNameRegex', 'Regex for masking the Patient Name header field', 1, 0, 'text', ID, 'Patient name regex', 2 FROM ConfigSettings WHERE Name="dicom_archive";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'LegoPhantomRegex', 'Regex for identifying a Lego Phantom scan header', 1, 0, 'text', ID, 'Lego phantom regex', 3 FROM ConfigSettings WHERE Name="dicom_archive";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'LivingPhantomRegex', 'Regex to be used on Living Phantom scan header', 1, 0, 'text', ID, 'Living phantom regex', 4 FROM ConfigSettings WHERE Name="dicom_archive";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'showTransferStatus', 'Show transfer status in the DICOM Archive table', 1, 0, 'boolean', ID, 'Show transfer status', 5 FROM ConfigSettings WHERE Name="dicom_archive";

-- statistics
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('statistics', 'Statistics module settings', 1, 0, 'Statistics', 7);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'excludedMeasures', 'Instruments to be excluded from Statistics calculations', 1, 1, 'instrument', ID, 'Excluded instruments', 1 FROM ConfigSettings WHERE Name="statistics";

-- mail
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('mail', 'LORIS email settings for notifications sent to users', 1, 0, 'Email', 8);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'From', 'Sender email address header (e.g. admin@myproject.loris.ca)', 1, 0, 'email', ID, 'From', 1 FROM ConfigSettings WHERE Name="mail";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'Reply-to', 'Reply-to email address header (e.g. admin@myproject.loris.ca)', 1, 0, 'email', ID, 'Reply-to', 2 FROM ConfigSettings WHERE Name="mail";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'X-MimeOLE', 'X-MimeOLE', 1, 0, 'text', ID, 'X-MimeOLE', 3 FROM ConfigSettings WHERE Name="mail";

-- uploads
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('uploads', 'Settings related to file uploading', 1, 0, 'Uploads', '9');

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'FileGroup', 'Determines the group permission for new subdirectories created for uploaded files', 1, 0, 'text', ID, 'File Group for Uploads', 1 FROM ConfigSettings WHERE Name="uploads";

-- API keys
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('APIKeys', 'Specify any API keys required for LORIS', 1, 0, 'API Keys', 10);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'JWTKey', 'Secret key for signing JWT tokens on this server. This should be unique and never shared with anyone. ', 1, 0, 'text', ID, 'JWT Secret Key', 9 FROM ConfigSettings WHERE Name="APIKeys";

--
-- Filling Config table with default values
--

-- default study variables
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings WHERE Name="additional_user_info";
INSERT INTO Config (ConfigID, Value) SELECT ID, "Example Study" FROM ConfigSettings WHERE Name="title";
INSERT INTO Config (ConfigID, Value) SELECT ID, "<h3>Example Study Description</h3>\r\n <p>This is a sample description for this study, because it is a new LORIS install that has not yet customized this text.</p>\r\n <p>A LORIS administrator can customize this text in the configuration module, under the configuration option labeled \"Study Description\"</p>\r\n <h3>Useful Links</h3>\r\n <ul>\r\n <li><a href=\"https://github.com/aces/Loris\" >LORIS GitHub Repository</a></li>\r\n <li><a href=\"https://github.com/aces/Loris/wiki/Setup\" >LORIS Setup Guide</a></li>\r\n <li><a href=\"https://www.youtube.com/watch?v=2Syd_BUbl5A\" >A video of a loris on YouTube</a></li>\r\n </ul>" FROM ConfigSettings WHERE Name="StudyDescription";
INSERT INTO Config (ConfigID, Value) SELECT ID, "images/neurorgb_web.jpg" FROM ConfigSettings WHERE Name="studylogo";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useEDC";
INSERT INTO Config (ConfigID, Value) SELECT ID, 8 FROM ConfigSettings WHERE Name="ageMin";
INSERT INTO Config (ConfigID, Value) SELECT ID, 11 FROM ConfigSettings WHERE Name="ageMax";
INSERT INTO Config (ConfigID, Value) SELECT ID, "true" FROM ConfigSettings WHERE Name="multipleSites";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useFamilyID";
INSERT INTO Config (ConfigID, Value) SELECT ID, YEAR(NOW()) FROM ConfigSettings WHERE Name="startYear";
INSERT INTO Config (ConfigID, Value) SELECT ID, YEAR(NOW())+10 FROM ConfigSettings WHERE Name="endYear";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useExternalID";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useProband";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useProjects";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useScreening";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="SupplementalSessionStatus";
INSERT INTO Config (ConfigID, Value) SELECT ID, "true" FROM ConfigSettings WHERE Name="useScanDone";
INSERT INTO Config (ConfigID, Value) SELECT ID, "true" FROM ConfigSettings WHERE Name="allowPrenatalTimepoints";
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings WHERE Name="ImagingUploaderAutoLaunch";
INSERT INTO Config (ConfigID, Value) SELECT ID, "Modify this to your project's citation policy" FROM ConfigSettings WHERE Name="citation_policy";

-- default path settings
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/%PROJECTNAME%/data/" FROM ConfigSettings WHERE Name="imagePath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "%LORISROOT%" FROM ConfigSettings WHERE Name="base";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/%PROJECTNAME%/data/" FROM ConfigSettings WHERE Name="data";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/EXTERNAL/LIBRARY/" FROM ConfigSettings WHERE Name="extLibs";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/%PROJECTNAME%/data/" FROM ConfigSettings WHERE Name="mincPath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "%LORISROOT%" FROM ConfigSettings WHERE Name="DownloadPath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "tools/logs/" FROM ConfigSettings WHERE Name="log";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/incoming/" FROM ConfigSettings WHERE Name="IncomingPath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/%PROJECTNAME%/bin/mri/" FROM ConfigSettings WHERE Name="MRICodePath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/incoming/" FROM ConfigSettings WHERE Name="MRIUploadIncomingPath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/Genomic-Data/" FROM ConfigSettings WHERE Name="GenomicDataPath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/uploads/" FROM ConfigSettings WHERE Name="mediaPath";

-- default gui settings
INSERT INTO Config (ConfigID, Value) SELECT ID, "main.css" FROM ConfigSettings WHERE Name="css";
INSERT INTO Config (ConfigID, Value) SELECT ID, 25 FROM ConfigSettings WHERE Name="rowsPerPage";

-- default www settings
INSERT INTO Config (ConfigID, Value) SELECT ID, "localhost" FROM ConfigSettings WHERE Name="host";
INSERT INTO Config (ConfigID, Value) SELECT ID, "http://localhost/" FROM ConfigSettings WHERE Name="url";

-- default dashboard settings
INSERT INTO Config (ConfigID, Value) SELECT ID, "This database provides an on-line mechanism to store both imaging and behavioral data collected from various locations. Within this framework, there are several tools that will make this process as efficient and simple as possible. For more detailed information regarding any aspect of the database, please click on the Help icon at the top right. Otherwise, feel free to contact us at the DCC. We strive to make data collection almost fun." FROM ConfigSettings WHERE Name="projectDescription";

-- default dicom_archive settings
INSERT INTO Config (ConfigID, Value) SELECT ID, "/./" FROM ConfigSettings WHERE Name="patientIDRegex";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/./i" FROM ConfigSettings WHERE Name="patientNameRegex";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/./i" FROM ConfigSettings WHERE Name="LegoPhantomRegex";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/./i" FROM ConfigSettings WHERE Name="LivingPhantomRegex";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="showTransferStatus";

-- default statistics settings
INSERT INTO Config (ConfigID, Value) SELECT ID, "radiology_review" FROM ConfigSettings WHERE Name="excludedMeasures";
INSERT INTO Config (ConfigID, Value) SELECT ID, "mri_parameter_form" FROM ConfigSettings WHERE Name="excludedMeasures";

-- default mail settings
INSERT INTO Config (ConfigID, Value) SELECT ID, "no-reply@example.com" FROM ConfigSettings WHERE Name="From";
INSERT INTO Config (ConfigID, Value) SELECT ID, "no-reply@example.com" FROM ConfigSettings WHERE Name="Reply-to";
INSERT INTO Config (ConfigID, Value) SELECT ID, "Produced by LorisDB" FROM ConfigSettings WHERE Name="X-MimeOLE";

INSERT INTO Config (ConfigID, Value) SELECT ID, "S3cret" FROM ConfigSettings WHERE Name="JWTKey";
