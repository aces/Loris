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
CREATE TABLE IF NOT EXISTS `violations_resolved` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `hash` varchar(255) NOT NULL,
  `ExtID` bigint(20) NOT NULL,
  `TypeTable` varchar(255) DEFAULT NULL,
  `User` varchar(255) DEFAULT NULL,
  `ChangeDate` datetime DEFAULT NULL,
  `Resolved` enum('unresolved', 'reran', 'emailed', 'inserted', 'rejected', 'inserted_flag', 'other') DEFAULT 'unresolved',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE subproject (
    SubprojectID int(10) unsigned NOT NULL auto_increment,
    title varchar(255) NOT NULL,
    useEDC boolean,
    WindowDifference enum('optimal', 'battery'),
    PRIMARY KEY (SubprojectID)
);

ALTER TABLE tarchive_series ADD Modality ENUM ('MR', 'PT') default NULL;
UPDATE LorisMenu SET Label='Imaging Uploader', Link='main.php?test_name=imaging_uploader' WHERE Link='main.php?test_name=mri_upload';
UPDATE feedback_mri_comment_types SET CommentName='Geometric distortion', CommentStatusField='a:2:{s:5:\"field\";s:20:\"Geometric_distortion\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"Good\";i:2;s:4:\"Fair\";i:3;s:4:\"Poor\";i:4;s:12:\"Unacceptable\";}}' WHERE CommentName='Geometric intensity';

UPDATE feedback_mri_comment_types SET CommentStatusField='a:2:{s:5:"field";s:18:"Intensity_artifact";s:6:"values";a:5:{i:0;s:0:"";i:1;s:4:"Good";i:2;s:4:"Fair";i:3;s:4:"Poor";i:4;s:12:"Unacceptable";}}' WHERE CommentName="Intensity artifact";

UPDATE feedback_mri_comment_types SET CommentStatusField='a:2:{s:5:\"field\";s:30:\"Movement_artifacts_within_scan\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"None\";i:2;s:15:\"Slight Movement\";i:3;s:12:\"Poor Quality\";i:4;s:12:\"Unacceptable\";}}' WHERE CommentName="Movement artifact";

UPDATE feedback_mri_comment_types SET CommentStatusField='a:3:{s:5:\"field\";s:31:\"Movement_artifacts_between_scan\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"None\";i:2;s:15:\"Slight Movement\";i:3;s:12:\"Poor Quality\";i:4;s:12:\"Unacceptable\";}}' WHERE CommentName="Packet movement artifact";
ALTER TABLE feedback_mri_comments DROP COLUMN MRIID, DROP COLUMN PatientName, DROP COLUMN CandID, DROP COLUMN VisitNo;
DELETE cu FROM conflicts_unresolved cu LEFT JOIN flag f ON (cu.CommentId1=f.CommentID) LEFT JOIN session s ON (f.SessionID=s.ID) WHERE s.Current_stage='Recycling Bin';
ALTER TABLE files DROP COLUMN ClassifyAlgorithm;
DELETE cu FROM conflicts_unresolved cu LEFT JOIN flag f ON (cu.CommentId1=f.CommentID) WHERE f.Data_entry='In Progress';
DELETE cu FROM conflicts_unresolved cu LEFT JOIN flag f ON (cu.CommentId2=f.CommentID) WHERE f.Data_entry='In Progress';
ALTER TABLE subproject ADD RecruitmentTarget int(10) unsigned;

CREATE TABLE `Project` (
    `ProjectID` INT(2) NOT NULL,
    `Name` VARCHAR(255) NULL,
    `recruitmentTarget` INT(6) Default NULL,
    PRIMARY KEY (`ProjectID`)
)ENGINE = InnoDB  DEFAULT CHARSET=utf8;
DROP TABLE IF EXISTS `feedback_bvl_types_site`;

update parameter_type SET Name='Geometric_distortion' WHERE Name='Geometric_intensity';
UPDATE permissions SET code='imaging_uploader', description='Imaging Uploader' WHERE code='mri_upload';
UPDATE help SET hash=md5('imaging_uploader') WHERE topic='Imaging Uploader';
ALTER TABLE `Project` CHANGE COLUMN `ProjectID` `ProjectID` INT(2) NOT NULL AUTO_INCREMENT;
DROP TABLE IF EXISTS ExternalLinkTypes;
CREATE TABLE ExternalLinkTypes (
    LinkTypeID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    LinkType varchar(255)
);  
INSERT INTO ExternalLinkTypes (LinkType)
    VALUES ('FooterLink'),
           ('StudyLinks'),
           ('dashboard');

DROP TABLE IF EXISTS ExternalLinks;
CREATE TABLE ExternalLinks (
    LinkID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    LinkTypeID int,
    LinkText varchar(255) NOT NULL,
    LinkURL varchar(255) NOT NULL,
    FOREIGN KEY (LinkTypeID) REFERENCES ExternalLinkTypes(LinkTypeID)
);
INSERT INTO ExternalLinks (LinkTypeID, LinkText, LinkURL) VALUES 
    (1,  'Loris Website', 'http://www.loris.ca'),
    (1,  'GitHub', 'https://github.com/aces'),
    (2,  'Loris Website', 'http://www.loris.ca'),
    (2,  'GitHub', 'https://github.com/aces'),
    (3,  'Loris Website', 'http://www.loris.ca');

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='dicom_archive_view_allsites' AND m.Label='DICOM Archive';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_view_site' AND m.Label='Imaging Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_view_allsites' AND m.Label='Imaging Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_entry' AND m.Label='Statistics';
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='document_repository_view' AND m.Label='Document Repository';
-- Candidate Menu
update LorisMenu SET Link='/candidate_list/' WHERE Link='main.php?test_name=candidate_list';
update LorisMenu SET Link='/new_profile/' WHERE Link='main.php?test_name=new_profile';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='access_all_profiles' AND m.Label='New Profile';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='access_all_profiles' AND m.Label='Access Profile';

-- Clinical Menu
update LorisMenu SET Link='/reliability/' WHERE Link="main.php?test_name=reliability";
update LorisMenu SET Link='/conflict_resolver/' WHERE Link="main.php?test_name=conflict_resolver";
update LorisMenu SET Link='/examiner/' WHERE Link="main.php?test_name=examiner";
update LorisMenu SET Link='/training/' WHERE Link="main.php?test_name=training";

-- Imaging Menu
update LorisMenu SET Link='/final_radiological_review/' WHERE Link="main.php?test_name=final_radiological_review";
update LorisMenu SET Link='/dicom_archive/' WHERE Link="main.php?test_name=dicom_archive";
update LorisMenu SET Link='/imaging_browser/' WHERE Link="main.php?test_name=imaging_browser";
update LorisMenu SET Link='/mri_violations/' WHERE Link="main.php?test_name=mri_violations";
update LorisMenu SET Link='/imaging_uploader/' WHERE Link="main.php?test_name=imaging_uploader";

-- Reports menu
update LorisMenu SET Link='/statistics/' WHERE Link="main.php?test_name=statistics";

-- Tools menu
update LorisMenu SET Link='/datadict/' WHERE Link="main.php?test_name=datadict";
update LorisMenu SET Link='/document_repository/' WHERE Link="main.php?test_name=document_repository";
update LorisMenu SET Link='/data_integrity_flag/' WHERE Link="main.php?test_name=data_integrity_flag";
update LorisMenu SET Link='/data_team_helper/' WHERE Link="main.php?test_name=data_team_helper";
update LorisMenu SET Link='/instrument_builder/' WHERE Link="main.php?test_name=instrument_builder";
update LorisMenu SET Link='/genomic_browser/' WHERE Link="main.php?test_name=genomic_browser";

-- Admin menu
update LorisMenu SET Link='/user_accounts/' WHERE Link="main.php?test_name=user_accounts";
update LorisMenu SET Link='/survey_accounts/' WHERE Link="main.php?test_name=survey_accounts";
update LorisMenu SET Link='/help_editor/' WHERE Link="main.php?test_name=help_editor";
update LorisMenu SET Link='/instrument_manager/' WHERE Link="main.php?test_name=instrument_manager";
update LorisMenu SET Link='/configuration/' WHERE Link="main.php?test_name=configuration";
update LorisMenu SET Link='/server_process_manager/' WHERE Link="main.php?test_name=server_process_manager";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('APIKeys', 'Specify any API keys required for LORIS', 1, 0, 'API Keys', 10);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'JWTKey', 'Secret key for signing JWT tokens on this server. This should be unique and never shared with anyone. ', 1, 0, 'text', ID, 'JWT Secret Key', 9 FROM ConfigSettings WHERE Name="APIKeys";

INSERT INTO Config (ConfigID, Value) SELECT ID, "S3cret" FROM ConfigSettings WHERE Name="JWTKey";
UPDATE LorisMenuPermissions SET PermID = (SELECT permID FROM permissions WHERE code = 'conflict_resolver') 
  WHERE PermID = (SELECT permID FROM permissions where code = 'data_entry') 
  AND MenuId = (SELECT ID FROM LorisMenu WHERE Label = 'Conflict Resolver');
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'StudyDescription', 'Description of the Study', 1, 0, 'textarea', ID , 'Study Description', 2 FROM ConfigSettings WHERE Name="gui";
INSERT INTO Config (ConfigID, Value) SELECT ID, "<h3>Example Study Description</h3>\r\n <p>This is a sample description for this study, because it is a new LORIS install that has not yet customized this text.</p>\r\n <p>A LORIS administrator can customize this text in the configuration module, under the configuration option labeled \"Study Description\"</p>\r\n <h3>Useful Links</h3>\r\n <ul>\r\n <li><a href=\"https://github.com/aces/Loris\" >LORIS GitHub Repository</a></li>\r\n <li><a href=\"https://github.com/aces/Loris/wiki/Setup\" >LORIS Setup Guide</a></li>\r\n <li><a href=\"https://www.youtube.com/watch?v=2Syd_BUbl5A\" >A video of a loris on YouTube</a></li>\r\n </ul>" FROM ConfigSettings WHERE Name="StudyDescription";
DROP TABLE IF EXISTS `acknowledgements`;
CREATE TABLE `acknowledgements` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ordering` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `citation_name` varchar(255) DEFAULT NULL,
  `title` enum('') DEFAULT NULL,
  `affiliations` varchar(255) DEFAULT NULL,
  `degrees` varchar(255) DEFAULT NULL,
  `roles` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `present` enum('Yes', 'No') DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES ('Acknowledgements','/acknowledgements/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 8);

INSERT INTO permissions (code,description,categoryID) VALUES ('acknowledgements_view','View Acknowledgements',2);
INSERT INTO permissions (code,description,categoryID) VALUES ('acknowledgements_edit','Edit Acknowledgements',2);

INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='acknowledgements_view' AND m.Label='Acknowledgements';
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='acknowledgements_edit' AND m.Label='Acknowledgements';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'citation_policy', 'Citation Policy for Acknowledgements module', 1, 0, 'textarea', ID, 'Citation Policy', 22 FROM ConfigSettings WHERE Name="study";

INSERT INTO Config (ConfigID, Value) SELECT ID, "Modify this to your project's citation policy" FROM ConfigSettings WHERE Name="citation_policy";

DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='showTiming');

DELETE FROM ConfigSettings WHERE Name='showTiming';CREATE TABLE empty_queries (
 ID int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
 query text NOT NULL,
 timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE mri_upload CHANGE `Processed` `InsertionComplete` tinyint(1) NOT NULL DEFAULT '0';
ALTER TABLE mri_upload CHANGE `CurrentlyProcessed` `Inserting` tinyint(1) NOT NULL DEFAULT '0';
ALTER TABLE mri_upload CHANGE `IsValidated` `IsCandidateInfoValidated` tinyint(1) DEFAULT NULL;
ALTER TABLE conflicts_unresolved MODIFY COLUMN Value1 text;
ALTER TABLE conflicts_unresolved MODIFY COLUMN Value2 text;
ALTER TABLE conflicts_resolved MODIFY COLUMN OldValue1 text;
ALTER TABLE conflicts_resolved MODIFY COLUMN OldValue2 text;
ALTER TABLE conflicts_resolved MODIFY COLUMN NewValue text;
ALTER TABLE notification_spool add Verbose enum('Y','N') NOT NULL DEFAULT 'N';
UPDATE permissions SET code = 'imaging_uploader' WHERE code = 'imaging_upload';
DELETE FROM Config WHERE ConfigID = (SELECT ID FROM ConfigSettings WHERE Name = 'showPearErrors');
DELETE FROM ConfigSettings WHERE Name = 'showPearErrors';
--
-- Table structure for Genomic Browser table `GWAS`
--
CREATE TABLE `GWAS` (
  `GWASID` int unsigned NOT NULL AUTO_INCREMENT,
  `SNPID` int(20) NOT NULL,
  `rsID` varchar(20) DEFAULT NULL,
  `MajorAllele` enum('A','C','T','G') DEFAULT NULL,
  `MinorAllele` enum('A','C','T','G') DEFAULT NULL,
  `MAF` varchar(20) DEFAULT NULL,
  `Estimate` varchar(20) DEFAULT NULL,
  `StdErr` varchar(20) DEFAULT NULL,
  `Pvalue` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`GWASID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Stores results of Genome-Wide Analysis Study';

--
-- Table structure for table `genomic_files`
--
CREATE TABLE `genomic_files` (
  `GenomicFileID` int unsigned NOT NULL AUTO_INCREMENT,
  `CandID` int(6) NOT NULL DEFAULT '0',
  `VisitLabel` varchar(255) DEFAULT NULL,
  `FileName` varchar(255) NOT NULL,
  `FilePackage` tinyint(1) DEFAULT NULL,
  `Description` varchar(255) NOT NULL,
  `FileType` varchar(255) NOT NULL,
  `FileSize` int(20) NOT NULL,
  `Platform` varchar(255) DEFAULT NULL,
  `Batch` varchar(255) DEFAULT NULL,
  `Source` varchar(255) DEFAULT NULL,
  `Date_taken` date DEFAULT NULL,
  `Category` enum('raw','cleaned','GWAS') DEFAULT NULL,
  `Pipeline` varchar(255) DEFAULT NULL,
  `Algorithm` varchar(255) DEFAULT NULL,
  `Normalization` varchar(255) DEFAULT NULL,
  `SampleID` varchar(255) DEFAULT NULL,
  `AnalysisProtocol` varchar(255) DEFAULT NULL,
  `InsertedByUserID` varchar(255) NOT NULL DEFAULT '',
  `Date_inserted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Caveat` tinyint(1) DEFAULT NULL,
  `Notes` text,
  PRIMARY KEY (`GenomicFileID`),
  KEY `FK_genomic_files_1` (`CandID`),
  CONSTRAINT `FK_genomic_files_1` FOREIGN KEY (`CandID`) REFERENCES `candidate` (`CandID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for Genomic Browser table `SNP_candidate_rel`
--
CREATE TABLE `SNP_candidate_rel` (
  `SNPID` bigint(20) NOT NULL DEFAULT '0',
  `CandID` int(6) NOT NULL DEFAULT '0',
  `ObservedBase` enum('A','C','T','G') DEFAULT NULL,
  `ArrayReport` enum('Normal','Uncertain','Pending') DEFAULT NULL,
  `ArrayReportDetail` varchar(255) DEFAULT NULL,
  `ValidationMethod` varchar(50) DEFAULT NULL,
  `Validated` enum('0','1') DEFAULT NULL,
  `GenotypeQuality` int(4) DEFAULT NULL,
  `PlatformID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`SNPID`,`CandID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT IGNORE INTO SNP_candidate_rel (SNPID, CandID, ObservedBase, ArrayReport, ArrayReportDetail, ValidationMethod, Validated, GenotypeQuality, PlatformID)  SELECT SNPID, CandID, ObservedBase, ArrayReport, ArrayReportDetail, ValidationMethod, Validated, GenotypeQuality, PlatformID FROM SNP;

ALTER TABLE SNP DROP COLUMN ObservedBase, DROP COLUMN ArrayReport, DROP COLUMN ArrayReportDetail, DROP COLUMN ValidationMethod, DROP COLUMN Validated, DROP COLUMN GenotypeQuality, DROP FOREIGN KEY SNP_ibfk_1, DROP COLUMN PlatformID, DROP FOREIGN KEY SNP_ibfk_3, DROP COLUMN CandID, MODIFY COLUMN rsID varchar(20) DEFAULT NULL;

-- Remove any duplicate SNP records, given dropped columns   
CREATE TABLE temp_unique_SNP_records SELECT DISTINCT * from SNP;
DELETE FROM SNP WHERE 1=1; 
INSERT INTO SNP SELECT * FROM temp_unique_SNP_records; 
-- RECOMMENDED: 
-- DROP TABLE temp_unique_SNP_records ; 

-- Add Config setting

INSERT IGNORE INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'GenomicDataPath', 'Path to Genomic data files', 1, 0, 'text', ID, 'Genomic Data Path', 8 FROM ConfigSettings WHERE Name="paths";

INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/Genomic-Data/" FROM ConfigSettings WHERE Name="GenomicDataPath";

CREATE INDEX SessionSubproject ON session (SubprojectID);
CREATE INDEX SessionActive ON session (Active);
CREATE INDEX CandidateActive ON candidate (Active);

CREATE INDEX FeedbackCandidate ON feedback_bvl_thread (CandID);

CREATE INDEX CandidateCenterID ON candidate (CenterID);
CREATE INDEX SessionCenterID ON session(CenterID);
INSERT INTO help (parentID, hash, topic, content, updated) VALUES (-1, md5('mri_violations'), 'MRI Protocol Violations', 'The MRI Violations Module has a Selection Filter function to allow users to search for a particular scan that violates MRI protocol. By clicking the button Show Data after selecting certain search options, a box will appear containing all the search results, which are organized by Patient Name, Project, Subproject, Site, Time Run, MincFile name, MincFile Violated, Series Description Or Scan Type, Problem, and Resolution Status. \n Clicking on a link under the MincFileViolated column will open a pop-up window of the scan in Brainbrowser. \n Clicking on a link under the Problem column will allow the user to see the issues for that particular patient and visit label. The issues are organized by Patient Name, CandID, Visit Label, Scan Type, Severity, Header, Value, ValidRange, ValidRegex, and SeriesUID. \n Once a particular MRI Protocol Violation has been resolved, the Resolution Status can be updated using the drop-down menu to select one of the following options: Reran, Emailed site/pending, Inserted, Rejected, Inserted with flag, Other. Otherwise, the drop-down menu is left as "Unresolved", serving as a message to other users that an issue still exists. \n', '2016-02-23 00:00:00') 
ON DUPLICATE KEY UPDATE content='The MRI Violations Module has a Selection Filter function to allow users to search for a particular scan that violates MRI protocol. By clicking the button Show Data after selecting certain search options, a box will appear containing all the search results, which are organized by Patient Name, Project, Subproject, Site, Time Run, MincFile name, MincFile Violated, Series Description Or Scan Type, Problem, and Resolution Status. \n Clicking on a link under the MincFileViolated column will open a pop-up window of the scan in Brainbrowser. \n Clicking on a link under the Problem column will allow the user to see the issues for that particular patient and visit label. The issues are organized by Patient Name, CandID, Visit Label, Scan Type, Severity, Header, Value, ValidRange, ValidRegex, and SeriesUID. \n Once a particular MRI Protocol Violation has been resolved, the Resolution Status can be updated using the drop-down menu to select one of the following options: Reran, Emailed site/pending, Inserted, Rejected, Inserted with flag, Other. Otherwise, the drop-down menu is left as "Unresolved", serving as a message to other users that an issue still exists. \n';

INSERT INTO help (parentID, hash, topic, content, updated) VALUES (-1, md5('examiner'), 'Examiner', 'The Examiner tab allows the authorized user to add, view, or modify examiners and their certifications. \n To add an examiner, the name and site of the examiner must be specified, as well as whether or not the examiner is a radiologist. \n The Examiner Module has a Selection Filter function to allow users to search for a particular examiner and/or site. By clicking the button Show Data after selecting certain search options, the search results will appear, organized by the blue headers Examiner, Site, Radiologist, and Certification. \n By clicking on an examiner\'s name, the certification for that examiner can be added or modified. To edit certification for an examiner, choose an instrument under the  Instrument header, click the Certification Status drop-down, select the correct Certification Date and enter in any pertinent comments. Any modifications to an examiner\'s certification will appear in the Change Log. \n', '2016-02-23 00:00:00') 
ON DUPLICATE KEY UPDATE content='The Examiner tab allows the authorized user to add, view, or modify examiners and their certifications. \n To add an examiner, the name and site of the examiner must be specified, as well as whether or not the examiner is a radiologist. \n The Examiner Module has a Selection Filter function to allow users to search for a particular examiner and/or site. By clicking the button Show Data after selecting certain search options, the search results will appear, organized by the blue headers Examiner, Site, Radiologist, and Certification. \n By clicking on an examiner\'s name, the certification for that examiner can be added or modified. To edit certification for an examiner, choose an instrument under the  Instrument header, click the Certification Status drop-down, select the correct Certification Date and enter in any pertinent comments. Any modifications to an examiner\'s certification will appear in the Change Log. \n';

INSERT INTO help (parentID, hash, topic, content, updated) VALUES ((SELECT helpID FROM (SELECT * FROM help) AS T WHERE hash=md5('examiner')), md5('edit_examiner'), 'Edit Examiner', 'To edit certification for an examiner, choose an instrument under the  Instrument header, click the Certification Status drop-down, select the correct Certification Date and enter in any pertinent comments. Any modifications to an examiner\'s certification will appear in the Change Log. \n', '2016-02-23 00:00:00') 
ON DUPLICATE KEY UPDATE content='To edit certification for an examiner, choose an instrument under the  Instrument header, click the Certification Status drop-down, select the correct Certification Date and enter in any pertinent comments. Any modifications to an examiner\'s certification will appear in the Change Log. \n';

INSERT INTO help (parentID, hash, topic, content, updated) VALUES (-1, md5('training'), 'Training', 'The Training Module allows users to view training content in three columns: Certifications to Complete, Completed Certifications, and Online Training. \n Certifications to Complete consists of available existing training modules that the user has not yet completed. Completed Certifications allow the user to browse the training content for any of the instruments that the user has already been certified for. Online Training allows the user to access training for certain instruments online.\n', '2016-02-23 00:00:00') 
ON DUPLICATE KEY UPDATE content='The Training Module allows users to view training content in three columns: Certifications to Complete, Completed Certifications, and Online Training. \n Certifications to Complete consists of available existing training modules that the user has not yet completed. Completed Certifications allow the user to browse the training content for any of the instruments that the user has already been certified for. Online Training allows the user to access training for certain instruments online.\n';

INSERT INTO help (parentID, hash, topic, content, updated) VALUES (-1, md5('server_processes_manager'), 'Server Processes Manager', 'The Server Processes Manager displays the jobs that were launched asynchronously on the LORIS website. These jobs are actually Unix processes that run on the LORIS server. Currently, only MRI uploads can be executed this way but future versions of LORIS might include other type of processes. The process table on the Server Processes Manager page lists summary information for each of these processes, namely:<br><br><ul><li>No: LORIS internal ID for the process.</li><li>Pid: the Unix process ID of the command that was launched asynchronously.</li><li>Type: type of process (only mri_upload is currently implemented).</li><li>Stdout file: full Unix path on the LORIS server to the file that contains all output on STDOUT for the given process.</li><li>Stderr file: full Unix path to the file on the LORIS server that contains the ouput on STDERR for the given process.</li><li>Exit code file: full Unix path of the file on the LORIS server that will contain the exit code of the process once it finishes.</li><li>Exit code: Unix exit code for the process. This column will be empty until the process terminates.</li><li>Userid: the LORIS username of the user that launched the asynchronous process.</li><li>Start time: time (on the LORIS server) at which the process was started.</li><li>End time: time (on the LORIS server) at which the process ended. Will be empty until the process finishes (refresh the page to view).</li><li>Exit text: summary text describing the process execution result. Will be empty until the process finishes (refresh the page to view).</li></ul><br>The Server Processes Manager page provides a filter that can be used to display only specific processes. Filtering can be performed based on the pid, type of process or user ID. Finally, note that when a process finishes, all the temporary files used to store the process\' stdout, stderr and exit code will automatically be deleted.\n', '2016-02-23 00:00:00')
ON DUPLICATE KEY UPDATE content='The Server Process Manager displays the jobs that were launched asynchronously on the LORIS website. These jobs are actually Unix processes that run on the LORIS server. Currently, only MRI uploads can be executed this way but future versions of LORIS might include other type of processes. The process table on the Server Processes Manager page lists summary information for each of these processes, namely:<br><br><ul><li>No: LORIS internal ID for the process.</li><li>Pid: the Unix process ID of the command that was launched asynchronously.</li><li>Type: type of process (only mri_upload is currently implemented).</li><li>Stdout file: full Unix path on the LORIS server to the file that contains all output on STDOUT for the given process.</li><li>Stderr file: full Unix path to the file on the LORIS server that contains the ouput on STDERR for the given process.</li><li>Exit code file: full Unix path of the file on the LORIS server that will contain the exit code of the process once it finishes (refresh the page to view).</li><li>Exit code: Unix exit code for the process. This column will be empty until the process terminates (refresh the page to view).</li><li>Userid: the LORIS username of the user that launched the asynchronous process.</li><li>Start time: time (on the LORIS server) at which the process was started.</li><li>End time: time (on the LORIS server) at which the process ended. Will be empty until the process finishes (refresh the page to view).</li><li>Exit text: summary text describing the process execution result. Will be empty until the process finishes (refresh the page to view).</li></ul><br>The Server Processes Manager page provides a filter that can be used to display only specific processes. Filtering can be performed based on the pid, type of process or user ID. Finally, note that when a process finishes, all the temporary files used to store the process\' stdout, stderr and exit code will automatically be deleted.\n';

INSERT INTO help (parentID, hash, topic, content, updated) VALUES (-1, md5('survey_accounts'), 'Survey Accounts',
'The Survey Accounts Module can be used to create a survey form, which creates a unique URL that can either be emailed to the participants to be completed online or loaded as a webpage on a desktop at the site for the participants to fill out during their visit.\r\n This page contains a list of all forms created for direct data entry by study participants. You can filter this list of surveys based on the Visit, Email, PSCID and Instrument. \r\n To create a survey, click on the "Add Survey" button. See additional help on the "Add Survey" page for information on how to create a survey. Once the survey has been created, click on the URL to access the online survey.\r\n Survey Status Information:\r\nCreated: Indicates that the survey was created. This is the default status once a survey is created using the "Add Survey" page.\r\n Sent: Indicates that the survey was created and an email with the survey link was sent to the participant. This is the default status once a survey is created and sent by email using the "Add Survey" window. \r\n In Progress: indicates that the survey was accessed. This status can either be attained when data entry staff click on the URL to load the page for the participants or when participants access the link sent to them via email. \r\n Complete: This indicates that the survey was completed and submitted. After this stage, the participant will not be able to go back and change his/her entries. Clicking on the URL will display a page with the message "Data has already been submitted".', '2016-02-23 00:00:00')
  ON DUPLICATE KEY UPDATE content='The Survey Accounts Module can be used to create a survey form, which creates a unique URL that can either be emailed to the participants to be completed online or loaded as a webpage on a desktop at the site for the participants to fill out during their visit.\r\n This page contains a list of all forms created for direct data entry by study participants. You can filter this list of surveys based on the Visit, Email, PSCID and Instrument. \r\n To create a survey, click on the "Add Survey" button. See additional help on the "Add Survey" page for information on how to create a survey. Once the survey has been created, click on the URL to access the online survey.\r\n Survey Status Information:\r\nCreated: Indicates that the survey was created. This is the default status once a survey is created using the "Add Survey" page.\r\n Sent: Indicates that the survey was created and an email with the survey link was sent to the participant. This is the default status once a survey is created and sent by email using the "Add Survey" window. \r\n In Progress: indicates that the survey was accessed. This status can either be attained when data entry staff click on the URL to load the page for the participants or when participants access the link sent to them via email. \r\n Complete: This indicates that the survey was completed and submitted. After this stage, the participant will not be able to go back and change his/her entries. Clicking on the URL will display a page with the message "Data has already been submitted".';

INSERT INTO help (parentID, hash, topic, content, updated) VALUES (-1, md5('instrument_list'), 'Time-Point Instrument List', 'Once inside a time point, the user will see some general information about the candidate across the top of the screen, such as gender, visit label, and subproject. The status of each particular visit can be viewed in the far left panel, where status can be marked as “Pass”, “Failure”, “Withdrawal”, or “In Progress”. “Send Time Point” is selected by the user to “Send to DCC”, and is the final step in completing data entry for a visit. \r\n The “BVL QC Type” is used to record whether the Behavioural quality control was done on an electronic device or as a hard copy, and the “BVL QC Status” records if quality control has been completed. When viewing a visit in a narrow browser window or mobile device, this panel is hidden. The visit panel contains the Actions Menu, the Visit Stage, the Send Time Point, and QC Information. This menu can be opened for viewing or hidden by selecting the list icon at the top lefthand menu. \r\n\r\n Each time point carries a unique set of tests, also known as instruments. In addition to seeing the names of the instruments contained within each behavioural battery, users can view Administration and Data Entry Status, as well as whether any feedback exists for that particular instrument. Information about Double Data Entry progress can also be found within the behavioural battery table. Click on any instrument name to open the instrument form and perform data entry. Double data entry can be performed by clicking on the "Double Data Entry" link for a given instrument.', '2016-02-23 00:00:00')
ON DUPLICATE KEY UPDATE content='Once inside a time point, the user will see some general information about the candidate across the top of the screen, such as gender, visit label, and subproject. The status of each particular visit can be viewed in the far left panel, where status can be marked as “Pass”, “Failure”, “Withdrawal”, or “In Progress”. “Send Time Point” is selected by the user to “Send to DCC”, and is the final step in completing data entry for a visit. \r\nThe “BVL QC Type” is used to record whether the Behavioural quality control was done on an electronic device or as a hard copy, and the “BVL QC Status” records if quality control has been completed. When viewing a visit in a narrow browser window or mobile device, this panel is hidden. The visit panel contains the Actions Menu, the Visit Stage, the Send Time Point, and QC Information. This menu can be opened for viewing or hidden by selecting the list icon at the top lefthand menu. \r\n\r\nEach time point carries a unique set of tests, also known as instruments. In addition to seeing the names of the instruments contained within each behavioural battery, users can view Administration and Data Entry Status, as well as whether any feedback exists for that particular instrument. Information about Double Data Entry progress can also be found within the behavioural battery table.  Click on any instrument name to open the instrument form and perform data entry. Double data entry can be performed by clicking on the "Double Data Entry" link for a given instrument.';


UPDATE help SET updated='2016-02-12 00:00:00' WHERE hash=md5('mri_violations');
UPDATE help SET updated='2016-02-12 00:00:00' WHERE hash=md5('examiner');
UPDATE help SET updated='2016-02-12 00:00:00' WHERE hash=md5('edit_examiner');
UPDATE help SET updated='2016-02-12 00:00:00' WHERE hash=md5('training');
UPDATE help SET updated='2016-02-12 00:00:00' WHERE hash=md5('server processes manager');
UPDATE help SET updated='2016-02-12 00:00:00' WHERE hash=md5('survey_accounts');
UPDATE help SET updated='2016-02-12 00:00:00' WHERE hash=md5('instrument_list');
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES ('Data Release', '/data_release/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 7);

DROP TABLE IF EXISTS `data_release`;
CREATE TABLE `data_release` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `file_name` varchar(255),
 `version` varchar(255),
 `upload_date` date,
 PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `data_release_permissions`;
CREATE TABLE `data_release_permissions` (
 `userid` int(10) unsigned NOT NULL,
 `data_release_id` int(10) unsigned NOT NULL,
 PRIMARY KEY (`userid`, `data_release_id`),
 KEY `FK_userid` (`userid`),
 KEY `FK_data_release_id` (`data_release_id`),
 CONSTRAINT `FK_userid` FOREIGN KEY (`userid`) REFERENCES `users` (`ID`),
 CONSTRAINT `FK_data_release_id` FOREIGN KEY (`data_release_id`) REFERENCES `data_release` (`id`)
);
UPDATE Config AS c, ConfigSettings AS cs SET c.value="/data/incoming/" WHERE c.ConfigID=cs.ID AND c.Value="/PATH/TO/MRI-Upload/" AND cs.Name="MRIUploadIncomingPath";
-- ALTER files_qcstatus table to add a Selected column
ALTER TABLE files_qcstatus ADD COLUMN Selected VARCHAR(255);

-- UPDATE the Selected column of the files_qcstatus table with values stored in the parameter_file table for the Selected
UPDATE files_qcstatus AS fq, parameter_file AS pf, parameter_type AS pt SET fq.Selected=pf.Value WHERE fq.FileID=pf.FileID AND pf.ParameterTypeID=pt.ParameterTypeID AND Name="Selected";

-- WARNING: be sure the two queries above worked before running the delete statement 
-- Remove all Selected values from parameter_file
-- DELETE FROM parameter_file WHERE ParameterTypeID=(SELECT ParameterTypeID FROM parameter_type WHERE Name='Selected');
-- DELETE FROM parameter_type WHERE Name="Selected";
ALTER TABLE test_battery ADD instr_order tinyint after firstVisit;
ALTER TABLE test_subgroups ADD group_order tinyint after Subgroup_name;
-- Update the Dataquery Menu Link
UPDATE LorisMenu SET Link='/dataquery/' WHERE Label='Data Query Tool';

-- Add Dataquery permission
INSERT INTO permissions (code, description, categoryID) VALUES ('dataquery_view','View Data Query Tool','2');

-- Add menu permission
-- Data Query Tool
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='dataquery_view' AND m.Label='Data Query Tool';INSERT INTO help (parentID, hash, topic, content, updated) VALUES (-1, md5('dataquery'), 'Data Query Tool', 'The Data Query Tool (DQT) is a simple and easy-to-use interface to your LORIS database. The DQT enables users to query and download data.\r\n The DQT can be used to define or use your query by using the following tabs:\r\n Info: \r\n A quick summary of each of the DQT tabs. It also states the time of last data cache update. \r\n\r\n Define Fields \r\n Define the fields to be added to your query here. \r\n\r\n Define Filters \r\n Define the criteria to filter the data for your query here. \r\n\r\n View Data \r\n See the results of your query. \r\n \r\n Statistical Analysis \r\n Visualize or see basic statistical measures from your query here. \r\n\r\n Load Saved Query \r\n Load a previously saved query (by name) by selecting from this menu. \r\n\r\n Manage Saved Queries \r\n Either save your current query or see the criteria of previously saved queries here. \r\n\r\n <b>Define Fields</b>\r\n The \“Define Fields\” tab is where you select the data categories and the specific data fields that you want added to your query. By default, all categories of data fields are displayed in a list when you first enter the tab. If you click on any category, its field names and field descriptions will appear in a table. If the number of fields in the chosen category exceeds the display limit per page, the results may be displayed on subsequent pages within the table, accessible via the page number buttons found by scrolling toward the bottom of the page. Any fields that are defined for the current query are listed on the right-hand side (subject to change). If there are no fields defined for the current query, this list is not shown. Time points can be specified within the field in the \“Define Fields\” tab or in the \“Define Filters\” tab. \r\n\r\n The options to add fields to your query are as follows: \r\n\r\n <u>Option 1:</u> Add Using Dropdown \r\n Fields can be searched for using the list of categories of data fields. After clicking the desired instrument, a list of fields are displayed. Clicking on a field row will highlight it and add it to the list of selected fields for your current query. \r\n\r\n <u>Option 2:</u> Search Within Instrument \r\n Fields can be searched for using the search bar. Once the user starts typing, all matches will be displayed in an active list. Once the desired field is displayed, the field must be clicked to be added into the query. \r\n\r\n <u>Option 3:</u> Add All \r\n If all fields from a particular category should be included in the query, use this method. By clicking the \“Add All\” button above the list of categories, all fields from the category will be added. \r\n\r\n <u>Option 4:</u> Load a Saved Query \r\n To reload a saved query, click on the \"Load Saved Query\" tab. User Saved Queries and Shared Saved Queries will appear in a dropdown. User Saved Queries are queries that the current user has saved, and are listed according to Query Name. Shared Saved Queries are publicly shared, and are listed according to the user who created it and the Query Name. Once a query is selected, the DQT will retrieve and load the query fields and filters that were selected when the query was initially created. This will be displayed under the \“Define Fields\” and \“Define Filters\” tabs, respectively. \r\n\r\n If you wish to remove fields from your query, you must find the field from the list (using the Search Within Instrument search bar or in the instrument list of fields) and click on the highlighted field. This can be confirmed by checking that the field no longer appears in your list of selected fields. \r\n\r\n If you wish to remove all currently selected fields from your query, you can click \“Clear Query\” in the list of Fields. If you wish to remove all fields from a specific category, click the \“Remove All\” button above the list of categories. \r\n\r\n Once all desired fields are listed under \“Fields\”, continue to the \“Define Filters\” tab to add filters to your query, or go directly to the \“View Data\” tab if your query does not require filters. \r\n\r\n <b>Define Filters</b> \r\n The \“Define Filters\” tab is where you define the criteria to filter the data for your query. Filters can be applied on any field in order to limit the set of results returned by a query. For example, you can extract data collected only at one specific site or from a particular visit. Furthermore, multiple filters can be applied with either \“And\” or \“Or\” logic. The filters are candidate specific, no longer time point and candidate specific. \r\n\r\n The data fields are grouped by category. To add a filter, select a category using the dropdown. A second dropdown will appear with all the data fields in that category. Once a data field is specified, dropdowns to specify the \“Operator\” and \“Value\” will appear.  \r\n\r\n Possible operators are as follows: \r\n • = equal to \r\n • != does not equal \r\n • <= less than or equal to \r\n • >= greater than or equal to \r\n • startsWith: filter for values starting with a specific character or string \r\n • contains:  filter for values containing a specific character or string \r\n\r\n To add additional filters, click the \“Add Rule\” button and follow the instructions above. To delete any unwanted filters, click the \“Delete\” button within the specific filter. \r\n\r\n By default, the filters are set to \“And\” logic. Previously, only \"And\" logic was applied. To switch to the \“Or\” logic, click on the \“Or\” button. This sets the operator for the whole group of filters. To add a new group, click the \“Add Group\” button. This allows you to have nested filters with both \“And\” and \“Or\” logical operators. \“And\” indicates that all of its operands are true. \“Or\” indicates inclusive or, which means that one or more of its operands is true. \r\n\r\n <b>View Data</b> \r\n The \“View Data\” tab executes queries, displays query results, and allows users to download data. Select how you want the data to be arranged using the Data dropdown (cross-sectional or longitudinal). Click the \“Run Query\” button to execute the current query on the database based on the defined fields and filters. Results can be also sorted by field by clicking on the table\'s column headers. The number of results displayed per page can be modified using the \“Maximum rows per page dropdown\” at the bottom of the results table. \r\n\r\n After running a query and viewing the results, click the \"Download Table Data as CSV\" button to save the query output dataset to your computer as a comma-separated value file. If any files are included in the query output, click \"Download Data as ZIP\" to save compressed packages of the files and data to your computer. \r\n\r\n The query can also be saved for reuse, to avoid constructing the query from scratch in future. Go to the \“Manage Saved Queries\” tab and then click the \"Save Query\" button. A pop-up dialog will appear. Enter a descriptive query name. If you would like the query to be publicly shared, click on the checkbox. Then click \"Save query\" to complete the process, and the currently defined fields and filters will be saved under the specified query name. \r\n\r\n This saved query should now appear under the \"Manage Saved Queries\" tab in the \“Your currently saved queries\” table. New fields can be selected and saved under the same name to directly update the current query. See the help section for \"Saved Queries\" for further information on actions that can be performed on these previously created queries. \r\n\r\n <b>Manage Saved Queries</b> \r\n The \“Manage Saved Queries\” tab organizes new or previously saved queries. The query name, selected fields and filters for each saved query are displayed in the table. Clicking on any column header (e.g. \"Query Name\") will sort the list by that column. \r\n\r\n The current query can be saved by clicking the \"Save Current Query\" button. A pop-up dialog will appear. Enter a descriptive query name. If you would like the query to be publicly shared, click on the checkbox. Then click \"Save query\" to complete the process, and the currently defined fields and filters will be saved under the specified query name. This saved query should now appear under the \"Manage Saved Queries\" tab in the \“Your currently saved queries\” table. New fields can be selected and saved under the same name to directly update the current query. \r\n\r\n To reload a saved query, click on the \"Load Saved Query\" tab. User Saved Queries and Shared Saved Queries will appear in a dropdown. User Saved Queries are queries that the current user has saved, and are listed according to Query Name. Shared Saved Queries are publicly shared, and are listed according to the user who created it and the Query Name. Once a query is selected, the DQT will retrieve and load the query fields and filters that were selected when the query was initially created. This will be displayed under the \“Define Fields\” and \“Define Filters\” tabs, respectively.  \r\n', '2016-02-23 00:00:00');
ALTER TABLE genotyping_platform ADD UNIQUE (Name);
ALTER TABLE genome_loc ADD UNIQUE KEY (Chromosome, StartLoc, EndLoc);
ALTER TABLE genome_loc ADD INDEX (Chromosome, EndLoc);

DROP TABLE IF EXISTS `genomic_sample_candidate_rel`;
CREATE TABLE `genomic_sample_candidate_rel` (
  `sample_label` varchar(100) NOT NULL,
  `CandID` int(6) NOT NULL,
  PRIMARY KEY (sample_label, CandID),
  UNIQUE KEY `sample_label` (`sample_label`),  
  FOREIGN KEY (CandID)
    REFERENCES candidate(CandID)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8
COMMENT = '';

DROP TABLE IF EXISTS `genomic_cpg_annotation`;
CREATE TABLE `genomic_cpg_annotation` (
  `cpg_name` varchar(100) NOT NULL,
  `location_id` bigint(20) NOT NULL,
  `address_id_a` int unsigned NULL,
  `probe_seq_a` varchar(100) NULL, 
  `address_id_b` int unsigned NULL,
  `probe_seq_b` varchar(100) NULL,
  `design_type` varchar(20) NULL,
  `color_channel` enum ('Red', 'Grn') NULL,
  `genome_build` varchar(40) NULL,
  `probe_snp_10` varchar(40) NULL,
  `gene_name` text NULL,
  `gene_acc_num` text NULL,
  `gene_group` text NULL,
  `island_loc` varchar(100) NULL,
  `island_relation` enum ('island', 'n_shelf', 'n_shore', 's_shelf', 's_shore') NULL, 
  `fantom_promoter_loc` varchar(100) NULL,
  `dmr` enum ('CDMR', 'DMR', 'RDMR') NULL,
  `enhancer` tinyint(1) NULL,
  `hmm_island_loc` varchar(100) NULL,
  `reg_feature_loc` varchar(100) NULL,
  `reg_feature_group` varchar(100) NULL,
  `dhs` tinyint(1) NULL,
  `platform_id` bigint(20) NULL,
  PRIMARY KEY (cpg_name),
  FOREIGN KEY (location_id)
    REFERENCES genome_loc(`GenomeLocID`)
    ON DELETE RESTRICT,
  FOREIGN KEY (platform_id)
    REFERENCES genotyping_platform(`PlatformID`)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8
COMMENT = '';

DROP TABLE IF EXISTS `genomic_cpg`;
CREATE TABLE `genomic_cpg` (
  `sample_label` varchar(100) NOT NULL,
  `cpg_name` varchar(100) NOT NULL,
  `beta_value` decimal(4,3) DEFAULT NULL,
  PRIMARY KEY (sample_label, cpg_name),
  FOREIGN KEY (sample_label)
    REFERENCES genomic_sample_candidate_rel(sample_label)
    ON DELETE RESTRICT,
  FOREIGN KEY (cpg_name)
    REFERENCES genomic_cpg_annotation(cpg_name)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8
COMMENT = '';
CREATE TABLE `genomic_analysis_modality_enum` (
  `analysis_modality` varchar(100),
  PRIMARY KEY (`analysis_modality`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
COMMENT '';

INSERT IGNORE INTO `genomic_analysis_modality_enum` (analysis_modality) VALUES
('Methylation beta-values'),
('Other');

CREATE TABLE `genomic_candidate_files_rel` (
    `CandID` int(6) NOT NULL,
    `GenomicFileID` int(10) unsigned NOT NULL,
    PRIMARY KEY (`CandID`,`GenomicFileID`),
    FOREIGN KEY (CandID) 
        REFERENCES candidate (CandID),
    FOREIGN KEY (GenomicFileID)
        REFERENCES genomic_files (GenomicFileID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO genomic_candidate_files_rel (CandID, GenomicFileID) select CandID, GenomicFileID FROM genomic_files;

ALTER TABLE genomic_files 
    DROP FOREIGN KEY `FK_genomic_files_1`,
    DROP COLUMN `CandID`,
    DROP COLUMN `VisitLabel`,
    ADD COLUMN AnalysisModality varchar(100),
    ADD FOREIGN KEY (AnalysisModality) REFERENCES genomic_analysis_modality_enum (analysis_modality),
    MODIFY `Category` enum('raw','cleaned') DEFAULT NULL;
-- Admin menu
update LorisMenu SET Link='/server_processes_manager/' WHERE Link="main.php?test_name=server_processes_manager";
ALTER TABLE mri_upload CHANGE `Inserting` `Inserting` tinyint(1) DEFAULT NULL;
INSERT INTO help (parentID, hash, topic, content, updated) VALUES (-1, md5('genomic_browser'), 'Genomic Browser', 'The Genomic Browser houses analyzed genetic results and facilitates exploration of these datasets, cross-linked with behavioural and imaging subject data.  Within each tab, all fields or only a selection of Summary fields can be viewed by toggling the Display select box.  One-click download of the current dataview is also available. \r\nThe Profiles tab displays all genetic data stored in Loris per candidate, and enables application of filters including phenotypes. \r\nThe GWAS, SNP, CNV and Methylation tabs enable filtering and exploration of analysis-specific datasets performed on a candidate population.\r\nThe Files tab displays all genetic filesets available for download, and provides upload functionality for Methylation data (16.0). Clicking on a fileset name will load a subpage displaying the metadata available for this file, as well enabling its download. \r\n', '2016-04-07 00:00:00');
-- Create a permission for Genomic file upload
INSERT INTO permissions (code, description, categoryID) VALUE ('genomic_data_manager', 'Manage the genomic files', 2);
-- Give the permission to the admin user
INSERT INTO user_perm_rel (userID, permID) VALUES (1, (select permID from permissions where lower(code) = 'genomic_data_manager'));

UPDATE help set content = "The Genomic Browser houses analyzed genetic results and facilitates exploration of these datasets, cross-linked with behavioural and imaging subject data.  Within each tab, all fields or only a selection of Summary fields can be viewed by toggling the Display select box.  One-click download of the current dataview is also available.
The Profiles tab displays all genetic data and files stored in Loris per candidate, and enables application of filters.
The GWAS, SNP, CNV and Methylation tabs enable filtering and exploration of analysis-specific datasets performed on a candidate population.
The Files tab displays all genetic filesets available for download, and provides upload functionality for Methylation data (LORIS 16.0). Clicking on a fileset name will load a subpage displaying the metadata available for this file, as well enabling its download. " WHERE topic = 'Genomic Browser';

INSERT INTO help (parentID, hash, topic, content, updated) VALUES (-1, md5('imaging_uploader'), 'Imaging Uploader', 'The Imaging Uploader allows users to upload imaging files, typically for an entire imaging session at a time. Please note that files should be in a compressed format (.tgz, .tar.gz, or .zip) and must be labeled properly in order to be uploaded successfully into the database. \r\n\r\nAfter choosing the file to upload, users must input the CandID, PSCID, and Visit Label for this dataset, and then click the "Upload" button. The newly uploaded file will be displayed in the table at the bottom of the page. \r\n\r\nUsers can also use the topmost panel to search for datasets uploaded in the past, y leaving the "File to Upload" field blank, and filling any of the remaining fields such as an ID or visit label, then clicking "Show Data". Results will be displayed in the table at bottom, which can be sorted by columns "CandID", "Visit Label", "Source Location", "Upload Date" and "Uploaded By", as well as by number of Minc files inserted, and number of Minc files created.\r\n\r\nNote that the "Tarchive Info" column contains links to the corresponding DICOM header information for a given imaging dataset, via the DICOM Archive module. Also, to display the current status in the "Progress" column of the uploads table at bottom, you should refresh the page.\r\n\r\nTo view the output of the imaging insertion pipeline for a given uploaded file by selecting its row in the table of uploads at bottom. When you click on a row in the imaging upload table, the panel called "Upload Process Logs" (above the table of uploads) will display the most recent output of the imaging insertion pipeline for that particular file. This display will be refreshed every five seconds. There are two modes for displaying logs: "Detailed", which retrieves everything output by the pipeline and "Summary" which displays only the most important log messages (namely the steps successfully executed by the pipeline).','2016-04-29 00:00:00')
ON DUPLICATE KEY UPDATE content='The Imaging Uploader allows users to upload imaging files, typically for an entire imaging session at a time. Please note that files should be in a compressed format (.tgz, .tar.gz, or .zip) and must be labeled properly in order to be uploaded successfully into the database. \r\n\r\nAfter choosing the file to upload, users must input the CandID, PSCID, and Visit Label for this dataset, and then click the "Upload" button. The newly uploaded file will be displayed in the table at the bottom of the page. \r\n\r\nUsers can also use the topmost panel to search for datasets uploaded in the past, y leaving the "File to Upload" field blank, and filling any of the remaining fields such as an ID or visit label, then clicking "Show Data". Results will be displayed in the table at bottom, which can be sorted by columns "CandID", "Visit Label", "Source Location", "Upload Date" and "Uploaded By", as well as by number of Minc files inserted, and number of Minc files created.\r\n\r\nNote that the "Tarchive Info" column contains links to the corresponding DICOM header information for a given imaging dataset, via the DICOM Archive module. Also, to display the current status in the "Progress" column of the uploads table at bottom, you should refresh the page.\r\n\r\nTo view the output of the imaging insertion pipeline for a given uploaded file by selecting its row in the table of uploads at bottom. When you click on a row in the imaging upload table, the panel called "Upload Process Logs" (above the table of uploads) will display the most recent output of the imaging insertion pipeline for that particular file. This display will be refreshed every five seconds. There are two modes for displaying logs: "Detailed", which retrieves everything output by the pipeline and "Summary" which displays only the most important log messages (namely the steps successfully executed by the pipeline).',
                        updated='2016-04-29 00:00:00';

REPLACE INTO help (parentID, hash, topic, content, updated) VALUES(IFNULL((SELECT h.helpID FROM help as h WHERE h.topic LIKE 'Configuration%'),-1), md5('project'), 'Project', 'You then click on &quot;New ProjectID&quot;, fill in the fields on the right, click save.  Immediately refresh the page to view your new project.  Clicking save more than once will register a duplicate project ID.  If you create an extra ID, you have to delete it from the database manually with an sql command.\n\nDefine all projectID-subprojectID relationships by populating the project_rel table, e.g.\n\nINSERT INTO `project_rel` VALUES (1,1),(1,2),(2,3);', '2016-04-01 00:00:00');
REPLACE INTO help (parentID, hash, topic, content, updated) VALUES(IFNULL((SELECT h.helpID FROM help as h WHERE h.topic LIKE 'Configuration%'),-1), md5('subproject'), 'Subproject', 'You then click on &quot;New SubprojectID&quot;, fill in the fields on the right, click save.  Immediately refresh the page to view your new subproject.  Clicking save more than once will register a duplicate subproject ID.  If you create an extra ID, you have to delete it from the database manually with an sql command.\n\nDefine all projectID-subprojectID relationships by populating the project_rel table, e.g.\n\nINSERT INTO `project_rel` VALUES (1,1),(1,2),(2,3);', '2016-04-01 00:00:00');
UPDATE Config SET Value = LEFT(Value , LENGTH(Value)-1) WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url') AND RIGHT(Value,1) = "/";
UPDATE LorisMenu SET Link = RIGHT(Link, LENGTH(Link)-1) WHERE LEFT(Link,1) = "/";
-- Add 'media' tab to the menu under Clinical section
DELETE FROM LorisMenu WHERE Label='Media';
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES ('Media', 'media/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 5);


-- Add 'media' table
CREATE TABLE IF NOT EXISTS `media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` int(10) unsigned NOT NULL,
  `instrument` varchar(255) DEFAULT NULL,
  `date_taken` date DEFAULT NULL,
  `comments` text,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `data_dir` varchar(255) NOT NULL,
  `uploaded_by` varchar(255) DEFAULT NULL,
  `hide_file` tinyint(1) DEFAULT '0',
  `date_uploaded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`session_id`) REFERENCES `session` (`ID`),
  FOREIGN KEY (`instrument`) REFERENCES `test_names` (`Test_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Add user permissions

-- Upload/Edit/Hide Media Files
SET @uploadPermissionID = (SELECT permID FROM permissions WHERE code='media_write');
INSERT IGNORE INTO permissions (`permID`, `code`, `description`, `categoryID`) VALUES (
    @uploadPermissionID, 'media_write', 'Media files: Uploading/Downloading/Editing', 2
);
INSERT IGNORE INTO user_perm_rel (`userID`, `permID`) VALUES (
  (SELECT ID FROM users WHERE UserID = 'admin'), (SELECT permID FROM permissions WHERE code = 'media_write')
);

-- Browse Media Files
SET @browsePermissionID = (SELECT permID FROM permissions WHERE code='media_read');
INSERT IGNORE INTO permissions (`permID`, `code`, `description`, `categoryID`) VALUES (
    @browsePermissionID, 'media_read', 'Media files: Browsing ', 2
);
INSERT IGNORE INTO user_perm_rel (`userID`, `permID`) VALUES (
  (SELECT ID FROM users WHERE UserID = 'admin'), (SELECT permID FROM permissions WHERE code = 'media_read')
);



-- Set path to upload/download media
SET @parentID = (SELECT ID FROM ConfigSettings WHERE Name = 'paths');
DELETE FROM ConfigSettings WHERE Name='mediaPath';
INSERT INTO ConfigSettings (`Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`) VALUES (
  'mediaPath', 'Path to uploaded media files', 1, 0, 'text', @parentID, 'Media', 10
);

DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='mediaPath');
INSERT INTO Config (`ConfigID`, `Value`) VALUES (
  (SELECT ID FROM ConfigSettings WHERE Name='mediaPath'), '/data/uploads/'
);

INSERT INTO parameter_type (Name, Type, SourceFrom) VALUES ('SNR', 'double', 'parameter_file');
UPDATE Config SET Value="images/neurorgb_web.jpg" WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name="studylogo") AND Value="images/neuro_logo_blue.gif";


-- 2016-05-10-HelpContentFixCharacters.sql
INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('dashboard'),'LORIS HELP: Using the Database','Welcome to the LORIS database. \r\nThis Help section provides you with guidelines for adding and updating information in the database. On each page, click on the question-mark icon in the Menu Bar across the top of the screen to access detailed information specific to the page.\r\n\r\nUpon logging into the LORIS database, the user will come to the home page. Here, key user information can automatically be seen at the right-hand side of the Menu Bar at the top of the screen indicating the user’s name and the site to which the user belongs. To return to the home page at any time, the user can click on the \"LORIS\" button at the far left corner of the Menu Bar.\r\nThe menus spanning horizontally across the Menu Bar represent different categories of features within the database that allow data acquisition, storage, processing and dissemination using the web based interface. Please note that when accessing LORIS via tablet, mobile device, or in a narrow-width desktop browser window, these main menus will be hidden under the downward-pointing arrow icon in the Menu Bar. Clicking on this button will show or hide all main menus in a vertical list.\r\nThere are five main drop-down menus: Candidate, Clinical, Imaging, Reports and Admin. Hover over on each menu to display a list of features or modules, organized by category:\r\n- Candidate: New Profile, Access Profile\r\n- Clinical: Reliability Coding, Conflict Resolver, Certification, Document Repository\r\n- Imaging: Radiological Review, DICOM Archive, Imaging Browser, Imaging Uploader\r\n- Reports: Database Statistics, Data Dictionary, Data Querying Tool, Data Team Helper, Data Integrity Tool\r\n- Admin: User Accounts, Instrument Builder\r\n\r\nOn the right side of the Menu Bar there are two icons linking to the Feedback Module, a pencil on paper icon , and Help, a question mark icon. Each of these modules will open in a new pop-up window, or new tab on a mobile browser.\r\n\r\nAll five main menus, the two icons listed above, the user’s site and the user’s name are accessible from any page in LORIS, via the Menu Bar at the top of the screen. \r\n\r\nTo log out of the database, click on the username displayed at the right edge of the Menu Bar, and select the \"Log Out\" option from the drop-down menu. \r\n\r\nThe \"My Preferences\" feature, also listed in this menu, can be used to update certain user profile settings and change the user’s password. \r\n','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='Welcome to the LORIS database. \r\nThis Help section provides you with guidelines for adding and updating information in the database. On each page, click on the question-mark icon in the Menu Bar across the top of the screen to access detailed information specific to the page.\r\n\r\nUpon logging into the LORIS database, the user will come to the home page. Here, key user information can automatically be seen at the right-hand side of the Menu Bar at the top of the screen indicating the user’s name and the site to which the user belongs. To return to the home page at any time, the user can click on the \"LORIS\" button at the far left corner of the Menu Bar.\r\nThe menus spanning horizontally across the Menu Bar represent different categories of features within the database that allow data acquisition, storage, processing and dissemination using the web based interface. Please note that when accessing LORIS via tablet, mobile device, or in a narrow-width desktop browser window, these main menus will be hidden under the downward-pointing arrow icon in the Menu Bar. Clicking on this button will show or hide all main menus in a vertical list.\r\nThere are five main drop-down menus: Candidate, Clinical, Imaging, Reports and Admin. Hover over on each menu to display a list of features or modules, organized by category:\r\n- Candidate: New Profile, Access Profile\r\n- Clinical: Reliability Coding, Conflict Resolver, Certification, Document Repository\r\n- Imaging: Radiological Review, DICOM Archive, Imaging Browser, Imaging Uploader\r\n- Reports: Database Statistics, Data Dictionary, Data Querying Tool, Data Team Helper, Data Integrity Tool\r\n- Admin: User Accounts, Instrument Builder\r\n\r\nOn the right side of the Menu Bar there are two icons linking to the Feedback Module, a pencil on paper icon , and Help, a question mark icon. Each of these modules will open in a new pop-up window, or new tab on a mobile browser.\r\n\r\nAll five main menus, the two icons listed above, the user’s site and the user’s name are accessible from any page in LORIS, via the Menu Bar at the top of the screen. \r\n\r\nTo log out of the database, click on the username displayed at the right edge of the Menu Bar, and select the \"Log Out\" option from the drop-down menu. \r\n\r\nThe \"My Preferences\" feature, also listed in this menu, can be used to update certain user profile settings and change the user’s password. \r\n';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,NULL,'Instruments - Guide', 'For each instrument in a visit, the user needs to mark Administration as \"All\", \"Partial\" or \"None\" and mark Data Entry as \"Complete\" in order to save the form. If the instrument includes a Validity flag, Validity needs to be marked as \"Valid\", \"Questionable\" or \"Invalid\". \r\nNote the administration status is an indication of whether a particular instrument was conducted at the given time point. Administration, Data Entry status (and Validity, if applicable) can be found within the far left panel. Data Entry is automatically marked as \"In Progress\" once the user opens an instrument form. \r\n\r\nThe \"Top\" or first page of each instrument requires the user to enter the \"Date of Administration\" and \"Examiner\". \"Date of administration\" refers to the date the testing was performed. \"Examiner\" refers to the name of the person that performed the testing.\r\nSome instruments include all fields for data entry in one page, whereas other instruments include questions that have been organized onto different pages. These additional pages can be accessed through the far left panel under the heading \"Subtests\". In order to mark Data Entry as \"Complete\", all items across all pages need to be filled out. After completing data entry for a page, please click the button \"Save Data\", found at the bottom of the page. Any items for which no data is entered in the paper form should be marked as \"Not Answered\" in the database. If this option is selected for any field, a note in golden text will appear indicating \"Any entered data will not be saved\". Additional data entry for fields already marked with \"not_answered\" will also be disabled. \r\n\r\nAfter saving all data for a specific instrument, certain values specific to the instrument will be automatically calculated by the database and will appear on the first page of the form. For instance, \"Candidate Age\" is automatically calculated based on the amount of time that has passed between the \"Date of Administration\" and the Candidate’s Date of Birth (entered when the candidate’s profile was first created).\r\n\r\nOnce data for an instrument have been fully entered, and the \"Administration\" and \"Validity\" have been selected, Data Entry can be marked as \"Complete\" as previously mentioned. It is important to enter data in all required fields, otherwise the database will not allow the user to proceed with data entry completion. When viewing an Instrument Form in a narrow browser window or on a mobile device, the navigation panel typically found to the left is hidden. The instrument navigation panel contains the Administration Menu, the Validity Menu, the Data Entry Menu, and the Subtest Menu. Similar to the visit panel, it can be accessed and hidden by selecting the list icon at the left edge of the Menu Bar.\r\nLastly, the user can return to the visit through the white banner near the top of the screen and clicking \"TimePoint <i>visit</i> Details\". ','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='For each instrument in a visit, the user needs to mark Administration as \"All\", \"Partial\" or \"None\" and mark Data Entry as \"Complete\" in order to save the form. If the instrument includes a Validity flag, Validity needs to be marked as \"Valid\", \"Questionable\" or \"Invalid\". \r\nNote the administration status is an indication of whether a particular instrument was conducted at the given time point. Administration, Data Entry status (and Validity, if applicable) can be found within the far left panel. Data Entry is automatically marked as \"In Progress\" once the user opens an instrument form. \r\n\r\nThe \"Top\" or first page of each instrument requires the user to enter the \"Date of Administration\" and \"Examiner\". \"Date of administration\" refers to the date the testing was performed. \"Examiner\" refers to the name of the person that performed the testing.\r\nSome instruments include all fields for data entry in one page, whereas other instruments include questions that have been organized onto different pages. These additional pages can be accessed through the far left panel under the heading \"Subtests\". In order to mark Data Entry as \"Complete\", all items across all pages need to be filled out. After completing data entry for a page, please click the button \"Save Data\", found at the bottom of the page. Any items for which no data is entered in the paper form should be marked as \"Not Answered\" in the database. If this option is selected for any field, a note in golden text will appear indicating \"Any entered data will not be saved\". Additional data entry for fields already marked with \"not_answered\" will also be disabled. \r\n\r\nAfter saving all data for a specific instrument, certain values specific to the instrument will be automatically calculated by the database and will appear on the first page of the form. For instance, \"Candidate Age\" is automatically calculated based on the amount of time that has passed between the \"Date of Administration\" and the Candidate’s Date of Birth (entered when the candidate’s profile was first created).\r\n\r\nOnce data for an instrument have been fully entered, and the \"Administration\" and \"Validity\" have been selected, Data Entry can be marked as \"Complete\" as previously mentioned. It is important to enter data in all required fields, otherwise the database will not allow the user to proceed with data entry completion. When viewing an Instrument Form in a narrow browser window or on a mobile device, the navigation panel typically found to the left is hidden. The instrument navigation panel contains the Administration Menu, the Validity Menu, the Data Entry Menu, and the Subtest Menu. Similar to the visit panel, it can be accessed and hidden by selecting the list icon at the left edge of the Menu Bar.\r\nLastly, the user can return to the visit through the white banner near the top of the screen and clicking \"TimePoint <i>visit</i> Details\".';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('new_profile'),'New Profile','By clicking on \"New Profile\" under the Candidate Menu, users with appropriate permissions can register a new candidate for their study site. Once inside the \"New Profile\" page, the \"Date of Birth\" field must be entered twice, in order to minimize error in data entry. \r\nThe PSCID refers to an alphanumeric identifier entered by the user. This identifier is typically comprised of a site-specific code (e.g., AAA), followed by a numeric code specific to the candidate at that site (e.g., AAA0000). Other fields are customized for specific projects and can be configured as drop-down fields or user input fields. \r\n\r\nOnce all the required data fields are completed, the user can click on the \"Create\" button to finish registering the candidate. It is crucial that no mistakes in data entry are made at this point, as information cannot be modified after clicking the \"Create\" button. \r\n\r\nEach new candidate will then be assigned a 6 digit numerical DCC-ID. The DCCID, along with the previously entered PSCID, will always be used to identify this candidate.\r\n' ,'2014-09-01 00:00:00', NULL)
ON DUPLICATE KEY UPDATE content='By clicking on \"New Profile\" under the Candidate Menu, users with appropriate permissions can register a new candidate for their study site. Once inside the \"New Profile\" page, the \"Date of Birth\" field must be entered twice, in order to minimize error in data entry. \r\nThe PSCID refers to an alphanumeric identifier entered by the user. This identifier is typically comprised of a site-specific code (e.g., AAA), followed by a numeric code specific to the candidate at that site (e.g., AAA0000). Other fields are customized for specific projects and can be configured as drop-down fields or user input fields. \r\n\r\nOnce all the required data fields are completed, the user can click on the \"Create\" button to finish registering the candidate. It is crucial that no mistakes in data entry are made at this point, as information cannot be modified after clicking the \"Create\" button. \r\n\r\nEach new candidate will then be assigned a 6 digit numerical DCC-ID. The DCCID, along with the previously entered PSCID, will always be used to identify this candidate.\r\n';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('candidate_list'),'Access Profile','In many cases, the candidate`s profile will already be created. The Access Profile module, also found under the Candidate menu, allows the user to efficiently search for an existing candidate and access the related data. \r\n\r\nThere are 3 main ways to search for a candidate:\r\n\r\n<u>Option 1:</u> Using PSC-ID and DCC-ID\r\nA specific candidate profile can be accessed directly by entering both the PSC-ID and the DCC-ID in the white boxes to the right of the screen and then clicking the button \"Open Profile\". In a narrow browser window or mobile device the PSC-ID and DCC-ID fields are found below the selection filter.\r\n\r\n<u>Option 2:</u> Basic Filter Options\r\nUsers may search for particular candidates by selecting from the \"Basic\" filter options. Users may select from drop-down select boxes, and then click \"Show Data\" to view a list of candidates. If only a fragment of the candidate ID is known, the user may search for the profile by entering the known fragment, and then click show data to find the appropriate profile. For example, searching with \"531\" under \"DCCID\" will retrieve the profile of candidate DCC1107 (with full DCCID 531861).\r\n\r\n<u>Option 3:</u> Advanced Filter Options\r\nMore detailed filter options can be accessed by clicking on the \"Advanced\" button. Users will select from a number of drop-down select boxes including Site, Project, Subproject, Gender etc., and then click \"Show Data\" to view a list of candidates. To return to \"Basic\" selection filters please select \"Basic\".\r\n\r\nTo view a specific candidate’s dataset, click on the candidate’s PSCID found in blue text under the \"PSCID\" column. At the top of the table, column headings will appear underlined and show a click icon when the user hovers over the heading title. Data can be sorted in ascending order according to a given column by clicking on the column heading (i.e. DCCID, Site, PSCID etc.), and by clicking again, in descending order. In both standard and mobile view, the selection filter can be hidden by selecting the upward arrow icon, allowing easier viewing of the data. Once in this view, users can click on the downward arrow icon to display the features of the selection filter once again. This feature applies to all pages that include a Selection Filter.\r\nNote that the form remembers previously selected data such that when the user returns to the \"Access Profile\" page, the selection filter will automatically select profiles according to the last selection settings. Depending on the magnitude of the search, there may be several pages of search results for the user to look through. If \"No candidates found\" appears, this indicates no profiles matched the information specified by the selection filter(s). \r\nWhen on a mobile device or narrow browser window, the table will have a slider at the bottom of the table, facilitating scrolling of the data. The user may also hover or click the arrows that flank the table to see the remainder of the table. When scrolling through search results, the PSC-ID column will freeze and remain displayed on the lefthand side, to allow for easy reference and access to relevant information.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='In many cases, the candidate`s profile will already be created. The Access Profile module, also found under the Candidate menu, allows the user to efficiently search for an existing candidate and access the related data. \r\n\r\nThere are 3 main ways to search for a candidate:\r\n\r\n<u>Option 1:</u> Using PSC-ID and DCC-ID\r\nA specific candidate profile can be accessed directly by entering both the PSC-ID and the DCC-ID in the white boxes to the right of the screen and then clicking the button \"Open Profile\". In a narrow browser window or mobile device the PSC-ID and DCC-ID fields are found below the selection filter.\r\n\r\n<u>Option 2:</u> Basic Filter Options\r\nUsers may search for particular candidates by selecting from the \"Basic\" filter options. Users may select from drop-down select boxes, and then click \"Show Data\" to view a list of candidates. If only a fragment of the candidate ID is known, the user may search for the profile by entering the known fragment, and then click show data to find the appropriate profile. For example, searching with \"531\" under \"DCCID\" will retrieve the profile of candidate DCC1107 (with full DCCID 531861).\r\n\r\n<u>Option 3:</u> Advanced Filter Options\r\nMore detailed filter options can be accessed by clicking on the \"Advanced\" button. Users will select from a number of drop-down select boxes including Site, Project, Subproject, Gender etc., and then click \"Show Data\" to view a list of candidates. To return to \"Basic\" selection filters please select \"Basic\".\r\n\r\nTo view a specific candidate’s dataset, click on the candidate’s PSCID found in blue text under the \"PSCID\" column. At the top of the table, column headings will appear underlined and show a click icon when the user hovers over the heading title. Data can be sorted in ascending order according to a given column by clicking on the column heading (i.e. DCCID, Site, PSCID etc.), and by clicking again, in descending order. In both standard and mobile view, the selection filter can be hidden by selecting the upward arrow icon, allowing easier viewing of the data. Once in this view, users can click on the downward arrow icon to display the features of the selection filter once again. This feature applies to all pages that include a Selection Filter.\r\nNote that the form remembers previously selected data such that when the user returns to the \"Access Profile\" page, the selection filter will automatically select profiles according to the last selection settings. Depending on the magnitude of the search, there may be several pages of search results for the user to look through. If \"No candidates found\" appears, this indicates no profiles matched the information specified by the selection filter(s). \r\nWhen on a mobile device or narrow browser window, the table will have a slider at the bottom of the table, facilitating scrolling of the data. The user may also hover or click the arrows that flank the table to see the remainder of the table. When scrolling through search results, the PSC-ID column will freeze and remain displayed on the lefthand side, to allow for easy reference and access to relevant information.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('timepoint_list'),'Candidate Profile','The database facilitates data collection of longitudinal studies; following the same candidates at various intervals for long periods of time. Each candidate may have several time-points stretching the duration of the study. Each time-point will be given a name called a \"Visit Label\". The time-points refer to data collection on different visits for the same candidate. Every time-point contains a subset of data collected in a given time frame with the intention of keeping this subset in a tightly related group. \r\n\r\nA new candidate time-point can be created from the Candidate Profile page by opening a specific profile and clicking \"Create Time Point\" among the Actions buttons visible above the \"List of Visits\" table. Authorized users may also edit general information about the candidate, such as adding comments and updating participant status, by clicking the \"Edit Candidate Info\" button.\r\n\r\nOnce a candidate’s profile has been opened, the PSC-ID and DCC-ID will remain at the top of the screen in white text on a banner for reference. Clicking on the candidate’s IDs in white will return the user to the Candidate Profile. \r\nBelow the candidate’s information, the user will find a list of time points under \"Visit Label (Click to Open)\". Clicking on the time point itself in navy text can open the profile for the candidate at that time point.\r\n','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='The database facilitates data collection of longitudinal studies; following the same candidates at various intervals for long periods of time. Each candidate may have several time-points stretching the duration of the study. Each time-point will be given a name called a \"Visit Label\". The time-points refer to data collection on different visits for the same candidate. Every time-point contains a subset of data collected in a given time frame with the intention of keeping this subset in a tightly related group. \r\n\r\nA new candidate time-point can be created from the Candidate Profile page by opening a specific profile and clicking \"Create Time Point\" among the Actions buttons visible above the \"List of Visits\" table. Authorized users may also edit general information about the candidate, such as adding comments and updating participant status, by clicking the \"Edit Candidate Info\" button.\r\n\r\nOnce a candidate’s profile has been opened, the PSC-ID and DCC-ID will remain at the top of the screen in white text on a banner for reference. Clicking on the candidate’s IDs in white will return the user to the Candidate Profile. \r\nBelow the candidate’s information, the user will find a list of time points under \"Visit Label (Click to Open)\". Clicking on the time point itself in navy text can open the profile for the candidate at that time point.\r\n';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('candidate_parameters'),'Candidate Parameters','The Candidate Parameters Page provides users an opportunity to add important general information about the candidate. There are three sections of the Candidate Parameters Page that can be updated as required by authorized users: \"Candidate Information\", \"Participant Status\", and \"Participation Consent Status\". To return to the Candidate Profile, please click the \"Return to timepoint list\" button.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='The Candidate Parameters Page provides users an opportunity to add important general information about the candidate. There are three sections of the Candidate Parameters Page that can be updated as required by authorized users: \"Candidate Information\", \"Participant Status\", and \"Participation Consent Status\". To return to the Candidate Profile, please click the \"Return to timepoint list\" button.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES ((SELECT helpID FROM (SELECT * FROM `help`) as temp WHERE hash=md5('candidate_parameters')),md5('update_candidate_info'),'Update Candidate Information', 'The Update Candidate Information Page allows users to document any additional comments about the candidate that may be important for analysis, as well as external identifiers. Please note the caveat emptor flag is set to \"False\" by default. A candidate with a unique case for data analysis should have the caveat emptor flag marked as \"True\", with a reason for the flag specified through the drop-down option(s) provided, outlining the most common flagged cases for the study at hand, or through the text box field. Additional comments can also be entered. The user must \"Save\" the updates before navigating back to the Candidate Parameters page via the \"Return to Candidate Info\" button.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='The Update Candidate Information Page allows users to document any additional comments about the candidate that may be important for analysis, as well as external identifiers. Please note the caveat emptor flag is set to \"False\" by default. A candidate with a unique case for data analysis should have the caveat emptor flag marked as \"True\", with a reason for the flag specified through the drop-down option(s) provided, outlining the most common flagged cases for the study at hand, or through the text box field. Additional comments can also be entered. The user must \"Save\" the updates before navigating back to the Candidate Parameters page via the \"Return to Candidate Info\" button.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES ((SELECT helpID FROM (SELECT * FROM `help`) as temp WHERE hash=md5('candidate_parameters')),md5('update_participant_status'), 'Participant Status', 'All candidates are marked as \"Active\" in the database by default. The participant status can be updated to one of the following options: Active, Refused/Not Enrolled, Ineligible, Excluded, Inactive, Incomplete, Complete.\r\n• Active: Candidate active in the study\r\n• Refused/Not Enrolled: Candidate recruited for the study but opted out\r\n• Ineligible: Candidate met exclusionary criterion/criteria during screening and was never scheduled for a visit\r\n• Excluded: Candidate was enrolled but met exclusionary criterion/criteria after starting the study (e.g. scan was reviewed as exclusionary by radiologist)\r\n• Inactive: Candidate continues to be part of the study but currently is inactive (e.g. Candidate is \"Unsure\" about continuing, \"Requiring further investigation\", or \"Not responding\")\r\n• Incomplete: Candidate has withdrawn.\r\n• Complete: Candidate has completed the study \r\nIf the candidate is listed as Inactive or Incomplete, a reason for the chosen status is required. Additional comments regarding the status can also be entered. The user must \"Save\" the updates before navigating back to the Candidate Parameters page via the button \"Return to Candidate Info\".','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='All candidates are marked as \"Active\" in the database by default. The participant status can be updated to one of the following options: Active, Refused/Not Enrolled, Ineligible, Excluded, Inactive, Incomplete, Complete.\r\n• Active: Candidate active in the study\r\n• Refused/Not Enrolled: Candidate recruited for the study but opted out\r\n• Ineligible: Candidate met exclusionary criterion/criteria during screening and was never scheduled for a visit\r\n• Excluded: Candidate was enrolled but met exclusionary criterion/criteria after starting the study (e.g. scan was reviewed as exclusionary by radiologist)\r\n• Inactive: Candidate continues to be part of the study but currently is inactive (e.g. Candidate is \"Unsure\" about continuing, \"Requiring further investigation\", or \"Not responding\")\r\n• Incomplete: Candidate has withdrawn.\r\n• Complete: Candidate has completed the study \r\nIf the candidate is listed as Inactive or Incomplete, a reason for the chosen status is required. Additional comments regarding the status can also be entered. The user must \"Save\" the updates before navigating back to the Candidate Parameters page via the button \"Return to Candidate Info\".';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES ((SELECT helpID FROM (SELECT * FROM `help`) as temp WHERE hash=md5('candidate_parameters')),md5('update_consent_info'), 'Participation Consent Status', 'Updates can be made on the following participant consent status items:\r\n• Consent to Study: Users may choose from options \"Yes/No\", based on whether written consent was obtained for the study\r\n• Date of Consent to Study: This field is required if Consent to Study=Yes. Users are required to enter the date to consent twice, to minimize error in data entry.\r\n• Date of Withdrawal of Consent to Study: Users are not required to enter anything in this field if the candidate did not retract their consent.\r\nSpecific projects require additional consent for collaborative projects and/or for specific procedures (i.e. consent to draw blood). The same consent status fields apply to any additional consent items pertaining to the study.\r\nPlease note that written consent is required prior to data entry in the database.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='Updates can be made on the following participant consent status items:\r\n• Consent to Study: Users may choose from options \"Yes/No\", based on whether written consent was obtained for the study\r\n• Date of Consent to Study: This field is required if Consent to Study=Yes. Users are required to enter the date to consent twice, to minimize error in data entry.\r\n• Date of Withdrawal of Consent to Study: Users are not required to enter anything in this field if the candidate did not retract their consent.\r\nSpecific projects require additional consent for collaborative projects and/or for specific procedures (i.e. consent to draw blood). The same consent status fields apply to any additional consent items pertaining to the study.\r\nPlease note that written consent is required prior to data entry in the database.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('instrument_list'), 'Time-Point Instrument List','Once inside a time point, the user will see some general information about the candidate across the top of the screen, such as gender, visit label, and subproject. The status of each particular visit can be viewed in the far left panel, where status can be marked as \"Pass\", \"Failure\", \"Withdrawal\", or \"In Progress\". \"Send Time Point\" is selected by the user to \"Send to DCC\", and is the final step in completing data entry for a visit. \r\nThe \"BVL QC Type\" is used to record whether the Behavioural quality control was done on an electronic device or as a hard copy, and the \"BVL QC Status\" records if quality control has been completed. When viewing a visit in a narrow browser window or mobile device, this panel is hidden. The visit panel contains the Actions Menu, the Visit Stage, the Send Time Point, and QC Information. This menu can be opened for viewing or hidden by selecting the list icon at the top lefthand menu. \r\n\r\nEach time point carries a unique set of tests, also known as instruments. In addition to seeing the names of the instruments contained within each behavioural battery, users can view Administration and Data Entry Status, as well as whether any feedback exists for that particular instrument. Information about Double Data Entry progress can also be found within the behavioural battery table.  Click on any instrument name to open the instrument form and perform data entry. Double data entry can be performed by clicking on the \"Double Data Entry\" link for a given instrument.' ,'2014-09-01 00:00:00', NULL)
ON DUPLICATE KEY UPDATE content='Once inside a time point, the user will see some general information about the candidate across the top of the screen, such as gender, visit label, and subproject. The status of each particular visit can be viewed in the far left panel, where status can be marked as \"Pass\", \"Failure\", \"Withdrawal\", or \"In Progress\". \"Send Time Point\" is selected by the user to \"Send to DCC\", and is the final step in completing data entry for a visit. \r\nThe \"BVL QC Type\" is used to record whether the Behavioural quality control was done on an electronic device or as a hard copy, and the \"BVL QC Status\" records if quality control has been completed. When viewing a visit in a narrow browser window or mobile device, this panel is hidden. The visit panel contains the Actions Menu, the Visit Stage, the Send Time Point, and QC Information. This menu can be opened for viewing or hidden by selecting the list icon at the top lefthand menu. \r\n\r\nEach time point carries a unique set of tests, also known as instruments. In addition to seeing the names of the instruments contained within each behavioural battery, users can view Administration and Data Entry Status, as well as whether any feedback exists for that particular instrument. Information about Double Data Entry progress can also be found within the behavioural battery table.  Click on any instrument name to open the instrument form and perform data entry. Double data entry can be performed by clicking on the \"Double Data Entry\" link for a given instrument.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('reliability'), 'Reliability Coding','The Reliability Coding module was designed to allow users across and within sites to be confident in the scoring of data, thus improving the integrity of the data within the database on an on-going basis. This module may not be employed by your study if it does not require inter-rater agreement. Reliability immediately brings forward any discrepancies in instrument administration or data reports, as well as helping reduce human error within data reports. Under the Reliability Coding module, the user can apply the selection filter to narrow down candidates of interest. \r\nA list of entries will appear that organizes candidates by PSCID, the site of reliability, cohort, DCCID, gender, visit label, instrument, reliability score and an indication of whether the chosen candidate has reliable data. Note that certain headings (i.e. DCCID, Site, PSCID etc.) at the top of the table will become underlined and show a click icon when the user hovers over the heading title. These titles can be clicked to sort the table data; clicking more than once will toggle the sort order between ascending and descending order. On a narrow browser window or mobile device, this table has a slider bar at the bottom, as well as arrows flanking the sides for easy scrolling. In this tab, both the selection filter and the \"Swap Candidates\" feature (explained below) can be hidden by selecting the upward arrow icon to the right of the table title and reopened using the downward arrow icon. \r\n\r\nSwap Candidates: The candidates for whom reliability is available are selected at random by the database. However, in the case that a particular candidate lacks adequate data for reliability (e.g. poor quality video), another candidate can be manually selected using the \"Swap Candidates\" feature. Upon clicking the \"Swap Candidates\" button next to the Selection Filter, users can input the information of the \"Original Candidate\" with insufficient data for reliability, and input a desired \"Replacement Candidate\". The user can indicate the instrument in question and proceed to clicking \"Swap Candidates\". \r\n\r\nOnce the user has completed a search within the Reliability Module, the user can click on the PSCID of the candidate for the instrument in question. The \"Reliable\" column shows the user whether the reliability score surpasses the established threshold for reliability by being marked as \"Yes\" in green if the candidate is reliable or \"No\" in red if the candidate did not pass reliability. If the candidate had been flagged as invalid, the user will see a note in red text beside the PSCID.\r\n \r\nFor each instrument configured under the module, the user will see a table listing the reliability status of each rater (e.g. \"Yes\" or \"In progress\"), as well as the date at which reliability was established, date at which the tape was sent, date at which Feedback was received, whether the rater is outside the research group and Administration status (e.g., \"Current\" or \"No\"). The criteria required for a candidate to be considered reliable is outlined below the heading of each instrument.\r\n\r\n<b>Entering Reliability Data</b>\r\nAfter clicking on a PSCID, a data entry screen will appear for second raters to enter data for the selected candidate and time point. The database will automatically compare the newly entered data to that entered by the first rater and calculate a reliability score. This score can then be viewed on the main reliability page under the \"Reliability Score\" Column.\r\n\r\n<b>After saving Reliability form</b>\r\nThis page displays all data that was previously entered in the reliability form. These are static and cannot be altered from this page. Users can directly access the initial data entry form through the Comment ID link in blue text under \"Scoring\". Please use the Clinical Menu to navigate back to the Reliability Coding page.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='The Reliability Coding module was designed to allow users across and within sites to be confident in the scoring of data, thus improving the integrity of the data within the database on an on-going basis. This module may not be employed by your study if it does not require inter-rater agreement. Reliability immediately brings forwnard any discrepancies in instrument administration or data reports, as well as helping reduce human error within data reports. Under the Reliability Coding module, the user can apply the selection filter to narrow down candidates of interest. \r\nA list of entries will appear that organizes candidates by PSCID, the site of reliability, cohort, DCCID, gender, visit label, instrument, reliability score and an indication of whether the chosen candidate has reliable data. Note that certain headings (i.e. DCCID, Site, PSCID etc.) at the top of the table will become underlined and show a click icon when the user hovers over the heading title. These titles can be clicked to sort the table data; clicking more than once will toggle the sort order between ascending and descending order. On a narrow browser window or mobile device, this table has a slider bar at the bottom, as well as arrows flanking the sides for easy scrolling. In this tab, both the selection filter and the \"Swap Candidates\" feature (explained below) can be hidden by selecting the upward arrow icon to the right of the table title and reopened using the downward arrow icon. \r\n\r\nSwap Candidates: The candidates for whom reliability is available are selected at random by the database. However, in the case that a particular candidate lacks adequate data for reliability (e.g. poor quality video), another candidate can be manually selected using the \"Swap Candidates\" feature. Upon clicking the \"Swap Candidates\" button next to the Selection Filter, users can input the information of the \"Original Candidate\" with insufficient data for reliability, and input a desired \"Replacement Candidate\". The user can indicate the instrument in question and proceed to clicking \"Swap Candidates\". \r\n\r\nOnce the user has completed a search within the Reliability Module, the user can click on the PSCID of the candidate for the instrument in question. The \"Reliable\" column shows the user whether the reliability score surpasses the established threshold for reliability by being marked as \"Yes\" in green if the candidate is reliable or \"No\" in red if the candidate did not pass reliability. If the candidate had been flagged as invalid, the user will see a note in red text beside the PSCID.\r\n \r\nFor each instrument configured under the module, the user will see a table listing the reliability status of each rater (e.g. \"Yes\" or \"In progress\"), as well as the date at which reliability was established, date at which the tape was sent, date at which Feedback was received, whether the rater is outside the research group and Administration status (e.g., \"Current\" or \"No\"). The criteria required for a candidate to be considered reliable is outlined below the heading of each instrument.\r\n\r\n<b>Entering Reliability Data</b>\r\nAfter clicking on a PSCID, a data entry screen will appear for second raters to enter data for the selected candidate and time point. The database will automatically compare the newly entered data to that entered by the first rater and calculate a reliability score. This score can then be viewed on the main reliability page under the \"Reliability Score\" Column.\r\n\r\n<b>After saving Reliability form</b>\r\nThis page displays all data that was previously entered in the reliability form. These are static and cannot be altered from this page. Users can directly access the initial data entry form through the Comment ID link in blue text under \"Scoring\". Please use the Clinical Menu to navigate back to the Reliability Coding page.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('conflict_resolver'), 'Conflict Resolver','The Conflict Resolver tool allows users to view and keep track of any discrepancies that may arise between initial data entry and double data entry forms. Unresolved and Resolved conflicts are found on two separate tabs of the module. The Unresolved conflicts are displayed first upon accessing the Conflict Resolver module. The Conflict Resolver has a selection filter function to allow users to search for a particular subject and/or instrument. By clicking the button \"Show Data\" after selecting certain search options, the search results will be updated to reflect the selection filter criteria. The search results table is organized by the blue headers \"Instrument\", \"DCCID\", \"PSCID\", \"Visit Label\", \"Question\", and \"Correct Answer\". \r\nIf the user is confident that the data for the particular question of interest is consistent across the two data entry forms, the user can select the appropriate answer from the drop-down menu under the \"Correct Answer\" column and then click \"Save\" at the bottom of the table to resolve the issue. After refreshing the page, this newly resolved conflict will no longer appear under the Unresolved Conflicts tab, and will appear among the list of resolved conflicts on the second tab of the module. Similar to other pages of the database, the selection filter can be hidden by selecting upward arrow icon and reopened using the downward arrow icon.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='The Conflict Resolver tool allows users to view and keep track of any discrepancies that may arise between initial data entry and double data entry forms. Unresolved and Resolved conflicts are found on two separate tabs of the module. The Unresolved conflicts are displayed first upon accessing the Conflict Resolver module. The Conflict Resolver has a selection filter function to allow users to search for a particular subject and/or instrument. By clicking the button \"Show Data\" after selecting certain search options, the search results will be updated to reflect the selection filter criteria. The search results table is organized by the blue headers \"Instrument\", \"DCCID\", \"PSCID\", \"Visit Label\", \"Question\", and \"Correct Answer\". \r\nIf the user is confident that the data for the particular question of interest is consistent across the two data entry forms, the user can select the appropriate answer from the drop-down menu under the \"Correct Answer\" column and then click \"Save\" at the bottom of the table to resolve the issue. After refreshing the page, this newly resolved conflict will no longer appear under the Unresolved Conflicts tab, and will appear among the list of resolved conflicts on the second tab of the module. Similar to other pages of the database, the selection filter can be hidden by selecting upward arrow icon and reopened using the downward arrow icon.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('certification'), 'Certification','The Certification module allows the user to access and input information regarding examiners’ credentials. To view existing credentials, the user must select the examiner’s name outlined in navy text. \r\nThe Certification module also has a selection filter to allow users to search for a particular examiner or measure. The user may also create new credentials first by clicking \"Add Certification\". Similar to other pages of the database, the selection filter can be hidden by selecting upward arrow icon and reopened using the downward arrow icon.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='The Certification module allows the user to access and input information regarding examiners’ credentials. To view existing credentials, the user must select the examiner’s name outlined in navy text. \r\nThe Certification module also has a selection filter to allow users to search for a particular examiner or measure. The user may also create new credentials first by clicking \"Add Certification\". Similar to other pages of the database, the selection filter can be hidden by selecting upward arrow icon and reopened using the downward arrow icon.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES ((SELECT helpID FROM (SELECT * FROM `help`) as temp WHERE hash=md5('certification')),md5('edit_event'), 'Add Certification','To add certification, the user must select an examiner from the drop down menu. The status of his/her training for various instruments must be selected as \"Not Certified\", \"In Training\" or \"Certified\" and the date that the certification has been updated must be input. In order to store changes in certification the user must click \"Save\" after updating the examiner’s information. Note that certification updates for each examiner are recorded in a \"Change Log\", just below the \"Edit Certification Event\" box.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='To add certification, the user must select an examiner from the drop down menu. The status of his/her training for various instruments must be selected as \"Not Certified\", \"In Training\" or \"Certified\" and the date that the certification has been updated must be input. In order to store changes in certification the user must click \"Save\" after updating the examiner’s information. Note that certification updates for each examiner are recorded in a \"Change Log\", just below the \"Edit Certification Event\" box.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('document_repository'), 'Document Repository', 'The Document Repository is a useful tool that provides multiple users with a centralized location for important documents relevant to the project. Files may be uploaded and organized under any user-defined category. Subcategories can also be defined by the user to be nested under parent categories. To view the previously uploaded files, the user must click on the appropriate category title to reveal a complete list of subcategories, and subsequently its files. Clicking on the file name outlined in blue will open these files. Various metadata at the file level may also be edited by selecting the corresponding \"Edit\" link and files can be deleted with the \"Delete\" link to the right of the desired file. Categories and uploaded files can have comments attached to them to provide additional information. To edit the comments of a specific category, hover over the ellipsis beside the title and click the text to make any necessary changes.\r\n\r\nSimilar to other modules in the LORIS database, the Document Repository has a Selection Filter with which the user may input search criteria, and select \"Show Data\" to locate specific documents. Clicking on the column headers serves to sort the data, consistent with other pages of the LORIS database. Clicking \"Upload File\" in the Selection Filter window enables the user to upload new and/or revised documents. Clicking \"Add Category\" allows a user to create a new category or subcategory to an existing parent category.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='The Document Repository is a useful tool that provides multiple users with a centralized location for important documents relevant to the project. Files may be uploaded and organized under any user-defined category. Subcategories can also be defined by the user to be nested under parent categories. To view the previously uploaded files, the user must click on the appropriate category title to reveal a complete list of subcategories, and subsequently its files. Clicking on the file name outlined in blue will open these files. Various metadata at the file level may also be edited by selecting the corresponding \"Edit\" link and files can be deleted with the \"Delete\" link to the right of the desired file. Categories and uploaded files can have comments attached to them to provide additional information. To edit the comments of a specific category, hover over the ellipsis beside the title and click the text to make any necessary changes.\r\n\r\nSimilar to other modules in the LORIS database, the Document Repository has a Selection Filter with which the user may input search criteria, and select \"Show Data\" to locate specific documents. Clicking on the column headers serves to sort the data, consistent with other pages of the LORIS database. Clicking \"Upload File\" in the Selection Filter window enables the user to upload new and/or revised documents. Clicking \"Add Category\" allows a user to create a new category or subcategory to an existing parent category.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('final_radiological_review'), 'Radiological Review','The user can view the radiological review status for each candidate and corresponding visit label through the Radiological Review module.\r\n\r\n<b>To Access Reviews:</b>\r\nSet appropriate filters in the Selection Filter box and click the \"Show Data\" button to retrieve a list of the search results. The results are categorized by column by the candidate’s IDs, date of birth, visit label, review completion status, results (e.g., normal, atypical), exclusionary status and custom fields such as subarachnoid spaces (SAS) status (e.g., none, mild, minimal), perivascular spaces (PVS) and any further comments. This filter can be hidden by selecting the upward arrow icon and reopened using the downward arrow icon. In a narrow browser window or mobile device the table of search results will be displayed below the selection filter. \r\nIn the data table there is a column addressing whether any conflict exists between final and extra reviews, which can be found under the blue heading \"Conflict\". Next to this column, the user will find whether the review was finalized. The user will see that hovering over each of the blue headings displays a click icon; if selected, the columns will sort in ascending or descending order. Note that clicking several times will reverse/change the sorting pattern. In addition, the table will fit to the browser size, and display a slide bar at the bottom as well as arrows flanking the table to ease data viewing. By clicking on a PSCID, the candidate’s file will be opened and the user can access the radiological review. \r\n<b>Within a Radiological Review</b> \r\nIf a conflict exists between the original and final review, a warning will appear at the top of the screen in red text. General Information, such as PSCID, DCCID, Visit Label, and DICOM folder can be easily viewed from the Final Radiological Review page. The user can directly access this candidate’s Imaging Browser page or Final Radiological Review by following the links next to \"Go to:\" under the General Information section. Details of the candidate’s radiological review at that particular time-point can be viewed in the box under the navy blue heading \"Review Values\". Any changes made to the record will be documented in the table following the heading \"Change Log\".','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='The user can view the radiological review status for each candidate and corresponding visit label through the Radiological Review module.\r\n\r\n<b>To Access Reviews:</b>\r\nSet appropriate filters in the Selection Filter box and click the \"Show Data\" button to retrieve a list of the search results. The results are categorized by column by the candidate’s IDs, date of birth, visit label, review completion status, results (e.g., normal, atypical), exclusionary status and custom fields such as subarachnoid spaces (SAS) status (e.g., none, mild, minimal), perivascular spaces (PVS) and any further comments. This filter can be hidden by selecting the upward arrow icon and reopened using the downward arrow icon. In a narrow browser window or mobile device the table of search results will be displayed below the selection filter. \r\nIn the data table there is a column addressing whether any conflict exists between final and extra reviews, which can be found under the blue heading \"Conflict\". Next to this column, the user will find whether the review was finalized. The user will see that hovering over each of the blue headings displays a click icon; if selected, the columns will sort in ascending or descending order. Note that clicking several times will reverse/change the sorting pattern. In addition, the table will fit to the browser size, and display a slide bar at the bottom as well as arrows flanking the table to ease data viewing. By clicking on a PSCID, the candidate’s file will be opened and the user can access the radiological review. \r\n<b>Within a Radiological Review</b> \r\nIf a conflict exists between the original and final review, a warning will appear at the top of the screen in red text. General Information, such as PSCID, DCCID, Visit Label, and DICOM folder can be easily viewed from the Final Radiological Review page. The user can directly access this candidate’s Imaging Browser page or Final Radiological Review by following the links next to \"Go to:\" under the General Information section. Details of the candidate’s radiological review at that particular time-point can be viewed in the box under the navy blue heading \"Review Values\". Any changes made to the record will be documented in the table following the heading \"Change Log\".';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('dicom_archive'),'Dicom Archive','The user can access all DICOM files through the DICOM Archive under the \"Imaging\" menu. By default, all fields in the Selection Filter will appear to be null and no search results will be listed. Users can click \"Submit\" to view all imaging data. A more detailed search can be executed using selected fields from the Selection Filter. This includes filtering by \"Patient ID\", \"Patient Name\", \"Gender\", \"Date of Birth\", \"Acquisition\" date, and/or \"Archive Location\". This Selection Filter can be hidden using the upward arrow icon and re-opened by selecting the downward arrow icon. After submitting a search, the user will be able to see how many results their search has retrieved. The user can organize the results in ascending or descending order by clicking on any of the blue headers of the table, consistent with other pages on the LORIS database.\r\n\r\nLinks to a particular patient’s DICOM archive can be accessed through the Metadata column by clicking \"View Details\". Direct links to neuroimaging data can also be accessed through the Imaging Browser column.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='The user can access all DICOM files through the DICOM Archive under the \"Imaging\" menu. By default, all fields in the Selection Filter will appear to be null and no search results will be listed. Users can click \"Submit\" to view all imaging data. A more detailed search can be executed using selected fields from the Selection Filter. This includes filtering by \"Patient ID\", \"Patient Name\", \"Gender\", \"Date of Birth\", \"Acquisition\" date, and/or \"Archive Location\". This Selection Filter can be hidden using the upward arrow icon and re-opened by selecting the downward arrow icon. After submitting a search, the user will be able to see how many results their search has retrieved. The user can organize the results in ascending or descending order by clicking on any of the blue headers of the table, consistent with other pages on the LORIS database.\r\n\r\nLinks to a particular patient’s DICOM archive can be accessed through the Metadata column by clicking \"View Details\". Direct links to neuroimaging data can also be accessed through the Imaging Browser column.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES ((SELECT helpID FROM (SELECT * FROM `help`) as temp WHERE hash=md5('dicom_archive')),md5('viewDetails'),'Dicom Archive - View Details','Within a particular candidate’s DICOM archive, specific information about the patient can be found, as well as details about imaging data acquisition. Specifics of the DICOM Series can be found in the table, located near the bottom of the DICOM archive page, and can provide information as to whether there was a protocol violation.Under the specifics of the Series, two links to \"Show/Hide files\" and \"Show/Hide metadata\" can be clicked to expand the table and reveal additional information. \r\n\r\nNote the DICOM archive for a particular candidate can also be accessed directly from their corresponding Imaging Browser page.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='Within a particular candidate’s DICOM archive, specific information about the patient can be found, as well as details about imaging data acquisition. Specifics of the DICOM Series can be found in the table, located near the bottom of the DICOM archive page, and can provide information as to whether there was a protocol violation.Under the specifics of the Series, two links to \"Show/Hide files\" and \"Show/Hide metadata\" can be clicked to expand the table and reveal additional information. \r\n\r\nNote the DICOM archive for a particular candidate can also be accessed directly from their corresponding Imaging Browser page.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('imaging_browser'),'Imaging Browser ','By default, all fields in the Selection Filter will appear to be null and no search results will be listed. Users can click \"Submit\" to view all imaging data. A more detailed search can be executed using selected fields from the Selection Filter. After submitting a search, the Imaging browser will organize the results by time-point and the user will be able to see how many results their search has retrieved. \r\nThe user can organize the results in ascending or descending order by clicking on any of the blue headers of the table. The date of first acquisition for the imaging dataset is indicated under \"First Acq Date\" column. The date on which the data was last QC\’ed can be found under \"Last QC\". Any data that was recently inserted will be indicated via the label \"NEW\" under \"New Data\". \r\n\r\nTo view the imaging datasets for a specific candidate\'s timepoint, select a dataset type from under the 3 \"Links\" columns: \"native\", \"selected\", and \"all types\". \"Native\" will show only raw imaging datasets, \"Selected\" displays only scans on which QC has flagged as optimal, and \"all types\" displays all data, including analyzed outputs. By clicking on any of these links, the user will be able to see details for that specific subject\’s dataset from a given scanning session. \r\n\r\nNote that the Imaging Browser may also be accessed from the DICOM Archive module.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='By default, all fields in the Selection Filter will appear to be null and no search results will be listed. Users can click \"Submit\" to view all imaging data. A more detailed search can be executed using selected fields from the Selection Filter. After submitting a search, the Imaging browser will organize the results by time-point and the user will be able to see how many results their search has retrieved. \r\nThe user can organize the results in ascending or descending order by clicking on any of the blue headers of the table. The date of first acquisition for the imaging dataset is indicated under \"First Acq Date\" column. The date on which the data was last QC\’ed can be found under \"Last QC\". Any data that was recently inserted will be indicated via the label \"NEW\" under \"New Data\". \r\n\r\nTo view the imaging datasets for a specific candidate\'s timepoint, select a dataset type from under the 3 \"Links\" columns: \"native\", \"selected\", and \"all types\". \"Native\" will show only raw imaging datasets, \"Selected\" displays only scans on which QC has flagged as optimal, and \"all types\" displays all data, including analyzed outputs. By clicking on any of these links, the user will be able to see details for that specific subject\’s dataset from a given scanning session. \r\n\r\nNote that the Imaging Browser may also be accessed from the DICOM Archive module.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES ((SELECT helpID FROM (SELECT * FROM `help`) as temp WHERE hash=md5('imaging_browser')),md5('viewSession'),'Imaging Browser: View Session','At the top of the page is a box with grey headings, listing general information about the candidate, including subject IDs, demographic information, key parameters (e.g. scannerID) and QC status. \r\n\r\nIn the left side panel, QC status flags can be set at the bottom under \"Visit QC\", and detailed QC information can be entered for the entire timepoint dataset via \"Visit-level feedback\", under \"Visit Controls\". Clicking on \"Visit-level feedback\" will open a new window with the candidate’s information (e.g.CandID, PSCID, Visit Label and Subproject ID), as well as any additional QC comments and/or existing Mantis bug reports.\r\n\r\nThe files for the selected candidate’s dataset are displayed below the general information box. Horizontal, sagittal and coronal views of each scan volume are grouped together. Each set of images for each file also has a list of scan parameters listed on the right, including protocol, the date at which the image was acquired, the date the images were put on the database, and other details regarding scan acquisition. \r\n\r\nTo the left of the images, there is a panel displaying the QC status of the scan, and if any \"caveat emptor\" flags exist. If a specific acquisition has been \"selected\" as the optimal scan of its type or modality (e.g. t1) for this dataset, the modality will be displayed as the selected option in the \"Selected\" dropdown box found within the left-hand panel of each scan. Detailed QC information about a specific scan can be entered by clicking \"Link to comments\", which will open a separate smaller window with a summary of the candidate’s information and the filename, followed by comments, if any exist, regarding intensity, movement artifacts, coverage and overall feedback on the selected scan. After saving any changes, the user can either close the pop-up window or use the link at the top: \"Click here to close this window\".\r\n\r\n<b>Visualization</b>\r\nTo use visualization tools BrainBrowser and the JIV viewer. The user can also access 3D images through the navy blue links \"3D+Overlay\" and \"3D Only\" for both the JIV Panel and BrainBrowser in the left sidebar. \r\n\r\nIn the left sidebar, Links are also displayed to direct the user to the MRI parameter form, Radiological Review, DICOM Archive module, and Mantis issue-tracking tool. \r\nAt the top of the left sidebar, the user can click on \"Next\" to move to the next time-point for the candidate of interest.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='At the top of the page is a box with grey headings, listing general information about the candidate, including subject IDs, demographic information, key parameters (e.g. scannerID) and QC status. \r\n\r\nIn the left side panel, QC status flags can be set at the bottom under \"Visit QC\", and detailed QC information can be entered for the entire timepoint dataset via \"Visit-level feedback\", under \"Visit Controls\". Clicking on \"Visit-level feedback\" will open a new window with the candidate’s information (e.g.CandID, PSCID, Visit Label and Subproject ID), as well as any additional QC comments and/or existing Mantis bug reports.\r\n\r\nThe files for the selected candidate’s dataset are displayed below the general information box. Horizontal, sagittal and coronal views of each scan volume are grouped together. Each set of images for each file also has a list of scan parameters listed on the right, including protocol, the date at which the image was acquired, the date the images were put on the database, and other details regarding scan acquisition. \r\n\r\nTo the left of the images, there is a panel displaying the QC status of the scan, and if any \"caveat emptor\" flags exist. If a specific acquisition has been \"selected\" as the optimal scan of its type or modality (e.g. t1) for this dataset, the modality will be displayed as the selected option in the \"Selected\" dropdown box found within the left-hand panel of each scan. Detailed QC information about a specific scan can be entered by clicking \"Link to comments\", which will open a separate smaller window with a summary of the candidate’s information and the filename, followed by comments, if any exist, regarding intensity, movement artifacts, coverage and overall feedback on the selected scan. After saving any changes, the user can either close the pop-up window or use the link at the top: \"Click here to close this window\".\r\n\r\n<b>Visualization</b>\r\nTo use visualization tools BrainBrowser and the JIV viewer. The user can also access 3D images through the navy blue links \"3D+Overlay\" and \"3D Only\" for both the JIV Panel and BrainBrowser in the left sidebar. \r\n\r\nIn the left sidebar, Links are also displayed to direct the user to the MRI parameter form, Radiological Review, DICOM Archive module, and Mantis issue-tracking tool. \r\nAt the top of the left sidebar, the user can click on \"Next\" to move to the next time-point for the candidate of interest.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('imaging_uploader'), 'Imaging Uploader', 'The Imaging Uploader allows users to upload imaging files, typically for an entire imaging session at a time. Please note that files should be in a compressed format (.tgz, .tar.gz, or .zip) and must be labeled properly in order to be uploaded successfully into the database. \r\n\r\nAfter choosing the file to upload, users must input the CandID, PSCID, and Visit Label for this dataset, and then click the \"Upload\" button. The newly uploaded file will be displayed in the table at the bottom of the page. \r\n\r\nUsers can also use the topmost panel to search for datasets uploaded in the past, y leaving the \"File to Upload\" field blank, and filling any of the remaining fields such as an ID or visit label, then clicking \"Show Data\". Results will be displayed in the table at bottom, which can be sorted by columns \"CandID\", \"Visit Label\", \"Source Location\", \"Upload Date\" and \"Uploaded By\", as well as by number of Minc files inserted, and number of Minc files created.\r\n\r\nNote that the \"Tarchive Info\" column contains links to the corresponding DICOM header information for a given imaging dataset, via the DICOM Archive module. Also, to display the current status in the \"Progress\" column of the uploads table at bottom, you should refresh the page.\r\n\r\nTo view the output of the imaging insertion pipeline for a given uploaded file by selecting its row in the table of uploads at bottom. When you click on a row in the imaging upload table, the panel called \"Upload Process Logs\" (above the table of uploads) will display the most recent output of the imaging insertion pipeline for that particular file. This display will be refreshed every five seconds. There are two modes for displaying logs: \"Detailed\", which retrieves everything output by the pipeline and \"Summary\" which displays only the most important log messages (namely the steps successfully executed by the pipeline).','2016-04-29 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='The Imaging Uploader allows users to upload imaging files, typically for an entire imaging session at a time. Please note that files should be in a compressed format (.tgz, .tar.gz, or .zip) and must be labeled properly in order to be uploaded successfully into the database. \r\n\r\nAfter choosing the file to upload, users must input the CandID, PSCID, and Visit Label for this dataset, and then click the \"Upload\" button. The newly uploaded file will be displayed in the table at the bottom of the page. \r\n\r\nUsers can also use the topmost panel to search for datasets uploaded in the past, y leaving the \"File to Upload\" field blank, and filling any of the remaining fields such as an ID or visit label, then clicking \"Show Data\". Results will be displayed in the table at bottom, which can be sorted by columns \"CandID\", \"Visit Label\", \"Source Location\", \"Upload Date\" and \"Uploaded By\", as well as by number of Minc files inserted, and number of Minc files created.\r\n\r\nNote that the \"Tarchive Info\" column contains links to the corresponding DICOM header information for a given imaging dataset, via the DICOM Archive module. Also, to display the current status in the \"Progress\" column of the uploads table at bottom, you should refresh the page.\r\n\r\nTo view the output of the imaging insertion pipeline for a given uploaded file by selecting its row in the table of uploads at bottom. When you click on a row in the imaging upload table, the panel called \"Upload Process Logs\" (above the table of uploads) will display the most recent output of the imaging insertion pipeline for that particular file. This display will be refreshed every five seconds. There are two modes for displaying logs: \"Detailed\", which retrieves everything output by the pipeline and \"Summary\" which displays only the most important log messages (namely the steps successfully executed by the pipeline).';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('statistics'), 'Database Statistics', 'The Database statistics module calculates and displays statistics related to data acquisition, data processing, and data entry for both behavioural and imaging data collections. A brief description of \"Demographic\", \"Imaging\", and \"Behavioural Statistics\" can be found under the \"General Description\" tab. In addition to these tabs, the user can also view \"Reliability Statistics\". These statistics categories will condense into a drop-down menu in a narrow browser view or mobile device, but can be opened using the downward arrow icon and hidden using the upward arrow icon.\r\n\r\n<b>Demographic Statistics</b>\r\nGeneral statistics can be retrieved from each site by using the drop-down select box under the first smaller heading \"General Statistics\" and clicking on the button \"Submit Query\". Under General Statistics, the user will find the heading \"Breakdown of Registered Candidates\", where a table outlines gender breakdowns per site, time-point and subproject ID. Data Entry Completion Status can be viewed for each instrument by selecting from the dropdown menu under \"Breakdown of Registered Candidates\". Click \"Submit Query\" to view statistics specific to the selected instrument. \r\n\r\n<b>Behavioural Statistics</b>\r\nThe user will first see a table labeled \"Data Entry Statistics\", where each site is listed in blue headers horizontally and includes the headings \"Completed\", \"Created\", and \"% Completion\". \"Completed\" refers to the total number of instruments that have been marked \"Data Entry= Complete\" and \"Administration= None/Partial/All\". This column has its percentage counterpart under \"% Completion\". \"Created\" refers to the total number of instruments that have been populated requiring data entry. Another feature allows all site information to be reversibly hidden except \"% Completion\" by a single click on the Site Name (i.e. AAA, DCC etc.). The \"Double Data Entry Statistics\" table underneath rests on a similar premise as the \"Data Entry Statistics\" Table, but with regards to double data entry. In both of these tables, the visits are listed in rows with the data sorted by site. Depending on the study and number of sites involved, the user will need to navigate horizontally through the table using the slider or the arrows flanking the table. When using a desktop the user must hover the mouse over the arrows, whereas on a mobile device the user must click on the arrows. The user also has the option of viewing \"Per Instrument Stats\" at the bottom of each site’s column, by following the \"Please Click Here\" link. The user can then view which candidates have not completed data entry in each site. \r\n\r\n<b>Reliability Statistics</b>\r\nThe Reliability Statistics module currently sorts each instrument by visit label and shows the number of flagged, completed, and reliable cases, in addition to expressing reliability and completion in terms of percentages. \"Total Flagged\" cases refer to the number of candidates with levels consistently falling below a given threshold, thus they have been ‘flagged’ for reliability review. The \"Total Complete\" column contains the number of candidates for whom a reliability review has been completed. The \"Total Reliable\" column adds to the information in \"Total Complete\", but includes only those candidates whose information is now reliable. The Reliability Statistics Table also includes \"Percent Complete\" and \"Percent Reliable\" columns. Under the smaller navy heading \"Reliability Statistics\", the user can search for specific statistics for their site of interest by using the dropdown menu and clicking the button \"Submit Query\".\r\n\r\n<b>Imaging Statistics</b>\r\nThe first table under \"Imaging Integrity Statistics for\" displays information regarding missing imaging data, as indicated by data entry on the MRI parameter form, and scan insertions based on records in the Imaging Browser and DICOM archive. Specific candidates with missing imaging data can be easily identified through the link \"Click here for breakdown per participant\" under the \"Breakdown of Problems\" column.\r\n\r\nThe second table within the Imaging Statistics module allows the user to get a breakdown of statistics for candidates by time-point, based on the scan selected. Depending on the project, the user can choose from T1, T2, T1 & T2, DTI, BOLD, and Spectroscopy scans, and other possible options at the top left of the second table, to show the relative number of candidates with scans marked as \"Complete\", \"Partial\", or \"No Scan\". Under the column \"% Complete\", the user can view the percentage of candidates for the scan of interest that have completed scans. The record of scans has the subprojects listed across the top of the table horizontally, with each site encompassing all of its time points listed in rows. A breakdown of the total imaging data is also available at the bottom of the table.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='The Database statistics module calculates and displays statistics related to data acquisition, data processing, and data entry for both behavioural and imaging data collections. A brief description of \"Demographic\", \"Imaging\", and \"Behavioural Statistics\" can be found under the \"General Description\" tab. In addition to these tabs, the user can also view \"Reliability Statistics\". These statistics categories will condense into a drop-down menu in a narrow browser view or mobile device, but can be opened using the downward arrow icon and hidden using the upward arrow icon.\r\n\r\n<b>Demographic Statistics</b>\r\nGeneral statistics can be retrieved from each site by using the drop-down select box under the first smaller heading \"General Statistics\" and clicking on the button \"Submit Query\". Under General Statistics, the user will find the heading \"Breakdown of Registered Candidates\", where a table outlines gender breakdowns per site, time-point and subproject ID. Data Entry Completion Status can be viewed for each instrument by selecting from the dropdown menu under \"Breakdown of Registered Candidates\". Click \"Submit Query\" to view statistics specific to the selected instrument. \r\n\r\n<b>Behavioural Statistics</b>\r\nThe user will first see a table labeled \"Data Entry Statistics\", where each site is listed in blue headers horizontally and includes the headings \"Completed\", \"Created\", and \"% Completion\". \"Completed\" refers to the total number of instruments that have been marked \"Data Entry= Complete\" and \"Administration= None/Partial/All\". This column has its percentage counterpart under \"% Completion\". \"Created\" refers to the total number of instruments that have been populated requiring data entry. Another feature allows all site information to be reversibly hidden except \"% Completion\" by a single click on the Site Name (i.e. AAA, DCC etc.). The \"Double Data Entry Statistics\" table underneath rests on a similar premise as the \"Data Entry Statistics\" Table, but with regards to double data entry. In both of these tables, the visits are listed in rows with the data sorted by site. Depending on the study and number of sites involved, the user will need to navigate horizontally through the table using the slider or the arrows flanking the table. When using a desktop the user must hover the mouse over the arrows, whereas on a mobile device the user must click on the arrows. The user also has the option of viewing \"Per Instrument Stats\" at the bottom of each site’s column, by following the \"Please Click Here\" link. The user can then view which candidates have not completed data entry in each site. \r\n\r\n<b>Reliability Statistics</b>\r\nThe Reliability Statistics module currently sorts each instrument by visit label and shows the number of flagged, completed, and reliable cases, in addition to expressing reliability and completion in terms of percentages. \"Total Flagged\" cases refer to the number of candidates with levels consistently falling below a given threshold, thus they have been ‘flagged’ for reliability review. The \"Total Complete\" column contains the number of candidates for whom a reliability review has been completed. The \"Total Reliable\" column adds to the information in \"Total Complete\", but includes only those candidates whose information is now reliable. The Reliability Statistics Table also includes \"Percent Complete\" and \"Percent Reliable\" columns. Under the smaller navy heading \"Reliability Statistics\", the user can search for specific statistics for their site of interest by using the dropdown menu and clicking the button \"Submit Query\".\r\n\r\n<b>Imaging Statistics</b>\r\nThe first table under \"Imaging Integrity Statistics for\" displays information regarding missing imaging data, as indicated by data entry on the MRI parameter form, and scan insertions based on records in the Imaging Browser and DICOM archive. Specific candidates with missing imaging data can be easily identified through the link \"Click here for breakdown per participant\" under the \"Breakdown of Problems\" column.\r\n\r\nThe second table within the Imaging Statistics module allows the user to get a breakdown of statistics for candidates by time-point, based on the scan selected. Depending on the project, the user can choose from T1, T2, T1 & T2, DTI, BOLD, and Spectroscopy scans, and other possible options at the top left of the second table, to show the relative number of candidates with scans marked as \"Complete\", \"Partial\", or \"No Scan\". Under the column \"% Complete\", the user can view the percentage of candidates for the scan of interest that have completed scans. The record of scans has the subprojects listed across the top of the table horizontally, with each site encompassing all of its time points listed in rows. A breakdown of the total imaging data is also available at the bottom of the table.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES ((SELECT helpID FROM (SELECT * FROM `help`) as temp WHERE hash=md5('statistics')),md5('statistics_site'), 'Per Instrument Statistics', 'Completion Statistics for each site are displayed, and are organized by instrument and visit label. The \"Completion Count\" column displays the number of completed entries per instrument. Each PSCID that appears in the \"Incomplete Candidates\" list was designed to be a link itself to that particular candidate’s page for the selected instrument.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='Completion Statistics for each site are displayed, and are organized by instrument and visit label. The \"Completion Count\" column displays the number of completed entries per instrument. Each PSCID that appears in the \"Incomplete Candidates\" list was designed to be a link itself to that particular candidate’s page for the selected instrument.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES ((SELECT helpID FROM (SELECT * FROM `help`) as temp WHERE hash=md5('statistics')),md5('statistics_mri_site'), 'Imaging Integrity Statistics Breakdown', 'This page contains a table listing various Scan Insertion Issues in the left-most column. In the \"Incomplete Entries\" column, clicking on the candidate IDs will redirect the user to the appropriate Imaging form or dataset for that candidate.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='This page contains a table listing various Scan Insertion Issues in the left-most column. In the \"Incomplete Entries\" column, clicking on the candidate IDs will redirect the user to the appropriate Imaging form or dataset for that candidate.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('datadict'), 'Data Dictionary', 'As the title suggests, the Data Dictionary houses definitions or descriptions for various instrument fields. In addition, like many other modules in LORIS, the Data Dictionary features a Selection Filter where the user may select from a number of drop-down select boxes and click \"Show Data\" to quickly locate desired information. The selection filter can be hidden using the upward arrow icon, and reopened using the downward arrow icon.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='As the title suggests, the Data Dictionary houses definitions or descriptions for various instrument fields. In addition, like many other modules in LORIS, the Data Dictionary features a Selection Filter where the user may select from a number of drop-down select boxes and click \"Show Data\" to quickly locate desired information. The selection filter can be hidden using the upward arrow icon, and reopened using the downward arrow icon.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('data_team_helper'), 'Data Team Helper',  'The Data Team Helper allows the users to find out what the outstanding behaviourial feedbacks, conflicts and incomplete forms for the given candidate/field/instrument by filtering for the given visit-Label and Instrument. This module will also display the \"Single Data_entry Completion Percentage\" for the given visit and instrument, only if the instrument is selected.\n\r The resulting table:\n - displays all fields from the selected instrument (or All Instruments if this feature was chosen) for the specified visit. \n - Under the column \"Names (Instrument_Fieldname)\", the given field name is clickable which allows the user to download the data for the given field/instrument in the .csv format, containing the data and data_entry (i.e complete, in_progress or null)  for every candidate for the given field and visit.\n- The \"Link to Bvl Feedback\" column contains links to pop-up feedback window, where feedback for a particular field and candidate was previously entered, based on the field-name. If such information was never entered, users will see \"N/A\". \n- For existing links to behavioural feedback, the corresponding status for this field will be listed under the column \"Feedback Status\". \n- Any candidates with conflicts between initial and double data entry will be listed under the \"Conflicts\" column. Clicking on the candidate\’s link will open up a new tab, directing the user to the Conflict Resolver for the corresponding field and visit label for that candidate. \n- A list of candidates for which data entry is incomplete for that particular instrument and visit label will be listed under \"Incomplete Candidates\". The ID of each candidate listed is a link to that candidate’s data entry page.\n','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='The Data Team Helper allows the users to find out what the outstanding behaviourial feedbacks, conflicts and incomplete forms for the given candidate/field/instrument by filtering for the given visit-Label and Instrument. This module will also display the \"Single Data_entry Completion Percentage\" for the given visit and instrument, only if the instrument is selected.\n\r The resulting table:\n - displays all fields from the selected instrument (or All Instruments if this feature was chosen) for the specified visit. \n - Under the column \"Names (Instrument_Fieldname)\", the given field name is clickable which allows the user to download the data for the given field/instrument in the .csv format, containing the data and data_entry (i.e complete, in_progress or null)  for every candidate for the given field and visit.\n- The \"Link to Bvl Feedback\" column contains links to pop-up feedback window, where feedback for a particular field and candidate was previously entered, based on the field-name. If such information was never entered, users will see \"N/A\". \n- For existing links to behavioural feedback, the corresponding status for this field will be listed under the column \"Feedback Status\". \n- Any candidates with conflicts between initial and double data entry will be listed under the \"Conflicts\" column. Clicking on the candidate\’s link will open up a new tab, directing the user to the Conflict Resolver for the corresponding field and visit label for that candidate. \n- A list of candidates for which data entry is incomplete for that particular instrument and visit label will be listed under \"Incomplete Candidates\". The ID of each candidate listed is a link to that candidate’s data entry page.\n';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('data_integrity_flag'), 'Data Integrity','The Data Integrity module provides a direct way for users to view and update behavioural feedback at-a-glance, without requiring the user to navigate to the individual instrument forms or use the behavioural feedback pop-up window. \r\n\r\nThe Selection Filter allows users to search for existing feedback for a particular Visit Label, Instrument and User. Upon clicking \"Show Data\", the user can add a new flag or behavioural feedback comment within the table directly below the Selection Filter. Users can also search through existing behavioural feedback results within the third table on the page. When adding new behavioural feedback, the date on which the flag was created must be indicated, as well as the Flag Status from the dropdown menu, and any additional comments. The \"Save\" button must be clicked in order to save the new behavioural flag. Click \"Show updated data\" or refresh the page to see the most recent behavioural flag within the results table.\r\n\r\nWithin the results table (third table on the Data Integrity page), links under the \"Instrument\" column will redirect the user to a detailed summary of each field for that particular instrument along with links to behavioural feedback and to incomplete candidates. Users can also view the date the flag was submitted, the Flag Status, any comments, data cleaning feedback, and UserID. Note, Flag Status is based on the codes used in the dropdown of the second table, where 1=Ready for Review, 2= Review Completed, 3=Feedbacks Closed, and 4=Finalization.' ,'2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='The Data Integrity module provides a direct way for users to view and update behavioural feedback at-a-glance, without requiring the user to navigate to the individual instrument forms or use the behavioural feedback pop-up window. \r\n\r\nThe Selection Filter allows users to search for existing feedback for a particular Visit Label, Instrument and User. Upon clicking \"Show Data\", the user can add a new flag or behavioural feedback comment within the table directly below the Selection Filter. Users can also search through existing behavioural feedback results within the third table on the page. When adding new behavioural feedback, the date on which the flag was created must be indicated, as well as the Flag Status from the dropdown menu, and any additional comments. The \"Save\" button must be clicked in order to save the new behavioural flag. Click \"Show updated data\" or refresh the page to see the most recent behavioural flag within the results table.\r\n\r\nWithin the results table (third table on the Data Integrity page), links under the \"Instrument\" column will redirect the user to a detailed summary of each field for that particular instrument along with links to behavioural feedback and to incomplete candidates. Users can also view the date the flag was submitted, the Flag Status, any comments, data cleaning feedback, and UserID. Note, Flag Status is based on the codes used in the dropdown of the second table, where 1=Ready for Review, 2= Review Completed, 3=Feedbacks Closed, and 4=Finalization.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('user_accounts'), 'User Accounts', 'This feature of LORIS allows an administrator to create accounts and set the Roles and Permissions for database users. Like many modules in LORIS, User Accounts has a Selection Filter which allows the user to quickly search for desired information. The Selection Filter panel can be hidden using the upward arrow icon , and reopened using the downward arrow icon. Once the appropriate user has been found, the profile can be viewed by selecting the \"Username\" outlined in navy text.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='This feature of LORIS allows an administrator to create accounts and set the Roles and Permissions for database users. Like many modules in LORIS, User Accounts has a Selection Filter which allows the user to quickly search for desired information. The Selection Filter panel can be hidden using the upward arrow icon , and reopened using the downward arrow icon. Once the appropriate user has been found, the profile can be viewed by selecting the \"Username\" outlined in navy text.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES ((SELECT helpID FROM (SELECT * FROM `help`) as temp WHERE hash=md5('user_accounts')), md5('edit_user'), 'Add or Edit User Accounts', 'On this page, the user may enter and modify detailed information including address, degree, position and password. By checking a series of boxes under \"Roles\" and \"Permissions\" an administrator-level user may add, change or remove a user’s access to areas or functions in the database. After making changes, the administrator must click \"Save\" to ensure the permissions are updated. Note that permissions may be \"Reset\" by selecting the appropriate button. The administrator may also return to the list of users by selecting \"Back\".' ,'2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='On this page, the user may enter and modify detailed information including address, degree, position and password. By checking a series of boxes under \"Roles\" and \"Permissions\" an administrator-level user may add, change or remove a user’s access to areas or functions in the database. After making changes, the administrator must click \"Save\" to ensure the permissions are updated. Note that permissions may be \"Reset\" by selecting the appropriate button. The administrator may also return to the list of users by selecting \"Back\".';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('instrument_builder'), 'Instrument Builder', 'The Instrument Builder module is designed to create new behavioural forms on the database. Existing instruments that were created using the instrument builder can be added under the \"Load Instrument (optional)\" heading. Most new instruments will be generated through the \"Create Instrument\" tab.\r\nThere are a series of buttons that specify the type of information each field in the form conveys.\r\n<b>Field Types, by Category :</b>\r\n<u>Information</u>\r\n• Header :: Used to specify a title for the page or section of the instrument. Text will appear in boldface at the center of the page.\r\n• Label :: Functions as a subtitle to introduce a subset of questions\r\n• Scored Field :: Specifies any field that will have data entry. The type of scored field should be indicated under the \"data entry\" section\r\n<u>Data Entry</u>\r\n• Textbox :: Used for fields with free text, preferably short answers\r\n• Textarea :: Used for free text fields with longer inputs such as general comments, etc.\r\n• Dropdown :: Used for forced choice fields. The options for the dropdown menu need to be specified.  Once \"Dropdown\" is selected, the user will see an added row labeled as \"Dropdown option\". Once the option has been entered, press \"add option\". This new option should appear in the \"preview\" menu. The field \"not_answered\" will be automatically added to each dropdown menu. Once all options have been added, click \"add row\". For subsequent dropdown scored fields, previous dropdown options will be preserved. If the user would like to create a new dropdown menu, click \"reset\".\r\n• Multiselect :: Used for fields that have a select box where multiple options can be chosen.\r\n• Date :: Used for creating a date field such as Date of Birth\r\n• Numeric :: Used for creating a numeric field such as Height, Weight, etc.\r\n<u>Formatting</u>\r\n• Blank Line :: Can be used to separate sections within the same page of an instrument. The \"Question Name\" and \"Question Text\" can be left blank.\r\n• Page Break :: Used to add a new page within the instrument. The \"Question Text\" can be populated with the name of the new page, if desired.\r\n \r\n<b>Note on Question Names: </b>\r\n\"Question Name\" is the field name as it appears (only) in the back-end of the database. The \"Question Text\" will be seen by users on the database once the instrument has been uploaded. Users have the option of entering the same content into both the \"Question Name\" and \"Question Text\" boxes, but generally the \"Question Name\" is more brief and is formatted with the question number (ie. q1_*). Question names are unique and should not contain spaces. \r\n\r\nAfter each question entry, click \"add row\" to add the new field to the instrument code. \r\nThis should appear in table format at the bottom of the page. Each row can also be added to the table simply by pressing the enter key.\r\nIf a mistake was made while creating the instrument, users can directly edit the field names in the table at the bottom of the page. By clicking on the field name, a cursor should appear. The user can then make the appropriate changes and hit enter once finished. It is also possible to rearrange or delete fields using the \"Options\" column.\r\n \r\nOnce the user is satisfied with their instrument, it can be saved and validated.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='The Instrument Builder module is designed to create new behavioural forms on the database. Existing instruments that were created using the instrument builder can be added under the \"Load Instrument (optional)\" heading. Most new instruments will be generated through the \"Create Instrument\" tab.\r\nThere are a series of buttons that specify the type of information each field in the form conveys.\r\n<b>Field Types, by Category :</b>\r\n<u>Information</u>\r\n• Header :: Used to specify a title for the page or section of the instrument. Text will appear in boldface at the center of the page.\r\n• Label :: Functions as a subtitle to introduce a subset of questions\r\n• Scored Field :: Specifies any field that will have data entry. The type of scored field should be indicated under the \"data entry\" section\r\n<u>Data Entry</u>\r\n• Textbox :: Used for fields with free text, preferably short answers\r\n• Textarea :: Used for free text fields with longer inputs such as general comments, etc.\r\n• Dropdown :: Used for forced choice fields. The options for the dropdown menu need to be specified.  Once \"Dropdown\" is selected, the user will see an added row labeled as \"Dropdown option\". Once the option has been entered, press \"add option\". This new option should appear in the \"preview\" menu. The field \"not_answered\" will be automatically added to each dropdown menu. Once all options have been added, click \"add row\". For subsequent dropdown scored fields, previous dropdown options will be preserved. If the user would like to create a new dropdown menu, click \"reset\".\r\n• Multiselect :: Used for fields that have a select box where multiple options can be chosen.\r\n• Date :: Used for creating a date field such as Date of Birth\r\n• Numeric :: Used for creating a numeric field such as Height, Weight, etc.\r\n<u>Formatting</u>\r\n• Blank Line :: Can be used to separate sections within the same page of an instrument. The \"Question Name\" and \"Question Text\" can be left blank.\r\n• Page Break :: Used to add a new page within the instrument. The \"Question Text\" can be populated with the name of the new page, if desired.\r\n \r\n<b>Note on Question Names: </b>\r\n\"Question Name\" is the field name as it appears (only) in the back-end of the database. The \"Question Text\" will be seen by users on the database once the instrument has been uploaded. Users have the option of entering the same content into both the \"Question Name\" and \"Question Text\" boxes, but generally the \"Question Name\" is more brief and is formatted with the question number (ie. q1_*). Question names are unique and should not contain spaces. \r\n\r\nAfter each question entry, click \"add row\" to add the new field to the instrument code. \r\nThis should appear in table format at the bottom of the page. Each row can also be added to the table simply by pressing the enter key.\r\nIf a mistake was made while creating the instrument, users can directly edit the field names in the table at the bottom of the page. By clicking on the field name, a cursor should appear. The user can then make the appropriate changes and hit enter once finished. It is also possible to rearrange or delete fields using the \"Options\" column.\r\n \r\nOnce the user is satisfied with their instrument, it can be saved and validated.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES ((SELECT helpID FROM (SELECT * FROM `help`) as temp WHERE hash=md5('user_accounts')),md5('my_preferences'), 'My Preferences', 'This module allows the user to modify first name, last name, email address, and current password, as well as Document Repository preferences. All changes made to the user’s preferences must be saved by clicking \"Save\" after completion. Information can be reset using the \"Reset\" button.','2014-09-01 00:00:00',NULL)
ON DUPLICATE KEY UPDATE content='This module allows the user to modify first name, last name, email address, and current password, as well as Document Repository preferences. All changes made to the user’s preferences must be saved by clicking \"Save\" after completion. Information can be reset using the \"Reset\" button.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1, md5('configuration'), 'Configuration', 'The Configuration Module allows you to edit configuration settings from the front end. The configuration values are stored in the database, instead of in the config.xml file. Any settings that are not currently in the Configuration Module can still be found and edited from the config.xml file.\r\n\r\nTo edit any configuration settings, navigate to the field that you\'d like to edit in the module, and edit or insert a new value.\r\n\r\nSome configuration settings can accept multiple values. For these settings, you can add additional fields by pressing the \"Add Field\" button. This will create an empty form area where you can insert new values. You can delete any of the settings by pressing the red delete button attached to the form.\r\n\r\nPress the submit button at the bottom of the page to save your changes. You must press the submit button that is on the page where you are making the changes for the changes to be stored in the database. If you press the submit button on another configuration page, it will not store any changes made on other pages.\r\n\r\nCare should be taken when editing the fields as there is currently no way to revert changes. You can reset the form to its values on page load by pressing the reset button. However, this will not undo any changes made before the submit button has been pressed.', '2014-09-01 00:00:00', NULL)
ON DUPLICATE KEY UPDATE content='The Configuration Module allows you to edit configuration settings from the front end. The configuration values are stored in the database, instead of in the config.xml file. Any settings that are not currently in the Configuration Module can still be found and edited from the config.xml file.\r\n\r\nTo edit any configuration settings, navigate to the field that you\'d like to edit in the module, and edit or insert a new value.\r\n\r\nSome configuration settings can accept multiple values. For these settings, you can add additional fields by pressing the \"Add Field\" button. This will create an empty form area where you can insert new values. You can delete any of the settings by pressing the red delete button attached to the form.\r\n\r\nPress the submit button at the bottom of the page to save your changes. You must press the submit button that is on the page where you are making the changes for the changes to be stored in the database. If you press the submit button on another configuration page, it will not store any changes made on other pages.\r\n\r\nCare should be taken when editing the fields as there is currently no way to revert changes. You can reset the form to its values on page load by pressing the reset button. However, this will not undo any changes made before the submit button has been pressed.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('mri_violations'),'MRI Protocol Violations','The MRI Violations Module has a Selection Filter function to allow users to search for a particular scan that violates MRI protocol. By clicking the button Show Data after selecting certain search options, a box will appear containing all the search results, which are organized by Patient Name, Project, Subproject, Site, Time Run, MincFile name, MincFile Violated, Series Description Or Scan Type, Problem, and Resolution Status. \r\n Clicking on a link under the MincFileViolated column will open a pop-up window of the scan on Brainbrowser. \r\n Clicking on a link under the Problem column will allow the user to see the issues for that particular patient and visit label. The issues are organized by Patient Name, CandID, Visit Label, Scan Type, Severity, Header, Value, ValidRange, ValidRegex, and SeriesUID. \r\n Once a particular MRI Protocol Violation has been resolved, the Resolution Status can be updated using the drop-down menu to select one of the following options: Reran, Emailed site/pending, Inserted, Rejected, Inserted with flag, Other. Otherwise, the drop-down menu is left as \"Unresolved\", serving as a message to other users that an issue still exists.', '2016-02-23 00:00:00', NULL)
ON DUPLICATE KEY UPDATE content='The MRI Violations Module has a Selection Filter function to allow users to search for a particular scan that violates MRI protocol. By clicking the button Show Data after selecting certain search options, a box will appear containing all the search results, which are organized by Patient Name, Project, Subproject, Site, Time Run, MincFile name, MincFile Violated, Series Description Or Scan Type, Problem, and Resolution Status. \r\n Clicking on a link under the MincFileViolated column will open a pop-up window of the scan on Brainbrowser. \r\n Clicking on a link under the Problem column will allow the user to see the issues for that particular patient and visit label. The issues are organized by Patient Name, CandID, Visit Label, Scan Type, Severity, Header, Value, ValidRange, ValidRegex, and SeriesUID. \r\n Once a particular MRI Protocol Violation has been resolved, the Resolution Status can be updated using the drop-down menu to select one of the following options: Reran, Emailed site/pending, Inserted, Rejected, Inserted with flag, Other. Otherwise, the drop-down menu is left as \"Unresolved\", serving as a message to other users that an issue still exists.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('training'),'Training','The Training Module allows users to view training content in three columns: Certifications to Complete, Completed Certifications, and Online Training. \r\n Certifications to Complete consists of available existing training modules that the user has not yet completed. Completed Certifications allow the user to browse the training content for any of the instruments that the user has already been certified for. Online Training allows the user to access training for certain instruments online.','2016-02-23 00:00:00', NULL)
ON DUPLICATE KEY UPDATE content='The Training Module allows users to view training content in three columns: Certifications to Complete, Completed Certifications, and Online Training. \r\n Certifications to Complete consists of available existing training modules that the user has not yet completed. Completed Certifications allow the user to browse the training content for any of the instruments that the user has already been certified for. Online Training allows the user to access training for certain instruments online.';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('survey_accounts'),'Survey Accounts','The Survey Accounts Module can be used to create a survey form, which creates a unique URL that can either be emailed to the participants to be completed online or loaded as a webpage on a desktop at the site for the participants to fill out during their visit.\r\n This page contains a list of all forms created for direct data entry by study participants. You can filter this list of surveys based on the Visit, Email, PSCID and Instrument. \r\n To create a survey, click on the \"Add Survey\" button. See additional help on the \"Add Survey\" page for information on how to create a survey. Once the survey has been created, click on the URL to access the online survey.\r\n Survey Status Information:\r\nCreated: Indicates that the survey was created. This is the default status once a survey is created using the \"Add Survey\" page.\r\n Sent: Indicates that the survey was created and an email with the survey link was sent to the participant. This is the default status once a survey is created and sent by email using the \"Add Survey\" window. \r\n In Progress: indicates that the survey was accessed. This status can either be attained when data entry staff click on the URL to load the page for the participants or when participants access the link sent to them via email. \r\n Complete: This indicates that the survey was completed and submitted. After this stage, the participant will not be able to go back and change his/her entries. Clicking on the URL will display a page with the message \"Data has already been submitted\".','2016-02-23 00:00:00', NULL)
ON DUPLICATE KEY UPDATE content='The Survey Accounts Module can be used to create a survey form, which creates a unique URL that can either be emailed to the participants to be completed online or loaded as a webpage on a desktop at the site for the participants to fill out during their visit.\r\n This page contains a list of all forms created for direct data entry by study participants. You can filter this list of surveys based on the Visit, Email, PSCID and Instrument. \r\n To create a survey, click on the \"Add Survey\" button. See additional help on the \"Add Survey\" page for information on how to create a survey. Once the survey has been created, click on the URL to access the online survey.\r\n Survey Status Information:\r\nCreated: Indicates that the survey was created. This is the default status once a survey is created using the \"Add Survey\" page.\r\n Sent: Indicates that the survey was created and an email with the survey link was sent to the participant. This is the default status once a survey is created and sent by email using the \"Add Survey\" window. \r\n In Progress: indicates that the survey was accessed. This status can either be attained when data entry staff click on the URL to load the page for the participants or when participants access the link sent to them via email. \r\n Complete: This indicates that the survey was completed and submitted. After this stage, the participant will not be able to go back and change his/her entries. Clicking on the URL will display a page with the message \"Data has already been submitted\".';

INSERT INTO `help` (parentID, hash, topic, content, created, updated) VALUES (-1,md5('dataquery'),'Data Query Tool','The Data Query Tool (DQT) is a simple and easy-to-use interface to your LORIS database. The DQT enables users to query and download data.\r\n The DQT can be used to define or use your query by using the following tabs:\r\n Info: \r\n A quick summary of each of the DQT tabs. It also states the time of last data cache update. \r\n\r\n Define Fields \r\n Define the fields to be added to your query here. \r\n\r\n Define Filters \r\n Define the criteria to filter the data for your query here. \r\n\r\n View Data \r\n See the results of your query. \r\n \r\n Statistical Analysis \r\n Visualize or see basic statistical measures from your query here. \r\n\r\n Load Saved Query \r\n Load a previously saved query (by name) by selecting from this menu. \r\n\r\n Manage Saved Queries \r\n Either save your current query or see the criteria of previously saved queries here. \r\n\r\n <b>Define Fields</b>\r\n The \"Define Fields\" tab is where you select the data categories and the specific data fields that you want added to your query. By default, all categories of data fields are displayed in a list when you first enter the tab. If you click on any category, its field names and field descriptions will appear in a table. If the number of fields in the chosen category exceeds the display limit per page, the results may be displayed on subsequent pages within the table, accessible via the page number buttons found by scrolling toward the bottom of the page. Any fields that are defined for the current query are listed on the right-hand side (subject to change). If there are no fields defined for the current query, this list is not shown. Time points can be specified within the field in the \"Define Fields\" tab or in the \"Define Filters\" tab. \r\n\r\n The options to add fields to your query are as follows: \r\n\r\n <u>Option 1:</u> Add Using Dropdown \r\n Fields can be searched for using the list of categories of data fields. After clicking the desired instrument, a list of fields are displayed. Clicking on a field row will highlight it and add it to the list of selected fields for your current query. \r\n\r\n <u>Option 2:</u> Search Within Instrument \r\n Fields can be searched for using the search bar. Once the user starts typing, all matches will be displayed in an active list. Once the desired field is displayed, the field must be clicked to be added into the query. \r\n\r\n <u>Option 3:</u> Add All \r\n If all fields from a particular category should be included in the query, use this method. By clicking the \"Add All\" button above the list of categories, all fields from the category will be added. \r\n\r\n <u>Option 4:</u> Load a Saved Query \r\n To reload a saved query, click on the \"Load Saved Query\" tab. User Saved Queries and Shared Saved Queries will appear in a dropdown. User Saved Queries are queries that the current user has saved, and are listed according to Query Name. Shared Saved Queries are publicly shared, and are listed according to the user who created it and the Query Name. Once a query is selected, the DQT will retrieve and load the query fields and filters that were selected when the query was initially created. This will be displayed under the \"Define Fields\" and \"Define Filters\" tabs, respectively. \r\n\r\n If you wish to remove fields from your query, you must find the field from the list (using the Search Within Instrument search bar or in the instrument list of fields) and click on the highlighted field. This can be confirmed by checking that the field no longer appears in your list of selected fields. \r\n\r\n If you wish to remove all currently selected fields from your query, you can click \"Clear Query\" in the list of Fields. If you wish to remove all fields from a specific category, click the \"Remove All\" button above the list of categories. \r\n\r\n Once all desired fields are listed under \"Fields\", continue to the \"Define Filters\" tab to add filters to your query, or go directly to the \"View Data\" tab if your query does not require filters. \r\n\r\n <b>Define Filters</b> \r\n The \"Define Filters\" tab is where you define the criteria to filter the data for your query. Filters can be applied on any field in order to limit the set of results returned by a query. For example, you can extract data collected only at one specific site or from a particular visit. Furthermore, multiple filters can be applied with either \"And\" or \"Or\" logic. The filters are candidate specific, no longer time point and candidate specific. \r\n\r\n The data fields are grouped by category. To add a filter, select a category using the dropdown. A second dropdown will appear with all the data fields in that category. Once a data field is specified, dropdowns to specify the \"Operator\" and \"Value\" will appear.  \r\n\r\n Possible operators are as follows: \r\n • = equal to \r\n • != does not equal \r\n • <= less than or equal to \r\n • >= greater than or equal to \r\n • startsWith: filter for values starting with a specific character or string \r\n • contains:  filter for values containing a specific character or string \r\n\r\n To add additional filters, click the \"Add Rule\" button and follow the instructions above. To delete any unwanted filters, click the \"Delete\" button within the specific filter. \r\n\r\n By default, the filters are set to \"And\" logic. Previously, only \"And\" logic was applied. To switch to the \"Or\" logic, click on the \"Or\" button. This sets the operator for the whole group of filters. To add a new group, click the \"Add Group\" button. This allows you to have nested filters with both \"And\" and \"Or\" logical operators. \"And\" indicates that all of its operands are true. \"Or\" indicates inclusive or, which means that one or more of its operands is true. \r\n\r\n <b>View Data</b> \r\n The \"View Data\" tab executes queries, displays query results, and allows users to download data. Select how you want the data to be arranged using the Data dropdown (cross-sectional or longitudinal). Click the \"Run Query\" button to execute the current query on the database based on the defined fields and filters. Results can be also sorted by field by clicking on the table\'s column headers. The number of results displayed per page can be modified using the \"Maximum rows per page dropdown\" at the bottom of the results table. \r\n\r\n After running a query and viewing the results, click the \"Download Table Data as CSV\" button to save the query output dataset to your computer as a comma-separated value file. If any files are included in the query output, click \"Download Data as ZIP\" to save compressed packages of the files and data to your computer. \r\n\r\n The query can also be saved for reuse, to avoid constructing the query from scratch in future. Go to the \"Manage Saved Queries\" tab and then click the \"Save Query\" button. A pop-up dialog will appear. Enter a descriptive query name. If you would like the query to be publicly shared, click on the checkbox. Then click \"Save query\" to complete the process, and the currently defined fields and filters will be saved under the specified query name. \r\n\r\n This saved query should now appear under the \"Manage Saved Queries\" tab in the \"Your currently saved queries\" table. New fields can be selected and saved under the same name to directly update the current query. See the help section for \"Saved Queries\" for further information on actions that can be performed on these previously created queries. \r\n\r\n <b>Manage Saved Queries</b> \r\n The \"Manage Saved Queries\" tab organizes new or previously saved queries. The query name, selected fields and filters for each saved query are displayed in the table. Clicking on any column header (e.g. \"Query Name\") will sort the list by that column. \r\n\r\n The current query can be saved by clicking the \"Save Current Query\" button. A pop-up dialog will appear. Enter a descriptive query name. If you would like the query to be publicly shared, click on the checkbox. Then click \"Save query\" to complete the process, and the currently defined fields and filters will be saved under the specified query name. This saved query should now appear under the \"Manage Saved Queries\" tab in the \"Your currently saved queries\" table. New fields can be selected and saved under the same name to directly update the current query. \r\n\r\n To reload a saved query, click on the \"Load Saved Query\" tab. User Saved Queries and Shared Saved Queries will appear in a dropdown. User Saved Queries are queries that the current user has saved, and are listed according to Query Name. Shared Saved Queries are publicly shared, and are listed according to the user who created it and the Query Name. Once a query is selected, the DQT will retrieve and load the query fields and filters that were selected when the query was initially created. This will be displayed under the \"Define Fields\" and \"Define Filters\" tabs, respectively.  \r\n','2016-04-01 00:00:00', NULL)
ON DUPLICATE KEY UPDATE content='The Data Query Tool (DQT) is a simple and easy-to-use interface to your LORIS database. The DQT enables users to query and download data.\r\n The DQT can be used to define or use your query by using the following tabs:\r\n Info: \r\n A quick summary of each of the DQT tabs. It also states the time of last data cache update. \r\n\r\n Define Fields \r\n Define the fields to be added to your query here. \r\n\r\n Define Filters \r\n Define the criteria to filter the data for your query here. \r\n\r\n View Data \r\n See the results of your query. \r\n \r\n Statistical Analysis \r\n Visualize or see basic statistical measures from your query here. \r\n\r\n Load Saved Query \r\n Load a previously saved query (by name) by selecting from this menu. \r\n\r\n Manage Saved Queries \r\n Either save your current query or see the criteria of previously saved queries here. \r\n\r\n <b>Define Fields</b>\r\n The \"Define Fields\" tab is where you select the data categories and the specific data fields that you want added to your query. By default, all categories of data fields are displayed in a list when you first enter the tab. If you click on any category, its field names and field descriptions will appear in a table. If the number of fields in the chosen category exceeds the display limit per page, the results may be displayed on subsequent pages within the table, accessible via the page number buttons found by scrolling toward the bottom of the page. Any fields that are defined for the current query are listed on the right-hand side (subject to change). If there are no fields defined for the current query, this list is not shown. Time points can be specified within the field in the \"Define Fields\" tab or in the \"Define Filters\" tab. \r\n\r\n The options to add fields to your query are as follows: \r\n\r\n <u>Option 1:</u> Add Using Dropdown \r\n Fields can be searched for using the list of categories of data fields. After clicking the desired instrument, a list of fields are displayed. Clicking on a field row will highlight it and add it to the list of selected fields for your current query. \r\n\r\n <u>Option 2:</u> Search Within Instrument \r\n Fields can be searched for using the search bar. Once the user starts typing, all matches will be displayed in an active list. Once the desired field is displayed, the field must be clicked to be added into the query. \r\n\r\n <u>Option 3:</u> Add All \r\n If all fields from a particular category should be included in the query, use this method. By clicking the \"Add All\" button above the list of categories, all fields from the category will be added. \r\n\r\n <u>Option 4:</u> Load a Saved Query \r\n To reload a saved query, click on the \"Load Saved Query\" tab. User Saved Queries and Shared Saved Queries will appear in a dropdown. User Saved Queries are queries that the current user has saved, and are listed according to Query Name. Shared Saved Queries are publicly shared, and are listed according to the user who created it and the Query Name. Once a query is selected, the DQT will retrieve and load the query fields and filters that were selected when the query was initially created. This will be displayed under the \"Define Fields\" and \"Define Filters\" tabs, respectively. \r\n\r\n If you wish to remove fields from your query, you must find the field from the list (using the Search Within Instrument search bar or in the instrument list of fields) and click on the highlighted field. This can be confirmed by checking that the field no longer appears in your list of selected fields. \r\n\r\n If you wish to remove all currently selected fields from your query, you can click \"Clear Query\" in the list of Fields. If you wish to remove all fields from a specific category, click the \"Remove All\" button above the list of categories. \r\n\r\n Once all desired fields are listed under \"Fields\", continue to the \"Define Filters\" tab to add filters to your query, or go directly to the \"View Data\" tab if your query does not require filters. \r\n\r\n <b>Define Filters</b> \r\n The \"Define Filters\" tab is where you define the criteria to filter the data for your query. Filters can be applied on any field in order to limit the set of results returned by a query. For example, you can extract data collected only at one specific site or from a particular visit. Furthermore, multiple filters can be applied with either \"And\" or \"Or\" logic. The filters are candidate specific, no longer time point and candidate specific. \r\n\r\n The data fields are grouped by category. To add a filter, select a category using the dropdown. A second dropdown will appear with all the data fields in that category. Once a data field is specified, dropdowns to specify the \"Operator\" and \"Value\" will appear.  \r\n\r\n Possible operators are as follows: \r\n • = equal to \r\n • != does not equal \r\n • <= less than or equal to \r\n • >= greater than or equal to \r\n • startsWith: filter for values starting with a specific character or string \r\n • contains:  filter for values containing a specific character or string \r\n\r\n To add additional filters, click the \"Add Rule\" button and follow the instructions above. To delete any unwanted filters, click the \"Delete\" button within the specific filter. \r\n\r\n By default, the filters are set to \"And\" logic. Previously, only \"And\" logic was applied. To switch to the \"Or\" logic, click on the \"Or\" button. This sets the operator for the whole group of filters. To add a new group, click the \"Add Group\" button. This allows you to have nested filters with both \"And\" and \"Or\" logical operators. \"And\" indicates that all of its operands are true. \"Or\" indicates inclusive or, which means that one or more of its operands is true. \r\n\r\n <b>View Data</b> \r\n The \"View Data\" tab executes queries, displays query results, and allows users to download data. Select how you want the data to be arranged using the Data dropdown (cross-sectional or longitudinal). Click the \"Run Query\" button to execute the current query on the database based on the defined fields and filters. Results can be also sorted by field by clicking on the table\'s column headers. The number of results displayed per page can be modified using the \"Maximum rows per page dropdown\" at the bottom of the results table. \r\n\r\n After running a query and viewing the results, click the \"Download Table Data as CSV\" button to save the query output dataset to your computer as a comma-separated value file. If any files are included in the query output, click \"Download Data as ZIP\" to save compressed packages of the files and data to your computer. \r\n\r\n The query can also be saved for reuse, to avoid constructing the query from scratch in future. Go to the \"Manage Saved Queries\" tab and then click the \"Save Query\" button. A pop-up dialog will appear. Enter a descriptive query name. If you would like the query to be publicly shared, click on the checkbox. Then click \"Save query\" to complete the process, and the currently defined fields and filters will be saved under the specified query name. \r\n\r\n This saved query should now appear under the \"Manage Saved Queries\" tab in the \"Your currently saved queries\" table. New fields can be selected and saved under the same name to directly update the current query. See the help section for \"Saved Queries\" for further information on actions that can be performed on these previously created queries. \r\n\r\n <b>Manage Saved Queries</b> \r\n The \"Manage Saved Queries\" tab organizes new or previously saved queries. The query name, selected fields and filters for each saved query are displayed in the table. Clicking on any column header (e.g. \"Query Name\") will sort the list by that column. \r\n\r\n The current query can be saved by clicking the \"Save Current Query\" button. A pop-up dialog will appear. Enter a descriptive query name. If you would like the query to be publicly shared, click on the checkbox. Then click \"Save query\" to complete the process, and the currently defined fields and filters will be saved under the specified query name. This saved query should now appear under the \"Manage Saved Queries\" tab in the \"Your currently saved queries\" table. New fields can be selected and saved under the same name to directly update the current query. \r\n\r\n To reload a saved query, click on the \"Load Saved Query\" tab. User Saved Queries and Shared Saved Queries will appear in a dropdown. User Saved Queries are queries that the current user has saved, and are listed according to Query Name. Shared Saved Queries are publicly shared, and are listed according to the user who created it and the Query Name. Once a query is selected, the DQT will retrieve and load the query fields and filters that were selected when the query was initially created. This will be displayed under the \"Define Fields\" and \"Define Filters\" tabs, respectively.  \r\n';

-- 2016-06-22-UpdateGithubExternalLinks.sql
UPDATE ExternalLinks SET LinkURL ='https://github.com/aces/Loris' WHERE LinkText='GitHub';

-- 2016-06-29-adding_filetypes_to_new_table.sql
-- patch creating FileTypes table for existing projects and adding foreign keys to other tables
CREATE TABLE `ImagingFileTypes` (
 `type` varchar(255) NOT NULL PRIMARY KEY
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `ImagingFileTypes` VALUES
            ('mnc'),
            ('obj'),
            ('xfm'),
            ('xfmmnc'),
            ('imp'),
            ('vertstat'),
            ('xml'),
            ('txt'),
            ('nii'),
            ('nii.gz'),
            ('nrrd');

ALTER TABLE `mri_processing_protocol` MODIFY `FileType` VARCHAR(255) DEFAULT NULL;
ALTER TABLE `mri_processing_protocol` ADD FOREIGN KEY (`FileType`) REFERENCES `ImagingFileTypes`(`type`);
INSERT IGNORE INTO ImagingFileTypes (TYPE) SELECT DISTINCT FileType FROM files;
ALTER TABLE `files` MODIFY `FileType` VARCHAR(255) DEFAULT NULL;
UPDATE files SET FileType = SUBSTRING_INDEX(File,'.',-1) WHERE FileType = '';
ALTER TABLE `files` ADD FOREIGN KEY (`FileType`) REFERENCES `ImagingFileTypes`(`type`);

-- 2016-07-06-UniquePermissionname.sql
CREATE TEMPORARY TABLE `new_permissions` (   `permID` int(10) unsigned NOT NULL auto_increment,   `code` varchar(255) NOT NULL default '' UNIQUE,   `description` varchar(255) NOT NULL default '',   `categoryID` int(10) DEFAULT NULL,   PRIMARY KEY  (`permID`) ) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

INSERT INTO new_permissions SELECT permID, code, description, categoryID FROM permissions WHERE permID IN (select MIN(permID) from permissions GROUP BY code);

UPDATE IGNORE user_perm_rel a LEFT JOIN permissions b ON a.permID = b.permID LEFT JOIN new_permissions c ON b.code = c.code SET a.permID = c.permID WHERE b.permID <> c.permID;

DELETE FROM permissions WHERE permID not in (select permID from new_permissions);

DELETE FROM user_perm_rel WHERE permID NOT IN (SELECT permID from new_permissions);

UPDATE IGNORE LorisMenuPermissions a LEFT JOIN permissions b ON a.PermID = b.permID LEFT JOIN new_permissions c ON b.code = c.code SET a.PermID = c.permID WHERE b.permID <> c.permID;

DELETE FROM LorisMenuPermissions WHERE PermID NOT IN (SELECT permID from new_permissions);

ALTER TABLE permissions ADD CONSTRAINT code_name UNIQUE (code);

-- 2016-07-07-AddTarchiveSeriesIDTotarchive_filesTable.sql
ALTER TABLE tarchive_files ADD `TarchiveSeriesID` INT(11) DEFAULT NULL;
ALTER TABLE tarchive_files ADD CONSTRAINT `tarchive_files_TarchiveSeriesID_fk` FOREIGN KEY (`TarchiveSeriesID`) REFERENCES tarchive_series(`TarchiveSeriesID`);

-- 2016-08-01-UpdateHelpChars.sql
UPDATE `help` SET content='Welcome to the LORIS database. \r\nThis Help section provides you with guidelines for adding and updating information in the database. On each page, click on the question mark icon in the Menu Bar across the top of the screen to access detailed information specific to the current page.\r\n\r\nUpon logging into the LORIS database, the user will come to the home page. Here, key user information can automatically be seen at the right-hand side of the Menu Bar at the top of the screen indicating the user’s name and the site to which the user belongs. To return to the home page at any time, the user can click on the \"LORIS\" button at the far left corner of the Menu Bar.\r\nThe menus spanning horizontally across the Menu Bar represent different categories of features within the database that allow data acquisition, storage, processing and dissemination using the web based interface. Please note that when accessing LORIS via tablet, mobile device, or in a narrow-width desktop browser window, these main menus will be hidden under the downward-pointing arrow icon in the Menu Bar. Clicking on this button will show or hide all main menus in a vertical list.\r\nThere are five main drop-down menus: Candidate, Clinical, Imaging, Reports and Admin. Hover over on each menu to display a list of features or modules, organized by category:\r\n- Candidate: New Profile, Access Profile\r\n- Clinical: Reliability Coding, Conflict Resolver, Certification, Document Repository\r\n- Imaging: Radiological Review, DICOM Archive, Imaging Browser, Imaging Uploader\r\n- Reports: Database Statistics, Data Dictionary, Data Querying Tool, Data Team Helper, Data Integrity Tool\r\n- Admin: User Accounts, Instrument Builder\r\n\r\nOn the right side of the Menu Bar there are two icons linking to the Feedback Module, a pencil on paper icon , and Help, a question mark icon. Each of these modules will open in a new pop-up window, or new tab on a mobile browser.\r\n\r\nAll five main menus, the two icons listed above, the user’s site and the user’s name are accessible from any page in LORIS, via the Menu Bar at the top of the screen. \r\n\r\nTo log out of the database, click on the username displayed at the right edge of the Menu Bar, and select the \"Log Out\" option from the drop-down menu. \r\n\r\nThe \"My Preferences\" feature, also listed in this menu, can be used to update certain user profile settings and change the user’s password. \r\n'
WHERE content='Welcome to the LORIS database. \r\nThis Help section provides you with guidelines for adding and updating information in the database. On each page, click on the question-mark icon in the Menu Bar across the top of the screen to access detailed information specific to the page.\r\n\r\nUpon logging into the LORIS database, the user will come to the home page. Here, key user information can automatically be seen at the right-hand side of the Menu Bar at the top of the screen indicating the user’s name and the site to which the user belongs. To return to the home page at any time, the user can click on the \"LORIS\" button at the far left corner of the Menu Bar.\r\nThe menus spanning horizontally across the Menu Bar represent different categories of features within the database that allow data acquisition, storage, processing and dissemination using the web based interface. Please note that when accessing LORIS via tablet, mobile device, or in a narrow-width desktop browser window, these main menus will be hidden under the downward-pointing arrow icon in the Menu Bar. Clicking on this button will show or hide all main menus in a vertical list.\r\nThere are five main drop-down menus: Candidate, Clinical, Imaging, Reports and Admin. Hover over on each menu to display a list of features or modules, organized by category:\r\n- Candidate: New Profile, Access Profile\r\n- Clinical: Reliability Coding, Conflict Resolver, Certification, Document Repository\r\n- Imaging: Radiological Review, DICOM Archive, Imaging Browser, Imaging Uploader\r\n- Reports: Database Statistics, Data Dictionary, Data Querying Tool, Data Team Helper, Data Integrity Tool\r\n- Admin: User Accounts, Instrument Builder\r\n\r\nOn the right side of the Menu Bar there are two icons linking to the Feedback Module, a pencil on paper icon , and Help, a question mark icon. Each of these modules will open in a new pop-up window, or new tab on a mobile browser.\r\n\r\nAll five main menus, the two icons listed above, the user’s site and the user’s name are accessible from any page in LORIS, via the Menu Bar at the top of the screen. \r\n\r\nTo log out of the database, click on the username displayed at the right edge of the Menu Bar, and select the \"Log Out\" option from the drop-down menu. \r\n\r\nThe \"My Preferences\" feature, also listed in this menu, can be used to update certain user profile settings and change the user’s password. \r\n';

UPDATE `help` SET content='By clicking on \"New Profile\" under the Candidate Menu, users with appropriate permissions can register a new candidate for their study site. Once inside the \"New Profile\" page, the \"Date of Birth\" field must be entered twice, in order to minimize error in data entry. \r\nThe PSCID refers to an alphanumeric identifier entered by the user. This identifier is typically comprised of a site-specific code (e.g., AAA), followed by a numeric code specific to the candidate at that site (e.g., AAA0000). Other fields are customized for specific projects and can be configured as drop-down fields or user input fields. \r\n\r\nOnce all the required data fields are completed, the user can click on the \"Create\" button to finish registering the candidate. It is crucial that no mistakes in data entry are made at this point, as information cannot be modified after clicking the \"Create\" button. \r\n\r\nEach new candidate will then be assigned a 6 digit numerical DCCID. The DCCID, along with the previously entered PSCID, will always be used to identify this candidate.\r\n'
WHERE content='By clicking on \"New Profile\" under the Candidate Menu, users with appropriate permissions can register a new candidate for their study site. Once inside the \"New Profile\" page, the \"Date of Birth\" field must be entered twice, in order to minimize error in data entry. \r\nThe PSCID refers to an alphanumeric identifier entered by the user. This identifier is typically comprised of a site-specific code (e.g., AAA), followed by a numeric code specific to the candidate at that site (e.g., AAA0000). Other fields are customized for specific projects and can be configured as drop-down fields or user input fields. \r\n\r\nOnce all the required data fields are completed, the user can click on the \"Create\" button to finish registering the candidate. It is crucial that no mistakes in data entry are made at this point, as information cannot be modified after clicking the \"Create\" button. \r\n\r\nEach new candidate will then be assigned a 6 digit numerical DCC-ID. The DCCID, along with the previously entered PSCID, will always be used to identify this candidate.\r\n';

UPDATE `help` SET content='In many cases, the candidate`s profile will already be created. The Access Profile module, also found under the Candidate menu, allows the user to efficiently search for an existing candidate and access the related data. \r\n\r\nThere are 3 main ways to search for a candidate:\r\n\r\n<u>Option 1:</u> Using PSCID and DCCID\r\nA specific candidate profile can be accessed directly by entering both the PSCID and the DCCID in the white boxes to the right of the screen and then clicking the button \"Open Profile\". In a narrow browser window or mobile device the PSCID and DCCID fields are found below the selection filter.\r\n\r\n<u>Option 2:</u> Basic Filter Options\r\nUsers may search for particular candidates by selecting from the \"Basic\" filter options. Users may select from drop-down select boxes, and then click \"Show Data\" to view a list of candidates. If only a fragment of the candidate ID is known, the user may search for the profile by entering the known fragment, and then click show data to find the appropriate profile. For example, searching with \"531\" under \"DCCID\" will retrieve the profile of candidate DCC1107 (with full DCCID 531861).\r\n\r\n<u>Option 3:</u> Advanced Filter Options\r\nMore detailed filter options can be accessed by clicking on the \"Advanced\" button. Users will select from a number of drop-down select boxes including Site, Project, Subproject, Gender etc., and then click \"Show Data\" to view a list of candidates. To return to \"Basic\" selection filters please select \"Basic\".\r\n\r\nTo view a specific candidate’s dataset, click on the candidate’s PSCID found in blue text under the \"PSCID\" column. At the top of the table, column headings will appear underlined and show a click icon when the user hovers over the heading title. Data can be sorted in ascending order according to a given column by clicking on the column heading (i.e. DCCID, Site, PSCID etc.), and by clicking again, in descending order. In both standard and mobile view, the selection filter can be hidden by selecting the upward arrow icon, allowing easier viewing of the data. Once in this view, users can click on the downward arrow icon to display the features of the selection filter once again. This feature applies to all pages that include a Selection Filter.\r\nNote that the form remembers previously selected data such that when the user returns to the \"Access Profile\" page, the selection filter will automatically select profiles according to the last selection settings. Depending on the magnitude of the search, there may be several pages of search results for the user to look through. If \"No candidates found\" appears, this indicates no profiles matched the information specified by the selection filter(s). \r\nWhen on a mobile device or narrow browser window, the table will have a slider at the bottom of the table, facilitating scrolling of the data. The user may also hover or click the arrows that flank the table to see the remainder of the table. When scrolling through search results, the PSCID column will freeze and remain displayed on the lefthand side, to allow for easy reference and access to relevant information.'
WHERE content='In many cases, the candidate`s profile will already be created. The Access Profile module, also found under the Candidate menu, allows the user to efficiently search for an existing candidate and access the related data. \r\n\r\nThere are 3 main ways to search for a candidate:\r\n\r\n<u>Option 1:</u> Using PSC-ID and DCC-ID\r\nA specific candidate profile can be accessed directly by entering both the PSC-ID and the DCC-ID in the white boxes to the right of the screen and then clicking the button \"Open Profile\". In a narrow browser window or mobile device the PSC-ID and DCC-ID fields are found below the selection filter.\r\n\r\n<u>Option 2:</u> Basic Filter Options\r\nUsers may search for particular candidates by selecting from the \"Basic\" filter options. Users may select from drop-down select boxes, and then click \"Show Data\" to view a list of candidates. If only a fragment of the candidate ID is known, the user may search for the profile by entering the known fragment, and then click show data to find the appropriate profile. For example, searching with \"531\" under \"DCCID\" will retrieve the profile of candidate DCC1107 (with full DCCID 531861).\r\n\r\n<u>Option 3:</u> Advanced Filter Options\r\nMore detailed filter options can be accessed by clicking on the \"Advanced\" button. Users will select from a number of drop-down select boxes including Site, Project, Subproject, Gender etc., and then click \"Show Data\" to view a list of candidates. To return to \"Basic\" selection filters please select \"Basic\".\r\n\r\nTo view a specific candidate’s dataset, click on the candidate’s PSCID found in blue text under the \"PSCID\" column. At the top of the table, column headings will appear underlined and show a click icon when the user hovers over the heading title. Data can be sorted in ascending order according to a given column by clicking on the column heading (i.e. DCCID, Site, PSCID etc.), and by clicking again, in descending order. In both standard and mobile view, the selection filter can be hidden by selecting the upward arrow icon, allowing easier viewing of the data. Once in this view, users can click on the downward arrow icon to display the features of the selection filter once again. This feature applies to all pages that include a Selection Filter.\r\nNote that the form remembers previously selected data such that when the user returns to the \"Access Profile\" page, the selection filter will automatically select profiles according to the last selection settings. Depending on the magnitude of the search, there may be several pages of search results for the user to look through. If \"No candidates found\" appears, this indicates no profiles matched the information specified by the selection filter(s). \r\nWhen on a mobile device or narrow browser window, the table will have a slider at the bottom of the table, facilitating scrolling of the data. The user may also hover or click the arrows that flank the table to see the remainder of the table. When scrolling through search results, the PSC-ID column will freeze and remain displayed on the lefthand side, to allow for easy reference and access to relevant information.';

UPDATE `help` SET content='The database facilitates data collection of longitudinal studies; following the same candidates at various intervals for long periods of time. Each candidate may have several time-points stretching the duration of the study. Each time-point will be given a name called a \"Visit Label\". The time-points refer to data collection on different visits for the same candidate. Every time-point contains a subset of data collected in a given time frame with the intention of keeping this subset in a tightly related group. \r\n\r\nA new candidate time-point can be created from the Candidate Profile page by opening a specific profile and clicking \"Create Time Point\" among the Actions buttons visible above the \"List of Visits\" table. Authorized users may also edit general information about the candidate, such as adding comments and updating participant status, by clicking the \"Edit Candidate Info\" button.\r\n\r\nOnce a candidate’s profile has been opened, the PSCID and DCCID will remain at the top of the screen in white text on a banner for reference. Clicking on the candidate’s IDs in white will return the user to the Candidate Profile. \r\nBelow the candidate’s information, the user will find a list of time points under \"Visit Label (Click to Open)\". Clicking on the time point itself in navy text can open the profile for the candidate at that time point.\r\n'
WHERE content='The database facilitates data collection of longitudinal studies; following the same candidates at various intervals for long periods of time. Each candidate may have several time-points stretching the duration of the study. Each time-point will be given a name called a \"Visit Label\". The time-points refer to data collection on different visits for the same candidate. Every time-point contains a subset of data collected in a given time frame with the intention of keeping this subset in a tightly related group. \r\n\r\nA new candidate time-point can be created from the Candidate Profile page by opening a specific profile and clicking \"Create Time Point\" among the Actions buttons visible above the \"List of Visits\" table. Authorized users may also edit general information about the candidate, such as adding comments and updating participant status, by clicking the \"Edit Candidate Info\" button.\r\n\r\nOnce a candidate’s profile has been opened, the PSC-ID and DCC-ID will remain at the top of the screen in white text on a banner for reference. Clicking on the candidate’s IDs in white will return the user to the Candidate Profile. \r\nBelow the candidate’s information, the user will find a list of time points under \"Visit Label (Click to Open)\". Clicking on the time point itself in navy text can open the profile for the candidate at that time point.\r\n';

-- 2016-08-18-AddCaveatFlag_SessionTable.sql
ALTER TABLE session ADD `MRICaveat` enum('true', 'false') NOT NULL default 'false';

-- 2016-08-18-DataReleaseHelpContent.sql
INSERT INTO help (parentID, hash, topic, content, created, updated) VALUES (-1,md5('data_release'),'Data Release','The Data Release Module can be used to easily distribute packaged data releases of your study. Use the "Upload File" button to upload your file and tag it with a version based on your own version convention. Grant access to any of your users using the "Add Permission" button. These buttons will be visible only if you have the "superuser" permission.','2016-11-04 00:00:00',NULL);

-- 2016-08-18-HelpTableDefaultCreatedValue.sql
SET SESSION sql_mode = 'ALLOW_INVALID_DATES';
ALTER TABLE help CHANGE `created` `created` DATETIME DEFAULT NULL;
ALTER TABLE help CHANGE `updated` `updated` DATETIME DEFAULT NULL;
UPDATE help SET created = NULL WHERE created = '0000-00-00 00:00:00';

-- 2016-08-18-RemovingTitleFromAcknowledgements.sql
ALTER TABLE acknowledgements DROP COLUMN title;

-- 2016-08-19-IssueTracker.sql
-- Change LorisMenu engine to InnoDB so that Foreign Keys can be created
ALTER TABLE `LorisMenu` ENGINE = InnoDB;

-- Add issues tab to the Loris Menu
INSERT INTO `LorisMenu` (`Parent`, `Label`, `Link`, `Visible`, `OrderNumber`)
VALUES (5, 'Issue Tracker', 'issue_tracker/', true, 8);


-- Add user permissions
-- Reporter
INSERT INTO `permissions` (`code`, `description`, `categoryID`)
VALUES ('issue_tracker_reporter', 'Can add a new issue, edit own issue, comment on all', 2);
INSERT IGNORE INTO user_perm_rel (`userID`, `permID`) VALUES (
  (SELECT ID FROM users WHERE UserID = 'admin'), (SELECT permID FROM permissions WHERE code = 'issue_tracker_reporter')
);

-- Developer
INSERT INTO `permissions` (`code`, `description`, `categoryID`)
VALUES ('issue_tracker_developer', 'Can re-assign issues, mark issues as closed, comment on all, edit issues.', 2);
INSERT IGNORE INTO user_perm_rel (`userID`, `permID`) VALUES (
  (SELECT ID FROM users WHERE UserID = 'admin'), (SELECT permID FROM permissions WHERE code = 'issue_tracker_developer')
);

-- LorisMenuPermissions
INSERT INTO LorisMenuPermissions (MenuID, PermID)
  SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='issue_tracker_reporter' AND m.Label='Issue Tracker';

-- issuesCategories
CREATE TABLE `issues_categories` (
  `categoryID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  PRIMARY KEY (`categoryID`),
  UNIQUE KEY `categoryName` (`categoryName`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

-- issuesTable
CREATE TABLE `issues` (
  `issueID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `reporter` varchar(255) NOT NULL DEFAULT '',
  `assignee` varchar(255) DEFAULT NULL,
  `status` enum('new','acknowledged','feedback','assigned','resolved','closed') NOT NULL DEFAULT 'new',
  `priority` enum('low','normal','high','urgent','immediate') NOT NULL DEFAULT 'low',
  `module` int(10) unsigned DEFAULT NULL,
  `dateCreated` datetime DEFAULT NULL,
  `lastUpdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastUpdatedBy` varchar(255) DEFAULT NULL,
  `sessionID` int(10) unsigned DEFAULT NULL,
  `centerID` tinyint(2) unsigned DEFAULT NULL,
  `candID` int(6) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`issueID`),
  KEY `fk_issues_1` (`reporter`),
  KEY `fk_issues_2` (`assignee`),
  KEY `fk_issues_3` (`candID`),
  KEY `fk_issues_4` (`sessionID`),
  KEY `fk_issues_5` (`centerID`),
  KEY `fk_issues_6` (`lastUpdatedBy`),
  KEY `fk_issues_8` (`category`),
  CONSTRAINT `fk_issues_8` FOREIGN KEY (`category`) REFERENCES `issues_categories` (`categoryName`),
  CONSTRAINT `fk_issues_1` FOREIGN KEY (`reporter`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_issues_2` FOREIGN KEY (`assignee`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_issues_3` FOREIGN KEY (`candID`) REFERENCES `candidate` (`CandID`),
  CONSTRAINT `fk_issues_4` FOREIGN KEY (`sessionID`) REFERENCES `session` (`ID`),
  CONSTRAINT `fk_issues_5` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`),
  CONSTRAINT `fk_issues_6` FOREIGN KEY (`lastUpdatedBy`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- issues_history table
CREATE TABLE `issues_history` (
  `issueHistoryID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `newValue` longtext NOT NULL,
  `dateAdded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority') NOT NULL DEFAULT 'comment',
  `issueID` int(11) unsigned NOT NULL,
  `addedBy` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`issueHistoryID`),
  KEY `fk_issues_comments_1` (`issueID`),
  CONSTRAINT `fk_issues_comments_1` FOREIGN KEY (`issueID`) REFERENCES `issues` (`issueID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- issues_comments table
CREATE TABLE `issues_comments` (
  `issueCommentID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `issueID` int(11) unsigned NOT NULL,
  `dateAdded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `addedBy` varchar(255) NOT NULL DEFAULT '',
  `issueComment` text NOT NULL,
  PRIMARY KEY (`issueCommentID`),
  KEY `fk_issue_comments_1` (`issueID`),
  CONSTRAINT `fk_issue_comments_1` FOREIGN KEY (`issueID`) REFERENCES `issues` (`issueID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- issues_comments_history
CREATE TABLE `issues_comments_history` (
  `issueCommentHistoryID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `issueCommentID` int(11) unsigned NOT NULL,
  `dateEdited` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `newValue` longtext NOT NULL,
  `editedBy` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`issueCommentHistoryID`),
  KEY `fk_issues_comments_history` (`issueCommentID`),
  CONSTRAINT `fk_issues_comments_history` FOREIGN KEY (`issueCommentID`) REFERENCES `issues_comments` (`issueCommentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- issues_watching
CREATE TABLE `issues_watching` (
  `userID` varchar(255) NOT NULL DEFAULT '',
  `issueID` int(11) unsigned NOT NULL,
  PRIMARY KEY (`userID`,`issueID`),
  KEY `fk_issues_watching_2` (`issueID`),
  CONSTRAINT `fk_issues_watching_1` FOREIGN KEY (`userID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 2016-08-19-SelectedTrueFalse_fileqcstatusTable.sql
UPDATE files_qcstatus as fqc SET fqc.Selected='true' WHERE fqc.Selected <> '';
ALTER TABLE files_qcstatus CHANGE `Selected` `Selected` enum('true','false') DEFAULT NULL; 

-- 2016-08-29-AddForeignKeyToCertification.sql
ALTER TABLE `certification` MODIFY `testID` int(10) UNSIGNED NOT NULL;

ALTER TABLE `certification` ADD CONSTRAINT `FK_certification` FOREIGN KEY (`testID`) REFERENCES `test_names` (`ID`);
-- 2016-09-13-AddScannerIDInFiles.sql
-- Add ScannerCandID column to files, back-populate the newly added column from parameter_file table, then add foreign key constraints 
ALTER TABLE files ADD `ScannerID` int(10) unsigned default NULL;
CREATE TEMPORARY TABLE ScannerIDs AS SELECT pf.FileID, pf.Value AS ScannerID FROM parameter_file AS pf LEFT JOIN parameter_type AS pt ON pf.ParameterTypeID=pt.ParameterTypeID WHERE pt.Name='ScannerID';
UPDATE files AS f, ScannerIDs AS S SET f.ScannerID=S.ScannerID where f.FileID=S.FileID;
ALTER TABLE files ADD CONSTRAINT `FK_files_scannerID` FOREIGN KEY (`ScannerID`) REFERENCES mri_scanner (`ID`);

-- 2016-09-13-Add_SNP_MinorAllele.sql
ALTER TABLE SNP 
ADD COLUMN `MinorAllele` enum('A','C','T','G') DEFAULT NULL AFTER `ReferenceBase`;

ALTER TABLE SNP_candidate_rel
CHANGE COLUMN `ObservedBase` `AlleleA` ENUM('A','C','T','G') NULL DEFAULT NULL ,
ADD COLUMN `ID` BIGINT NOT NULL AUTO_INCREMENT FIRST,
ADD COLUMN `AlleleB` ENUM('A','C','T','G') NULL DEFAULT NULL AFTER `AlleleA`,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`ID`);

ALTER TABLE `SNP_candidate_rel` 
ADD CONSTRAINT `fk_SNP_candidate_rel_1`
  FOREIGN KEY (`SNPID`)
  REFERENCES `SNP` (`SNPID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `SNP_candidate_rel`              
ADD CONSTRAINT `fk_SNP_candidate_rel_2`
  FOREIGN KEY (`CandID`)
  REFERENCES `candidate` (`CandID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

CREATE UNIQUE INDEX `uniq_snp` 
  ON `SNP` (`rsID`, `SNPExternalSource`);

-- 2016-09-13-Visit_Windows_add_primary.sql
ALTER TABLE Visit_Windows ADD `ID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY;

-- 2016-09-14-Examiners-add-active-pending-fields.sql
ALTER TABLE examiners ADD COLUMN `active` enum('Y','N') NOT NULL DEFAULT 'Y';
ALTER TABLE examiners ADD COLUMN `pending_approval` enum('Y','N') NOT NULL DEFAULT 'N';

-- 2016-09-18-Config_add_content_security.sql
-- Insert necessary values into configsettings and config

INSERT INTO ConfigSettings (Name,Description,Visible,AllowMultiple,DataType,Parent,Label,OrderNumber) Values ("CSPAdditionalHeaders","Extensions to the Content-security policy allow only for self-hosted content", 1, 0, "text", 1, "Content-Security Extensions", 23);
INSERT INTO Config (ConfigID,Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name='CSPAdditionalHeaders'),"");

-- 2016-09-20-OrderOfAcquisition
ALTER TABLE files ADD `AcqOrderPerModality` int(11) default NULL;

-- 2016-10-17_Default_date_value.sql
ALTER TABLE `users` 
CHANGE COLUMN `Password_expiry` `Password_expiry` DATE NOT NULL DEFAULT '1990-04-01' ;
ALTER TABLE `tarchive` 
CHANGE COLUMN `PatientDoB` `PatientDoB` DATE NULL DEFAULT NULL ,
CHANGE COLUMN `LastUpdate` `LastUpdate` DATETIME NULL DEFAULT NULL ,
CHANGE COLUMN `DateAcquired` `DateAcquired` DATE NULL DEFAULT NULL ;

-- 2016-10-19-LorisMenuPermissions_add_media.sql
-- Insert necessary values into LorisMenuPermissions.

INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='media_read' AND m.Label='Media';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='media_write' AND m.Label='Media';

-- 2016-10-20_issues_categories.sql
INSERT INTO issues_categories (categoryName) VALUES
    ('Behavioural Battery'),
    ('Behavioural Instruments'),
    ('Data Entry'),
    ('Examiners'),
    ('Imaging'),
    ('Technical Issue'),
    ('User Accounts'),
    ('Other');

-- 2016-10-24-ParticipantStatus_add_data_entry_date_default.sql
ALTER TABLE `participant_status` 
CHANGE COLUMN `data_entry_date` `data_entry_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 2016-10-25_issue_tracker_help_text.sql
INSERT INTO help (parentID, hash, topic, content, created, updated) VALUES (-1, md5('issue_tracker'), 'Issue Tracker', 'The Issue Tracker module allows users to report bugs and flag data concerns within a given LORIS. <br>Click the "Add Issue" button to register a new issue. Use the All Issues, Closed Issues, and My Issues tabs, in combination with the Selection filters, to build a custom view of issues of interest. Optionally, a PSCID can be associated to an issue, to link it to a specific subject record.  If PSCID is provided, a Visit label can also be specified for cases where an issue relates to a subject-timepoint.<br>Clicking on any issue will load a page displaying the Issue Details, enabling the user to edit or update the issue given appropriate user permissions.  This form can be used to re-assign an issue, change its status, and add further comments.  Email notifications are sent when a given issue is updated, to any user who is added to the list of those "watching" the issue. The history of all comments and updates to the issue is also visible at the end of the Issue page.', '2016-10-25 00:00:00', NULL);

-- 2016-10-26-IssuesHistory_add_candID_to_fieldChanged_enum.sql
ALTER TABLE `issues_history`
  CHANGE COLUMN `fieldChanged` `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','candID') NOT NULL DEFAULT 'comment';

-- 2016-10-28-ConfigTypos.sql
UPDATE ConfigSettings SET Label='Multiple sites' WHERE Name='multipleSites';
UPDATE ConfigSettings SET Description='Used for identifying timepoints that have (or should have) imaging data' WHERE Name='useScanDone';
UPDATE ConfigSettings SET Description='Path to the directory where files available for download are stored. Used to transfer files to the imaging browser, data query tool, and the package_files.sh script.' WHERE Name='DownloadPath';
UPDATE ConfigSettings SET Description='Path to the Directory of Uploaded Scans' WHERE Name='MRIUploadIncomingPath';
WARNINGS;
CREATE TABLE `user_psc_rel` (
  `UserID` int(10) unsigned NOT NULL,
  `CenterID` tinyint(2) unsigned NOT NULL,
  PRIMARY KEY  (`UserID`,`CenterID`),
  KEY `FK_user_psc_rel_2` (`CenterID`),
  CONSTRAINT `FK_user_psc_rel_2` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_psc_rel_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_psc_site`
--

INSERT IGNORE INTO `user_psc_rel` (UserID, CenterID) SELECT ID, CenterID FROM users;
-- Add admin to the user_psc_rel
INSERT IGNORE INTO `user_psc_rel` (UserID, CenterID) SELECT 1, CenterID FROM psc;

-- ** WARNING: The next 2 lines will DROP column CenterID from the users table ** 
-- ALTER TABLE users DROP foreign key FK_users_1;
-- ALTER TABLE users DROP column `CenterID`;
CREATE TABLE `examiners_psc_rel` (
  `examinerID` int(10) unsigned NOT NULL,
  `centerID` tinyint(2) unsigned NOT NULL,
  `active` enum('Y','N') NOT NULL DEFAULT 'Y',
  `pending_approval` enum('Y','N') NOT NULL DEFAULT 'N',
  PRIMARY KEY  (`examinerID`,`centerID`),
  KEY `FK_examiners_psc_rel_2` (`centerID`),
  CONSTRAINT `FK_examiners_psc_rel_1` FOREIGN KEY (`examinerID`) REFERENCES `examiners` (`examinerID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_examiners_psc_rel_2` FOREIGN KEY (`centerID`) REFERENCES `psc` (`CenterID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SELECT "Creating copy of `examiners` table as `examiners_17_0`" as 'Examiners';
CREATE TABLE examiners_17_0 LIKE examiners;
INSERT examiners_17_0 SELECT * FROM examiners;

-- CLEAN-UP
UPDATE examiners SET full_name = TRIM(full_name);
UPDATE examiners SET radiologist=0 WHERE radiologist IS NULL OR radiologist='';
ALTER TABLE examiners MODIFY COLUMN `radiologist` tinyint(1) NOT NULL DEFAULT 0;



-- NEW COLUMN
ALTER TABLE examiners ADD COLUMN `userID` int(10) unsigned;
ALTER TABLE examiners ADD CONSTRAINT `FK_examiners_2` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ** WARNING: The next lines will DROP column CenterID from the users table **
-- CLEAN-UP
-- ALTER TABLE examiners DROP FOREIGN KEY FK_examiners_1;
-- ALTER TABLE examiners DROP INDEX full_name;
-- ALTER TABLE examiners DROP KEY FK_examiners_1;
-- ALTER TABLE examiners DROP COLUMN `CenterID`;
-- ALTER TABLE examiners DROP COLUMN `active`;
-- ALTER TABLE examiners DROP COLUMN `pending_approval`;

-- ALTER TABLE certification ADD CONSTRAINT `FK_certifcation_2` FOREIGN KEY (`examinerID`) REFERENCES `examiners` (`examinerID`);
-- ALTER TABLE examiners ADD CONSTRAINT `U_examiners_1` UNIQUE KEY `full_name` (`full_name`);
-- UPDATE examiners SET full_name=REPLACE(full_name, '   ', ' ');
-- UPDATE examiners SET full_name=REPLACE(full_name, '  ', ' ');
-- UPDATE examiners e SET full_name=IFNULL((SELECT Real_name FROM users WHERE LOWER(TRIM(Real_name))=LOWER(e.full_name) AND pending_approval='N' LIMIT 1), e.full_name);
-- UPDATE examiners e SET e.userID=(SELECT ID FROM users WHERE TRIM(Real_name)=e.full_name AND pending_approval='N' LIMIT 1);

ALTER TABLE users DROP COLUMN Password_md5;-- This script put all unique records from LorisMenuPermissions in a
-- temporary table before adding foreign keys and unique constraint
-- to the table.
-- It also remove duplicates from LorisMenu table and add unique
-- constraint on Parent and Label column

CREATE TEMPORARY TABLE tmp_lmp AS 
  SELECT DISTINCT MenuId, PermID FROM LorisMenuPermissions;

DELETE FROM LorisMenuPermissions;

ALTER TABLE `LorisMenuPermissions` 
CHANGE COLUMN `MenuID` `MenuID` INT(10) UNSIGNED NOT NULL,
CHANGE COLUMN `PermID` `PermID` INT(10) UNSIGNED NOT NULL,
ADD PRIMARY KEY (`MenuID`, `PermID`);

ALTER TABLE `LorisMenuPermissions` 
ADD CONSTRAINT `fk_LorisMenuPermissions_1`
  FOREIGN KEY (`MenuID`)
  REFERENCES `LorisMenu` (`ID`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_LorisMenuPermissions_2`
  FOREIGN KEY (`PermID`)
  REFERENCES `permissions` (`permID`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

INSERT IGNORE INTO LorisMenuPermissions SELECT MenuID, PermID FROM tmp_lmp;
DROP TABLE tmp_lmp;

-- Remove duplicates in the LorisMenu
DELETE FROM LorisMenu USING LorisMenu, LorisMenu lm1 
  WHERE LorisMenu.ID < lm1.ID AND LorisMenu.Parent = lm1.Parent AND LorisMenu.Label = lm1.Label;

ALTER TABLE `LorisMenu` 
ADD INDEX `fk_LorisMenu_1_idx` (`Parent` ASC),
ADD UNIQUE INDEX `index3` (`Parent` ASC, `Label` ASC);
ALTER TABLE `LorisMenu` 
ADD CONSTRAINT `fk_LorisMenu_1`
  FOREIGN KEY (`Parent`)
  REFERENCES `LorisMenu` (`ID`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

DELETE FROM media USING media, media m1 
  WHERE media.date_uploaded < m1.date_uploaded AND media.file_name = m1.file_name;

ALTER TABLE `media`
ADD UNIQUE INDEX `file_name` (`file_name`);
ALTER TABLE flag ADD `Data` TEXT;
SET @parentID = (SELECT ID FROM ConfigSettings WHERE Name = 'APIKeys');

-- Cleanup 
DELETE FROM ConfigSettings WHERE Name='reCAPTCHAPrivate';
DELETE FROM ConfigSettings WHERE Name='reCAPTCHAPublic';
DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='reCAPTCHAPrivate');
DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='reCAPTCHAPublic');

-- Insert
INSERT INTO ConfigSettings (`Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`) VALUES (
  'reCAPTCHAPrivate', 'Private Key for Google reCAPTCHA', 1, 0, 'text', @parentID, 'reCAPTCHA Private Key', 2
);
INSERT INTO ConfigSettings (`Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`) VALUES (
  'reCAPTCHAPublic', 'Public Key for Google reCAPTCHA', 1, 0, 'text', @parentID, 'reCAPTCHA Public Key', 3
);
ALTER TABLE issues_categories CONVERT TO CHARACTER SET utf8;
ALTER TABLE issues_categories MODIFY COLUMN categoryName varchar(255);
-- This can take quite a while to execute depending on the row count of the CNV table 
ALTER TABLE CNV ADD FOREIGN KEY (`CandID`) REFERENCES `candidate` (`CandID`);
-- Insert necessary values into configsettings and config
INSERT INTO ConfigSettings (Name,Description,Visible,AllowMultiple,DataType,Parent,Label,OrderNumber) Values ("dobFormat","Format of the Date of Birth", 1, 0, "text", 1, "DOB Format:", 8);
INSERT INTO Config (ConfigID,Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name='dobFormat'),"YMd");
-- This is for LORIS instance that source the schema of LORIS v15.04.
-- The ExonicFunction column got added in 15.10 but there was a missing patch.
SET @s = (SELECT IF(
    (SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE table_name = 'SNP'
        AND table_schema = DATABASE()
        AND column_name = 'ExonicFunction'
    ) > 0,
    "SELECT 'conform' as 'SNP table structure check'",
    "ALTER TABLE SNP ADD `ExonicFunction` enum('nonsynonymous','unknown') DEFAULT NULL AFTER `Damaging`"
));

PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
WARNINGS;
SET SQL_NOTES=1;

SELECT 'Removing unused indexes to change the storage engine for help table' as 'Step #1';
ALTER TABLE `help` 
DROP INDEX `content`,
DROP INDEX `topic`;
ALTER TABLE `help` ENGINE = InnoDB;

SELECT 'Droping unused table help_related_links' as 'Step #2';
DROP TABLE help_related_links;


SELECT 'Adding foreign key between Config and ConfigSettings' as 'Step #3';
SELECT 'Config records not associated with a valid ConfigSettings.id will be deleted' as 'ATTENTION';
DELETE FROM `Config` WHERE ConfigID IS NULL;
ALTER TABLE `Config` CHANGE `ConfigID` `ConfigID` int(11) NOT NULL;
ALTER TABLE `Config` 
  ADD INDEX `fk_Config_1_idx` (`ConfigID` ASC);
ALTER TABLE `Config` 
  ADD CONSTRAINT `fk_Config_1`
  FOREIGN KEY (`ConfigID`)
    REFERENCES `ConfigSettings` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

SELECT 'Adding foreign key between permissions and permissions_category' as 'Step #4';
SELECT 'permissions.categoryID not associated with a valid permissions_category.id will be set to 2 (Permission)' as 'ATTENTION';
UPDATE permissions SET categoryID = 2 WHERE categoryID NOT IN (SELECT id FROM permissions_category);
ALTER TABLE `permissions` 
  CHANGE COLUMN `categoryID` `categoryID` INT(10) NOT NULL DEFAULT 2;
ALTER TABLE `permissions` 
  ADD INDEX `fk_permissions_1_idx` (`categoryID` ASC);
ALTER TABLE `permissions` 
  ADD CONSTRAINT `fk_permissions_1`
  FOREIGN KEY (`categoryID`)
    REFERENCES `permissions_category` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


SELECT 'Adding foreign key between candidate and caveat_options' as 'Step #5';
SELECT 'List of candidate(s) with innexistant flagged_reason in the canveat_options table. Those flagged_reason will be set to NULL' as 'ATTENTION';
SELECT c.candid, c.flagged_reason 
  FROM candidate c
  WHERE NOT EXISTS (
    SELECT ID FROM caveat_options WHERE c.flagged_reason = ID
  ) AND c.flagged_reason IS NOT NULL;
ALTER TABLE `candidate` 
  ADD INDEX `FK_candidate_2_idx` (`flagged_reason` ASC);
ALTER TABLE `candidate` 
  ADD CONSTRAINT `FK_candidate_2`
  FOREIGN KEY (`flagged_reason`)
    REFERENCES `caveat_options` (`ID`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

SELECT 'Dropping duplicate index CandidateCenterID in the candidate table' as 'Step #6';
ALTER TABLE `candidate` 
  DROP INDEX `CandidateCenterID` ;

SELECT 'Adding index PSCID in the candidate table' as 'Step #7';
ALTER TABLE `candidate` 
  ADD INDEX `PSCID` (`PSCID` ASC);

SELECT 'Adding foreign key between document_repository_categories and document_repository tables' as 'Step #8';
SELECT 'document_repository.File_category not associated with a valid document_repository_categories.id will be set to NULL' as 'ATTENTION';
UPDATE document_repository SET File_category = NULL WHERE File_category NOT IN (SELECT id FROM document_repository_categories);
ALTER TABLE `document_repository` 
  CHANGE COLUMN `File_category` `File_category` INT(3) UNSIGNED NULL DEFAULT NULL;
ALTER TABLE `document_repository`
  ADD INDEX `fk_document_repository_1_idx` (`File_category` ASC);
ALTER TABLE `document_repository`
  ADD CONSTRAINT `fk_document_repository_1`
  FOREIGN KEY (`File_category`)
    REFERENCES `document_repository_categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

SELECT 'Adding foreign key between document_repository_categories and document_repository tables' as 'Step #9';
SELECT 'session_status records not associated with a valid session.id will be deleted' as 'ATTENTION';
DELETE FROM session_status WHERE SessionID NOT IN (SELECT id FROM `session`);
ALTER TABLE `session_status` 
  CHANGE COLUMN `SessionID` `SessionID` INT(10) UNSIGNED NOT NULL ;
ALTER TABLE `session_status` 
  ADD CONSTRAINT `fk_session_status_1`
  FOREIGN KEY (`SessionID`)
    REFERENCES `session` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

SELECT 'Adding foreign key between participant_status and participant_status_options tables' as 'Step #10';
SELECT 'participant_status.participant_status not associated with a valid participant_status_options.id will be set to NULL' as 'ATTENTION';
SELECT 'participant_status.participant_suboptions not associated with a valid participant_status_options.id will be set to NULL' as 'ATTENTION';
UPDATE participant_status SET participant_status = NULL WHERE participant_status NOT IN (SELECT id FROM participant_status_options);
UPDATE participant_status SET participant_suboptions = NULL WHERE participant_suboptions NOT IN (SELECT id FROM participant_status_options);
ALTER TABLE `participant_status` 
CHANGE COLUMN `participant_status` `participant_status` INT(10) UNSIGNED NULL DEFAULT NULL ,
CHANGE COLUMN `participant_suboptions` `participant_suboptions` INT(10) UNSIGNED NULL DEFAULT NULL ;
ALTER TABLE `participant_status` 
  ADD INDEX `fk_participant_status_1_idx` (`participant_status` ASC),
  ADD INDEX `fk_participant_status_2_idx` (`participant_suboptions` ASC);
ALTER TABLE `participant_status` 
  ADD CONSTRAINT `fk_participant_status_1`
  FOREIGN KEY (`participant_status`)
    REFERENCES `participant_status_options` (`ID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_participant_status_2`
  FOREIGN KEY (`participant_suboptions`)
    REFERENCES `participant_status_options` (`ID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

SELECT 'Adding foreign key between participant_status and candidate tables' as 'Step #11';
SELECT 'participant_status records not associated with a valid candidate.candid will be deleted' as 'ATTENTION';
DELETE FROM participant_status WHERE CandID NOT IN (SELECT candid FROM candidate);
ALTER TABLE `participant_status` 
  ADD CONSTRAINT `fk_participant_status_3`
  FOREIGN KEY (`CandID`)
    REFERENCES `candidate` (`CandID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

SELECT 'Change the parameter_type_category primary key to conform all the other int(11) unsigned NOT NULL AUTO_INCREMENT columns' as 'Step #12'; 
ALTER TABLE parameter_type_category CHANGE `ParameterTypeCategoryID` `ParameterTypeCategoryID` int(11) unsigned NOT NULL AUTO_INCREMENT;

SELECT 'Changes storage engine to InnoDB for participant_* tables' as 'Step #13';
ALTER TABLE `participant_status` ENGINE = InnoDB;
ALTER TABLE `participant_status_options` ENGINE = InnoDB;
ALTER TABLE `participant_emails` ENGINE = InnoDB;
ALTER TABLE `participant_accounts` ENGINE = InnoDB;
ALTER TABLE `participant_status_history` ENGINE = InnoDB;
ALTER TABLE `consent_info_history` ENGINE = InnoDB;

SELECT 'Changes default chatset to utf8 for participant_* tables' as 'Step #14';
ALTER TABLE `participant_status` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `participant_status_options` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `participant_emails` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `participant_accounts` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `participant_status_history` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `consent_info_history` CONVERT TO CHARACTER SET utf8;

SELECT 'Adding ignored foreign key between participant_emails and test_names tables' as 'Step #15';
ALTER TABLE `participant_emails` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `participant_emails`
  ADD CONSTRAINT `fk_participant_emails_1`
  FOREIGN KEY (`Test_name`)
    REFERENCES `test_names` (`Test_name`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

SELECT 'Changes storage engine to InnoDB for remaining tables' as 'Step #16';
ALTER TABLE `ExternalLinkTypes` ENGINE = InnoDB;
ALTER TABLE `ExternalLinks` ENGINE = InnoDB;
ALTER TABLE `empty_queries` ENGINE = InnoDB;
ALTER TABLE `data_release` ENGINE = InnoDB;
ALTER TABLE `data_release_permissions` ENGINE = InnoDB;

SELECT 'Changes default chatset to utf8 for remaining tables' as 'Step #17';
ALTER TABLE `ExternalLinkTypes` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `ExternalLinks` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `empty_queries` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `data_release` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `data_release_permissions` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `Visit_Windows` CONVERT TO CHARACTER SET utf8;

SELECT 'Dropping duplicate index SessionCenterID in the session table' as 'Step #18';
ALTER TABLE `session`
  DROP INDEX `SessionCenterID` ;

SELECT 'Rectifying some discrepancies' as 'Step #19';
UPDATE ConfigSettings SET OrderNumber = 1 WHERE Name = 'JWTKey';
ALTER TABLE `certification_history` COMMENT='primaryVals should always contain a valid certID from the certification table';
ALTER TABLE `session_status` COMMENT='Used if SupplementalSessionStatus configSettings is true';
ALTER TABLE `tarchive_find_new_uploads` COMMENT='This table is used by Loris-MRI/find_uploads_tarchive to store the last time the script was ran for that location';

SELECT 'Patch completed' as 'Status';
-- Add scan_type to ENUM
ALTER TABLE ConfigSettings MODIFY COLUMN DataType ENUM('text', 'boolean', 'email', 'instrument', 'textarea', 'scan_type');

-- Change Dicom Archive name to Imaging Modules
UPDATE ConfigSettings SET Name='imaging_modules', Description='DICOM Archive and Imaging Browser settings', Label='Imaging Modules' WHERE Name ='dicom_archive';

-- Add Imaging Browser to Imaging Modules
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'tblScanTypes', 'Scan types from the mri_scan_type table that the project wants to see displayed in Imaging Browser table', 1, 1, 'scan_type', ID, 'Imaging Browser Tabulated Scan Types', 6 FROM ConfigSettings WHERE Name="imaging_modules";

-- default imaging_browser settings
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, GROUP_CONCAT(mst.Scan_Type) FROM ConfigSettings cs JOIN mri_scan_type mst WHERE cs.Name="tblScanTypes" AND mst.ID=44;
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, GROUP_CONCAT(mst.Scan_Type) FROM ConfigSettings cs JOIN mri_scan_type mst WHERE cs.Name="tblScanTypes" AND mst.ID=45;


-- Loris-MRI/Imaging Pipeline options from the $profile (commonly "prod") file
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('imaging_pipeline', 'Imaging Pipeline settings', 1, 0, 'Imaging Pipeline', 12);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'dataDirBasepath', 'Base Path to the data directory of Loris-MRI', 1, 0, 'text', ID, 'Loris-MRI Data Directory', 1 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'prefix', 'Study prefix or study name', 1, 0, 'text', ID, 'Study Name', 2 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'mail_user', 'User to be notified during imaging pipeline execution', 1, 0, 'text', ID, 'User to notify when executing the pipeline', 3 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'get_dicom_info', 'Full path to get_dicom_info.pl', 1, 0, 'text', ID, 'Full path to get_dicom_info.pl script', 4 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'horizontalPics', 'Generate horizontal pictures', 1, 0, 'boolean', ID, 'Horizontal pictures creation', 5 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'no_nii', 'Create NIFTII files if set to 0', 1, 0, 'boolean', ID, 'NIFTII file creation', 6 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'converter', 'If converter is set to dcm2mnc, the c-version of dcm2mnc will be used. If however you want to use any of the various versions of the converter, you will have to specify what it is called and the uploader will try to invoke it', 1, 0, 'text', ID, 'dcm2mnc binary to use when converting', 7 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'tarchiveLibraryDir', 'Location of storing the library of used tarchives. If this is not set, they will not be moved', 1, 0, 'text', ID, 'Path to Tarchives', 8 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'lookupCenterNameUsing', 'The element of the tarchive table to be used in getPSC(), being either PatientID or PatientName', 1, 0, 'text', ID, 'Center name lookup variable', 9 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'createCandidates', 'Creation of candidates if set to 1', 1, 0, 'boolean', ID, 'Upload creation of candidates', 10 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'is_qsub', 'Do not use batch management if qsub is set to 0', 1, 0, 'boolean', ID, 'Project batch management used', 11 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'if_site', 'Use site if set to 1', 1, 0, 'boolean', ID, 'If site is used', 12 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'DTI_volumes', 'Number of volumes in native DTI acquisitions', 1, 0, 'text', ID, 'Number of volumes in native DTI acquisitions', 13 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 't1_scan_type', 'Scan type of native T1 acquisition (as in the mri_scan_type table)', 1, 0, 'text', ID, 'Scan type of native T1 acquisition', 14 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'reject_thresh', 'Max number of directions that can be rejected to PASS QC', 1, 0, 'text', ID, 'Max number of DTI rejected directions for passing QC', 15 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'niak_path', 'Path to niak quarantine to use if mincdiffusion will be run (option -runMincdiffusion set when calling DTIPrep_pipeline.pl)', 1, 0, 'text', ID, 'NIAK Path', 16 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'QCed2_step', 'DTIPrep protocol step at which a secondary QCed dataset is produced (for example one without motion correction and eddy current correction would be saved at INTERLACE_outputDWIFileNameSuffix step of DTIPrep)', 1, 0, 'text', ID, 'Secondary QCed dataset', 17 FROM ConfigSettings WHERE Name="imaging_pipeline";


-- default imaging_pipeline settings
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/DATA/location" FROM ConfigSettings cs WHERE cs.Name="dataDirBasepath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "project" FROM ConfigSettings cs WHERE cs.Name="prefix";
INSERT INTO Config (ConfigID, Value) SELECT ID, "yourname\@example.com" FROM ConfigSettings cs WHERE cs.Name="mail_user";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/get_dicom_info.pl" FROM ConfigSettings cs WHERE cs.Name="get_dicom_info";
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings cs WHERE cs.Name="horizontalPics";
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings cs WHERE cs.Name="no_nii";
INSERT INTO Config (ConfigID, Value) SELECT ID, "dcm2mnc" FROM ConfigSettings cs WHERE cs.Name="converter";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/dicomlib/" FROM ConfigSettings cs WHERE cs.Name="tarchiveLibraryDir";
INSERT INTO Config (ConfigID, Value) SELECT ID, "PatientName" FROM ConfigSettings cs WHERE cs.Name="lookupCenterNameUsing";
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings cs WHERE cs.Name="createCandidates";
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings cs WHERE cs.Name="is_qsub";
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings cs WHERE cs.Name="if_site";
INSERT INTO Config (ConfigID, Value) SELECT ID, 65 FROM ConfigSettings cs WHERE cs.Name="DTI_volumes";
INSERT INTO Config (ConfigID, Value) SELECT ID, "adniT1" FROM ConfigSettings cs WHERE cs.Name="t1_scan_type";
INSERT INTO Config (ConfigID, Value) SELECT ID, 19 FROM ConfigSettings cs WHERE cs.Name="reject_thresh";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/opt/niak-0.6.4.1/" FROM ConfigSettings cs WHERE cs.Name="niak_path";
INSERT INTO Config (ConfigID, Value) SELECT ID, "INTERLACE_outputDWIFileNameSuffix" FROM ConfigSettings cs WHERE cs.Name="QCed2_step";
-- Add a permission to Imaging Broswer to give access to users to view phantoms data only
INSERT INTO permissions (code,description,categoryID) VALUES ('imaging_browser_phantom_allsites', 'Can access only phantom data from all sites in Imaging Browser', 2);
INSERT INTO permissions (code,description,categoryID) VALUES ('imaging_browser_phantom_ownsite', 'Can access only phantom data from own sites in Imaging Browser', 2);
INSERT INTO user_perm_rel (userID,permID) SELECT u.ID, p.permID FROM users u JOIN permissions p WHERE u.UserID='admin' AND p.code = 'imaging_browser_phantom_allsites';
INSERT INTO user_perm_rel (userID,permID) SELECT u.ID, p.permID FROM users u JOIN permissions p WHERE u.UserID='admin' AND p.code = 'imaging_browser_phantom_ownsite';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_phantom_allsites' AND m.Label='Imaging Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_phantom_ownsite' AND m.Label='Imaging Browser';


-- ad phone to users
ALTER TABLE users ADD COLUMN `Phone` varchar(15) default NULL;

-- Associates modules with the service available for each
CREATE TABLE `notification_modules` (
      `id` int(10) unsigned auto_increment NOT NULL,
      `module_name` varchar(100) NOT NULL,
      `operation_type` varchar(100) NOT NULL,
      `as_admin` enum('Y','N') NOT NULL DEFAULT 'N',
      `template_file` varchar(100) NOT NULL,
      `description` varchar(255) DEFAULT NULL,
      PRIMARY KEY (`id`),
      KEY (`module_name`),
      UNIQUE(module_name,operation_type)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Associates modules with the service available for each
CREATE TABLE `notification_services` (
      `id` int(10) unsigned auto_increment NOT NULL,
      `service` VARCHAR(50) NOT NULL,
      PRIMARY KEY (`id`),
      UNIQUE(service)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- saves users preferences for notification type
CREATE TABLE `notification_modules_services_rel` (
      `module_id` int(10) unsigned NOT NULL,
      `service_id` int(10) unsigned NOT NULL,
      PRIMARY KEY (`module_id`,`service_id`),
      KEY `FK_notification_modules_services_rel_1` (`module_id`),
      KEY `FK_notification_modules_services_rel_2` (`service_id`),
      CONSTRAINT `FK_notification_modules_services_rel_1` FOREIGN KEY (`module_id`) REFERENCES `notification_modules` (`id`),
      CONSTRAINT `FK_notification_modules_services_rel_2` FOREIGN KEY (`service_id`) REFERENCES `notification_services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- saves users preferences for notification type
CREATE TABLE `users_notifications_rel` (
      `user_id` int(10) unsigned NOT NULL,
      `module_id` int(10) unsigned NOT NULL,
      `service_id` int(10) unsigned NOT NULL,
      PRIMARY KEY (`user_id`,`module_id`,`service_id`),
      KEY `FK_notifications_users_rel_1` (`user_id`),
      KEY `FK_notifications_users_rel_2` (`module_id`),
      KEY `FK_notifications_users_rel_3` (`service_id`),
      CONSTRAINT `FK_notifications_users_rel_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`),
      CONSTRAINT `FK_notifications_users_rel_2` FOREIGN KEY (`module_id`) REFERENCES `notification_modules` (`id`),
      CONSTRAINT `FK_notifications_users_rel_3` FOREIGN KEY (`service_id`) REFERENCES `notification_services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- history log
CREATE TABLE `notification_history` (
      `id` int(10) unsigned auto_increment NOT NULL,
      `module_id` int(10) unsigned NOT NULL,
      `service_id` int(10) unsigned NOT NULL,
      `date_sent` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `trigger_user` int(10) unsigned NOT NULL,
      `target_user` int(10) unsigned NOT NULL,
      PRIMARY KEY (`id`),
      KEY `FK_notification_history_1` (`trigger_user`),
      KEY `FK_notification_history_2` (`target_user`),
      CONSTRAINT `FK_notification_history_1` FOREIGN KEY (`trigger_user`) REFERENCES `users` (`ID`) ON UPDATE CASCADE ON DELETE CASCADE ,
      CONSTRAINT `FK_notification_history_2` FOREIGN KEY (`target_user`) REFERENCES `users` (`ID`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- basic notification service
INSERT INTO notification_services (service) VALUES
('email_text');

-- Pre-implemented notifications
INSERT INTO notification_modules (module_name, operation_type, as_admin, template_file, description) VALUES
  ('media', 'upload', 'N', 'notifier_media_upload.tpl', 'Media: New File Uploaded'),
  ('media', 'download', 'N', 'notifier_media_download.tpl', 'Media: File Downloaded'),
  ('document_repository', 'new_category', 'N', 'notifier_document_repository_new_category.tpl', 'Document Repository: New Category'),
  ('document_repository', 'upload', 'N', 'notifier_document_repository_upload.tpl', 'Document Repository: New Document Uploaded'),
  ('document_repository', 'delete', 'N', 'notifier_document_repository_delete.tpl', 'Document Repository: Document Deleted'),
  ('document_repository', 'edit', 'N', 'notifier_document_repository_edit.tpl', 'Document Repository: Document Edited');

-- enable doc repo basic text emails
INSERT INTO notification_modules_services_rel SELECT nm.id, ns.id FROM notification_modules nm JOIN notification_services ns WHERE nm.module_name='document_repository' AND ns.service='email_text';

-- Transfer Document repository notifications to new system
INSERT INTO users_notifications_rel SELECT u.ID, nm.id, ns.id FROM users u JOIN notification_modules nm JOIN notification_services ns WHERE nm.module_name='document_repository' AND ns.service='email_text' AND u.Doc_Repo_Notifications='Y';

-- permissions for each notification module
CREATE TABLE `notification_modules_perm_rel` (
      `notification_module_id` int(10) unsigned NOT NULL,
      `perm_id` int(10) unsigned NOT NULL default '0',
      CONSTRAINT `FK_notification_modules_perm_rel_1` FOREIGN KEY (`notification_module_id`) REFERENCES `notification_modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT `FK_notification_modules_perm_rel_2` FOREIGN KEY (`perm_id`) REFERENCES `permissions` (`permID`) ON DELETE CASCADE ON UPDATE CASCADE,
      PRIMARY KEY (`notification_module_id`,`perm_id`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- populate notification perm table
INSERT INTO notification_modules_perm_rel SELECT nm.id, p.permID FROM notification_modules nm JOIN permissions p WHERE nm.module_name='media' AND (p.code='media_write' OR p.code='media_read');
INSERT INTO notification_modules_perm_rel SELECT nm.id, p.permID FROM notification_modules nm JOIN permissions p WHERE nm.module_name='document_repository' AND (p.code='document_repository_view' OR p.code='document_repository_delete');
ALTER TABLE issues DROP FOREIGN KEY `fk_issues_5`;
ALTER TABLE issues ADD CONSTRAINT `fk_issues_5` FOREIGN KEY (`centerID`) REFERENCES `psc` (`CenterID`);
WARNINGS;
SET SQL_NOTES=1;

SELECT 'Delete duplicate entries' as 'Step #1';
DELETE 
FROM 
	instrument_subtests 
USING 
	instrument_subtests,
	instrument_subtests to_keep 
WHERE 
	instrument_subtests.ID < to_keep.ID 
	AND instrument_subtests.Test_name = to_keep.Test_name
	AND instrument_subtests.Subtest_name = to_keep.Subtest_name;

SELECT 'Alter instrument_subtests to force unique Subtest_name' as 'Step #2';
ALTER TABLE `instrument_subtests`
ADD UNIQUE KEY `unique_index` (`Test_name`, `Subtest_name`);

SELECT 'Patch complete' as 'Status';
CREATE TEMPORARY TABLE
    project_rel_tmp
AS
    SELECT DISTINCT
        ProjectID, SubprojectID
    FROM
        project_rel;

DELETE FROM project_rel;

INSERT INTO
    project_rel (ProjectID, SubprojectID)
SELECT
    ProjectID, SubprojectID
FROM
    project_rel_tmp;

ALTER TABLE `project_rel` ADD PRIMARY KEY( `ProjectID`, `SubprojectID`);
ALTER table parameter_file MODIFY Value LONGTEXT;

-- The OneTimePassword storage capacity should be extended according to new key generation logic

ALTER TABLE participant_accounts MODIFY COLUMN OneTimePassword VARCHAR(16) ;
-- Removing reliability statistics as it is more project specific
DELETE FROM `StatisticsTabs`  WHERE `SubModuleName`='stats_reliability';ALTER TABLE project_rel MODIFY COLUMN ProjectID int(2) NOT NULL;
ALTER TABLE project_rel MODIFY COLUMN SubprojectID int(2) NOT NULL;
DELIMITER $$

CREATE PROCEDURE `change_psc_centerid_column_definition`()
BEGIN

  DECLARE v_finish INTEGER DEFAULT 0;

  DECLARE v_schema_name VARCHAR(255) DEFAULT database();
  DECLARE v_table_name VARCHAR(255) DEFAULT "";
  DECLARE v_column_name VARCHAR(255) DEFAULT "";
  DECLARE v_constraint_name VARCHAR(255) DEFAULT "";
  DECLARE v_column_default VARCHAR(255) DEFAULT "";
  DECLARE v_nullable VARCHAR(255) DEFAULT "";

  DECLARE stmt VARCHAR(1024);

  DECLARE c_constraints CURSOR FOR
    SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME FROM tmp_centerid_contraints;

  DECLARE CONTINUE HANDLER FOR NOT FOUND
    SET v_finish = 1;

  -- Cleanup the notification_spool table in case of bad datetime format.
  CREATE TEMPORARY TABLE hist_tmp AS 
    (SELECT h.changeDate, h.primaryVals FROM history h WHERE h.tbl='notification_spool' AND h.col='TimeSpooled');

  CREATE TEMPORARY TABLE hist_list_tmp AS 
    (SELECT h.primaryVals FROM history h WHERE h.tbl='notification_spool' AND h.col='TimeSpooled');

  UPDATE notification_spool SET TimeSpooled=(SELECT ChangeDate FROM hist_tmp WHERE primaryVals=NotificationID) WHERE NotificationID IN (SELECT primaryVals FROM hist_list_tmp);

  DROP TABLE hist_tmp;
  DROP TABLE hist_list_tmp;

  -- Store the current foreign keys for the cursor.
  CREATE TEMPORARY TABLE tmp_centerid_contraints SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = v_schema_name AND ((TABLE_NAME = 'psc' AND LOWER(COLUMN_NAME) = 'centerid') OR (REFERENCED_TABLE_NAME = 'psc' AND LOWER(REFERENCED_COLUMN_NAME) = 'centerid')) AND TABLE_NAME != 'psc';

  -- Drop foreign keys
  OPEN c_constraints;
  
  drop_constraints: LOOP
    FETCH c_constraints INTO v_table_name, v_column_name, v_constraint_name;

    IF v_finish = 1 THEN
      LEAVE drop_constraints;
    END IF;

    SET @SQL := CONCAT('ALTER TABLE ',v_table_name,' DROP FOREIGN KEY ',v_constraint_name);
    SELECT @SQL;
    PREPARE stmt FROM @SQL;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

  END LOOP drop_constraints;
  CLOSE c_constraints;
  
  SET v_finish = false;
  OPEN c_constraints;
  alter_tables: LOOP
    FETCH c_constraints INTO v_table_name, v_column_name, v_constraint_name;
    
    IF v_finish = 1 THEN
      LEAVE alter_tables;
    END IF;

    SELECT IFNULL(CONCAT('DEFAULT ', COLUMN_DEFAULT), ''), IF(IS_NULLABLE = 'YES', '', 'NOT NULL') INTO v_column_default, v_nullable FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = v_schema_name AND TABLE_NAME = v_table_name AND column_name = v_column_name;
    SET @SQL := CONCAT('ALTER TABLE ',v_table_name,' CHANGE ',v_column_name,' ',v_column_name,' INTEGER UNSIGNED ',v_nullable,' ', v_column_default);    

    SELECT @SQL;
    PREPARE stmt FROM @SQL;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

  END LOOP alter_tables;
  CLOSE c_constraints;

  ALTER TABLE psc CHANGE `CenterID` `CenterID` integer unsigned NOT NULL AUTO_INCREMENT;

  SET v_finish = false;
  OPEN c_constraints;
  add_constraints: LOOP
    FETCH c_constraints INTO v_table_name, v_column_name, v_constraint_name;

    IF v_finish = 1 THEN
      LEAVE add_constraints;
    END IF;

    SET @SQL := CONCAT('ALTER TABLE ',v_table_name,' ADD CONSTRAINT `',v_constraint_name,'` FOREIGN KEY (`',v_column_name,'`) REFERENCES `psc` (`CenterID`)');
    SELECT @SQL;
    PREPARE stmt FROM @SQL;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

  END LOOP add_constraints;
  CLOSE c_constraints;

  DROP TABLE tmp_centerid_contraints;

  SELECT 'Success' as 'Exit';

END $$
DELIMITER ;

call change_psc_centerid_column_definition();
DROP PROCEDURE `change_psc_centerid_column_definition`;
DROP TABLE empty_queries;
-- Add TarchiveID foreign key to MRIcandidateErrors
ALTER TABLE MRICandidateErrors
  ADD CONSTRAINT `FK_tarchive_MRICandidateError_1`
    FOREIGN KEY (`TarchiveID`) REFERENCES `tarchive` (`TarchiveID`);

-- Add TarchiveID foreign key to mri_violations_log
ALTER TABLE mri_violations_log
  ADD CONSTRAINT `FK_tarchive_mriViolationsLog_1`
    FOREIGN KEY (`TarchiveID`) REFERENCES `tarchive` (`TarchiveID`);

-- Add TarchiveID foreign key to files
ALTER TABLE files
  ADD CONSTRAINT `FK_files_TarchiveID`
    FOREIGN KEY (`TarchiveSource`) REFERENCES `tarchive` (`TarchiveID`);

-- Add FileID foreign key to files_qcstatus
ALTER TABLE files_qcstatus
  MODIFY COLUMN `FileID` INT(10) UNSIGNED UNIQUE NULL,
  ADD CONSTRAINT `FK_filesqcstatus_FileID`
    FOREIGN KEY (`FileID`) REFERENCES `files` (`FileID`);

-- Add SessionID and TarchiveID foreign keys to mri_upload
ALTER TABLE mri_upload
  ADD CONSTRAINT `FK_mriupload_SessionID`
    FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`),
  ADD CONSTRAINT `FK_mriupload_TarchiveID`
    FOREIGN KEY (`TarchiveID`) REFERENCES `tarchive` (`TarchiveID`);

-- Add ScanType foreign key in mri_protocol_checks
ALTER TABLE mri_protocol_checks
  ADD CONSTRAINT `FK_mriProtocolChecks_ScanType`
    FOREIGN KEY (`Scan_type`) REFERENCES `mri_scan_type` (`ID`);

-- Add SessionID foreign key in tarchive
ALTER TABLE tarchive
  ADD CONSTRAINT `FK_tarchive_sessionID`
    FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`);

DROP TABLE IF EXISTS tarchive_find_new_uploads;

-- Alter table mri_protocol_violated_scans to add TarchiveID
ALTER TABLE mri_protocol_violated_scans 
  ADD TarchiveID INT(11) AFTER PSCID,
  ADD CONSTRAINT `FK_mri_violated_1` FOREIGN KEY (`TarchiveID`) 
        REFERENCES `tarchive` (`TarchiveID`);

-- Populate mri_protocol_violated_scans.TarchiveID in joining 
-- with tarchive_series table using SeriesUID
UPDATE mri_protocol_violated_scans 
  LEFT JOIN tarchive_series ts USING (SeriesUID) 
  SET mri_protocol_violated_scans.TarchiveID=ts.TarchiveID;
alter table help drop column projectContent;
-- CNV
-- Add fields from genome_loc table
ALTER TABLE `CNV`
  ADD COLUMN `Chromosome` varchar(255) DEFAULT NULL,
  ADD COLUMN `Strand` varchar(255) DEFAULT NULL,
  ADD COLUMN `EndLoc` int(11) DEFAULT NULL,
  ADD COLUMN `StartLoc` int(11) DEFAULT NULL;

-- Add fields from gene table
ALTER TABLE `CNV`
  ADD COLUMN `Symbol` varchar(255) DEFAULT NULL,
  ADD COLUMN `Name` varchar(255) DEFAULT NULL,
  ADD COLUMN `NCBIID` varchar(255) DEFAULT NULL,
  ADD COLUMN `OfficialSymbol` varchar(255) DEFAULT NULL,
  ADD COLUMN `OfficialName` text;

-- Fill those fields
UPDATE CNV t JOIN genome_loc gl USING (GenomeLocID) set t.Chromosome = gl.Chromosome, t.Strand = gl.Strand, t.EndLoc = gl.EndLoc, t.StartLoc = gl.StartLoc;
UPDATE CNV t JOIN gene g USING (GenomeLocID) set t.Symbol = g.Symbol, t.Name = g.Name, t.NCBIID = g.NCBIID, t.OfficialSymbol = g.OfficialSymbol, t.OfficialName = g.OfficialName;

-- Remove the FOREIGN KEY using constraint name from infomration_schema.
SET @constraint_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE table_name = 'CNV' AND CONSTRAINT_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME = 'genome_loc');
SET @s = (SELECT IF(@constraint_name IS NULL,"SELECT 'There is no foreign key between CNV and genome_loc table' as Message",CONCAT("ALTER TABLE CNV DROP FOREIGN KEY ", @constraint_name)));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop the reference column
ALTER TABLE CNV 
  DROP COLUMN GenomeLocID;

-- SNP
-- Add fields from genome_loc table
ALTER TABLE `SNP`
  ADD COLUMN `Chromosome` varchar(255) DEFAULT NULL,
  ADD COLUMN `Strand` varchar(255) DEFAULT NULL,
  ADD COLUMN `EndLoc` int(11) DEFAULT NULL,
  ADD COLUMN `StartLoc` int(11) DEFAULT NULL;

-- Add fields from gene table
ALTER TABLE `SNP`
  ADD COLUMN `Symbol` varchar(255) DEFAULT NULL,
  ADD COLUMN `Name` varchar(255) DEFAULT NULL,
  ADD COLUMN `NCBIID` varchar(255) DEFAULT NULL,
  ADD COLUMN `OfficialSymbol` varchar(255) DEFAULT NULL,
  ADD COLUMN `OfficialName` text;

-- Fill thos fields
UPDATE SNP t JOIN genome_loc gl USING (GenomeLocID) set t.Chromosome = gl.Chromosome, t.Strand = gl.Strand, t.EndLoc = gl.EndLoc, t.StartLoc = gl.StartLoc;
UPDATE SNP t JOIN gene g USING (GenomeLocID) set t.Symbol = g.Symbol, t.Name = g.Name, t.NCBIID = g.NCBIID, t.OfficialSymbol = g.OfficialSymbol, t.OfficialName = g.OfficialName;

-- Remove the FOREIGN KEY using constraint name from infomration_schema.
SET @constraint_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE table_name = 'SNP' AND CONSTRAINT_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME = 'genome_loc');
SET @s = (SELECT IF(@constraint_name IS NULL,"SELECT 'There is no foreign key between SNP and genome_loc table' as Message",CONCAT("ALTER TABLE SNP DROP FOREIGN KEY ", @constraint_name)));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop the reference column
ALTER TABLE SNP 
  DROP COLUMN GenomeLocID;

-- genomic_cpg_annotation
-- Add fields from genome_loc table
ALTER TABLE `genomic_cpg_annotation`
  ADD COLUMN `Chromosome` varchar(255) DEFAULT NULL,
  ADD COLUMN `Strand` varchar(255) DEFAULT NULL,
  ADD COLUMN `EndLoc` int(11) DEFAULT NULL,
  ADD COLUMN `StartLoc` int(11) DEFAULT NULL;

-- Fill thos fields
UPDATE genomic_cpg_annotation t JOIN genome_loc gl ON (location_id = GenomeLocID) set t.Chromosome = gl.Chromosome, t.Strand = gl.Strand, t.EndLoc = gl.EndLoc, t.StartLoc = gl.StartLoc;

-- Remove the FOREIGN KEY using constraint name from infomration_schema.
SET @constraint_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE table_name = 'genomic_cpg_annotation' AND CONSTRAINT_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME = 'genome_loc');
SET @s = (SELECT IF(@constraint_name IS NULL,"SELECT 'There is no foreign key between genomic_cpg_annotation and genome_loc table' as Message",CONCAT("ALTER TABLE genomic_cpg_annotation DROP FOREIGN KEY ", @constraint_name)));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop the reference column
ALTER TABLE genomic_cpg_annotation
  DROP COLUMN location_id;

RENAME TABLE genome_loc TO to_be_deleted_genome_loc;
RENAME TABLE gene TO to_be_deleted_gene;

-- DROP TABLE to_be_deleted_genome_loc;
-- DROP TABLE to_be_deleted_gene;

ALTER TABLE `genomic_cpg_annotation` 
ADD INDEX `index3` (`Chromosome` ASC, `StartLoc` ASC, `EndLoc` ASC, `Strand` ASC);

ALTER TABLE `CNV` 
ADD INDEX `index4` (`Chromosome` ASC, `StartLoc` ASC, `EndLoc` ASC, `Strand` ASC);

ALTER TABLE `SNP` 
ADD INDEX `index3` (`Chromosome` ASC, `StartLoc` ASC, `EndLoc` ASC, `Strand` ASC);
WARNINGS;
SET SQL_NOTES=1;

SELECT 'Delete Menu Permission' as 'Step #1';
DELETE FROM LorisMenuPermissions WHERE MenuID IN
    (SELECT ID FROM LorisMenu WHERE Link = 'final_radiological_review/');

SELECT 'Delete Menu Entry' as 'Step #2';
DELETE FROM LorisMenu WHERE Link = 'final_radiological_review/';

SELECT 'Patch complete' as 'Status';
ALTER TABLE mri_upload CHANGE `Inserting` `Inserting` tinyint(1) DEFAULT NULL;
CREATE TABLE `language` (
  `language_id` integer unsigned NOT NULL AUTO_INCREMENT,
  `language_code` varchar(255) NOT NULL,
  `language_label` varchar(255) NOT NULL,
  PRIMARY KEY (`language_id`),
  UNIQUE KEY (`language_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO language (language_code, language_label) VALUES ('en-CA', 'English');

ALTER TABLE users ADD language_preference integer unsigned DEFAULT NULL;
ALTER TABLE users ADD CONSTRAINT `FK_users_2` FOREIGN KEY (`language_preference`) REFERENCES `language` (`language_id`);

ALTER TABLE media ADD COLUMN  language_id INT UNSIGNED DEFAULT NULL;
ALTER TABLE media ADD CONSTRAINT `FK_media_language` FOREIGN KEY (`language_id`) REFERENCES `language` (`language_id`);

-- Disable Foreign key to be able to change type
-- of FileType to VARCHAR(12) in files,
-- mri_processing_protocol and ImagingFileType
SET FOREIGN_KEY_CHECKS=0;

-- ALTER files to drop the FK_files_FileTypes
ALTER TABLE files
  MODIFY `FileType` VARCHAR(12);

-- ALTER mri_processing_protocol to drop the
-- FK_mri_processing_protocol_FileTypes
ALTER TABLE mri_processing_protocol
  MODIFY `FileType` VARCHAR(12);

-- ALTER ImagingFileTypes table to add a `description` column
ALTER TABLE ImagingFileTypes
  MODIFY `type` VARCHAR(12) NOT NULL,
  ADD `description` VARCHAR(255) DEFAULT NULL;

-- Re-enable the forein keys
SET FOREIGN_KEY_CHECKS=1;

-- ADD description to the different type
UPDATE ImagingFileTypes
  SET description='MINC file'
  WHERE type='mnc';

UPDATE ImagingFileTypes
  SET description='3D imaging format'
  WHERE type='obj';

UPDATE ImagingFileTypes
  SET description='transformation matrix file'
  WHERE type='xfm';

UPDATE ImagingFileTypes
  SET description=NULL
  WHERE type='xfmmnc';

UPDATE ImagingFileTypes
  SET description='audition impulse file'
  WHERE type='imp';

UPDATE ImagingFileTypes
  SET description='file describing the cortical thickness in a single column'
  WHERE type='vertstat';

UPDATE ImagingFileTypes
  SET description='XML file'
  WHERE type='xml';

UPDATE ImagingFileTypes
  SET description='text file'
  WHERE type='txt';

UPDATE ImagingFileTypes
  SET description='NIfTI file'
  WHERE type='nii';

UPDATE ImagingFileTypes
  SET description='NRRD file format (used by DTIPrep)'
  WHERE type='nrrd';

INSERT INTO ImagingFileTypes (type, description)
  VALUES ('grid_0', 'MNI BIC non-linear field for non-linear transformation');

-- DELETE xfmmnc entry as no one understand what it is referring to
DELETE FROM ImagingFileTypes
  WHERE type='xfmmnc';

-- MAP .nii.gz file type in files table to .nii and delete .nii
UPDATE files
  SET FileType='nii'
  WHERE FileType='nii.gz';
DELETE FROM ImagingFileTypes
  WHERE type='nii.gz';

-- delete .imp (obscure file type not used currently in any project)
DELETE FROM ImagingFileTypes
  WHERE type='imp';

-- Add Imaging Browser to Imaging Modules
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'ImagingBrowserLinkedInstruments', 'Instruments that the users want to see linked from Imaging Browser', 1, 1, 'instrument', ID, 'Imaging Browser Links to Instruments', 7 FROM ConfigSettings WHERE Name="imaging_modules";

-- Default imaging_browser settings for Linked instruments
-- This will be the two tables mri_parameter_form and radiology_review; IF they exist in the database
SET @s1 = (SELECT IF(
    (SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.TABLES
        WHERE table_name = 'mri_parameter_form'
        AND table_schema = DATABASE()
    ) > 0,
    "INSERT INTO Config (ConfigID, Value) SELECT cs.ID, 'mri_parameter_form' FROM ConfigSettings cs WHERE cs.Name='ImagingBrowserLinkedInstruments'",
    "SELECT 'No. It is therefore not inserted into the Configuration module under Imaging Modules' as 'mri parameter_form table exists?'"
));

PREPARE stmt1 FROM @s1;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

SET @s2 = (SELECT IF(
    (SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.TABLES
        WHERE table_name = 'radiology_review'
        AND table_schema = DATABASE()
    ) > 0,
    "INSERT INTO Config (ConfigID, Value) SELECT cs.ID, 'mri_parameter_form' FROM ConfigSettings cs WHERE cs.Name='ImagingBrowserLinkedInstruments'",
    "SELECT 'No. It is therefore not inserted into the Configuration module under Imaging Modules' as 'radiology_review table exists?'"
));

PREPARE stmt2 FROM @s2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

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
ALTER TABLE ConfigSettings
  MODIFY COLUMN DataType ENUM('text','boolean','email','instrument','textarea','scan_type', 'lookup_center');

UPDATE ConfigSettings
  SET DataType='lookup_center'
  WHERE Name='lookUpCenterNameUsing';

UPDATE ConfigSettings SET
  Description='Path to the upload directory for incoming MRI studies',
  Label='MRI Incoming Directory'
  WHERE Name='MRIUploadIncomingPath';

ALTER TABLE users
	ADD COLUMN active_from DATE
	AFTER language_preference;

ALTER TABLE users
	ADD COLUMN active_to DATE
	AFTER active_from;
-- INSERT THE 2 NEW CONFIGs INTO ConfigSettings TABLE
INSERT INTO ConfigSettings
  (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
  SELECT
    'MriConfigFile',
    'Name of the MRI config file (stored in dicom-archive/.loris_mri/)',
    1,
    0,
    'text',
    ID,
    'Name of the MRI config file',
    19
  FROM ConfigSettings
  WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings
  (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
  SELECT
    'EnvironmentFile',
    'Name of the environment file that need to be sourced for the imaging pipeline',
    1,
    0,
    'text',
    ID,
    'Name of the environment file',
    20
  FROM ConfigSettings
  WHERE Name="imaging_pipeline";

-- INSERT DEFAULT NAME FOR THE CONFIG AND ENVIRONMENT FILE
INSERT INTO Config
  (ConfigID, Value)
  SELECT ID, 'prod' FROM ConfigSettings cs WHERE cs.Name="MriConfigFile";
INSERT INTO Config
  (ConfigID, Value)
  SELECT ID, 'environment' FROM ConfigSettings cs WHERE cs.Name="EnvironmentFile";


-- Create a physiological_modality table
CREATE TABLE `physiological_modality` (
  `PhysiologicalModalityID` INT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `PhysiologicalModality`   VARCHAR(50)         NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalModalityID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Create a physiological_output_type table
CREATE TABLE `physiological_output_type` (
  `PhysiologicalOutputTypeID` INT(5)      UNSIGNED NOT NULL AUTO_INCREMENT,
  `OutputTypeName`            VARCHAR(20)          NOT NULL UNIQUE,
  `OutputTypeDescription`     VARCHAR(255),
  PRIMARY KEY (`PhysiologicalOutputTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Create a physiological_file table
-- Note that the field InsertedByUser refers to the Linux User that ran the script
-- and not a LORIS user
CREATE TABLE `physiological_file` (
  `PhysiologicalFileID`       INT(10)    UNSIGNED  NOT NULL      AUTO_INCREMENT,
  `PhysiologicalModalityID`   INT(5)     UNSIGNED  DEFAULT NULL,
  `PhysiologicalOutputTypeID` INT(5)     UNSIGNED  NOT NULL,
  `SessionID`                 INT(10)    UNSIGNED  NOT NULL,
  `InsertTime`                TIMESTAMP            NOT NULL      DEFAULT CURRENT_TIMESTAMP,
  `FileType`                  VARCHAR(12)          DEFAULT NULL,
  `AcquisitionTime`           DATETIME             DEFAULT '1970-01-01 00:00:01',
  `InsertedByUser`            VARCHAR(50)          NOT NULL,
  `FilePath`                  VARCHAR(255)         NOT NULL,
  PRIMARY KEY (`PhysiologicalFileID`),
  CONSTRAINT `FK_session_ID`
    FOREIGN KEY (`SessionID`)
    REFERENCES `session` (`ID`),
  CONSTRAINT `FK_ImagingFileTypes_type`
    FOREIGN KEY (`FileType`)
    REFERENCES `ImagingFileTypes` (`type`),
  CONSTRAINT `FK_phys_modality_ModID`
    FOREIGN KEY (`PhysiologicalModalityID`)
    REFERENCES `physiological_modality` (`PhysiologicalModalityID`),
  CONSTRAINT `FK_phys_output_type_TypeID`
    FOREIGN KEY (`PhysiologicalOutputTypeID`)
    REFERENCES `physiological_output_type` (`PhysiologicalOutputTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- Create a physiological_parameter_file table that will store all JSON
-- information that accompanies the BIDS physiological dataset
CREATE TABLE `physiological_parameter_file` (
  `PhysiologicalParameterFileID` INT(10) UNSIGNED NOT NULL  AUTO_INCREMENT,
  `PhysiologicalFileID`          INT(10) UNSIGNED NOT NULL,
  `ParameterTypeID`              INT(10) UNSIGNED NOT NULL,
  `InsertTime`                   TIMESTAMP        NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  `Value`                        VARCHAR(255),
  PRIMARY KEY (`PhysiologicalParameterFileID`),
  CONSTRAINT `FK_phys_file_FileID`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_param_type_ParamTypeID`
    FOREIGN KEY (`ParameterTypeID`)
    REFERENCES `parameter_type` (`ParameterTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- Create a physiological_status_type table
CREATE TABLE `physiological_status_type` (
  `PhysiologicalStatusTypeID` INT(5)      UNSIGNED NOT NULL AUTO_INCREMENT,
  `ChannelStatus`             VARCHAR(10)          NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalStatusTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- Create a physiological_channel_type table
CREATE TABLE `physiological_channel_type` (
  `PhysiologicalChannelTypeID` INT(5)       UNSIGNED NOT NULL      AUTO_INCREMENT,
  `ChannelTypeName`            VARCHAR(255)          NOT NULL      UNIQUE,
  `ChannelDescription`         VARCHAR(255)          DEFAULT NULL,
  PRIMARY KEY (`PhysiologicalChannelTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- Create a physiological_channel table that will store all information from
CREATE TABLE `physiological_channel` (
  `PhysiologicalChannelID`     INT(10)    UNSIGNED NOT NULL      AUTO_INCREMENT,
  `PhysiologicalFileID`        INT(10)    UNSIGNED NOT NULL,
  `PhysiologicalChannelTypeID` INT(5)     UNSIGNED NOT NULL,
  `PhysiologicalStatusTypeID`  INT(5)     UNSIGNED DEFAULT NULL,
  `InsertTime`                 TIMESTAMP           NOT NULL      DEFAULT CURRENT_TIMESTAMP,
  `Name`                       VARCHAR(50)         NOT NULL,
  `Description`                VARCHAR(255)        DEFAULT NULL,
  `SamplingFrequency`          INT(6)              DEFAULT NULL,
  `LowCutoff`                  DECIMAL(8,3)        DEFAULT NULL,
  `HighCutoff`                 DECIMAL(8,3)        DEFAULT NULL,
  `ManualFlag`                 DECIMAL(5,4)        DEFAULT NULL,
  `Notch`                      INT(6)              DEFAULT NULL,
  `Reference`                  VARCHAR(255)        DEFAULT NULL,
  `StatusDescription`          VARCHAR(255)        DEFAULT NULL,
  `Unit`                       VARCHAR(255)        DEFAULT NULL,
  `FilePath`                   VARCHAR(255)        DEFAULT NULL,
  PRIMARY KEY (`PhysiologicalChannelID`),
  CONSTRAINT `FK_phys_file_FileID_2`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_phys_channel_type_TypeID`
    FOREIGN KEY (`PhysiologicalChannelTypeID`)
    REFERENCES `physiological_channel_type` (`PhysiologicalChannelTypeID`),
  CONSTRAINT `FK_phys_status_type_TypeID`
    FOREIGN KEY (`PhysiologicalStatusTypeID`)
    REFERENCES `physiological_status_type` (`PhysiologicalStatusTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create physiololgical_electrode_type table
CREATE TABLE `physiological_electrode_type` (
  `PhysiologicalElectrodeTypeID` INT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ElectrodeType`                VARCHAR(50)     NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalElectrodeTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create physiological_electrode_material table
CREATE TABLE `physiological_electrode_material` (
  `PhysiologicalElectrodeMaterialID` INT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ElectrodeMaterial`                VARCHAR(50)     NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalElectrodeMaterialID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create a physiological_electrode table
CREATE TABLE `physiological_electrode` (
  `PhysiologicalElectrodeID`          INT(10) UNSIGNED NOT NULL      AUTO_INCREMENT,
  `PhysiologicalFileID`               INT(10) UNSIGNED NOT NULL,
  `PhysiologicalElectrodeTypeID`      INT(5)  UNSIGNED DEFAULT NULL,
  `PhysiologicalElectrodeMaterialID`  INT(5)  UNSIGNED DEFAULT NULL,
  `InsertTime`                        TIMESTAMP        NOT NULL      DEFAULT CURRENT_TIMESTAMP,
  `Name`                              VARCHAR(50)      NOT NULL,
  `X`                                 DECIMAL(12,6)    NOT NULL,
  `Y`                                 DECIMAL(12,6)    NOT NULL,
  `Z`                                 DECIMAL(12,6)    NOT NULL,
  `Impedance`                         INT(10)          DEFAULT NULL,
  `FilePath`                          VARCHAR(255)     DEFAULT NULL,
  PRIMARY KEY (`PhysiologicalElectrodeID`),
  CONSTRAINT `FK_phys_file_FileID_3`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_phys_elec_type_ID`
    FOREIGN KEY (`PhysiologicalElectrodeTypeID`)
    REFERENCES `physiological_electrode_type` (`PhysiologicalElectrodeTypeID`),
  CONSTRAINT `FK_phys_elec_material_ID`
  FOREIGN KEY (`PhysiologicalElectrodeMaterialID`)
  REFERENCES `physiological_electrode_material` (`PhysiologicalElectrodeMaterialID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- Create physiological_task_event table that will store all information
-- regarding the task executed during the physiological recording
CREATE TABLE `physiological_task_event` (
  `PhysiologicalTaskEventID` INT(10) UNSIGNED NOT NULL      AUTO_INCREMENT,
  `PhysiologicalFileID`      INT(10) UNSIGNED NOT NULL,
  `InsertTime`               TIMESTAMP        NOT NULL      DEFAULT CURRENT_TIMESTAMP,
  `Onset`                    DECIMAL(11,6)    NOT NULL,
  `Duration`                 DECIMAL(11,6)    NOT NULL,
  `EventCode`                INT(10)          DEFAULT NULL,
  `EventValue`               INT(10)          DEFAULT NULL,
  `EventSample`              INT(10)          DEFAULT NULL,
  `EventType`                VARCHAR(50)      DEFAULT NULL,
  `TrialType`                VARCHAR(255)     DEFAULT NULL,
  `ResponseTime`             TIME             DEFAULT NULL,
  `FilePath`                 VARCHAR(255)     DEFAULT NULL,
  PRIMARY KEY (`PhysiologicalTaskEventID`),
  CONSTRAINT `FK_phys_file_FileID_4`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- Create physiological_archive which will store archives of all the files for
-- Front-end download
CREATE TABLE `physiological_archive` (
  `PhysiologicalArchiveID`   INT(10) UNSIGNED NOT NULL   AUTO_INCREMENT,
  `PhysiologicalFileID`      INT(10) UNSIGNED NOT NULL,
  `InsertTime`               TIMESTAMP        NOT NULL   DEFAULT CURRENT_TIMESTAMP,
  `Blake2bHash`              VARCHAR(128)     NOT NULL,
  `FilePath`                 VARCHAR(255)     NOT NULL,
  PRIMARY KEY (`PhysiologicalArchiveID`),
  CONSTRAINT `FK_phys_file_FileID_5`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Insert into physiological_output_type
INSERT INTO physiological_output_type
  (`OutputTypeName`, `OutputTypeDescription`)
  VALUES
  ('raw',         'raw dataset'),
  ('derivatives', 'derivative/processed dataset');

-- Insert into physiological_channel_type
INSERT INTO physiological_channel_type
  (`ChannelTypeName`, `ChannelDescription`)
  VALUES
  ('EEG',              'ElectoEncephaloGram: EEG sensors'                    ),
  ('VEOG',             'Vertical ElectroOculoGram (eyes)'                    ),
  ('HEOG',             'Horizontal ElectOculoGram'                           ),
  ('EOG',              'Generic EOG channel, if HEOG or VEOG information not available'),
  ('ECG',              'ElectroCardioGram (heart)'                           ),
  ('EMG',              'ElectroMyoGram (muscle)'                             ),
  ('TRIG',             'System Triggers'                                     ),
  ('REF',              'Reference electrode'                                 ),
  ('GRD',              'Ground electrode'                                    ),
  ('MISC',             'Miscellaneous'                                       ),
  ('MEGMAG',           'MEG magnetometer'                                    ),
  ('MEGGRADAXIAL',     'MEG axial gradiometer'                               ),
  ('MEGGRADPLANAR',    'MEG planar gradiometer'                              ),
  ('MEGGREFMAG',       'MEG reference magnetometer'                          ),
  ('MEGREFGRADAXIAL',  'MEG reference axial gradiometer'                     ),
  ('MEGREFGRADPLANAR', 'MEG reference planar gradiometer'                    ),
  ('MEGOTHER',         'Any other type of MEG sensor'                        ),
  ('ECOG',             'Electrode channel: electrocortigogram (intracranial)'),
  ('SEEG',             'Electrode channel: stereo-electroencephalogram (intracranial)'),
  ('DBS',              'Electrode channel: deep brain stimulation (intracranial)'),
  ('AUDIO',            'Audio signal'                                        ),
  ('PD',               'Photodiode'                                          ),
  ('EYEGAZE',          'Eye Tracker gaze'                                    ),
  ('PUPIL',            'Eye Tracker pupil diameter'                          ),
  ('SYSCLOCK',         'System time showing elapsed time since trial started'),
  ('ADC',              'Analog to Digital input'                             ),
  ('DAC',              'Digital to Analog input'                             ),
  ('HLU',              'Measure position of head and head coils'             ),
  ('FITERR',           'Fit error signal from each head localization coil'   ),
  ('OTHER',            'Any other type of channel'                           );


-- Insert into physiological_modality
INSERT INTO physiological_modality
  (PhysiologicalModality)
  VALUES
  ('eeg'),
  ('meg'),
  ('ieeg');


-- Insert into physiological_status_type
INSERT INTO physiological_status_type
  (ChannelStatus)
  VALUES
  ('good'),
  ('bad');

-- Insert into ImagingFileTypes
INSERT INTO ImagingFileTypes
  (type, description)
  VALUES
  ('set',  'EEGlab file format (EEG)'),
  ('bdf',  'Biosemi file format (EEG)'),
  ('vhdr', 'Brainvision file format (EEG)'),
  ('vsm',  'BrainStorm file format (EEG)'),
  ('edf',  'European data format (EEG)'),
  ('cnt',  'Neuroscan CNT data format (EEG)');


-- Insert into Config tables
INSERT INTO ConfigSettings
  (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
  SELECT
    'default_bids_vl',
    'Default visit label to use when no visit label set in the BIDS dataset',
    1,
    0,
    'text',
    ID as parentID,
    'Default visit label for BIDS dataset',
    (SELECT MAX(OrderNumber) + 1 FROM ConfigSettings WHERE Parent=parentID)
  FROM ConfigSettings
  WHERE Name="imaging_pipeline";

INSERT INTO permissions (code,description,categoryID) VALUES
('data_release_upload','Data Release: Upload file',(SELECT ID FROM permissions_category WHERE Description='Permission')),
('data_release_edit_file_access','Data Release: Grant other users view-file permissions',(SELECT ID FROM permissions_category WHERE Description='Permission'));

INSERT IGNORE INTO user_perm_rel
SELECT upr.userID, p.permID FROM user_perm_rel upr JOIN permissions p WHERE upr.permID=1 AND p.code IN ('data_release_upload', 'data_release_edit_permissions');


INSERT INTO notification_types
  (Type, private, Description)
  VALUES
  ('imaging non minc file insertion', 1, 'Insertion of a non-MINC file into the MRI tables (files/parameter_file)');

UPDATE notification_types
  SET Description = 'Insertion of a MINC file into the MRI tables (files/parameter_file)'
  WHERE Type = 'minc insertion';

INSERT INTO ConfigSettings
  (
    Name,
    Description,
    Visible,
    AllowMultiple,
    DataType,
    Parent,
    Label,
    OrderNumber
  )
  SELECT
    'compute_snr_modalities',
    'Modalities for which the SNR should be computed when running the insertion MRI scripts',
    1,
    1,
    'scan_type',
    ID,
    'Modalities on which SNR should be calculated',
    21
  FROM
    ConfigSettings
  WHERE
    Name="imaging_pipeline";

/*INSERT scan type=flair, t1, t2 and pd (a.k.a. 41, 44, 45 and 46 respectively)*/
INSERT INTO Config (ConfigID, Value) SELECT ID, 'flair' FROM ConfigSettings WHERE Name="compute_snr_modalities";
INSERT INTO Config (ConfigID, Value) SELECT ID, 't1'    FROM ConfigSettings WHERE Name="compute_snr_modalities";
INSERT INTO Config (ConfigID, Value) SELECT ID, 't2'    FROM ConfigSettings WHERE Name="compute_snr_modalities";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'pd'    FROM ConfigSettings WHERE Name="compute_snr_modalities";


-- Publication Status
CREATE TABLE `publication_status` (
  `PublicationStatusID` int(2) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(255) NOT NULL,
  CONSTRAINT `PK_publication_status` PRIMARY KEY(`PublicationStatusID`),
  CONSTRAINT `UK_publication_status_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';
INSERT INTO publication_status (`Label`) VALUES ('Pending');
INSERT INTO publication_status (`Label`) VALUES ('Approved');
INSERT INTO publication_status (`Label`) VALUES ('Rejected');

CREATE TABLE `publication_collaborator` (
  `PublicationCollaboratorID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255),
  CONSTRAINT `PK_publication_collaborator` PRIMARY KEY(`PublicationCollaboratorID`),
  CONSTRAINT `UK_publication_collaborator_Email` UNIQUE (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Main table
CREATE TABLE `publication` (
    `PublicationID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PublicationStatusID` int(2) unsigned NOT NULL default 1,
    `LeadInvestigatorID` int(10) unsigned NOT NULL,
    `UserID` int(10) unsigned NOT NULL,
    `RatedBy` int(10) unsigned,
    `DateProposed` date NOT NULL,
    `DateRated` date default NULL,
    `Title` varchar(255) NOT NULL,
    `RejectedReason` varchar(255) default NULL,
    `Description` text NOT NULL,
    CONSTRAINT `PK_publication` PRIMARY KEY(`PublicationID`),
    CONSTRAINT `FK_publication_UserID` FOREIGN KEY(`UserID`) REFERENCES `users` (`ID`),
    CONSTRAINT `FK_publication_RatedBy` FOREIGN KEY(`RatedBy`) REFERENCES `users` (`ID`),
    CONSTRAINT `FK_publication_PublicationStatusID` FOREIGN KEY(`PublicationStatusID`) REFERENCES `publication_status` (`PublicationStatusID`),
    CONSTRAINT `FK_publication_LeadInvestigatorID` FOREIGN KEY(`LeadInvestigatorID`) REFERENCES `publication_collaborator` (`PublicationCollaboratorID`),
    CONSTRAINT `UK_publication_Title` UNIQUE (`Title`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Separate table for Keywords
CREATE TABLE `publication_keyword` (
  `PublicationKeywordID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(255) NOT NULL,
  CONSTRAINT `PK_publication_keyword` PRIMARY KEY(`PublicationKeywordID`),
  CONSTRAINT `UK_publication_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Publication - Keyword relational table
CREATE TABLE `publication_keyword_rel` (
  `PublicationID` int(10) unsigned NOT NULL,
  `PublicationKeywordID` int(10) unsigned NOT NULL,
  CONSTRAINT `PK_publication_keyword_rel` PRIMARY KEY(PublicationID, PublicationKeywordID),
  CONSTRAINT `FK_publication_keyword_PublicationID` FOREIGN KEY(`PublicationID`) REFERENCES `publication` (`PublicationID`),
  CONSTRAINT `FK_publication_keyword_PublicationKeywordID` FOREIGN KEY(`PublicationKeywordID`) REFERENCES `publication_keyword` (`PublicationKeywordID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

CREATE TABLE `publication_collaborator_rel` (
  `PublicationID` int(10) unsigned NOT NULL,
  `PublicationCollaboratorID` int(10) unsigned NOT NULL,
  CONSTRAINT `PK_publication_collaborator_rel` PRIMARY KEY(PublicationID, PublicationCollaboratorID),
  CONSTRAINT `FK_publication_collaborator_rel_PublicationID` FOREIGN KEY(`PublicationID`) REFERENCES `publication` (`PublicationID`),
  CONSTRAINT `FK_publication_collaborator_rel_PublicationCollaboratorID` FOREIGN KEY(`PublicationCollaboratorID`) REFERENCES `publication_collaborator` (`PublicationCollaboratorID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Publication - Variable of Interest  relational table
CREATE TABLE `publication_parameter_type_rel` (
    `PublicationID` int(10) unsigned NOT NULL,
    `ParameterTypeID` int(10) unsigned NOT NULL,
    CONSTRAINT `PK_publication_parameter_type_rel` PRIMARY KEY (PublicationID, ParameterTypeID),
    CONSTRAINT `FK_publication_parameter_type_rel_PublicationID` FOREIGN KEY (`PublicationID`) REFERENCES `publication` (`PublicationID`),
    CONSTRAINT `FK_publication_parameter_type_rel_ParameterTypeID` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

CREATE TABLE `publication_test_names_rel` (
    `PublicationID` int(10) unsigned NOT NULL,
    `TestNameID` int(10) unsigned NOT NULL,
    CONSTRAINT `PK_publication_test_names_rel` PRIMARY KEY(`PublicationID`, `TestNameID`),
    CONSTRAINT `FK_publication_test_names_rel_PublicationID` FOREIGN KEY (`PublicationID`) REFERENCES `publication` (`PublicationID`),
    CONSTRAINT `FK_publication_test_names_rel_TestNameID` FOREIGN KEY (`TestNameID`) REFERENCES `test_names` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8mb4';

-- Publication Uploads
CREATE TABLE `publication_upload_type` (
  `PublicationUploadTypeID` int(2) unsigned NOT NULL AUTO_INCREMENT,
  `Label` varchar(255) NOT NULL,
  CONSTRAINT `PK_publication_upload_type` PRIMARY KEY (`PublicationUploadTypeID`),
  CONSTRAINT `UK_publication_Label` UNIQUE (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

INSERT INTO publication_upload_type (`Label`) VALUES ('Paper');
INSERT INTO publication_upload_type (`Label`) VALUES ('Poster');
INSERT INTO publication_upload_type (`Label`) VALUES ('Presentation');
INSERT INTO publication_upload_type (`Label`) VALUES ('Other');

CREATE TABLE `publication_upload` (
    `PublicationUploadID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PublicationID` int(10) unsigned NOT NULL,
    `PublicationUploadTypeID` int(2) unsigned NOT NULL,
    `Filename` varchar(255) NOT NULL,
    `Version` varchar(255),
    `Citation` text,
    CONSTRAINT `PK_publication_upload` PRIMARY KEY (`PublicationUploadID`),
    CONSTRAINT `UK_publication_upload_Filename` UNIQUE (Filename),
    CONSTRAINT `FK_publication_upload_PublicationID` FOREIGN KEY (`PublicationID`) REFERENCES `publication` (`PublicationID`),
    CONSTRAINT `FK_publication_upload_PublicationUploadTypeID` FOREIGN KEY (`PublicationUploadTypeID`) REFERENCES `publication_upload_type` (`PublicationUploadTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

CREATE TABLE `publication_users_edit_perm_rel` (
  `PublicationID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `UserID` int(10) unsigned NOT NULL,
  CONSTRAINT `FK_publication_users_edit_perm_rel_PublicationID` FOREIGN KEY (`PublicationID`) REFERENCES `publication` (`PublicationID`),
  CONSTRAINT `FK_publication_users_edit_perm_rel_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

SET @reportsTab = (SELECT ID FROM LorisMenu WHERE Label='Reports');
SET @orderNum = (SELECT MAX(OrderNumber) + 1 FROM LorisMenu WHERE Parent=@reportsTab);
INSERT INTO LorisMenu (Parent, Label, Link, OrderNumber) VALUES (@reportsTab, 'Publications', 'publication/', @orderNum);
INSERT INTO permissions (code, description, categoryID) VALUES ('publication_view', 'Publication - Access to module', 2);
INSERT INTO permissions (code, description, categoryID) VALUES ('publication_propose', 'Publication - Propose a project', 2);
INSERT INTO permissions (code, description, categoryID) VALUES ('publication_approve', 'Publication - Approve or reject proposed publication projects', 2);
INSERT INTO LorisMenuPermissions (MenuID, PermID) VALUES ((SELECT ID FROM LorisMenu WHERE Label='Publications'), (SELECT permID FROM permissions WHERE code='publication_view'));
INSERT INTO LorisMenuPermissions (MenuID, PermID) VALUES ((SELECT ID FROM LorisMenu WHERE Label='Publications'), (SELECT permID FROM permissions WHERE code='publication_propose'));
INSERT INTO LorisMenuPermissions (MenuID, PermID) VALUES ((SELECT ID FROM LorisMenu WHERE Label='Publications'), (SELECT permID FROM permissions WHERE code='publication_approve'));
INSERT INTO user_perm_rel (userID, permID) VALUES(1, (SELECT permID FROM permissions WHERE code='publication_approve'));
INSERT INTO user_perm_rel (userID, permID) VALUES(1, (SELECT permID FROM permissions WHERE code='publication_view'));
INSERT INTO user_perm_rel (userID, permID) VALUES(1, (SELECT permID FROM permissions WHERE code='publication_propose'));

INSERT INTO notification_modules (module_name, operation_type, template_file, description) VALUES ('publication', 'submission', 'notifier_publication_submission.tpl', 'Publication: Submission Received');
INSERT INTO notification_modules (module_name, operation_type, template_file, description) VALUES ('publication', 'review', 'notifier_publication_review.tpl', 'Publication: Proposal has been reviewed');
INSERT INTO notification_modules (module_name, operation_type, template_file, description) VALUES ('publication', 'edit', 'notifier_publication_edit.tpl', 'Publication: Proposal has been edited');

INSERT INTO notification_modules_services_rel (module_id, service_id) VALUES (
  (SELECT id FROM notification_modules WHERE module_name='publication' AND operation_type='submission'),
  (SELECT id FROM notification_services WHERE service='email_text')
);
INSERT INTO notification_modules_services_rel (module_id, service_id) VALUES (
  (SELECT id FROM notification_modules WHERE module_name='publication' AND operation_type='review'),
  (SELECT id FROM notification_services WHERE service='email_text')
);
INSERT INTO notification_modules_services_rel (module_id, service_id) VALUES (
  (SELECT id FROM notification_modules WHERE module_name='publication' AND operation_type='edit'),
  (SELECT id FROM notification_services WHERE service='email_text')
);

SET @pathID = (SELECT ID FROM ConfigSettings WHERE Name='paths');
SET @order  = (SELECT MAX(OrderNumber) + 1 FROM ConfigSettings WHERE Parent=@pathID);
INSERT INTO ConfigSettings (Name, Description, Visible, Parent, Label, DataType, OrderNumber) VALUES ('publication_uploads', 'Path to uploaded publications', 1, @pathID, 'Publications', 'text', @order + 1);
INSERT INTO Config (ConfigID, Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name='publication_uploads'), '/data/publication_uploads/');

INSERT INTO ConfigSettings (Name, Description, Visible, Parent, Label, DataType, OrderNumber) VALUES ('publication_deletions', 'Path to deleted publications', 1, @pathID, 'Deleted Publications', 'text', @order + 1);
INSERT INTO Config (ConfigID, Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name='publication_deletions'), '/data/publication_uploads/to_be_deleted/');







-- Convert all Perl regex that contain the case-insensitive modifier 'i'
UPDATE Config
SET Value=CONCAT('(?i)', SUBSTRING(Value FROM 2 FOR LENGTH(Value)-3))
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='patientIDRegex')
AND Value LIKE '/%/i';

-- Removes the leading and trailing forward slashes from every regex that do not contain any modifier
UPDATE Config
SET Value=SUBSTRING(Value FROM 2 FOR LENGTH(Value)-2)
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='patientIDRegex')
AND Value LIKE '/%/';

-- Convert all Perl regex that contain the case-insensitive modifier 'i'
UPDATE Config
SET Value=CONCAT('(?i)', SUBSTRING(Value FROM 2 FOR LENGTH(Value)-3))
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='patientNameRegex')
AND Value LIKE '/%/i';

-- Removes the leading and trailing forward slashes from every regex that do not contain any modifier
UPDATE Config
SET Value=SUBSTRING(Value FROM 2 FOR LENGTH(Value)-2)
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='patientNameRegex')
AND Value LIKE '/%/';

-- Convert all Perl regex that contain the case-insensitive modifier 'i'
UPDATE Config
SET Value=CONCAT('(?i)', SUBSTRING(Value FROM 2 FOR LENGTH(Value)-3))
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='LegoPhantomRegex')
AND Value LIKE '/%/i';

-- Removes the leading and trailing forward slashes from every regex that do not contain any modifier
UPDATE Config
SET Value=SUBSTRING(Value FROM 2 FOR LENGTH(Value)-2)
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='LegoPhantomRegex')
AND Value LIKE '/%/';

-- Convert all Perl regex that contain the case-insensitive modifier 'i'
UPDATE Config
SET Value=CONCAT('(?i)', SUBSTRING(Value FROM 2 FOR LENGTH(Value)-3))
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='LivingPhantomRegex')
AND Value LIKE '/%/i';

-- Removes the leading and trailing forward slashes from every regex that do not contain any modifier
UPDATE Config
SET Value=SUBSTRING(Value FROM 2 FOR LENGTH(Value)-2)
WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='LivingPhantomRegex')
AND Value LIKE '/%/';





-- Add 'path' and 'web_path' to DataType enum. The first should represent an
-- arbitrary path used in LORIS. 'web_path' should represent a full path
-- that is reachable by the web-server i.e. Apache. Paths of type 'web_path'
-- will be validated when configured from the front-end and will throw errors
-- if not reachable by the server.
ALTER TABLE ConfigSettings MODIFY COLUMN DataType enum('text','boolean','email','instrument','textarea','scan_type','lookup_center','path','web_path');
UPDATE ConfigSettings SET DataType='web_path' where Name IN ('imagePath', 'base', 'data', 'extLibs', 'mincPath', 'DownloadPath', 'IncomingPath', 'MRICodePath', 'MRIUploadIncomingPath', 'GenomicDataPath', 'mediaPath', 'dataDirBasepath');
UPDATE ConfigSettings SET DataType='path' WHERE Name IN ('log', 'MRICodePath', 'tarchiveLibraryDir', 'get_dicom_info', 'niak_path');






INSERT INTO ConfigSettings
  (
    Name,
    Description,
    Visible,
    AllowMultiple,
    DataType,
    Parent,
    Label,
    OrderNumber
  )
  SELECT
    'reference_scan_type_for_defacing',
    'Scan type to use as a reference for registration when defacing anatomical images (typically a T1W image)',
    1,
    0,
    'scan_type',
    ID,
    'Scan type to use as a reference for defacing (typically a T1W image)',
    22
  FROM
    ConfigSettings
  WHERE
    Name="imaging_pipeline";
INSERT INTO ConfigSettings
  (
    Name,
    Description,
    Visible,
    AllowMultiple,
    DataType,
    Parent,
    Label,
    OrderNumber
  )
  SELECT
    'modalities_to_deface',
    'Modalities for which defacing should be run and defaced image inserted in the database',
    1,
    1,
    'scan_type',
    ID,
    'Modalities on which to run the defacing pipeline',
    23
  FROM
    ConfigSettings
  WHERE
    Name="imaging_pipeline";

INSERT INTO Config (ConfigID, Value) SELECT ID, 't1'    FROM ConfigSettings WHERE Name="reference_scan_type_for_defacing";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'flair' FROM ConfigSettings WHERE Name="modalities_to_deface";
INSERT INTO Config (ConfigID, Value) SELECT ID, 't1'    FROM ConfigSettings WHERE Name="modalities_to_deface";
INSERT INTO Config (ConfigID, Value) SELECT ID, 't2'    FROM ConfigSettings WHERE Name="modalities_to_deface";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'pd'    FROM ConfigSettings WHERE Name="modalities_to_deface";






INSERT INTO parameter_type_category_rel (ParameterTypeID, ParameterTypeCategoryID)
  SELECT DISTINCT ParameterTypeID, ParameterTypeCategoryID
  FROM   parameter_type, parameter_type_category ptc
  WHERE  SourceFrom="parameter_file" AND ptc.Name="MRI Variables";


INSERT INTO parameter_type_category (Name, Type)
  VALUES ('Electrophysiology Variables', 'Metavars');

INSERT INTO parameter_type_category_rel (ParameterTypeID, ParameterTypeCategoryID)
  SELECT DISTINCT ParameterTypeID, ParameterTypeCategoryID
  FROM   parameter_type, parameter_type_category ptc
  WHERE  SourceFrom="physiological_parameter_file" AND ptc.Name="Electrophysiology Variables";


SELECT 'Running: SQL/New_patches/2018-01-17-normalisation_visit.sql';

ALTER TABLE project_rel DROP PRIMARY KEY;
ALTER TABLE project_rel ADD COLUMN `ProjectSubprojectRelID` int(10) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;
ALTER TABLE project_rel ADD CONSTRAINT UK_project_rel_ProjectID_SubprojectID UNIQUE KEY (ProjectID, SubprojectID);

CREATE TABLE `visit` (
  `VisitID` int(10) unsigned NOT NULL auto_increment,
  `VisitName` varchar(100) NOT NULL,
  CONSTRAINT `PK_visit` PRIMARY KEY (`VisitID`),
  CONSTRAINT `UK_visit_name` UNIQUE KEY (`VisitName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `visit_project_subproject_rel` (
  `VisitProjectSubprojectRelID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `VisitID` int(10) unsigned NOT NULL,
  `ProjectSubprojectRelID` int(10) unsigned NOT NULL,
  CONSTRAINT PK_visit_project_subproject_rel PRIMARY KEY (`VisitProjectSubprojectRelID`),
  CONSTRAINT UK_visit_project_subproject_rel_VisitID_ProjectSubprojectRelID UNIQUE KEY (`VisitID`, `ProjectSubprojectRelID`),
  CONSTRAINT FK_visit_project_subproject_rel_VisitID FOREIGN KEY (`VisitID`)
    REFERENCES `visit`(`VisitID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT FK_visit_project_subproject_rel_ProjectSubprojectRelID FOREIGN KEY (`ProjectSubprojectRelID`)
    REFERENCES `project_rel`(`ProjectSubprojectRelID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO visit (SELECT ID, Visit_label FROM Visit_Windows);
INSERT IGNORE INTO visit (SELECT null, Visit_label FROM session WHERE Visit_label NOT IN (SELECT VisitName FROM visit));

-- add visit from config.xml

SELECT 'Running: SQL/New_patches/2018-01-23-qc_module_patch.sql';

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES ('Quality Control','quality_control/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 10);

SELECT 'Running: SQL/New_patches/2018-02-27_normalize_mri_protocol.sql';

-- This patch adds min & max columns for every field in `mri_protocol` & `mri_protocol_checks` which presently can hold range values.
ALTER TABLE
	`mri_protocol`
		ADD COLUMN `TR_min` DECIMAL(10,4) DEFAULT NULL AFTER `Scan_type`,
		ADD COLUMN `TR_max` DECIMAL(10,4) DEFAULT NULL AFTER `TR_min`,
		ADD COLUMN `TE_min` DECIMAL(10,4) DEFAULT NULL AFTER `TR_max`,
		ADD COLUMN `TE_max` DECIMAL(10,4)  DEFAULT NULL AFTER `TE_min`,
		ADD COLUMN `TI_min` DECIMAL(10,4)  DEFAULT NULL AFTER `TE_max`,
		ADD COLUMN `TI_max` DECIMAL(10,4)  DEFAULT NULL AFTER `TI_min`,
		ADD COLUMN `slice_thickness_min` DECIMAL(7,4) DEFAULT NULL AFTER `TI_max`,
		ADD COLUMN `slice_thickness_max` DECIMAL(7,4) DEFAULT NULL AFTER `slice_thickness_min`,
		ADD COLUMN `xspace_min` int(4) DEFAULT NULL AFTER `slice_thickness_max`,
		ADD COLUMN `xspace_max` int(4) DEFAULT NULL AFTER `xspace_min`,
		ADD COLUMN `yspace_min` int(4) DEFAULT NULL AFTER `xspace_max`,
		ADD COLUMN `yspace_max` int(4) DEFAULT NULL AFTER `yspace_min`,
		ADD COLUMN `zspace_min` int(4) DEFAULT NULL AFTER `yspace_max`,
		ADD COLUMN `zspace_max` int(4) DEFAULT NULL AFTER `zspace_min`,
		ADD COLUMN `xstep_min` DECIMAL(9,4) DEFAULT NULL AFTER `zspace_max`,
		ADD COLUMN `xstep_max` DECIMAL(9,4) DEFAULT NULL AFTER `xstep_min`,
    ADD COLUMN `ystep_min` DECIMAL(9,4) DEFAULT NULL AFTER `xstep_max`,
    ADD COLUMN `ystep_max` DECIMAL(9,4) DEFAULT NULL AFTER `ystep_min`,
    ADD COLUMN `zstep_min` DECIMAL(9,4) DEFAULT NULL AFTER `ystep_max`,
    ADD COLUMN `zstep_max` DECIMAL(9,4) DEFAULT NULL AFTER `zstep_min`,
		ADD COLUMN `time_min` int(4) DEFAULT NULL AFTER `zstep_max`,
		ADD COLUMN `time_max` int(4) DEFAULT NULL AFTER `time_min`,
		DROP `FOV_x_range`,
		DROP `FOV_y_range`,
		DROP `FOV_z_range`;

ALTER TABLE
  `mri_protocol_checks`
    ADD COLUMN `ValidMin` int(4) DEFAULT NULL AFTER `Header`,
    ADD COLUMN `ValidMax` int(4) DEFAULT NULL AFTER `ValidMin`;


SELECT 'Running: SQL/New_patches/2018-08-27-BIDSScanTypeTable.sql';

CREATE TABLE `bids_category` (
 `BIDSCategoryID`   int(3)      UNSIGNED NOT NULL AUTO_INCREMENT,
 `BIDSCategoryName` varchar(10)          NOT NULL UNIQUE,
 PRIMARY KEY (`BIDSCategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `bids_category` (BIDSCategoryName) VALUES
      ('anat'),
      ('func'),
      ('dwi'),
      ('fmap');

CREATE TABLE `bids_scan_type_subcategory` (
  `BIDSScanTypeSubCategoryID` int(3)       UNSIGNED NOT NULL AUTO_INCREMENT,
  `BIDSScanTypeSubCategory`   varchar(100)          NOT NULL UNIQUE,
  PRIMARY KEY (`BIDSScanTypeSubCategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `bids_scan_type_subcategory` (BIDSScanTypeSubCategory) VALUES
  ('task-rest');

CREATE TABLE `bids_scan_type` (
  `BIDSScanTypeID` int(3)       UNSIGNED NOT NULL AUTO_INCREMENT,
  `BIDSScanType`   varchar(100)          NOT NULL UNIQUE,
  PRIMARY KEY (`BIDSScanTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `bids_scan_type` (BIDSScanType) VALUES
  ('bold'),
  ('FLAIR'),
  ('T1w'),
  ('T2w'),
  ('dwi');

CREATE TABLE `bids_mri_scan_type_rel` (
  `MRIScanTypeID`             int(10) UNSIGNED NOT NULL,
  `BIDSCategoryID`            int(3)  UNSIGNED DEFAULT NULL,
  `BIDSScanTypeSubCategoryID` int(3)  UNSIGNED DEFAULT NULL,
  `BIDSScanTypeID`            int(3)  UNSIGNED DEFAULT NULL,
  `BIDSEchoNumber`            int(3)  UNSIGNED DEFAULT NULL,
  PRIMARY KEY  (`MRIScanTypeID`),
  KEY `FK_bids_mri_scan_type_rel` (`MRIScanTypeID`),
  CONSTRAINT `FK_bids_mri_scan_type_rel`     FOREIGN KEY (`MRIScanTypeID`)             REFERENCES `mri_scan_type` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_bids_category`              FOREIGN KEY (`BIDSCategoryID`)            REFERENCES `bids_category`(`BIDSCategoryID`),
  CONSTRAINT `FK_bids_scan_type_subcategory` FOREIGN KEY (`BIDSScanTypeSubCategoryID`) REFERENCES `bids_scan_type_subcategory` (`BIDSScanTypeSubCategoryID`),
  CONSTRAINT `FK_bids_scan_type`             FOREIGN KEY (`BIDSScanTypeID`)            REFERENCES `bids_scan_type` (`BIDSScanTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Default schema scan types; make some of them named in a BIDS compliant manner
INSERT INTO bids_mri_scan_type_rel
  (MRIScanTypeID, BIDSCategoryID, BIDSScanTypeSubCategoryID, BIDSScanTypeID, BIDSEchoNumber)
  VALUES
  (
    (SELECT ID FROM mri_scan_type WHERE Scan_type = 'flair'),
    (SELECT BIDSCategoryID FROM bids_category WHERE BIDSCategoryName='anat'),
    NULL,
    (SELECT BIDSScanTypeID FROM bids_scan_type WHERE BIDSSCanType='FLAIR'),
    NULL
  ),
  (
    (SELECT ID FROM mri_scan_type WHERE Scan_type = 'fMRI'),
    (SELECT BIDSCategoryID FROM bids_category WHERE BIDSCategoryName='func'),
    (SELECT BIDSScanTypeSubCategoryID FROM bids_scan_type_subcategory WHERE BIDSScanTypeSubCategory='task-rest'),
    (SELECT BIDSScanTypeID FROM bids_scan_type WHERE BIDSSCanType='bold'),
    NULL
  ),
  (
    (SELECT ID FROM mri_scan_type WHERE Scan_type = 't1'),
    (SELECT BIDSCategoryID FROM bids_category WHERE BIDSCategoryName='anat'),
    NULL,
    (SELECT BIDSScanTypeID FROM bids_scan_type WHERE BIDSSCanType='T1w'),
    NULL
  ),
  (
    (SELECT ID FROM mri_scan_type WHERE Scan_type = 't2'),
    (SELECT BIDSCategoryID FROM bids_category WHERE BIDSCategoryName='anat'),
    NULL,
    (SELECT BIDSScanTypeID FROM bids_scan_type WHERE BIDSSCanType='T2w'),
    NULL
  ),
  (
    (SELECT ID FROM mri_scan_type WHERE Scan_type = 'dti'),
    (SELECT BIDSCategoryID FROM bids_category WHERE BIDSCategoryName='dwi'),
    NULL,
    (SELECT BIDSScanTypeID FROM bids_scan_type WHERE BIDSSCanType='dwi'),
    NULL
  );

SELECT 'Running: SQL/New_patches/2018-08-27-GenderToSex.sql';

ALTER TABLE `candidate` CHANGE COLUMN Gender Sex enum('Male','Female');
ALTER TABLE `candidate` CHANGE COLUMN ProbandGender ProbandSex enum('Male','Female');

ALTER TABLE `tarchive` CHANGE PatientGender PatientSex varchar(255);

SELECT 'Running: SQL/New_patches/2018-11-05-rename_candidate_CenterID_to_RegistrationCenterID.sql';

ALTER TABLE `candidate` DROP FOREIGN KEY `FK_candidate_1`;
ALTER TABLE `candidate` 
    CHANGE COLUMN `CenterID` `RegistrationCenterID` integer unsigned NOT NULL DEFAULT '0';
ALTER TABLE `candidate`
  ADD CONSTRAINT `FK_candidate_1` FOREIGN KEY (`RegistrationCenterID`) REFERENCES `psc` (`CenterID`);


SELECT 'Running: SQL/New_patches/2018-11-29-Add_instrument_manager_permission.sql';

INSERT INTO permissions (code,description,categoryID) VALUES ('instrument_manager_read','Instrument Manager: View module',(SELECT ID FROM permissions_category WHERE Description = 'Permission'));
INSERT INTO permissions (code,description,categoryID) VALUES ('instrument_manager_write','Instrument Manager: Install new instruments via file upload',(SELECT ID FROM permissions_category WHERE Description = 'Permission'));

INSERT IGNORE INTO user_perm_rel
SELECT upr.userID, p.permID FROM user_perm_rel upr JOIN permissions p WHERE upr.permID=1 AND p.code IN ('instrument_manager_read', 'instrument_manager_write');

INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='instrument_manager_read' AND m.Label='Instrument Manager';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='instrument_manager_write' AND m.Label='Instrument Manager';

SELECT 'Running: SQL/New_patches/2019-01-28_Add_Pwned_Password_ConfigSetting.sql';

-- Adds the option to toggle the usage of the Pwned Passwords
-- API (https://haveibeenpwned.com/API/v2#PwnedPasswords) in a project. This
-- is enabled by default to allow for a higher level of security. This
-- setting is added to allow projects to disable the API check in case of
-- networking issues.
INSERT INTO ConfigSettings
  (
    Name,
    Description,
    Visible,
    AllowMultiple,
    DataType,
    Parent,
    Label,
    OrderNumber
  )
  SELECT
    'usePwnedPasswordsAPI',
    'Whether to query the Have I Been Pwned password API on password changes to prevent the usage of common and breached passwords',
    1,
    0,
    'boolean',
    ID,
    'Enable "Pwned Password" check',
    22
  FROM
    ConfigSettings
  WHERE
    Name="study";

INSERT INTO Config (ConfigID, Value) SELECT ID, 'false' FROM ConfigSettings WHERE Name="usePwnedPasswordsAPI";

SELECT 'Running: SQL/New_patches/2019-02-08_cleanup_duplicated_data_path_in_Config.sql';

-- Remove entries for mincPath and data from the Config table
DELETE
FROM Config
WHERE ConfigID IN (
  SELECT ID
  FROM ConfigSettings
  WHERE Name IN ('mincPath', 'data')
);

-- Remove entries for mincPath and data from the ConfigSettings table
DELETE
FROM ConfigSettings
WHERE Name IN ('mincPath', 'data');

SELECT 'Running: SQL/New_patches/2019-03-20-session-notnull.sql';

ALTER TABLE `session` 
CHANGE COLUMN `CenterID` `CenterID` INTEGER UNSIGNED NOT NULL,
CHANGE COLUMN `Visit_label` `Visit_label` varchar(255) NOT NULL;
SELECT 'Running: SQL/New_patches/2019-04-04_add_image_type_to_mri_protocol.sql';

-- Add an image_type column to be used for scan identification 
-- in the mri_protocol and mri_protocol_violated_scans tables

ALTER TABLE mri_protocol 
  ADD COLUMN `image_type` varchar(255) default NULL;

ALTER TABLE mri_protocol_violated_scans
  ADD COLUMN `image_type` varchar(255) default NULL;

SELECT 'Running: SQL/New_patches/2019-04-26-Delete_cascades_parameter_type_rel.sql';

ALTER TABLE parameter_type_category_rel DROP FOREIGN KEY `FK_parameter_type_category_rel_1`;
ALTER TABLE parameter_type_category_rel DROP FOREIGN KEY `FK_parameter_type_category_rel_2`;

ALTER TABLE parameter_type_category_rel ADD CONSTRAINT `FK_parameter_type_category_rel_1` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`) ON DELETE CASCADE;
ALTER TABLE parameter_type_category_rel ADD CONSTRAINT `FK_parameter_type_category_rel_2` FOREIGN KEY (`ParameterTypeCategoryID`) REFERENCES `parameter_type_category` (`ParameterTypeCategoryID`) ON DELETE CASCADE;

SELECT 'Running: SQL/New_patches/2019-05-03-deprecate_useprojects.sql';

DELETE cs, c FROM ConfigSettings cs JOIN Config c ON c.ConfigID=cs.ID WHERE cs.Name='useProjects';

-- if Project table is empty, add default 'loris' project
INSERT INTO Project (Name)
(SELECT 'loris' FROM DUAL
WHERE NOT EXISTS (SELECT * FROM Project));

-- associate all subprojects to the loris project by default if project table was empty
INSERT INTO project_rel (ProjectID,SubprojectID)
SELECT ProjectID, SubprojectID 
FROM Project JOIN subproject 
WHERE Project.Name='loris';

-- if the loris project was added, set all candidates to that default project
UPDATE candidate SET ProjectID=(SELECT ProjectID FROM Project WHERE Name='loris') WHERE ProjectID IS NULL;

SELECT 'Running: SQL/New_patches/2019-05-15-LorisMenuPermissions_QC_and_datarelease.sql';

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_release_upload' AND m.Label='Data Release';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_release_edit_file_access' AND m.Label='Data Release';

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_team_helper' AND m.Label='Quality Control';


SELECT 'Running: SQL/New_patches/2019-05-22-ChangePublicationPathsToWebPathType.sql';

-- The publication paths were set to text in earlier versions of LORIS. They
-- should have the 'web_path' type so that they are properly validated in LORIS.
UPDATE ConfigSettings SET DataType="web_path" WHERE Name LIKE "publication%";

SELECT 'Running: SQL/New_patches/2019-05-23-correct_type_ValidMin_ValidMax_of_mri_protocol_checks.sql';

-- Change the type of mri_protocol_checks' ValidMin and ValidMax columns to be decimals 
-- instead of INT as these columns can contain decimal values.
ALTER TABLE mri_protocol_checks CHANGE `ValidMin` `ValidMin` decimal(10,4) DEFAULT NULL;
ALTER TABLE mri_protocol_checks CHANGE `ValidMax` `ValidMax` decimal(10,4) DEFAULT NULL;

SELECT 'Running: SQL/New_patches/2019-06-06-AddActiveToNotificationSpool.sql';

-- ----------------------------------------------------------------------------------------------
--
-- Adds the Active column to the notification spool table. Active log entries refer to the 
-- entries of the last upload associated to a given upload ID. The entries that belong to 
-- previous uploads will have their Active column set to 'N'.
--
-- ----------------------------------------------------------------------------------------------

ALTER TABLE notification_spool ADD COLUMN Active enum('Y', 'N') NOT NULL DEFAULT 'Y' AFTER Origin;

SELECT 'Running: SQL/New_patches/2019-06-13-LorisMenuPermissions_IssueTracker.sql';

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='issue_tracker_developer' AND m.Label='Issue Tracker';

SELECT 'Running: SQL/Archive/22.0/2019-04-30-project-rel-rename.sql';

RENAME TABLE project_rel TO project_subproject_rel;

-- Change fields to math their respective reference keys
ALTER TABLE project_subproject_rel CHANGE `SubprojectID` `SubprojectID` int(10) unsigned NOT NULL;

ALTER TABLE project_subproject_rel ADD CONSTRAINT `FK_project_subproject_rel_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE;
ALTER TABLE project_subproject_rel ADD CONSTRAINT `FK_project_subproject_rel_SubprojectID` FOREIGN KEY (`SubprojectID`) REFERENCES `subproject` (`SubprojectID`) ON DELETE CASCADE;


SELECT 'Running: SQL/Archive/22.0/2019-07-01_add_projects_to_sessions.sql';

-- Remove foreign key to be able to change signature of the column
ALTER TABLE project_subproject_rel DROP FOREIGN KEY `FK_project_subproject_rel_ProjectID`;

-- Change/add project ID fields to INT(10) consistently accross tables
ALTER TABLE project_subproject_rel CHANGE COLUMN ProjectID ProjectID int(10) unsigned NOT NULL;
ALTER TABLE Project CHANGE COLUMN ProjectID ProjectID int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE candidate CHANGE COLUMN ProjectID RegistrationProjectID int(10) unsigned DEFAULT NULL;
ALTER TABLE session ADD COLUMN ProjectID int(10) unsigned DEFAULT NULL;

-- Re-add necessary FOREIGN KEY constraints
ALTER TABLE project_subproject_rel ADD CONSTRAINT `FK_project_subproject_rel_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE;
ALTER TABLE candidate ADD CONSTRAINT `FK_candidate_RegistrationProjectID` FOREIGN KEY (`RegistrationProjectID`) REFERENCES `Project` (`ProjectID`) ON UPDATE CASCADE;
ALTER TABLE session ADD CONSTRAINT `FK_session_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`);

-- Populate new session field with pre recorded candidate project
UPDATE session s JOIN candidate c ON s.CandID=c.CandID SET ProjectID=c.RegistrationProjectID;



SELECT 'Running: SQL/Archive/22.0/2019-07-04-remove_header_row_from_parameter_file_and_convert_back_to_Value_field_to_text.sql';

DELETE FROM parameter_file WHERE ParameterTypeID=(SELECT ParameterTypeID FROM parameter_type WHERE Name='header' AND SourceFrom='parameter_file');
DELETE FROM parameter_type WHERE Name='header' AND SourceFrom='parameter_file';
ALTER TABLE parameter_file MODIFY Value TEXT;

SELECT 'Running: SQL/Archive/22.0/2019-07-10-subproject-session-FK.sql';

ALTER TABLE session CHANGE `SubprojectID` `SubprojectID` int(10) unsigned DEFAULT NULL;
ALTER TABLE session ADD CONSTRAINT `FK_session_3` FOREIGN KEY (`SubprojectID`) REFERENCES `subproject` (`SubprojectID`);

SELECT 'Running: SQL/Archive/22.0/2019-07-17_remove_mri_acquisition_dates_table.sql';

DROP TABLE mri_acquisition_dates;
SELECT 'Running: SQL/Archive/22.0/2019-08-05-add_projects_to_users.sql';


CREATE TABLE `user_project_rel` (
  `UserID` int(10) unsigned NOT NULL,
  `ProjectID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`UserID`,`ProjectID`),
  CONSTRAINT `FK_user_project_rel_UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_project_rel_ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- To maintain status quo, add all projects to all users since users had access to all data before projects were added.
INSERT IGNORE INTO user_project_rel
SELECT ID,ProjectID FROM users JOIN Project;

SELECT 'Running: SQL/Archive/22.0/2019-10-01_Rename-media-column.sql';

ALTER TABLE media CHANGE date_uploaded last_modified timestamp;

SELECT 'Running: SQL/Archive/22.0/2019-10-05-Add_alias_to_projects.sql';

ALTER TABLE `Project` ADD COLUMN `Alias` char(4) DEFAULT NULL AFTER `Name`;
UPDATE Project SET Alias=UPPER(LEFT(Name,4)) WHERE Alias IS NULL;
ALTER TABLE `Project` CHANGE COLUMN `Alias` `Alias` char(4) NOT NULL;

SELECT 'Running: SQL/Archive/22.0/2019-11-01-Add_data_release_permissions.sql';

INSERT INTO permissions (code,description,categoryID) VALUES 
('data_release_view','Data Release: View releases',(SELECT ID FROM permissions_category WHERE Description='Permission'));

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_release_view' AND m.Label='Data Release';
INSERT IGNORE INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_release_upload' AND m.Label='Data Release';
INSERT IGNORE INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_release_edit_file_access' AND m.Label='Data Release';

INSERT IGNORE INTO user_perm_rel
SELECT upr.userID, p.permID FROM user_perm_rel upr JOIN permissions p WHERE upr.permID=1 AND p.code IN ('data_release_view');

SELECT 'Running: SQL/Archive/22.0/2019-11-12-Rename_modules_QC_and_DTH.sql';

-- rename modules and change order number according to the new parent menu they belong to
SELECT MAX(OrderNumber)+1 INTO @ordernumber FROM LorisMenu WHERE Parent=(SELECT ID FROM LorisMenu WHERE Label='Clinical');
SELECT ID INTO @parentid FROM LorisMenu WHERE Label='Clinical';

UPDATE LorisMenu SET Label='Behavioural Quality Control', Link='behavioural_qc/', Parent=@parentid, OrderNumber=@ordernumber  WHERE Link='data_team_helper/';

SELECT MAX(OrderNumber)+1 INTO @ordernumber FROM LorisMenu WHERE Parent=(SELECT ID FROM LorisMenu WHERE Label='Imaging');
SELECT ID INTO @parentid FROM LorisMenu WHERE Label='Imaging';
UPDATE LorisMenu SET Label='Imaging Quality Control', Link='imaging_qc/', Parent=@parentid, OrderNumber=@ordernumber WHERE Link='quality_control/';

-- change location of Genomic Browser to place right after imaging tab
SELECT OrderNumber INTO @ordernumber FROM LorisMenu WHERE Label='Imaging';
UPDATE LorisMenu SET OrderNumber=(OrderNumber+1) WHERE Parent IS NULL AND OrderNumber>@ordernumber;

INSERT INTO LorisMenu (Label, OrderNumber)
SELECT 'Genomics', OrderNumber+1 FROM LorisMenu WHERE Label='Imaging';

SELECT ID INTO @parentid FROM LorisMenu WHERE Label='Genomics';
UPDATE LorisMenu SET Parent=@parentid WHERE Link='genomic_browser/';

UPDATE permissions SET Code='quality_control', description='Quality Control access' WHERE code='data_team_helper';

SELECT 'Running: SQL/Archive/22.0/2019-11-25-Default_value_for_session_submitted.sql';

UPDATE session SET Submitted='N' WHERE Submitted IS NULL;
ALTER TABLE session CHANGE Submitted Submitted ENUM('Y','N') DEFAULT 'N' NOT NULL;




SELECT 'Running: SQL/New_patches/2018-05-18-adding_physiological_all_sites_permissions.sql';

INSERT INTO permissions 
    (
        code, 
        description, 
        categoryID
    ) VALUES (
        'electrophysiology_browser_view_allsites',
        'View all-sites Electrophysiology Browser pages',
        (SELECT ID FROM permissions_category WHERE Description='Permission')
    );

INSERT INTO permissions
    (
        code,
        description,
        categoryID
    ) VALUES (
        'electrophysiology_browser_view_site',
        'View own site Electrophysiology Browser pages',
        (SELECT ID FROM permissions_category WHERE Description='Permission')
    );

INSERT INTO user_perm_rel
    (
      UserID,
      PermID
    ) VALUES (
      (SELECT ID FROM users WHERE UserID='admin'),
      (SELECT permID FROM permissions WHERE code='electrophysiology_browser_view_allsites')
    );

INSERT INTO user_perm_rel
    (
      UserID,
      PermID
    ) VALUES (
      (SELECT ID FROM users WHERE UserID='admin'),
      (SELECT permID FROM permissions WHERE code='electrophysiology_browser_view_site')
    );

SELECT 'Running: SQL/New_patches/2019-02-08-multiple_mri_protocols.sql';

-- ####################################################################################
--
-- SQL patch used to allow the usage of multiple MRI protocols within a given
-- study
--
-- ####################################################################################

-- -----------------------------------------------------------------------------------
--
-- mri_protocol_group table
--
-- By default, there is only one MRI protocol group
--
-- -----------------------------------------------------------------------------------
CREATE TABLE `mri_protocol_group` (
    `MriProtocolGroupID`   INT(4) UNSIGNED NOT NULL AUTO_INCREMENT,
    `Name`                 VARCHAR(255)    NOT NULL UNIQUE,
    PRIMARY KEY (`MriProtocolGroupID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4;
INSERT INTO `mri_protocol_group` (`Name`) VALUES('Default MRI protocol group');


-- -----------------------------------------------------------------------------------
--
-- mri_protocol_group_target table
--
-- Specify the MRI protocol group (or set of lines in mri_protocol) to use to
-- identify the type of a given scan based on the candidate's project
-- ID, the session's subproject ID and visit label.
--
-- By default, all scans use the default MRI protocol group for scan type
-- identification purposes
--
-- -----------------------------------------------------------------------------------
CREATE TABLE `mri_protocol_group_target` (
     `MriProtocolGroupTargetID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
     `MriProtocolGroupID`       INT(4)  UNSIGNED NOT NULL,
     `ProjectID`                INT(10) UNSIGNED DEFAULT NULL,
     `SubprojectID`             INT(10) UNSIGNED DEFAULT NULL,
     `Visit_label`              VARCHAR(255)     DEFAULT NULL,
     PRIMARY KEY (`MriProtocolGroupTargetID`),
     CONSTRAINT `FK_mri_protocol_group_target_1` FOREIGN KEY (`MriProtocolGroupID`) REFERENCES `mri_protocol_group` (`MriProtocolGroupID`),
     CONSTRAINT `FK_mri_protocol_group_target_2` FOREIGN KEY (`ProjectID`)          REFERENCES `Project` (`ProjectID`),
     CONSTRAINT `FK_mri_protocol_group_target_3` FOREIGN KEY (`SubprojectID`)       REFERENCES `subproject` (`SubprojectID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4;
INSERT INTO `mri_protocol_group_target` (`MriProtocolGroupID`, `ProjectID`, `SubprojectID`, `Visit_label`)
    VALUES((SELECT MriProtocolGroupID FROM mri_protocol_group WHERE Name='Default MRI protocol group'), NULL, NULL, NULL);



-- -----------------------------------------------------------------------------------
--
-- mri_protocol_checks_group table
--
-- By default, there is only one MRI protocol checks group
--
-- -----------------------------------------------------------------------------------
CREATE TABLE `mri_protocol_checks_group` (
    `MriProtocolChecksGroupID`   INT(4) UNSIGNED NOT NULL AUTO_INCREMENT,
    `Name`                       VARCHAR(255)    NOT NULL UNIQUE,
    PRIMARY KEY (`MriProtocolChecksGroupID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4;
INSERT INTO `mri_protocol_checks_group` (`Name`) VALUES('Default MRI protocol checks group');


-- -----------------------------------------------------------------------------------
--
-- mri_protocol_checks_group_target table
--
-- Specify the MRI protocol checks group (or set of lines in mri_protocol_checks)
-- to use to perform MRI protocol checks for a given scan based on the candidate's
-- project ID, the session's subproject ID and visit label.
--
-- By default, all scans use the default MRI protocol checks group
--
-- -----------------------------------------------------------------------------------
CREATE TABLE `mri_protocol_checks_group_target` (
     `MriProtocolChecksGroupTargetID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
     `MriProtocolChecksGroupID`       INT(4)  UNSIGNED NOT NULL,
     `ProjectID`                      INT(10) UNSIGNED DEFAULT NULL,
     `SubprojectID`                   INT(10) UNSIGNED DEFAULT NULL,
     `Visit_label`                    VARCHAR(255)     DEFAULT NULL,
     PRIMARY KEY(`MriProtocolChecksGroupTargetID`),
     CONSTRAINT `FK_mri_protocol_checks_group_target_1` FOREIGN KEY (`MriProtocolChecksGroupID`) REFERENCES `mri_protocol_checks_group` (`MriProtocolChecksGroupID`),
     CONSTRAINT `FK_mri_protocol_checks_group_target_2` FOREIGN KEY (`ProjectID`)                REFERENCES `Project` (`ProjectID`),
     CONSTRAINT `FK_mri_protocol_checks_group_target_3` FOREIGN KEY (`SubprojectID`)             REFERENCES `subproject` (`SubprojectID`)
) ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4;

INSERT INTO `mri_protocol_checks_group_target` (`MriProtocolChecksGroupID`, `ProjectID`, `SubprojectID`, `Visit_label`)
    VALUES((SELECT MriProtocolChecksGroupID FROM mri_protocol_checks_group WHERE Name='Default MRI protocol checks group'), NULL, NULL, NULL);

-- -----------------------------------------------------------------
-- Addition of a new column in table mri_protocol to identify the
-- MRI protocol group that a given line is associated to
-- -----------------------------------------------------------------
ALTER TABLE `mri_protocol` ADD COLUMN `MriProtocolGroupID` INT(4) UNSIGNED NOT NULL;
UPDATE mri_protocol SET MriProtocolGroupID=(SELECT MriProtocolGroupID FROM mri_protocol_group WHERE Name='Default MRI protocol group');
ALTER TABLE `mri_protocol` ADD CONSTRAINT `FK_mri_protocol_group_ID_1` FOREIGN KEY (`MriProtocolGroupID`) REFERENCES `mri_protocol_group` (`MriProtocolGroupID`);

-- -----------------------------------------------------------------------
-- Addition of a new column in table mri_protocol_checks to identify the
-- MRI protocol group that a given line is associated to
-- -----------------------------------------------------------------------
ALTER TABLE `mri_protocol_checks` ADD COLUMN `MriProtocolChecksGroupID` INT(4) UNSIGNED NOT NULL;
UPDATE mri_protocol_checks SET MriProtocolChecksGroupID=(SELECT MriProtocolChecksGroupID FROM mri_protocol_checks_group WHERE Name='Default MRI protocol checks group');
ALTER TABLE `mri_protocol_checks` ADD CONSTRAINT `FK_mri_protocol_checks_group_ID_1` FOREIGN KEY (`MriProtocolChecksGroupID`) REFERENCES `mri_protocol_checks_group` (`MriProtocolChecksGroupID`);

-- ----------------------------------------------------------------------------------
-- Addition of a new column in table mri_protocol_violated_scans to identify the
-- MRI protocol group that was used when trying to identify the scan type (will be NULL
-- unless exactly 1 group was used to identify the scan, according to the contents
-- of table mri_protocol_group_target)
-- ----------------------------------------------------------------------------------
ALTER TABLE `mri_protocol_violated_scans` ADD COLUMN `MriProtocolGroupID` INT(4) UNSIGNED DEFAULT NULL;
UPDATE mri_protocol_violated_scans SET MriProtocolGroupID=(SELECT MriProtocolGroupID FROM mri_protocol_group WHERE Name='Default MRI protocol group');
ALTER TABLE `mri_protocol_violated_scans` ADD CONSTRAINT `FK_mri_violated_2` FOREIGN KEY (`MriProtocolGroupID`) REFERENCES `mri_protocol_group` (`MriProtocolGroupID`);

-- -----------------------------------------------------------------------------------
-- Addition of a new column in table mri_violations_log to identify the
-- group of MRI protocol checks that was used when performing the MRI protocol checks
-- -----------------------------------------------------------------------------------
ALTER TABLE `mri_violations_log` ADD COLUMN `MriProtocolChecksGroupID` INT(4) UNSIGNED NOT NULL;
UPDATE mri_violations_log SET MriProtocolChecksGroupID=(SELECT MriProtocolChecksGroupID FROM mri_protocol_checks_group WHERE Name='Default MRI protocol checks group');
ALTER TABLE `mri_violations_log` ADD CONSTRAINT `FK_mri_checks_group_1` FOREIGN KEY (`MriProtocolChecksGroupID`) REFERENCES `mri_protocol_checks_group` (`MriProtocolChecksGroupID`);


SELECT 'Running: SQL/New_patches/2019-07-02-Add_Edit_DoB_Permissions.sql';

INSERT INTO permissions (code, description, categoryID) VALUES
    ("candidate_dob_edit","Edit dates of birth",2);
    
INSERT INTO user_perm_rel VALUES
    (1, (SELECT permID FROM permissions WHERE code='candidate_dob_edit'));

SELECT 'Running: SQL/New_patches/2019-07-04-add_DoD_feature.sql';

ALTER TABLE candidate
    ADD COLUMN DoD date default NULL;

 -- candidate_dod_edit permission
INSERT IGNORE INTO permissions (code, description, categoryID) VALUES
    ('candidate_dod_edit', "Edit dates of death", 2);

INSERT IGNORE INTO user_perm_rel (userID, permID) VALUES
    (1, (SELECT permID FROM permissions where code='candidate_dod_edit'));

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
    SELECT 'dodFormat', 'Format of the Date of Death', 1, 0, 'text', ID, 'DOD Format', 10 FROM ConfigSettings WHERE Name="study";

INSERT INTO Config (ConfigID, Value) SELECT ID, 'YMd'  FROM ConfigSettings WHERE Name="dodFormat";

SELECT 'Running: SQL/New_patches/2019-07-05-Add_Language_feature.sql';

ALTER TABLE `session`
    ADD COLUMN `languageID` integer unsigned DEFAULT NULL,
    ADD CONSTRAINT `FK_session_4` FOREIGN KEY (`languageID`) REFERENCES `language` (`language_id`);

SELECT 'Running: SQL/New_patches/2019-08-06-Add_date_display_format_config_setting.sql';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'dateDisplayFormat', 'The date format to use throughout LORIS for displaying date information - formats for date inputs are browser- and locale-dependent.', 1, 0, 'text', ID, 'Date display format', 27 FROM ConfigSettings WHERE Name="study";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'Y-m-d H:i:s'  FROM ConfigSettings WHERE Name="dateDisplayFormat";

SELECT 'Running: SQL/New_patches/2019-10-09-move_MINCToolsPath_configuration_to_Config_tables.sql';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'MINCToolsPath', 'Path to the MINC tools', 1, 0, 'web_path', ID, 'Path to the MINC tools', 12 FROM ConfigSettings WHERE Name="paths";
INSERT INTO Config (ConfigID, Value) SELECT ID, "%MINCToolsPath%" FROM ConfigSettings WHERE Name="MINCToolsPath";

SELECT 'Running: SQL/New_patches/2019-10-29-adding_issues_attachments_table.sql';

CREATE TABLE `issues_attachments` (
    `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `issueID` int(11) unsigned NOT NULL,
    `file_hash` varchar(64) NOT NULL,
    `date_added` timestamp NOT NULL DEFAULT current_timestamp(),
    `file_name` varchar(255) NOT NULL DEFAULT '',
    `deleted` tinyint(1) NOT NULL DEFAULT 0,
    `user` varchar(255) NOT NULL DEFAULT '',
    `description` text DEFAULT NULL,
    `file_size` int(20) DEFAULT NULL,
    `mime_type` varchar(255) NOT NULL DEFAULT '',
    CONSTRAINT `fk_issues_attachments_issue` FOREIGN KEY (`issueID`) REFERENCES `issues` (`issueID`),
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
SELECT 'IssueTrackerDataPath', 'Path to Issue Tracker data files', 1, 0, 'web_path', ID, 'Issue Tracker Data Path', 8 FROM ConfigSettings WHERE Name="paths";

INSERT INTO Config (ConfigID, Value)
SELECT
    ID,
    '/data/issue_tracker/'
FROM
    ConfigSettings
WHERE
        Name = "IssueTrackerDataPath";

SELECT 'Running: SQL/New_patches/2019-11-26-AddOtherSexEnum.sql';

ALTER TABLE
    `candidate`
MODIFY COLUMN
    `Sex` enum(
        'Male',
        'Female',
        'Other'
    )
DEFAULT NULL;

ALTER TABLE
    `candidate`
MODIFY COLUMN
    `ProbandSex` enum(
        'Male',
        'Female',
        'Other'
    )
DEFAULT NULL;

SELECT 'Running: SQL/New_patches/2019-11-29-Add_upload_directory_configuration.sql';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'documentRepositoryPath', 'Path to uploaded document repository files', 1, 0, 'text', cs1.ID, 'Document Repository Upload Path', MAX(cs2.OrderNumber)+1 FROM ConfigSettings cs1 JOIN ConfigSettings cs2 WHERE cs1.Name="paths" AND cs2.parent=cs1.ID;
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'dataReleasePath', 'Path to uploaded data release files', 1, 0, 'text', cs1.ID, 'Data Release Upload Path', MAX(cs2.OrderNumber)+1 FROM ConfigSettings cs1 JOIN ConfigSettings cs2 WHERE cs1.Name="paths" AND cs2.parent=cs1.ID;

-- For backwards compatibility, check the previous base and default to same folder as previous setting
SELECT Value INTO @base FROM Config c JOIN ConfigSettings cs ON cs.ID=c.ConfigID WHERE cs.Name="base";

INSERT INTO Config (ConfigID, Value) SELECT ID, CONCAT(@base,"modules/document_repository/user_uploads/") FROM ConfigSettings WHERE Name="documentRepositoryPath";
INSERT INTO Config (ConfigID, Value) SELECT ID, CONCAT(@base,"modules/data_release/user_uploads/") FROM ConfigSettings WHERE Name="dataReleasePath";


SELECT 'Running: SQL/New_patches/2019-12-05-AddModuleTable.sql';

CREATE TABLE `modules` (
  `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Active` enum('Y','N') NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `modules_id` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO modules (Name, Active) VALUES ('acknowledgements', 'Y');
INSERT INTO modules (Name, Active) VALUES ('api', 'Y');
INSERT INTO modules (Name, Active) VALUES ('behavioural_qc', 'Y');
INSERT INTO modules (Name, Active) VALUES ('brainbrowser', 'Y');
INSERT INTO modules (Name, Active) VALUES ('bvl_feedback', 'Y');
INSERT INTO modules (Name, Active) VALUES ('candidate_list', 'Y');
INSERT INTO modules (Name, Active) VALUES ('candidate_parameters', 'Y');
INSERT INTO modules (Name, Active) VALUES ('configuration', 'Y');
INSERT INTO modules (Name, Active) VALUES ('conflict_resolver', 'Y');
INSERT INTO modules (Name, Active) VALUES ('create_timepoint', 'Y');
INSERT INTO modules (Name, Active) VALUES ('dashboard', 'Y');
INSERT INTO modules (Name, Active) VALUES ('data_release', 'Y');
INSERT INTO modules (Name, Active) VALUES ('datadict', 'Y');
INSERT INTO modules (Name, Active) VALUES ('dataquery', 'Y');
INSERT INTO modules (Name, Active) VALUES ('dicom_archive', 'Y');
INSERT INTO modules (Name, Active) VALUES ('document_repository', 'Y');
INSERT INTO modules (Name, Active) VALUES ('examiner', 'Y');
INSERT INTO modules (Name, Active) VALUES ('genomic_browser', 'Y');
INSERT INTO modules (Name, Active) VALUES ('help_editor', 'Y');
INSERT INTO modules (Name, Active) VALUES ('imaging_browser', 'Y');
INSERT INTO modules (Name, Active) VALUES ('imaging_qc', 'Y');
INSERT INTO modules (Name, Active) VALUES ('imaging_uploader', 'Y');
INSERT INTO modules (Name, Active) VALUES ('instrument_builder', 'Y');
INSERT INTO modules (Name, Active) VALUES ('instrument_list', 'Y');
INSERT INTO modules (Name, Active) VALUES ('instrument_manager', 'Y');
INSERT INTO modules (Name, Active) VALUES ('instruments', 'Y');
INSERT INTO modules (Name, Active) VALUES ('issue_tracker', 'Y');
INSERT INTO modules (Name, Active) VALUES ('login', 'Y');
INSERT INTO modules (Name, Active) VALUES ('media', 'Y');
INSERT INTO modules (Name, Active) VALUES ('mri_violations', 'Y');
INSERT INTO modules (Name, Active) VALUES ('new_profile', 'Y');
INSERT INTO modules (Name, Active) VALUES ('next_stage', 'Y');
INSERT INTO modules (Name, Active) VALUES ('publication', 'Y');
INSERT INTO modules (Name, Active) VALUES ('server_processes_manager', 'Y');
INSERT INTO modules (Name, Active) VALUES ('statistics', 'Y');
INSERT INTO modules (Name, Active) VALUES ('survey_accounts', 'Y');
INSERT INTO modules (Name, Active) VALUES ('timepoint_list', 'Y');
INSERT INTO modules (Name, Active) VALUES ('user_accounts', 'Y');

SELECT 'Running: SQL/New_patches/2020-01-16-ModuleManager.sql';

INSERT INTO modules (Name, Active) VALUES ('module_manager', 'Y');
INSERT INTO permissions (code, description, categoryID) VALUES('module_manager_view', 'Module Manager: access the module', 2);
INSERT INTO permissions (code, description, categoryID) VALUES('module_manager_edit', 'Module Manager: edit installed modules', 2);
INSERT INTO user_perm_rel(UserID,PermID) VALUES (
    (SELECT ID FROM users WHERE UserID='admin'),
    (SELECT permID FROM permissions WHERE code='module_manager_view')
);
INSERT INTO user_perm_rel(UserID,PermID) VALUES (
    (SELECT ID FROM users WHERE UserID='admin'),
    (SELECT permID FROM permissions WHERE code='module_manager_edit')
);

SELECT 'Running: SQL/New_patches/2020-01-20-adding_electrophysiology_browser_to_modules_table.sql';

INSERT INTO modules (Name, Active) VALUES ('electrophysiology_browser', 'Y');


SELECT 'Running: SQL/New_patches/2020-02-18-MyPrefModule.sql';

INSERT INTO modules (Name, Active) VALUES ('my_preferences', 'Y');

SELECT 'Running: SQL/New_patches/2020-02-24-CandidateProfileModule.sql';

INSERT INTO modules (Name, Active) VALUES ('candidate_profile', 'Y');

SELECT 'Running: SQL/New_patches/2020-04-20-Rename_highlander_permission.sql';

UPDATE permissions SET description = 'Superuser - supersedes all permissions' WHERE code = 'superuser';

SELECT 'Running: SQL/New_patches/2020-04-27-AddViolatedScansOwnSitePermission.sql';

INSERT INTO permissions (code, description, categoryID) VALUES
    ('violated_scans_view_ownsite','Violated Scans: View Violated Scans from own site','2');
    
INSERT INTO user_perm_rel VALUES
    (
     (SELECT ID FROM users WHERE UserID='admin'),
     (SELECT permID FROM permissions WHERE code='violated_scans_view_ownsite')
    );

SELECT 'Running: SQL/New_patches/2020-05-08-ChangeDefaultMPCGForMriViolationsLog.sql';


-- ----------------------------------------------------------------------------------------
-- Change default value of column MriProtocolChecksGroupID for table mri_violations_log
--
-- Reason: the imaging browser allows one to set the Caveat of a scan to true and this 
-- creates an entry in the mri_violations_log table. This entry is not tied to any record
-- in table mri_protocol_checks_group, thus the nullable MriProtocolChecksGroupID.
--
-- ----------------------------------------------------------------------------------------
ALTER TABLE mri_violations_log CHANGE COLUMN `MriProtocolChecksGroupID` `MriProtocolChecksGroupID` INT(4) UNSIGNED DEFAULT NULL;


SELECT 'Running: SQL/New_patches/2020-05-11-AddViolationsResolved.sql';

-- ------------------------------------------------------------------------------------
--                                                                                   --
-- This SQL patch examines every record in table mri_violations_log that has         --
-- column `Header` set to 'Manual Caveat Set by <username>'. If there is not a       --
-- corresponding record in table violations_resolved that flags this violation       --
-- as having been inserted with flag, it adds it.                                    --
--                                                                                   --
-- ------------------------------------------------------------------------------------

INSERT INTO violations_resolved (hash, ExtID, TypeTable, User, ChangeDate, Resolved)
  SELECT 
      md5(concat_WS(':', MincFile, PatientName, SeriesUID, TimeRun)), 
      LogID, 
      'mri_violations_log',
      SUBSTRING_INDEX(Header, ' ', -1),
      TimeRun,
      'inserted_flag'
  FROM mri_violations_log
  WHERE Header LIKE 'Manual Caveat Set by %'
  AND NOT EXISTS (
      SELECT 1 
      FROM violations_resolved 
      WHERE ExtID=LogID
      AND TypeTable='mri_violations_log'
  );

SELECT 'Running: SQL/New_patches/2020-05-15-RemoveObsoleteMriViolationsLog.sql';

-- -----------------------------------------------------------------------------------
-- When you set the Caveat flag of a scan to true in the imaging browser, a record
-- is created in table mri_violations_log to indicate that there is a manual caveat 
-- for that scan. If you subsequently set the Caveat back to false, this record is not
-- deleted. This PR deletes those obsolete entries in table mri_violations_log
-- -----------------------------------------------------------------------------------

DELETE mvl
FROM mri_violations_log AS mvl
WHERE mvl.Header LIKE 'Manual Caveat Set by%'
AND (
    SELECT f.Caveat
    FROM files f
    WHERE f.File = mvl.MincFile
    AND f.SeriesUID = mvl.SeriesUID
) = 0;

-- ----------------------------------------------------------------------------------
-- The Caveat column of table files is used to indicate whether a file (scan) has
-- a manual caveat or a caveat that was created by the MRI pipeline. When a scan has
-- both types of caveat and you set the manual caveat to false in the imaging browser,
-- the value of the Caveat column will be set to 0. This is a bug, since the scan still
-- has a caveat set by the MRI pipeline associated to it.
-- This patch will correct those Caveat values that are set to 0 when they should have
-- a value of 1.
-- ---------------------------------------------------------------------------------------
UPDATE files f
SET f.Caveat=1
WHERE f.Caveat=0
AND EXISTS (
    SELECT 1
    FROM mri_violations_log mvl
    JOIN parameter_type pt
      ON (pt.Name=mvl.Header)
    JOIN parameter_file pf
      ON (pf.ParameterTypeID=pt.ParameterTypeID)
    WHERE mvl.SeriesUID = f.SeriesUID
    AND pf.FileID = f.FileID
    AND pf.Value = mvl.Value
);

SELECT 'Running: SQL/New_patches/2018-07-23-battery_manager_permissions.sql';

-- Add view permission for battery manager
INSERT INTO permissions (code, description, categoryID)
       VALUES (
           'battery_manager_view',
           'View Battery Manager',
           (SELECT ID FROM permissions_category WHERE Description = 'Permission')
       );

-- Add edit permission for battery manager
INSERT INTO permissions (code, description, categoryID)
       VALUES (
           'battery_manager_edit',
           'Add, activate, and deactivate entries in Test Battery',
           (SELECT ID FROM permissions_category WHERE Description = 'Permission')
       );

-- Give view permission to admin
INSERT INTO user_perm_rel (userID, permID)
SELECT ID, permID FROM users u JOIN permissions p
WHERE UserID='admin' AND code = 'battery_manager_view';

-- Give edit permission to admin
INSERT INTO user_perm_rel (userID, permID)
SELECT ID, permID FROM users u JOIN permissions p
WHERE UserID='admin' AND code = 'battery_manager_edit';

INSERT INTO modules (Name, Active) VALUES ('battery_manager', 'Y');
SELECT 'Running: SQL/Archive/24.0/2019-06-01-log_level-2021-07-19.sql';

ALTER TABLE `ConfigSettings` MODIFY COLUMN `DataType` ENUM('text','boolean','email','instrument','textarea','scan_type','date_format','lookup_center','path','web_path', 'log_level');

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('logs', 'Settings related to logging', 1, 0, 'Log Settings', 12);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'database_log_level', 'Verbosity of database logging', 1, 0, 'log_level', ID, 'Database Log Level', 3 FROM ConfigSettings WHERE Name='logs';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'request_log_level', 'Verbosity of HTTP request logs', 1, 0, 'log_level', ID, 'HTTP Request Log Level', 3 FROM ConfigSettings WHERE Name='logs';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'exception_log_level', 'Verbosity of PHP exception logging', 1, 0, 'log_level', ID, 'Exception Log Level', 3 FROM ConfigSettings WHERE Name='logs';

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


ALTER TABLE `physiological_annotation_parameter`
    MODIFY COLUMN `Description` text DEFAULT NULL
;

-- ---------------------------------------------------------------------------------------------
-- alter mri_protocol table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE mri_protocol ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)   DEFAULT NULL;
ALTER TABLE mri_protocol ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;


-- ---------------------------------------------------------------------------------------------
-- alter mri_protocol_violated_scans table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE mri_protocol_violated_scans ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)   DEFAULT NULL;
ALTER TABLE mri_protocol_violated_scans ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;

-- ---------------------------------------------------------------------------------------------
-- alter files table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE files ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)  DEFAULT NULL;
ALTER TABLE files ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;

-- ---------------------------------------------------------------------------------------------
-- alter files_qcstatus table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE files_qcstatus ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)  DEFAULT NULL;
ALTER TABLE files_qcstatus ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;

-- ---------------------------------------------------------------------------------------------
-- alter feedback_mri_comments table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE feedback_mri_comments ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)  DEFAULT NULL;
ALTER TABLE feedback_mri_comments ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;

-- ---------------------------------------------------------------------------------------------
-- alter mri_violations_log table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE mri_violations_log ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)  DEFAULT NULL;
ALTER TABLE mri_violations_log ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;

-- ---------------------------------------------------------------------------------------------
-- add an entry in parameter_type table to for the BIDS PhaseEncodingDirection parameter
-- ---------------------------------------------------------------------------------------------
INSERT INTO parameter_type (Name, Type, Description, SourceFrom)
SELECT 'PhaseEncodingDirection', 'text', 'BIDS PhaseEncodingDirection (a.k.a. i, i-, j, j-, k, k-)', 'parameter_file'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM parameter_type where Name='PhaseEncodingDirection');

-- ---------------------------------------------------------------------------------------------
-- fix incorrectly serialized feedback
-- ---------------------------------------------------------------------------------------------
UPDATE feedback_mri_comment_types SET
    CommentStatusField='a:2:{s:5:"field";s:34:"Movement_artifacts_between_packets";s:6:"values";a:5:{i:0;s:0:"";i:1;s:4:"None";i:2;s:15:"Slight Movement";i:3;s:12:"Poor Quality";i:4;s:12:"Unacceptable";}}'
WHERE CommentTypeID=4;

SELECT 'Running: SQL/Archive/25.0/2021-03-01-publication-add-columns.sql';

ALTER TABLE publication
    ADD COLUMN journal varchar(255) DEFAULT NULL,
    ADD COLUMN doi text DEFAULT NULL,
    ADD COLUMN datePublication date DEFAULT NULL,
    ADD COLUMN link varchar(255) DEFAULT NULL,
    ADD COLUMN publishingStatus enum('In Progress','Published') DEFAULT NULL,
    ADD COLUMN project int(10) unsigned DEFAULT NULL,
    ADD CONSTRAINT `FK_publication_project`
    FOREIGN KEY (project) REFERENCES Project(ProjectID);

SELECT 'Running: SQL/Archive/25.0/2021-09-13_fix_project_primary_key.sql';

-- Add a unique constraint on Project.Name
CREATE UNIQUE INDEX `u_ProjectName` ON `Project` (`Name`);


SELECT 'Running: SQL/Archive/25.0/2021-12-01-make_subproject_titles_unique.sql';

ALTER TABLE subproject ADD UNIQUE (`title`);

SELECT 'Running: SQL/Archive/25.0/2022-03-03-AddHEDTags.sql';

-- ############################## CAPTURE HEDVersion ########################## --
-- HEDVersion from dataset_description.json to be added to parameter_type
-- Entry in physiological_parameter_file will be added on dataset import**
INSERT INTO parameter_type (Name, Type, Description, SourceFrom) VALUES
    ('HEDVersion', 'text', 'HED Schema Version','physiological_parameter_file')
;

-- ############################## HANDLE EVENT FILES ########################## --
-- Create `physiological_event_file` table
CREATE TABLE `physiological_event_file` (
    `EventFileID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PhysiologicalFileID` int(10) unsigned NOT NULL,
    `FileType` varchar(20) NOT NULL,
    `FilePath` varchar(255) DEFAULT NULL,
    `LastUpdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `LastWritten` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`EventFileID`),
    KEY `FK_physio_file_ID` (`PhysiologicalFileID`),
    KEY `FK_event_file_type` (`FileType`),
    CONSTRAINT `FK_event_file_type` FOREIGN KEY (`FileType`) REFERENCES `ImagingFileTypes` (`type`),
    CONSTRAINT `FK_physio_file_ID` FOREIGN KEY (`PhysiologicalFileID`) REFERENCES `physiological_file` (`PhysiologicalFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
;

-- Create reference to EventFileID in `physiological_task_event` table
SET FOREIGN_KEY_CHECKS= 0;
ALTER TABLE physiological_task_event
    ADD COLUMN `EventFileID` int(10) unsigned NOT NULL AFTER PhysiologicalFileID,
    ADD KEY `FK_event_file` (`EventFileID`),
    ADD CONSTRAINT `FK_event_file` FOREIGN KEY (`EventFileID`) REFERENCES `physiological_event_file` (`EventFileID`)
;

-- Create column for assembled HEd tags in `physiological_task_event` table
ALTER TABLE physiological_task_event
    ADD COLUMN `AssembledHED` text DEFAULT NULL
;

-- Insert files into `physiological_event_file` table
INSERT INTO physiological_event_file (PhysiologicalFileID, FilePath, FileType)
    SELECT DISTINCT PhysiologicalFileID, FilePath, 'tsv' FROM physiological_task_event
;

-- Update EventFileID reference in `physiological_task_event` table
UPDATE physiological_task_event te
    SET EventFileID=(SELECT EventFileID FROM physiological_event_file WHERE PhysiologicalFileID=te.PhysiologicalFileID)
;
SET FOREIGN_KEY_CHECKS= 1;

-- Delete FilePath column in `physiological_task_event` table
ALTER TABLE physiological_task_event
    DROP COLUMN FilePath
;


-- ############################## EVENT FILES ARCHIVE ########################## --
CREATE TABLE `physiological_event_archive` (
    `EventArchiveID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PhysiologicalFileID` int(10) unsigned NOT NULL,
    `Blake2bHash` varchar(128) NOT NULL,
    `FilePath` varchar(255) NOT NULL,
    PRIMARY KEY (`EventArchiveID`),
    KEY `FK_phy_file_ID` (`PhysiologicalFileID`),
    CONSTRAINT `FK_phy_file_ID` FOREIGN KEY (`PhysiologicalFileID`) REFERENCES `physiological_file` (`PhysiologicalFileID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8
;


-- ############################## CAPTURE EVENT PARAMETERS ########################## --
CREATE TABLE `physiological_event_parameter` (
    `EventParameterID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `EventFileID` int(10) unsigned NOT NULL,
    `ParameterName` varchar(255) NOT NULL,
    `Description` text DEFAULT NULL,
    `LongName` varchar(255) DEFAULT NULL,
    `Units` varchar(50) DEFAULT NULL,
    `isCategorical` enum('Y', 'N') DEFAULT NULL,
    `HED` text DEFAULT NULL,
    PRIMARY KEY (`EventParameterID`),
    KEY `FK_event_file_ID` (`EventFileID`),
    CONSTRAINT `FK_event_file_ID` FOREIGN KEY (`EventFileID`) REFERENCES `physiological_event_file` (`EventFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
;

CREATE TABLE `physiological_event_parameter_category_level` (
    `CategoricalLevelID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `EventParameterID` int(10) unsigned NOT NULL,
    `LevelName` varchar(255) NOT NULL,
    `Description` text DEFAULT NULL,
    `HED` text DEFAULT NULL,
    PRIMARY KEY (`CategoricalLevelID`),
    KEY `FK_event_param_ID` (`EventParameterID`),
    CONSTRAINT `FK_event_param_ID` FOREIGN KEY (`EventParameterID`) REFERENCES `physiological_event_parameter` (`EventParameterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
;

SELECT 'Running: SQL/Archive/25.0/2022-11-22-eeg-additional-events-table.sql';

-- Create `physiological_task_event_opt` table
-- tracks additional events from bids archives
CREATE TABLE `physiological_task_event_opt` (
    `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PhysiologicalTaskEventID` int(10) unsigned NOT NULL,
    `PropertyName`             varchar(50) NOT NULL,
    `PropertyValue`            varchar(255) NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_event_task_opt`
        FOREIGN KEY (`PhysiologicalTaskEventID`)
        REFERENCES `physiological_task_event` (`PhysiologicalTaskEventID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
SELECT 'Running: SQL/Archive/25.0/2022-11-24-electrode-coord-system.sql';

-- -----------------------------------------------------
-- ADDED
-- Table `physiological_coord_system_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_type` (
  `PhysiologicalCoordSystemTypeID`  INT(10)     UNSIGNED  NOT NULL AUTO_INCREMENT,
  `Name`                            VARCHAR(20)           NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalCoordSystemTypeID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- insert 5
INSERT INTO physiological_coord_system_type
  (`Name`)
  VALUES
  ('Not registered'),
  ('Fiducials'),
  ('AnatomicalLandmark'),
  ('HeadCoil'),
  ('DigitizedHeadPoints');


-- -----------------------------------------------------
-- ADDED
-- Table `physiological_coord_system_name`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_name` (
  `PhysiologicalCoordSystemNameID`  INT(10)     UNSIGNED  NOT NULL AUTO_INCREMENT,
  `Name`                            VARCHAR(25)           NOT NULL UNIQUE,
  `Orientation`                     VARCHAR(5)            NULL,
  `Origin`                          VARCHAR(50)           NULL,
  PRIMARY KEY (`PhysiologicalCoordSystemNameID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- insert 19
INSERT INTO physiological_coord_system_name
  (`Name`, `Orientation`, `Origin`)
  VALUES
  ('Not registered', NULL, NULL),
  ('ACPC', 'RAS', 'anterior commissure'),
  ('Allen Institute', 'RAS', 'Bregma point'),
  ('Analyze', 'LAS', ''),
  ('BTi/4D', 'ALS', 'between the ears'),
  ('CTF', 'ALS', 'between the ears'),
  ('CTF MRI', 'ALS', 'between the ears'),
  ('CTF gradiometer', 'ALS', 'between the ears'),
  ('CapTrak', 'RAS', 'approximately between the ears'),
  ('Chieti ITAB', 'RAS', 'between the ears'),
  ('DICOM', 'LPS', 'centre of MRI gradient coil'),
  ('EEGLAB', 'ALS', 'between the ears'),
  ('FreeSurfer', 'RAS',	'center of isotropic 1mm 256x256x256 volume'),
  ('MNI', 'RAS', 'anterior commissure'),
  ('NIfTI', 'RAS', ''),
  ('Neuromag/Elekta/Megin', 'RAS', 'between the ears'),
  ('Paxinos-Franklin', 'RSP', 'Bregma point'),
  ('Scanner RAS (scanras)', 'RAS', 'scanner origin'),
  ('Talairach-Tournoux', 'RAS', 'anterior commissure'),
  ('Yokogawa', 'ALS', 'center of device');

-- -----------------------------------------------------
-- ADDED
-- Table `physiological_coord_unit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_unit` (
  `PhysiologicalCoordSystemUnitID`  INT(10)     UNSIGNED  NOT NULL AUTO_INCREMENT,
  `Name`                            VARCHAR(20)           NOT NULL UNIQUE,
  `Symbol`                          VARCHAR(5)            NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalCoordSystemUnitID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- insert 4
INSERT INTO physiological_coord_system_unit
  (`Name`, `Symbol`)
  VALUES
  ('Not registered', NULL),
  ('Millimeter', 'mm'),
  ('Centimeter', 'cm'),
  ('Meter', 'm');

-- -----------------------------------------------------
-- ADDED Value
-- to already existing `physiological_modality`
-- -----------------------------------------------------

INSERT INTO physiological_modality (`PhysiologicalModality`)
  VALUES ('Not registered');

-- -----------------------------------------------------
-- ADDED
-- Table `physiological_coord_system`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system` (
  `PhysiologicalCoordSystemID`  INT(10)     UNSIGNED  NOT NULL AUTO_INCREMENT,
  `NameID`                      INT(10)     UNSIGNED  NOT NULL,
  `TypeID`                      INT(10)     UNSIGNED  NOT NULL,
  `UnitID`                      INT(10)     UNSIGNED  NOT NULL,
  `ModalityID`                  INT(5)      UNSIGNED  NOT NULL,
  `FilePath`                    VARCHAR(255)          NULL,
  PRIMARY KEY (`PhysiologicalCoordSystemID`),
  CONSTRAINT `FK_PhysCoordSystemType_type`
    FOREIGN KEY (`TypeID`)
    REFERENCES `physiological_coord_system_type` (`PhysiologicalCoordSystemTypeID`),
  CONSTRAINT `FK_PhysCoordSystemName_name`
    FOREIGN KEY (`NameID`)
    REFERENCES `physiological_coord_system_name` (`PhysiologicalCoordSystemNameID`),
  CONSTRAINT `FK_PhysCoordSystemUnit_unit`
    FOREIGN KEY (`UnitID`)
    REFERENCES `physiological_coord_system_unit` (`PhysiologicalCoordSystemUnitID`),
  CONSTRAINT `FK_PhysCoordSystemModality_modality`
    FOREIGN KEY (`ModalityID`)
    REFERENCES `physiological_modality` (`PhysiologicalModalityID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- insert a dummy (`not registered` coord system)
INSERT INTO physiological_coord_system
  (`NameID`, `TypeID`, `UnitID`, `ModalityID`, `FilePath`)
  VALUES
  (
    (SELECT PhysiologicalCoordSystemNameID
      FROM physiological_coord_system_name
      WHERE Name = 'Not registered'),
    (SELECT PhysiologicalCoordSystemTypeID
      FROM physiological_coord_system_type
      WHERE Name = 'Not registered'),
    (SELECT PhysiologicalCoordSystemUnitID
      FROM physiological_coord_system_unit
      WHERE Name = 'Not registered'),
    (SELECT PhysiologicalModalityID
      FROM physiological_modality
      WHERE PhysiologicalModality = 'Not registered'),
    NULL
  );

-- -----------------------------------------------------
-- ADDED
-- Table `point_3d`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `point_3d` (
  `Point3DID` INT(10) UNSIGNED  NOT NULL AUTO_INCREMENT,
  `X`         DOUBLE            NULL,
  `Y`         DOUBLE            NULL,
  `Z`         DOUBLE            NULL,
  PRIMARY KEY (`Point3DID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- -----------------------------------------------------
-- ADDED
-- Table `physiological_coord_system_point_3d_rel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_point_3d_rel` (
  `PhysiologicalCoordSystemID` INT(10)     UNSIGNED NOT NULL,
  `Point3DID`                  INT(10)     UNSIGNED NOT NULL,
  `Name`                       VARCHAR(50)          NULL,
  PRIMARY KEY (`PhysiologicalCoordSystemID`, `Point3DID`),
  CONSTRAINT `fk_phys_coord_system_point_3d_rel_coord_system`
    FOREIGN KEY (`PhysiologicalCoordSystemID`)
    REFERENCES `physiological_coord_system` (`PhysiologicalCoordSystemID`),
  CONSTRAINT `fk_phys_coord_system_point_3d_rel_point`
    FOREIGN KEY (`Point3DID`)
    REFERENCES `point_3d` (`Point3DID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- -----------------------------------------------------
-- ADDED
-- Table `physiological_coord_system_electrode_rel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_electrode_rel` (
  `PhysiologicalCoordSystemID`  INT(10)    UNSIGNED   NOT NULL,
  `PhysiologicalElectrodeID`    INT(10)    UNSIGNED   NOT NULL,
  `PhysiologicalFileID`         INT(10)    UNSIGNED   NOT NULL,
  `InsertTime`                  TIMESTAMP             NOT NULL   DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (
    `PhysiologicalCoordSystemID`,
    `PhysiologicalElectrodeID`
  ),
  CONSTRAINT `FK_phys_coord_system_electrode_rel_coord_system`
    FOREIGN KEY (`PhysiologicalCoordSystemID`)
    REFERENCES `physiological_coord_system` (`PhysiologicalCoordSystemID`),
  CONSTRAINT `FK_phys_coord_system_electrode_rel_electrode`
    FOREIGN KEY (`PhysiologicalElectrodeID`)
    REFERENCES `physiological_electrode` (`PhysiologicalElectrodeID`),
  CONSTRAINT `FK_phys_coord_system_electrode_rel_phys_file`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`)
    ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- need insert before altering `physiological_electrode`
-- migrate/init every coord system already present to 'not registered' state
INSERT INTO physiological_coord_system_electrode_rel
  (PhysiologicalCoordSystemID, PhysiologicalElectrodeID, PhysiologicalFileID, InsertTime)
  SELECT DISTINCT
    -- PhysiologicalCoordSystemID = not registered
    (
      SELECT pcs.PhysiologicalCoordSystemID
      FROM physiological_coord_system AS pcs
      INNER JOIN physiological_coord_system_name AS pcsn
      WHERE pcsn.Name = 'Not registered'
    ) AS 'PhysiologicalCoordSystemID',
    -- PhysiologicalElectrodeID, PhysiologicalFileID, InsertTime
    PhysiologicalElectrodeID,
    PhysiologicalFileID,
    InsertTime
  FROM physiological_electrode;

-- -----------------------------------------------------
-- ALTERED
-- Table `physiological_electrode`
-- -----------------------------------------------------

-- Table point3D manages coordinates now
-- move coordinates to point_3d table

-- copy distinct coordinate to `point_3d` table
INSERT INTO point_3d
  (X, Y, Z)
  SELECT distinct X, Y, Z
  FROM physiological_electrode;

-- add the point3DID column to `physiological_electrode` table
ALTER TABLE physiological_electrode
  ADD Point3DID INT(10) UNSIGNED NOT NULL;

-- update the point3DID in `physiological_electrode` table
UPDATE point_3d as p, physiological_electrode as e
  SET e.Point3DID = p.Point3DID
  WHERE p.X = e.X
    AND p.Y = e.Y
    AND p.Z = e.Z;

-- add foreign key to validate change
ALTER TABLE physiological_electrode
  ADD CONSTRAINT `FK_phys_electrode_point_3d`
  FOREIGN KEY (`Point3DID`) REFERENCES `point_3d`(`Point3DID`);

-- drop coordinate from `physiological_electrode` table
ALTER TABLE physiological_electrode
  DROP COLUMN X;
ALTER TABLE physiological_electrode
  DROP COLUMN Y;
ALTER TABLE physiological_electrode
  DROP COLUMN Z;


-- `InsertTime` and `PhysiologicalFileID` will be moved
-- to the relation table `physiological_coord_system_electrode_rel`
ALTER TABLE physiological_electrode
  DROP COLUMN InsertTime;

ALTER TABLE physiological_electrode
  DROP FOREIGN KEY FK_phys_file_FileID_3;
ALTER TABLE physiological_electrode
  DROP COLUMN PhysiologicalFileID;

SELECT 'Running: SQL/Archive/25.0/2022-12-01-subprojects_no_more.sql';

ALTER TABLE subproject RENAME TO cohort;
ALTER TABLE project_subproject_rel RENAME TO project_cohort_rel;
ALTER TABLE visit_project_subproject_rel RENAME TO visit_project_cohort_rel;

ALTER TABLE cohort CHANGE `SubprojectID` `CohortID` int(10) unsigned NOT NULL auto_increment;
ALTER TABLE project_cohort_rel CHANGE `ProjectSubprojectRelID` `ProjectCohortRelID` int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE project_cohort_rel CHANGE `SubprojectID` `CohortID` int(10) unsigned NOT NULL;
ALTER TABLE session CHANGE `SubprojectID` `CohortID` int(10) unsigned DEFAULT NULL;
ALTER TABLE test_battery CHANGE `SubprojectID` `CohortID` int(10) unsigned DEFAULT NULL;
ALTER TABLE mri_protocol_checks_group_target CHANGE `SubprojectID` `CohortID` int(10) unsigned DEFAULT NULL;
ALTER TABLE mri_protocol_group_target CHANGE `SubprojectID` `CohortID` int(10) unsigned DEFAULT NULL;
ALTER TABLE visit_project_cohort_rel CHANGE `VisitProjectSubprojectRelID` `VisitProjectCohortRelID` int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE visit_project_cohort_rel CHANGE `ProjectSubprojectRelID` `ProjectCohortRelID` int(10) unsigned NOT NULL;


/**
REVERT PATCH

ALTER TABLE cohort RENAME TO subproject;
ALTER TABLE project_cohort_rel RENAME TO project_subproject_rel;
ALTER TABLE visit_project_cohort_rel RENAME TO visit_project_subproject_rel;

ALTER TABLE subproject CHANGE `CohortID` `SubprojectID` int(10) unsigned NOT NULL auto_increment;
ALTER TABLE project_subproject_rel CHANGE `ProjectCohortRelID` `ProjectSubprojectRelID` int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE project_subproject_rel CHANGE `CohortID` `SubprojectID` int(10) unsigned NOT NULL;
ALTER TABLE session CHANGE `CohortID` `SubprojectID` int(10) unsigned DEFAULT NULL;
ALTER TABLE test_battery CHANGE `CohortID` `SubprojectID` int(10) unsigned DEFAULT NULL;
ALTER TABLE mri_protocol_checks_group_target CHANGE `CohortID` `SubprojectID` int(10) unsigned DEFAULT NULL;
ALTER TABLE mri_protocol_group_target CHANGE `CohortID` `SubprojectID` int(10) unsigned DEFAULT NULL;
ALTER TABLE visit_project_subproject_rel CHANGE `VisitProjectCohortRelID` `VisitProjectSubprojectRelID` int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE visit_project_subproject_rel CHANGE `ProjectCohortRelID` `ProjectSubprojectRelID` int(10) unsigned NOT NULL;
 */

SELECT 'Running: SQL/Archive/25.0/2022-12-05-AddVizConfig.sql';

-- Adds the option to toggle the EEG Browser visualization components (disabled by default).
INSERT INTO ConfigSettings
  (
    Name,
    Description,
    Visible,
    AllowMultiple,
    DataType,
    Parent,
    Label,
    OrderNumber
  )
  SELECT
    'useEEGBrowserVisualizationComponents',
    'Whether to enable the visualization components on the EEG Browser module',
    1,
    0,
    'boolean',
    ID,
    'Enable the EEG Browser components',
    4
  FROM
    ConfigSettings
  WHERE
    Name="gui";

INSERT INTO Config (ConfigID, Value) SELECT ID, 'false' FROM ConfigSettings WHERE Name="useEEGBrowserVisualizationComponents";

SELECT 'Running: SQL/Archive/25.0/2022-12-20-instrumentpermissions.sql';

CREATE TABLE `testnames_permissions_rel` (
    `TestID` int(10) unsigned NOT NULL,
    `permID` int(10) unsigned NOT NULL,
    PRIMARY KEY  (`TestID`,`permID`),
    CONSTRAINT `FK_testnames_permissions_rel_test` FOREIGN KEY (`TestID`) REFERENCES `test_names` (`ID`),
    CONSTRAINT `FK_testnames_permissions_rel_perm` FOREIGN KEY (`permID`) REFERENCES `permissions` (`permID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SELECT 'Running: SQL/Archive/25.0/2022-12-20-project-name-not-null.sql';

ALTER TABLE `Project`
MODIFY `Name` VARCHAR(255) NOT NULL;

SELECT 'Running: SQL/Archive/25.0/2023-01-19_add_index_on_violations_resolved.sql';

CREATE INDEX `i_violations_resolved_extid_type` ON `violations_resolved` (`ExtID`, `TypeTable`);


SELECT 'Running: SQL/Archive/25.0/2023-01-31-add-date-stage-change.sql';

ALTER TABLE session
	ADD COLUMN Date_status_change date DEFAULT NULL AFTER Date_visit;
SELECT 'Running: SQL/Archive/25.0/2023-02-17-imaging-new-config.sql';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'createVisit', 'Enable visit creation in the imaging pipeline', 1, 0, 'boolean', ID, 'Enable visit creation', 11 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'default_project', 'Default project used when creating scan candidate or visit', 1, 0, 'text', ID, 'Default project', 12 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'default_cohort', 'Default cohort used when creating scan visit', 1, 0, 'text', ID, 'Default cohort', 13 FROM ConfigSettings WHERE Name="imaging_pipeline";

UPDATE ConfigSettings SET Label = 'Enable candidate creation' WHERE Name = 'createCandidates';

UPDATE ConfigSettings SET OrderNumber = 14 WHERE Name = 'default_bids_vl';
UPDATE ConfigSettings SET OrderNumber = 15 WHERE Name = 'is_qsub';
UPDATE ConfigSettings SET OrderNumber = 16 WHERE Name = 'DTI_volumes';
UPDATE ConfigSettings SET OrderNumber = 17 WHERE Name = 't1_scan_type';
UPDATE ConfigSettings SET OrderNumber = 18 WHERE Name = 'reject_thresh';
UPDATE ConfigSettings SET OrderNumber = 19 WHERE Name = 'niak_path';
UPDATE ConfigSettings SET OrderNumber = 20 WHERE Name = 'QCed2_step';
UPDATE ConfigSettings SET OrderNumber = 21 WHERE Name = 'excluded_series_description';
UPDATE ConfigSettings SET OrderNumber = 22 WHERE Name = 'ComputeDeepQC';
UPDATE ConfigSettings SET OrderNumber = 23 WHERE Name = 'MriConfigFile';
UPDATE ConfigSettings SET OrderNumber = 24 WHERE Name = 'EnvironmentFile';
UPDATE ConfigSettings SET OrderNumber = 25 WHERE Name = 'compute_snr_modalities';
UPDATE ConfigSettings SET OrderNumber = 26 WHERE Name = 'reference_scan_type_for_defacing';
UPDATE ConfigSettings SET OrderNumber = 27 WHERE Name = 'modalities_to_deface';
UPDATE ConfigSettings SET OrderNumber = 28 WHERE Name = 'MriPythonConfigFile';

SELECT 'Running: SQL/Archive/25.0/2023-02-24-electrophysiology_uploader.sql';

-- Create EEG upload table
CREATE TABLE `electrophysiology_uploader` (
    `UploadID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `UploadedBy` varchar(255) NOT NULL,
    `UploadDate` DateTime NOT NULL,
    `UploadLocation` varchar(255) NOT NULL,
    `Status` enum('Not Started', 'Extracted', 'In Progress', 'Complete', 'Failed', 'Archived') DEFAULT 'Not Started',
    `SessionID` int(10) unsigned,
    `Checksum` varchar(40) DEFAULT NULL,
    `MetaData` TEXT DEFAULT NULL,
    PRIMARY KEY (`UploadID`),
    KEY (`SessionID`),
    CONSTRAINT `FK_eegupload_SessionID`
        FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`),
    CONSTRAINT `FK_eegupload_UploadedBy`
        FOREIGN KEY (`UploadedBy`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Add to module table
INSERT INTO modules (Name, Active) VALUES ('electrophysiology_uploader', 'Y');

-- Add new configurations for eeg uploader
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
    SELECT 'EEGUploadIncomingPath', 'Path to the upload directory for incoming EEG studies', 1, 0, 'text', ID, 'EEG Incoming Directory', 7 FROM ConfigSettings WHERE Name="paths";

-- Add new permissions for eeg uploader
INSERT INTO permissions (code, description, moduleID, action, categoryID) VALUES
    ('monitor_eeg_uploads','Monitor EEG uploads',(SELECT ID FROM modules WHERE Name='electrophysiology_uploader'),NULL,'2');

SELECT 'Running: SQL/Archive/25.0/2023-02-28_create_max_days_inactive_config_for_users.sql';

INSERT INTO ConfigSettings
    (
        Name,
        Description,
        Visible,
        AllowMultiple,
        DataType,
        Parent,
        Label,
        OrderNumber
    )
    SELECT
        'UserMaximumDaysInactive',
        'The maximum number of days since last login before making a user inactive',
        1,
        0,
        'text',
        ID,
        'Maximum Days Before Making User Inactive',
        30
    FROM ConfigSettings
    WHERE Name="study";

INSERT INTO Config (ConfigID, Value) SELECT ID, "365" FROM ConfigSettings WHERE Name="UserMaximumDaysInactive";

SELECT 'Running: SQL/Archive/25.0/2023-04-24_add_phase_enc_dir_and_echo_number_to_MRICandidateErrors.sql';

-- ---------------------------------------------------------------------------------------------
-- alter MRICandidateErrors table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE MRICandidateErrors ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)  DEFAULT NULL;
ALTER TABLE MRICandidateErrors ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;

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
