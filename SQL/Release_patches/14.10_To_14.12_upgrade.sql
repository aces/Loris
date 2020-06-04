INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) 
SELECT 'Data Integrity Flag', 'main.php?test_name=data_integrity_flag', ID, 3 from LorisMenu WHERE Label = 'Tools';

INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID 
FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_integrity_flag' AND m.Label='Data Integrity Flag';

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) 
SELECT 'Instrument Manager', 'main.php?test_name=instrument_manager', ID, 4 from LorisMenu WHERE Label = 'Admin';

INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID 
FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='superuser' AND m.Label='Instrument Manager';

UPDATE help SET content = "Data Team Helper' allows the users to find out what the outstanding behaviourial feedbacks, conflicts and incompleted forms for the given candidate/field/instrument by filtering for the given visit-Label and Instrument.
This module will also display the 'Single Data_entry Completion Percentage' for the given visit and instrument, only if the instrument is selected.\n\r
The resulting table:\n
- displays all fields from the selected instrument (or All Instruments if this feature was chosen) for the specified visit. \n
- Under the column 'Names (Instrument_Fieldname)', the given field name is clickable which allows the user to download the data for the given field/instrument in the .csv format, containing the data and data_entry (i.e complete, in_pregress or null)  for every candidate for the given field and visit.\n
- The 'Link to Bvl Feedback' column contains links to pop-up feedback window, where feedback for a particular field and candidate was previously entered, based on the field-name. If such information was never entered, users will see “N/A”. \n
- For existing links to behavioural feedback, the corresponding status for this field will be listed under the column 'Feedback Status'. \n
- Any candidates with conflicts between initial and double data entry will be listed under the 'Conflicts' column. Clicking on the candidate’s link will open up a new tab, directing the user to the Conflict Resolver for the corresponding field and visit label for that candidate. \n
- A list of candidates for which data entry is incomplete for that particular instrument and visit label will be listed under 'Incomplete Candidates'. The ID of each candidate listed is a link to that candidate’s data entry page.\n" where topic = 'Data Team Helper';

DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name="columnThreshold");

DELETE FROM ConfigSettings WHERE Name="columnThreshold";

UPDATE ConfigSettings SET Description="Logo of the study. File should be located under the /var/www/$projectname/htdocs/images/ folder" WHERE Name="studyLogo";

UPDATE ConfigSettings SET Description="Study involves more than one project, where each project has multiple cohorts/subprojects" WHERE Name="useProjects";

UPDATE ConfigSettings SET Description="Use Screening stage with its own distinct instruments, administered before the Visit stage" WHERE Name="useScreening";

UPDATE ConfigSettings SET Description="Instruments to be excluded from the Data Dictionary and the Data Query tool" WHERE Name="excluded_instruments";

UPDATE ConfigSettings SET Description="Instrument (test name e.g. hand_preference)" WHERE Name="instrument";

UPDATE ConfigSettings SET Description="Instruments for which double data entry should be enabled (test name e.g. hand_preference)" WHERE Name="DoubleDataEntryInstruments";

UPDATE ConfigSettings SET Description="Path to logs (relative path starting from /var/www/$projectname)" WHERE Name="log";

UPDATE ConfigSettings SET Description="Regex for masking the patient ID" WHERE Name="patientIDRegex";

UPDATE ConfigSettings SET Description="Regex for masking the patient name" WHERE Name="patientNameRegex";

UPDATE ConfigSettings SET Description="Regex for identifying a Lego Phantom scan header" WHERE Name="LegoPhantomRegex";

UPDATE ConfigSettings SET Description="Regex for identifying a Living Phantom scan header" WHERE Name="LivingPhantomRegex";

UPDATE ConfigSettings SET Description="Excluded measures (test name e.g. hand_preference)" WHERE Name="excludedMeasures";
UPDATE permissions SET code="imaging_browser_qc", description="Edit imaging browser QC status" WHERE code="mri_feedback";
INSERT INTO permissions (code, description, categoryID) VALUES ("imaging_browser_view_site",     "View own-site Imaging Browser pages",  2);
INSERT INTO permissions (code, description, categoryID) VALUES ("imaging_browser_view_allsites", "View all-sites Imaging Browser pages", 2);
INSERT INTO user_perm_rel (userID, permID) SELECT 1, permID FROM permissions WHERE code="imaging_browser_view_site";
INSERT INTO user_perm_rel (userID, permID) SELECT 1, permID FROM permissions WHERE code="imaging_browser_view_allsites";
DELETE FROM permissions WHERE code IN ('mri_efax', 'mri_safety');
CREATE TABLE StatisticsTabs(
    ID INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    ModuleName varchar(255) NOT NULL,
    SubModuleName varchar(255) NOT NULL,
    Description varchar(255),
    OrderNo INTEGER DEFAULT NULL,
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Stores list of tabs for the statistics module';

INSERT INTO StatisticsTabs (ModuleName, SubModuleName, Description, OrderNo) VALUES
('statistics', 'stats_general', 'General Description', 1),
('statistics', 'stats_demographic', 'Demographic Statistics', 2),
('statistics', 'stats_behavioural', 'Behavioural Statistics', 3),
('statistics', 'stats_reliability', 'Reliability Statistics', 4),
('statistics', 'stats_MRI', 'Imaging Statistics', 5);

-- Intensity comments
UPDATE feedback_mri_comment_types SET CommentName="Intensity artifact",CommentStatusField='a:2:{s:5:\"field\";s:9:\"Intensity_artifact\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"Good\";i:2;s:4:\"Fair\";i:3;s:4:\"Poor\";i:4;s:12:\"Unacceptable\";}}' WHERE CommentName="Intensity";
UPDATE parameter_type SET Name='Intensity_artifact' WHERE Name="Intensity";
INSERT INTO feedback_mri_predefined_comments (CommentTypeID,Comment) 
VALUES ((SELECT CommentTypeID FROM feedback_mri_comment_types WHERE CommentName='Intensity artifact'),"susceptibility artifact due to anatomy");

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
INSERT INTO permissions (code, description, categoryID) VALUES ("dicom_archive_view_allsites", "Across all sites view Dicom Archive module and pages", 2);

UPDATE permissions SET code="violated_scans_view_allsites", description="Violated Scans: View all-sites Violated Scans" WHERE code="violated_scans";
UPDATE permissions SET code="violated_scans_edit", description="Violated Scans: Edit MRI protocol table" WHERE code="violated_scans_modifications";

-- Description updates

UPDATE ConfigSettings SET Description='Start year for study recruitment or data collection' WHERE Name='startYear';
UPDATE ConfigSettings SET Description='End year for study recruitment or data collection' WHERE Name='endYear';
UPDATE ConfigSettings SET Description='Use EDC (Expected Date of Confinement) for birthdate estimations if the study involves neonatals' WHERE Name='useEDC';
UPDATE ConfigSettings SET Description='Display additional user profile fields on the User accounts page (e.g. Institution, Position, Country, Address)' WHERE Name='additional_user_info';
UPDATE ConfigSettings SET Description='Instruments to be excluded from the Data Dictionary and download via the Data Query Tool' WHERE Name='excluded_instruments';
UPDATE ConfigSettings SET Description='Specify directories where LORIS-related files are stored or created. Take care when editing these fields as changing them incorrectly can cause certain modules to lose functionality.' WHERE Name='paths';
UPDATE ConfigSettings SET Description='Path for imaging data transferred to the project server (e.g. /data/incoming/$project/)' WHERE Name='IncomingPath';
UPDATE ConfigSettings SET Description='Path to directory where Loris-MRI (git) code is installed' WHERE Name='MRICodePath';
UPDATE ConfigSettings SET Description='Path to main imaging data directory (e.g. /data/$project/data/)' WHERE Name='data';
UPDATE ConfigSettings SET Description='Path to MINC files (e.g. /data/$project/data/)' WHERE Name='mincPath';
UPDATE ConfigSettings SET Description='Path to images for display in Imaging Browser (e.g. /data/$project/data/)' WHERE Name='imagePath';
UPDATE ConfigSettings SET Description='Number of table rows to display per page' WHERE Name='rowsPerPage';
UPDATE ConfigSettings SET Description='Main URL where LORIS can be accessed' WHERE Name='url';
UPDATE ConfigSettings SET Description='Description of the study displayed in main dashboard panel' WHERE Name='projectDescription';
UPDATE ConfigSettings SET Description='DICOM Archive settings' WHERE Name='dicom_archive';
UPDATE ConfigSettings SET Description='Regex for masking the Patient ID header field' WHERE Name='patientIDRegex';
UPDATE ConfigSettings SET Description='Regex for masking the Patient Name header field' WHERE Name='patientNameRegex';
UPDATE ConfigSettings SET Description='Show transfer status in the DICOM Archive table' WHERE Name='showTransferStatus';
UPDATE ConfigSettings SET Description='Instruments to be excluded from Statistics calculations' WHERE Name='excludedMeasures';
UPDATE ConfigSettings SET Description='LORIS email settings for notifications sent to users' WHERE Name='mail';
UPDATE ConfigSettings SET Description='Sender email address header (e.g. admin@myproject.loris.ca)' WHERE Name='From';
UPDATE ConfigSettings SET Description='Reply-to email address header (e.g. admin@myproject.loris.ca)' WHERE Name='Reply-to';

-- Label updates

UPDATE ConfigSettings SET Label='Start year' WHERE Name='startYear';
UPDATE ConfigSettings SET Label='End year' WHERE Name='endYear';
UPDATE ConfigSettings SET Label='LORIS-MRI code' WHERE Name='MRICodePath';
UPDATE ConfigSettings SET Label='Imaging data' WHERE Name='data';
UPDATE ConfigSettings SET Label='Main Loris URL' WHERE Name='url';
UPDATE ConfigSettings SET Label='DICOM Archive' WHERE Name='dicom_archive';
UPDATE ConfigSettings SET Label='Excluded instruments' WHERE Name='excludedMeasures';
UPDATE ConfigSettings SET Label='Email' WHERE Name='mail';

-- Order Number updates

UPDATE ConfigSettings SET OrderNumber=1 WHERE Name='base';
UPDATE ConfigSettings SET OrderNumber=2 WHERE Name='log';
UPDATE ConfigSettings SET OrderNumber=3 WHERE Name='extLibs';
UPDATE ConfigSettings SET OrderNumber=4 WHERE Name='DownloadPath';
UPDATE ConfigSettings SET OrderNumber=5 WHERE Name='IncomingPath';
UPDATE ConfigSettings SET OrderNumber=6 WHERE Name='MRICodePath';
UPDATE ConfigSettings SET OrderNumber=7 WHERE Name='data';
UPDATE ConfigSettings SET OrderNumber=8 WHERE Name='mincPath';
UPDATE ConfigSettings SET OrderNumber=9 WHERE Name='imagePath';

-- Add user & menu permissions for Reliability.  These should be granted/populated in user_perm_rel on a per-user basis
INSERT INTO permissions (code, description, categoryID) VALUES ("reliability_edit_all",     "Access and Edit all Reliability profiles",  2);
INSERT INTO permissions (code, description, categoryID) VALUES ("reliability_swap_candidates", "Swap Reliability candidates across all sites", 2);

-- Add permissions for Instrument Builder.  These should be granted/populated in user_perm_rel on a per-user basis
INSERT INTO permissions (code, description, categoryID) VALUES ("instrument_builder", "Instrument Builder: Create and Edit instrument forms", 2);

-- update Menu permissions for Instrument Builder, first removing any previous menu permissions for this module
DELETE FROM LorisMenuPermissions WHERE MenuID IN (SELECT m.ID FROM LorisMenu m WHERE m.Label='Instrument Builder'); 
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='instrument_builder' AND m.Label='Instrument Builder'; 

-- update Data Dictionary view permission
UPDATE permissions SET code="data_dict_view", description="View Data Dictionary (Parameter type descriptions)" WHERE  code="data_dict" ; 

-- data_dict_edit --> add for all users w 'unsend to dcc' permission  
INSERT INTO permissions (code, description, categoryID) VALUES ("data_dict_edit", "Edit Data Dictionary", 2);
INSERT INTO user_perm_rel (userID, permID) SELECT upr.userID, p2.permID from permissions p, user_perm_rel upr, permissions p2 WHERE p2.code="data_dict_edit" AND  p.code='data_dict_view' and p.permID=upr.permID; 

-- update Menu permissions for Data Dictionary, first removing any previous menu permissions for this module 
DELETE FROM LorisMenuPermissions WHERE MenuID IN (SELECT m.ID FROM LorisMenu m WHERE m.Label='Data Dictionary'); 
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_dict_view' AND m.Label='Data Dictionary'; 

-- data_team_helper --> add for all users w 'data entry' permission  
INSERT INTO permissions (code, description, categoryID) VALUES ("data_team_helper", "Data Team Helper", 2);
INSERT INTO user_perm_rel (userID, permID) SELECT upr.userID, p2.permID from permissions p, user_perm_rel upr, permissions p2 WHERE p2.code="data_team_helper" AND  p.code='data_entry' and p.permID=upr.permID; 

-- update menu permissions for Data Team Helper 
DELETE FROM LorisMenuPermissions WHERE MenuID IN (SELECT m.ID FROM LorisMenu m WHERE m.Label='Data Team Helper'); 
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_team_helper' AND m.Label='Data Team Helper'; 

-- candidate_parameter_view : add for all users w 'data_entry' permission
INSERT INTO permissions (code, description, categoryID) VALUES ("candidate_parameter_view", "View Candidate Parameters", 2);
INSERT INTO user_perm_rel (userID, permID) SELECT upr.userID, p2.permID from permissions p, user_perm_rel upr, permissions p2 WHERE p2.code="candidate_parameter_view" AND  p.code='data_entry' and p.permID=upr.permID; 

-- candidate_parameter_edit : add for all users w 'unsend to dcc' permission
INSERT INTO permissions (code, description, categoryID) VALUES ("candidate_parameter_edit", "Edit Candidate Parameters", 2);
INSERT INTO user_perm_rel (userID, permID) SELECT upr.userID, p2.permID from permissions p, user_perm_rel upr, permissions p2 WHERE p2.code="candidate_parameter_edit" AND  p.code='unsend_to_dcc' and p.permID=upr.permID; 

-- update all permissions for Admin user 
INSERT IGNORE INTO `user_perm_rel` (userID, permID) SELECT DISTINCT 1, permID FROM permissions;

ALTER TABLE final_radiological_review ADD COLUMN Review_Done2_val enum ('yes','no','not_answered');
UPDATE final_radiological_review SET Review_Done2_val = 'no' WHERE Review_Done2 = 0;
UPDATE final_radiological_review SET Review_Done2_val = 'yes' WHERE Review_Done2 = 1;
ALTER TABLE final_radiological_review DROP Review_Done2;
ALTER TABLE final_radiological_review ADD COLUMN Review_Done2 enum ('yes','no','not_answered');
UPDATE final_radiological_review SET Review_Done2 = 'yes' WHERE Review_Done2_val = 'yes';
UPDATE final_radiological_review SET Review_Done2 = 'no' WHERE Review_Done2_val = 'no';
ALTER TABLE final_radiological_review DROP Review_Done2_val;

CREATE TABLE `final_radiological_review_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `col` varchar(255) NOT NULL DEFAULT '',
  `old` text,
  `new` text,
  `CommentID` varchar(255),
  `changeDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userID` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO final_radiological_review_history (col, old, new, CommentID, changeDate, userID) SELECT col, old, new, primaryVals, changeDate, userID FROM history WHERE tbl='final_radiological_review';
DELETE FROM final_radiological_review_history WHERE col IN ('password', 'login','username');

UPDATE document_repository
SET Data_dir =  if (
                    locate('../document_repository/', data_dir) = 1, 
                    substr(data_dir,length('../document_repository/')+1),
                    data_dir
                );

UPDATE history SET new=md5(new) WHERE col='password';
