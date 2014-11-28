-- Remove the instrument config setting

UPDATE ConfigSettings SET AllowMultiple=1 WHERE Name='excluded_instruments';
UPDATE Config SET ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='excluded_instruments') WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='instrument');
DELETE FROM ConfigSettings WHERE Name='instrument';

-- Remove the header config setting

UPDATE ConfigSettings SET Parent=(SELECT ID FROM (SELECT * FROM ConfigSettings) as x WHERE Name='mail') WHERE Parent=(SELECT ID FROM (SELECT * FROM ConfigSettings) as y WHERE Name='headers');
DELETE FROM ConfigSettings WHERE Name='headers';

-- Add different datatypes to the config settings
ALTER TABLE ConfigSettings MODIFY COLUMN DataType ENUM('text', 'boolean', 'email', 'instrument', 'textarea');

-- boolean

UPDATE ConfigSettings SET DataType='boolean' WHERE Name='additional_user_info';
UPDATE ConfigSettings SET DataType='boolean' WHERE Name='useEDC';
UPDATE ConfigSettings SET DataType='boolean' WHERE Name='multipleSites';
UPDATE ConfigSettings SET DataType='boolean' WHERE Name='useFamilyID';
UPDATE ConfigSettings SET DataType='boolean' WHERE Name='useExternalID';
UPDATE ConfigSettings SET DataType='boolean' WHERE Name='useProband';
UPDATE ConfigSettings SET DataType='boolean' WHERE Name='useProjects';
UPDATE ConfigSettings SET DataType='boolean' WHERE Name='useScreening';
UPDATE ConfigSettings SET DataType='boolean' WHERE Name='showTiming';
UPDATE ConfigSettings SET DataType='boolean' WHERE Name='showPearErrors';
UPDATE ConfigSettings SET DataType='boolean' WHERE Name='showTransferStatus';

-- email

UPDATE ConfigSettings SET DataType='email' WHERE Name='From';
UPDATE ConfigSettings SET DataType='email' WHERE Name='Reply-to';

-- instrument

UPDATE ConfigSettings SET DataType='instrument' WHERE Name='excluded_instruments';
UPDATE ConfigSettings SET DataType='instrument' WHERE Name='DoubleDataEntryInstruments';
UPDATE ConfigSettings SET DataType='instrument' WHERE Name='excludedMeasures';

-- textarea

UPDATE ConfigSettings SET DataType='textarea' WHERE Name='projectDescription';

-- add a label to the config settings

ALTER TABLE ConfigSettings ADD Label varchar(255);

UPDATE ConfigSettings SET Label='Study' WHERE Name='study';
UPDATE ConfigSettings SET Label='Additional user information' WHERE Name='additional_user_info';
UPDATE ConfigSettings SET Label='Study title' WHERE Name='title';
UPDATE ConfigSettings SET Label='Study logo' WHERE Name='studylogo';
UPDATE ConfigSettings SET Label='Use EDC' WHERE Name='useEDC';
UPDATE ConfigSettings SET Label='Minimum candidate age' WHERE Name='ageMin';
UPDATE ConfigSettings SET Label='Maximum candidate age' WHERE Name='ageMax';
UPDATE ConfigSettings SET Label='Multiples sites' WHERE Name='multipleSites';
UPDATE ConfigSettings SET Label='Use family' WHERE Name='useFamilyID';
UPDATE ConfigSettings SET Label='Project start year' WHERE Name='startYear';
UPDATE ConfigSettings SET Label='Project end year' WHERE Name='endYear';
UPDATE ConfigSettings SET Label='Use external ID' WHERE Name='useExternalID';
UPDATE ConfigSettings SET Label='Use proband' WHERE Name='useProband';
UPDATE ConfigSettings SET Label='Use projects' WHERE Name='useProjects';
UPDATE ConfigSettings SET Label='Use screening' WHERE Name='useScreening';
UPDATE ConfigSettings SET Label='Excluded instruments' WHERE Name='excluded_instruments';
UPDATE ConfigSettings SET Label='Double data entry instruments' WHERE Name='DoubleDataEntryInstruments';
UPDATE ConfigSettings SET Label='Paths' WHERE Name='paths';
UPDATE ConfigSettings SET Label='Images' WHERE Name='imagePath';
UPDATE ConfigSettings SET Label='Base' WHERE Name='base';
UPDATE ConfigSettings SET Label='Data' WHERE Name='data';
UPDATE ConfigSettings SET Label='External libraries' WHERE Name='extLibs';
UPDATE ConfigSettings SET Label='MINC files' WHERE Name='mincPath';
UPDATE ConfigSettings SET Label='Downloads' WHERE Name='DownloadPath';
UPDATE ConfigSettings SET Label='Logs' WHERE Name='log';
UPDATE ConfigSettings SET Label='Incoming data' WHERE Name='IncomingPath';
UPDATE ConfigSettings SET Label='MRI code' WHERE Name='MRICodePath';
UPDATE ConfigSettings SET Label='GUI' WHERE Name='gui';
UPDATE ConfigSettings SET Label='CSS file' WHERE Name='css';
UPDATE ConfigSettings SET Label='Table rows per page' WHERE Name='rowsPerPage';
UPDATE ConfigSettings SET Label='Show page load timing' WHERE Name='showTiming';
UPDATE ConfigSettings SET Label='Show PEAR errors' WHERE Name='showPearErrors';
UPDATE ConfigSettings SET Label='WWW' WHERE Name='www';
UPDATE ConfigSettings SET Label='Host' WHERE Name='host';
UPDATE ConfigSettings SET Label='Main project URL' WHERE Name='url';
UPDATE ConfigSettings SET Label='Bug tracker URL' WHERE Name='mantis_url';
UPDATE ConfigSettings SET Label='Dashboard' WHERE Name='dashboard';
UPDATE ConfigSettings SET Label='Project Description' WHERE Name='projectDescription';
UPDATE ConfigSettings SET Label='Target number of participants' WHERE Name='recruitmentTarget';
UPDATE ConfigSettings SET Label='DICOM archive' WHERE Name='dicom_archive';
UPDATE ConfigSettings SET Label='Patient ID regex' WHERE Name='patientIDRegex';
UPDATE ConfigSettings SET Label='Patient name regex' WHERE Name='patientNameRegex';
UPDATE ConfigSettings SET Label='Lego phantom regex' WHERE Name='LegoPhantomRegex';
UPDATE ConfigSettings SET Label='Living phantom regex' WHERE Name='LivingPhantomRegex';
UPDATE ConfigSettings SET Label='Show transfer status' WHERE Name='showTransferStatus';
UPDATE ConfigSettings SET Label='Statistics' WHERE Name='statistics';
UPDATE ConfigSettings SET Label='Excluded measures' WHERE Name='excludedMeasures';
UPDATE ConfigSettings SET Label='Mail' WHERE Name='mail';
UPDATE ConfigSettings SET Label='From' WHERE Name='From';
UPDATE ConfigSettings SET Label='Reply-to' WHERE Name='Reply-to';
UPDATE ConfigSettings SET Label='X-MimeOLE' WHERE Name='X-MimeOLE';

-- Add order number to config settings

ALTER TABLE ConfigSettings ADD OrderNumber int(11);

UPDATE ConfigSettings SET OrderNumber=1 WHERE Name='study';
UPDATE ConfigSettings SET OrderNumber=2 WHERE Name='paths';
UPDATE ConfigSettings SET OrderNumber=3 WHERE Name='gui';
UPDATE ConfigSettings SET OrderNumber=4 WHERE Name='www';
UPDATE ConfigSettings SET OrderNumber=5 WHERE Name='dashboard';
UPDATE ConfigSettings SET OrderNumber=6 WHERE Name='dicom_archive';
UPDATE ConfigSettings SET OrderNumber=7 WHERE Name='statistics';
UPDATE ConfigSettings SET OrderNumber=8 WHERE Name='mail';

UPDATE ConfigSettings SET OrderNumber=1 WHERE Name='title';
UPDATE ConfigSettings SET OrderNumber=2 WHERE Name='studylogo';
UPDATE ConfigSettings SET OrderNumber=3 WHERE Name='multipleSites';
UPDATE ConfigSettings SET OrderNumber=4 WHERE Name='useProjects';
UPDATE ConfigSettings SET OrderNumber=5 WHERE Name='startYear';
UPDATE ConfigSettings SET OrderNumber=6 WHERE Name='endYear';
UPDATE ConfigSettings SET OrderNumber=7 WHERE Name='ageMin';
UPDATE ConfigSettings SET OrderNumber=8 WHERE Name='ageMax';
UPDATE ConfigSettings SET OrderNumber=9 WHERE Name='useProband';
UPDATE ConfigSettings SET OrderNumber=10 WHERE Name='useFamilyID';
UPDATE ConfigSettings SET OrderNumber=11 WHERE Name='useExternalID';
UPDATE ConfigSettings SET OrderNumber=12 WHERE Name='useEDC';
UPDATE ConfigSettings SET OrderNumber=13 WHERE Name='useScreening';
UPDATE ConfigSettings SET OrderNumber=14 WHERE Name='additional_user_info';
UPDATE ConfigSettings SET OrderNumber=15 WHERE Name='excluded_instruments';
UPDATE ConfigSettings SET OrderNumber=16 WHERE Name='DoubleDataEntryInstruments';

UPDATE ConfigSettings SET OrderNumber=1 WHERE Name='imagePath';
UPDATE ConfigSettings SET OrderNumber=2 WHERE Name='base';
UPDATE ConfigSettings SET OrderNumber=3 WHERE Name='data';
UPDATE ConfigSettings SET OrderNumber=4 WHERE Name='extLibs';
UPDATE ConfigSettings SET OrderNumber=5 WHERE Name='mincPath';
UPDATE ConfigSettings SET OrderNumber=6 WHERE Name='DownloadPath';
UPDATE ConfigSettings SET OrderNumber=7 WHERE Name='log';
UPDATE ConfigSettings SET OrderNumber=8 WHERE Name='IncomingPath';
UPDATE ConfigSettings SET OrderNumber=9 WHERE Name='MRICodePath';

UPDATE ConfigSettings SET OrderNumber=1 WHERE Name='css';
UPDATE ConfigSettings SET OrderNumber=2 WHERE Name='rowsPerPage';
UPDATE ConfigSettings SET OrderNumber=3 WHERE Name='showTiming';
UPDATE ConfigSettings SET OrderNumber=4 WHERE Name='showPearErrors';

UPDATE ConfigSettings SET OrderNumber=1 WHERE Name='host';
UPDATE ConfigSettings SET OrderNumber=2 WHERE Name='url';
UPDATE ConfigSettings SET OrderNumber=3 WHERE Name='mantis_url';

UPDATE ConfigSettings SET OrderNumber=1 WHERE Name='projectDescription';
UPDATE ConfigSettings SET OrderNumber=2 WHERE Name='recruitmentTarget';

UPDATE ConfigSettings SET OrderNumber=1 WHERE Name='patientIDRegex';
UPDATE ConfigSettings SET OrderNumber=2 WHERE Name='patientNameRegex';
UPDATE ConfigSettings SET OrderNumber=3 WHERE Name='LegoPhantomRegex';
UPDATE ConfigSettings SET OrderNumber=4 WHERE Name='LivingPhantomRegex';
UPDATE ConfigSettings SET OrderNumber=5 WHERE Name='showTransferStatus';

UPDATE ConfigSettings SET OrderNumber=1 WHERE Name='excludedMeasures';

UPDATE ConfigSettings SET OrderNumber=1 WHERE Name='From';
UPDATE ConfigSettings SET OrderNumber=2 WHERE Name='Reply-to';
UPDATE ConfigSettings SET OrderNumber=3 WHERE Name='X-MimeOLE';

-- Updating descriptions

UPDATE ConfigSettings SET Description='Settings related to details of the study' WHERE Name='study';
UPDATE ConfigSettings SET Description='Settings that specify directories where LORIS-related files are stored or created. Take care when editing these fields as changing them incorrectly can cause certain modules to lose functionality.' WHERE Name='paths';
UPDATE ConfigSettings SET Description='Settings related to the overall display of LORIS' WHERE Name='gui';
UPDATE ConfigSettings SET Description='Web address settings' WHERE Name='www';
UPDATE ConfigSettings SET Description='Settings that affect the appearance of the dashboard and its charts' WHERE Name='dashboard';
UPDATE ConfigSettings SET Description='DICOM archive settings' WHERE Name='dicom_archive';
UPDATE ConfigSettings SET Description='Statistics module settings' WHERE Name='statistics';
UPDATE ConfigSettings SET Description='Settings that affect emails sent from LORIS' WHERE Name='mail';

UPDATE ConfigSettings SET Description='Full descriptive title of the study' WHERE Name='title';
UPDATE ConfigSettings SET Description='Filename containing logo of the study. File should be located under the htdocs/images/ folder' WHERE Name='studyLogo';
UPDATE ConfigSettings SET Description='Enable if there is there more than one site in the project' WHERE Name='multipleSites';
UPDATE ConfigSettings SET Description='Enable if the study involves more than one project, where each project has multiple cohorts/subprojects' WHERE Name='useProjects';
UPDATE ConfigSettings SET Description='Enable for proband data collection' WHERE Name='useProband';
UPDATE ConfigSettings SET Description='Enable if family members are recruited for the study' WHERE Name='useFamilyID';
UPDATE ConfigSettings SET Description='Enable if data is used for blind data distribution, or from external data sources' WHERE Name='useExternalID';
UPDATE ConfigSettings SET Description='Use EDC (Expected Date of Confinement) if the study uses neonatals for birthdate estimations' WHERE Name='useEDC';
UPDATE ConfigSettings SET Description='Enable if there is a Screening stage with its own distinct instruments, administered before the Visit stage' WHERE Name='useScreening';

UPDATE ConfigSettings SET Description='Path to Imaging Browser files' WHERE Name='imagePath';
UPDATE ConfigSettings SET Description='The base filesystem path where LORIS is installed' WHERE Name='base';

UPDATE ConfigSettings SET Description='CSS file used for rendering (default main.css)' WHERE Name='css';

UPDATE ConfigSettings SET Description='Main project URL where LORIS can be accessed' WHERE Name='url';

UPDATE ConfigSettings SET Description='Description of the project that will be displayed on the dashboard' WHERE Name='projectDescription';

UPDATE ConfigSettings SET Description='Excluded measures' WHERE Name='excludedMeasures';

-- Update the help

UPDATE help SET content='The Configuration Module allows you to edit configuration settings from the front end. The configuration values are stored in the database, instead of in the config.xml file. Any settings that are not currently in the Configuration Module can still be found and edited from the config.xml file.\r\n\r\nTo edit any configuration settings, navigate to the field that you\'d like to edit in the module, and edit or insert a new value.\r\n\r\nSome configuration settings can accept multiple values. For these settings, you can add additional fields by pressing the "Add Field" button. This will create an empty form area where you can insert new values. You can delete any of the settings by pressing the red delete button attached to the form.\r\n\r\nPress the submit button at the bottom of the page to save your changes. You must press the submit button that is on the page where you are making the changes for the changes to be stored in the database. If you press the submit button on another configuration page, it will not store any changes made on other pages.\r\n\r\nCare should be taken when editing the fields as there is currently no way to revert changes. You can reset the form to its values on page load by pressing the reset button. However, this will not undo any changes made before the submit button has been pressed.' WHERE hash=md5('configuration');