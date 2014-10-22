--
-- study
--

-- study
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('study', 'Study variables', 1, 0);

-- additional_user_info
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'additional_user_info', 'Display additional user fields in User Accounts page', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- title
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'title', 'Descriptive study title', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- studylogo
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'studylogo', 'Logo of the study', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- columnThreshold
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'columnThreshold', 'Number of columns the quat table will contain', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- useEDC
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'useEDC', 'Use EDC (Expected Date of Confinement) - false unless the study focuses on neonatals for birthdate estimations.', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- ageMin
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'ageMin', 'Minimum candidate age in years (0+)', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- ageMax
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'ageMax', 'Maximum candidate age in years', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- multipleSites
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'multipleSites', 'More than one site in the project', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- useFamilyID
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'useFamilyID', 'Use family ID', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- startYear
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'startYear', "Project's start year", 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- endYear
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'endYear', "Project's end year", 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- useExternalID
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'useExternalID', "Use external ID field - false unless data is used for blind data distribution, or from external data sources", 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- useProband
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'useProband', "Show proband section on the candidate parameter page", 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- useProjects
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'useProjects', "Whether or not study involves more than one project where each project has multiple cohorts/subprojects", 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- useScreening
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'useScreening', "Whether or not there is a screening stage with its own intruments done before the visit stage", 1, 0, 'text', ID FROM ConfigSettings WHERE Name="study";

-- excluded_instruments
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'excluded_instruments', "instruments to be excluded from the data dictionary and the data query tool", 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- instrument
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'instrument', "Instrument to be excluded from the data dictionary and the data query tool", 1, 1, 'text', ID FROM ConfigSettings WHERE Name="excluded_instruments";

-- DoubleDataEntryInstruments
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'DoubleDataEntryInstruments', "Instruments for which double data entry should be enabled", 1, 1, 'text', ID FROM ConfigSettings WHERE Name="study";

--
-- paths
--

-- paths
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('paths', 'Path settings', 1, 0);

-- imagePath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'imagePath', 'Path to images', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- base
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'base', 'Base path', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- data
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'data', 'Path to data', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- extLibs
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'extLibs', 'Path to external libraries', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- mincPath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'mincPath', 'Path to MINC files', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- DownloadPath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'DownloadPath', 'Where files are downloaded', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- log
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'log', 'Path to logs', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- IncomingPath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'IncomingPath', 'Path for data transferred to the project server', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

-- MRICodePath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'MRICodePath', 'Path to MRI code', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="paths";

--
-- gui
--

-- gui
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('gui', 'GUI settings', 1, 0);

-- css
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'css', 'CSS file used for rendering', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="gui";

-- rowsPerPage
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'rowsPerPage', 'Number of table rows to appear, per page', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="gui";

-- showTiming
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'showTiming', 'Show breakdown of timing information for page loading', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="gui";

-- showPearErrors
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'showPearErrors', 'Print PEAR errors', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="gui";

--
-- www
--

-- www
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('www', 'WWW settings', 1, 0);

-- host
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'host', 'Host', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="www";

-- url
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'url', 'Main project URL', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="www";

-- mantis_url
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'mantis_url', 'Bug tracker URL', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="www";

--
-- dashboard
--

-- dashboard
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('dashboard', 'Dashboard settings', 1, 0);

-- projectDescription
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'projectDescription', 'Description of the project that will be displayed in the top panel of the dashboard', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="dashboard";

-- recruitmentTarget
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'recruitmentTarget', 'Target number of participants for the study', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="dashboard";

--
-- dicom_archive
--

-- dicom_archive
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('dicom_archive', 'DICOM archive settings', 1, 0);

-- patientIDRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'patientIDRegex', 'Regex for the patient ID', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="dicom_archive";

-- patientNameRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'patientNameRegex', 'Regex for the patient name', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="dicom_archive";

-- LegoPhantomRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'LegoPhantomRegex', 'Regex to be used on a Lego Phantom scan', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="dicom_archive";

-- LivingPhantomRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'LivingPhantomRegex', 'Regex to be used on Living Phantom scan', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="dicom_archive";

-- showTransferStatus
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'showTransferStatus', 'Show transfer status in the DICOM archive table', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="dicom_archive";

--
-- statistics
--

-- statistics
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('statistics', 'Statistics settings', 1, 0);

-- excludedMeasures
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'excludedMeasures', 'Excluded measures', 1, 1, 'text', ID FROM ConfigSettings WHERE Name="statistics";

--
-- mail
--

-- mail
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('mail', 'Mail settings', 1, 0);

-- headers
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'headers', 'Headers', 1, 0, ID FROM ConfigSettings WHERE Name="mail";

-- From
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'From', 'From', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="headers";

-- Reply-to
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'Reply-to', 'Reply-to', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="headers";

-- X-MimeOLE
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent) SELECT 'X-MimeOLE', 'X-MimeOLE', 1, 0, 'text', ID FROM ConfigSettings WHERE Name="headers";