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
ALTER TABLE `files` MODIFY `FileType` VARCHAR(255) DEFAULT NULL;
ALTER TABLE `files` ADD FOREIGN KEY (`FileType`) REFERENCES `ImagingFileTypes`(`type`);
ALTER TABLE tarchive_files ADD `TarchiveSeriesID` INT(11) DEFAULT NULL;
ALTER TABLE tarchive_files ADD CONSTRAINT `tarchive_files_TarchiveSeriesID_fk` FOREIGN KEY (`TarchiveSeriesID`) REFERENCES tarchive_series(`TarchiveSeriesID`);
UPDATE `help` SET content='Welcome to the LORIS database. \r\nThis Help section provides you with guidelines for adding and updating information in the database. On each page, click on the question mark icon in the Menu Bar across the top of the screen to access detailed information specific to the current page.\r\n\r\nUpon logging into the LORIS database, the user will come to the home page. Here, key user information can automatically be seen at the right-hand side of the Menu Bar at the top of the screen indicating the user’s name and the site to which the user belongs. To return to the home page at any time, the user can click on the \"LORIS\" button at the far left corner of the Menu Bar.\r\nThe menus spanning horizontally across the Menu Bar represent different categories of features within the database that allow data acquisition, storage, processing and dissemination using the web based interface. Please note that when accessing LORIS via tablet, mobile device, or in a narrow-width desktop browser window, these main menus will be hidden under the downward-pointing arrow icon in the Menu Bar. Clicking on this button will show or hide all main menus in a vertical list.\r\nThere are five main drop-down menus: Candidate, Clinical, Imaging, Reports and Admin. Hover over on each menu to display a list of features or modules, organized by category:\r\n- Candidate: New Profile, Access Profile\r\n- Clinical: Reliability Coding, Conflict Resolver, Certification, Document Repository\r\n- Imaging: Radiological Review, DICOM Archive, Imaging Browser, Imaging Uploader\r\n- Reports: Database Statistics, Data Dictionary, Data Querying Tool, Data Team Helper, Data Integrity Tool\r\n- Admin: User Accounts, Instrument Builder\r\n\r\nOn the right side of the Menu Bar there are two icons linking to the Feedback Module, a pencil on paper icon , and Help, a question mark icon. Each of these modules will open in a new pop-up window, or new tab on a mobile browser.\r\n\r\nAll five main menus, the two icons listed above, the user’s site and the user’s name are accessible from any page in LORIS, via the Menu Bar at the top of the screen. \r\n\r\nTo log out of the database, click on the username displayed at the right edge of the Menu Bar, and select the \"Log Out\" option from the drop-down menu. \r\n\r\nThe \"My Preferences\" feature, also listed in this menu, can be used to update certain user profile settings and change the user’s password. \r\n'
WHERE content='Welcome to the LORIS database. \r\nThis Help section provides you with guidelines for adding and updating information in the database. On each page, click on the question-mark icon in the Menu Bar across the top of the screen to access detailed information specific to the page.\r\n\r\nUpon logging into the LORIS database, the user will come to the home page. Here, key user information can automatically be seen at the right-hand side of the Menu Bar at the top of the screen indicating the user’s name and the site to which the user belongs. To return to the home page at any time, the user can click on the \"LORIS\" button at the far left corner of the Menu Bar.\r\nThe menus spanning horizontally across the Menu Bar represent different categories of features within the database that allow data acquisition, storage, processing and dissemination using the web based interface. Please note that when accessing LORIS via tablet, mobile device, or in a narrow-width desktop browser window, these main menus will be hidden under the downward-pointing arrow icon in the Menu Bar. Clicking on this button will show or hide all main menus in a vertical list.\r\nThere are five main drop-down menus: Candidate, Clinical, Imaging, Reports and Admin. Hover over on each menu to display a list of features or modules, organized by category:\r\n- Candidate: New Profile, Access Profile\r\n- Clinical: Reliability Coding, Conflict Resolver, Certification, Document Repository\r\n- Imaging: Radiological Review, DICOM Archive, Imaging Browser, Imaging Uploader\r\n- Reports: Database Statistics, Data Dictionary, Data Querying Tool, Data Team Helper, Data Integrity Tool\r\n- Admin: User Accounts, Instrument Builder\r\n\r\nOn the right side of the Menu Bar there are two icons linking to the Feedback Module, a pencil on paper icon , and Help, a question mark icon. Each of these modules will open in a new pop-up window, or new tab on a mobile browser.\r\n\r\nAll five main menus, the two icons listed above, the user’s site and the user’s name are accessible from any page in LORIS, via the Menu Bar at the top of the screen. \r\n\r\nTo log out of the database, click on the username displayed at the right edge of the Menu Bar, and select the \"Log Out\" option from the drop-down menu. \r\n\r\nThe \"My Preferences\" feature, also listed in this menu, can be used to update certain user profile settings and change the user’s password. \r\n';

UPDATE `help` SET content='By clicking on \"New Profile\" under the Candidate Menu, users with appropriate permissions can register a new candidate for their study site. Once inside the \"New Profile\" page, the \"Date of Birth\" field must be entered twice, in order to minimize error in data entry. \r\nThe PSCID refers to an alphanumeric identifier entered by the user. This identifier is typically comprised of a site-specific code (e.g., AAA), followed by a numeric code specific to the candidate at that site (e.g., AAA0000). Other fields are customized for specific projects and can be configured as drop-down fields or user input fields. \r\n\r\nOnce all the required data fields are completed, the user can click on the \"Create\" button to finish registering the candidate. It is crucial that no mistakes in data entry are made at this point, as information cannot be modified after clicking the \"Create\" button. \r\n\r\nEach new candidate will then be assigned a 6 digit numerical DCCID. The DCCID, along with the previously entered PSCID, will always be used to identify this candidate.\r\n'
WHERE content='By clicking on \"New Profile\" under the Candidate Menu, users with appropriate permissions can register a new candidate for their study site. Once inside the \"New Profile\" page, the \"Date of Birth\" field must be entered twice, in order to minimize error in data entry. \r\nThe PSCID refers to an alphanumeric identifier entered by the user. This identifier is typically comprised of a site-specific code (e.g., AAA), followed by a numeric code specific to the candidate at that site (e.g., AAA0000). Other fields are customized for specific projects and can be configured as drop-down fields or user input fields. \r\n\r\nOnce all the required data fields are completed, the user can click on the \"Create\" button to finish registering the candidate. It is crucial that no mistakes in data entry are made at this point, as information cannot be modified after clicking the \"Create\" button. \r\n\r\nEach new candidate will then be assigned a 6 digit numerical DCC-ID. The DCCID, along with the previously entered PSCID, will always be used to identify this candidate.\r\n';

UPDATE `help` SET content='In many cases, the candidate`s profile will already be created. The Access Profile module, also found under the Candidate menu, allows the user to efficiently search for an existing candidate and access the related data. \r\n\r\nThere are 3 main ways to search for a candidate:\r\n\r\n<u>Option 1:</u> Using PSCID and DCCID\r\nA specific candidate profile can be accessed directly by entering both the PSCID and the DCCID in the white boxes to the right of the screen and then clicking the button \"Open Profile\". In a narrow browser window or mobile device the PSCID and DCCID fields are found below the selection filter.\r\n\r\n<u>Option 2:</u> Basic Filter Options\r\nUsers may search for particular candidates by selecting from the \"Basic\" filter options. Users may select from drop-down select boxes, and then click \"Show Data\" to view a list of candidates. If only a fragment of the candidate ID is known, the user may search for the profile by entering the known fragment, and then click show data to find the appropriate profile. For example, searching with \"531\" under \"DCCID\" will retrieve the profile of candidate DCC1107 (with full DCCID 531861).\r\n\r\n<u>Option 3:</u> Advanced Filter Options\r\nMore detailed filter options can be accessed by clicking on the \"Advanced\" button. Users will select from a number of drop-down select boxes including Site, Project, Subproject, Gender etc., and then click \"Show Data\" to view a list of candidates. To return to \"Basic\" selection filters please select \"Basic\".\r\n\r\nTo view a specific candidate’s dataset, click on the candidate’s PSCID found in blue text under the \"PSCID\" column. At the top of the table, column headings will appear underlined and show a click icon when the user hovers over the heading title. Data can be sorted in ascending order according to a given column by clicking on the column heading (i.e. DCCID, Site, PSCID etc.), and by clicking again, in descending order. In both standard and mobile view, the selection filter can be hidden by selecting the upward arrow icon, allowing easier viewing of the data. Once in this view, users can click on the downward arrow icon to display the features of the selection filter once again. This feature applies to all pages that include a Selection Filter.\r\nNote that the form remembers previously selected data such that when the user returns to the \"Access Profile\" page, the selection filter will automatically select profiles according to the last selection settings. Depending on the magnitude of the search, there may be several pages of search results for the user to look through. If \"No candidates found\" appears, this indicates no profiles matched the information specified by the selection filter(s). \r\nWhen on a mobile device or narrow browser window, the table will have a slider at the bottom of the table, facilitating scrolling of the data. The user may also hover or click the arrows that flank the table to see the remainder of the table. When scrolling through search results, the PSCID column will freeze and remain displayed on the lefthand side, to allow for easy reference and access to relevant information.'
WHERE content='In many cases, the candidate`s profile will already be created. The Access Profile module, also found under the Candidate menu, allows the user to efficiently search for an existing candidate and access the related data. \r\n\r\nThere are 3 main ways to search for a candidate:\r\n\r\n<u>Option 1:</u> Using PSC-ID and DCC-ID\r\nA specific candidate profile can be accessed directly by entering both the PSC-ID and the DCC-ID in the white boxes to the right of the screen and then clicking the button \"Open Profile\". In a narrow browser window or mobile device the PSC-ID and DCC-ID fields are found below the selection filter.\r\n\r\n<u>Option 2:</u> Basic Filter Options\r\nUsers may search for particular candidates by selecting from the \"Basic\" filter options. Users may select from drop-down select boxes, and then click \"Show Data\" to view a list of candidates. If only a fragment of the candidate ID is known, the user may search for the profile by entering the known fragment, and then click show data to find the appropriate profile. For example, searching with \"531\" under \"DCCID\" will retrieve the profile of candidate DCC1107 (with full DCCID 531861).\r\n\r\n<u>Option 3:</u> Advanced Filter Options\r\nMore detailed filter options can be accessed by clicking on the \"Advanced\" button. Users will select from a number of drop-down select boxes including Site, Project, Subproject, Gender etc., and then click \"Show Data\" to view a list of candidates. To return to \"Basic\" selection filters please select \"Basic\".\r\n\r\nTo view a specific candidate’s dataset, click on the candidate’s PSCID found in blue text under the \"PSCID\" column. At the top of the table, column headings will appear underlined and show a click icon when the user hovers over the heading title. Data can be sorted in ascending order according to a given column by clicking on the column heading (i.e. DCCID, Site, PSCID etc.), and by clicking again, in descending order. In both standard and mobile view, the selection filter can be hidden by selecting the upward arrow icon, allowing easier viewing of the data. Once in this view, users can click on the downward arrow icon to display the features of the selection filter once again. This feature applies to all pages that include a Selection Filter.\r\nNote that the form remembers previously selected data such that when the user returns to the \"Access Profile\" page, the selection filter will automatically select profiles according to the last selection settings. Depending on the magnitude of the search, there may be several pages of search results for the user to look through. If \"No candidates found\" appears, this indicates no profiles matched the information specified by the selection filter(s). \r\nWhen on a mobile device or narrow browser window, the table will have a slider at the bottom of the table, facilitating scrolling of the data. The user may also hover or click the arrows that flank the table to see the remainder of the table. When scrolling through search results, the PSC-ID column will freeze and remain displayed on the lefthand side, to allow for easy reference and access to relevant information.';

UPDATE `help` SET content='The database facilitates data collection of longitudinal studies; following the same candidates at various intervals for long periods of time. Each candidate may have several time-points stretching the duration of the study. Each time-point will be given a name called a \"Visit Label\". The time-points refer to data collection on different visits for the same candidate. Every time-point contains a subset of data collected in a given time frame with the intention of keeping this subset in a tightly related group. \r\n\r\nA new candidate time-point can be created from the Candidate Profile page by opening a specific profile and clicking \"Create Time Point\" among the Actions buttons visible above the \"List of Visits\" table. Authorized users may also edit general information about the candidate, such as adding comments and updating participant status, by clicking the \"Edit Candidate Info\" button.\r\n\r\nOnce a candidate’s profile has been opened, the PSCID and DCCID will remain at the top of the screen in white text on a banner for reference. Clicking on the candidate’s IDs in white will return the user to the Candidate Profile. \r\nBelow the candidate’s information, the user will find a list of time points under \"Visit Label (Click to Open)\". Clicking on the time point itself in navy text can open the profile for the candidate at that time point.\r\n'
WHERE content='The database facilitates data collection of longitudinal studies; following the same candidates at various intervals for long periods of time. Each candidate may have several time-points stretching the duration of the study. Each time-point will be given a name called a \"Visit Label\". The time-points refer to data collection on different visits for the same candidate. Every time-point contains a subset of data collected in a given time frame with the intention of keeping this subset in a tightly related group. \r\n\r\nA new candidate time-point can be created from the Candidate Profile page by opening a specific profile and clicking \"Create Time Point\" among the Actions buttons visible above the \"List of Visits\" table. Authorized users may also edit general information about the candidate, such as adding comments and updating participant status, by clicking the \"Edit Candidate Info\" button.\r\n\r\nOnce a candidate’s profile has been opened, the PSC-ID and DCC-ID will remain at the top of the screen in white text on a banner for reference. Clicking on the candidate’s IDs in white will return the user to the Candidate Profile. \r\nBelow the candidate’s information, the user will find a list of time points under \"Visit Label (Click to Open)\". Clicking on the time point itself in navy text can open the profile for the candidate at that time point.\r\n';
ALTER TABLE session ADD `MRICaveat` enum('true', 'false') NOT NULL default 'false';
SET SESSION sql_mode = 'ALLOW_INVALID_DATES';
ALTER TABLE help CHANGE `created` `created` DATETIME DEFAULT NULL;
ALTER TABLE help CHANGE `updated` `updated` DATETIME DEFAULT NULL;
UPDATE help SET created = NULL WHERE created = '0000-00-00 00:00:00';
ALTER TABLE acknowledgements DROP COLUMN title;
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
UPDATE files_qcstatus as fqc SET fqc.Selected='true' WHERE fqc.Selected <> '';
ALTER TABLE files_qcstatus CHANGE `Selected` `Selected` enum('true','false') DEFAULT NULL; 
-- Add ScannerCandID column to files, back-populate the newly added column from parameter_file table, then add foreign key constraints 
ALTER TABLE files ADD `ScannerID` int(10) unsigned default NULL;
CREATE TEMPORARY TABLE ScannerIDs AS SELECT pf.FileID, pf.Value AS ScannerID FROM parameter_file AS pf LEFT JOIN parameter_type AS pt ON pf.ParameterTypeID=pt.ParameterTypeID WHERE pt.Name='ScannerID';
UPDATE files AS f, ScannerIDs AS S SET f.ScannerID=S.ScannerID where f.FileID=S.FileID;
ALTER TABLE files ADD CONSTRAINT `FK_files_scannerID` FOREIGN KEY (`ScannerID`) REFERENCES mri_scanner (`ID`);
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
ALTER TABLE Visit_Windows ADD `ID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY;
ALTER TABLE examiners ADD COLUMN `active` enum('Y','N') NOT NULL DEFAULT 'Y';
ALTER TABLE examiners ADD COLUMN `pending_approval` enum('Y','N') NOT NULL DEFAULT 'N';
-- Insert necessary values into configsettings and config

INSERT INTO ConfigSettings (Name,Description,Visible,AllowMultiple,DataType,Parent,Label,OrderNumber) Values ("CSPAdditionalHeaders","Extensions to the Content-security policy allow only for self-hosted content", 1, 0, "text", 1, "Content-Security Extentions:", 23);
INSERT INTO Config (ConfigID,Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name='CSPAdditionalHeaders'),"");
ALTER TABLE `users` 
CHANGE COLUMN `Password_expiry` `Password_expiry` DATE NOT NULL DEFAULT '1990-04-01' ;
ALTER TABLE `tarchive` 
CHANGE COLUMN `PatientDoB` `PatientDoB` DATE NULL DEFAULT NULL ,
CHANGE COLUMN `LastUpdate` `LastUpdate` DATETIME NULL DEFAULT NULL ,
CHANGE COLUMN `DateAcquired` `DateAcquired` DATE NULL DEFAULT NULL ;
-- Insert necessary values into LorisMenuPermissions.

INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='media_read' AND m.Label='Media';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='media_write' AND m.Label='Media';
INSERT INTO issues_categories (categoryName) VALUES
    ('Behavioural Battery'),
    ('Behavioural Instruments'),
    ('Data Entry'),
    ('Examiners'),
    ('Imaging'),
    ('Technical Issue'),
    ('User Accounts'),
    ('Other');
ALTER TABLE `participant_status` 
CHANGE COLUMN `data_entry_date` `data_entry_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
INSERT INTO help (parentID, hash, topic, content, created, updated) VALUES (-1, md5('issue_tracker'), 'Issue Tracker', 'The Issue Tracker module allows users to report bugs and flag data concerns within a given LORIS. <br>Click the "Add Issue" button to register a new issue. Use the All Issues, Closed Issues, and My Issues tabs, in combination with the Selection filters, to build a custom view of issues of interest. Optionally, a PSCID can be associated to an issue, to link it to a specific subject record.  If PSCID is provided, a Visit label can also be specified for cases where an issue relates to a subject-timepoint.<br>Clicking on any issue will load a page displaying the Issue Details, enabling the user to edit or update the issue given appropriate user permissions.  This form can be used to re-assign an issue, change its status, and add further comments.  Email notifications are sent when a given issue is updated, to any user who is added to the list of those "watching" the issue. The history of all comments and updates to the issue is also visible at the end of the Issue page.', '2016-10-25 00:00:00', NULL);

ALTER TABLE `issues_history`
  CHANGE COLUMN `fieldChanged` `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','candID') NOT NULL DEFAULT 'comment';

--ensure 'admin' has all the available permissions
INSERT IGNORE INTO `user_perm_rel` (userID, permID) SELECT DISTINCT 1, permID FROM permissions;

