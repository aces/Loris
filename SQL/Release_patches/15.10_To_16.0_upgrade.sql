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