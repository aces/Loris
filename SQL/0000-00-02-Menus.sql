--
-- Table Definition
--


CREATE TABLE `LorisMenu` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Parent` int(10) unsigned DEFAULT NULL,
  `Label` varchar(255) DEFAULT NULL,
  `Link` varchar(255) DEFAULT NULL,
  `Visible` enum('true','false') DEFAULT NULL,
  `OrderNumber` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `index3` (`Parent`,`Label`),
  KEY `fk_LorisMenu_1_idx` (`Parent`),
  CONSTRAINT `fk_LorisMenu_1` FOREIGN KEY (`Parent`) REFERENCES `LorisMenu` (`ID`) ON DELETE RESTRICT ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `LorisMenuPermissions` (
  `MenuID` int(10) unsigned NOT NULL,
  `PermID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`MenuID`,`PermID`),
  KEY `fk_LorisMenuPermissions_2` (`PermID`),
  CONSTRAINT `fk_LorisMenuPermissions_1` FOREIGN KEY (`MenuID`) REFERENCES `LorisMenu` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_LorisMenuPermissions_2` FOREIGN KEY (`PermID`) REFERENCES `permissions` (`permID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='If a user has ANY of the permissions for a module it will show up in their menu bar';

--
-- Data
--


INSERT INTO LorisMenu (Label, OrderNumber) VALUES
     ('Candidate', 1),
     ('Clinical', 2),
     ('Imaging', 3),
     ('Genomics', 4),
     ('Reports', 5),
     ('Tools', 6),
     ('Admin', 7);


INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('New Profile', 'new_profile/', (SELECT ID FROM LorisMenu as L WHERE Label='Candidate'), 1),
    ('Access Profile', 'candidate_list/', (SELECT ID FROM LorisMenu as L WHERE Label='Candidate'), 2);


INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('Conflict Resolver', 'conflict_resolver/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 2),
    ('Examiner', 'examiner/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 3),
    ('Media', 'media/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 4),
    ('Behavioural Quality Control', 'behavioural_qc/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 5);


INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('DICOM Archive', 'dicom_archive/', (SELECT ID FROM LorisMenu as L WHERE Label='Imaging'), 1),
    ('Imaging Browser', 'imaging_browser/', (SELECT ID FROM LorisMenu as L WHERE Label='Imaging'), 2),
    ('MRI Violated Scans', 'mri_violations/', (SELECT ID FROM LorisMenu as L WHERE Label='Imaging'), 3),
    ('Imaging Uploader', 'imaging_uploader/', (SELECT ID FROM LorisMenu as L WHERE Label='Imaging'), 4),
    ('Imaging Quality Control', 'imaging_qc/', (SELECT ID FROM LorisMenu as L WHERE Label='Imaging'), 5);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('Genomic Browser', 'genomic_browser/', (SELECT ID FROM LorisMenu as L WHERE Label='Genomics'), 1);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('Statistics', 'statistics/', (SELECT ID FROM LorisMenu as L WHERE Label='Reports'), 1),
    ('Data Query Tool', 'dataquery/', (SELECT ID FROM LorisMenu as L WHERE Label='Reports'), 2),
    ('Publications', 'publication/', (SELECT ID FROM LorisMenu as L WHERE Label='Reports'), 3);


INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('Data Dictionary', 'datadict/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 1),
    ('Document Repository', 'document_repository/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 2),
    ('Data Integrity Flag', 'data_integrity_flag/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 3),
    ('Instrument Builder', 'instrument_builder/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 5),
    ('Data Release', 'data_release/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 7),
    ('Acknowledgements', 'acknowledgements/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 8),
    ('Issue Tracker', 'issue_tracker/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 9);


INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('User Accounts', 'user_accounts/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 1),
    ('Survey Module', 'survey_accounts/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 2),
    ('Help Editor', 'help_editor/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 3),
    ('Instrument Manager', 'instrument_manager/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 4),
    ('Configuration', 'configuration/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 5),
    ('Server Processes Manager', 'server_processes_manager/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 6);



INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_entry' AND m.Label='New Profile';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='access_all_profiles' AND m.Label='New Profile';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_entry' AND m.Label='Access Profile';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='access_all_profiles' AND m.Label='Access Profile';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='conflict_resolver' AND m.Label='Conflict Resolver';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='examiner_view' AND m.Label='Examiner';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='examiner_multisite' AND m.Label='Examiner';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='training' AND m.Label='Training';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='dicom_archive_view_allsites' AND m.Label='DICOM Archive';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_view_site' AND m.Label='Imaging Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_view_allsites' AND m.Label='Imaging Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_phantom_allsites' AND m.Label='Imaging Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_phantom_ownsite' AND m.Label='Imaging Browser';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='violated_scans_view_allsites' AND m.Label='MRI Violated Scans';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_uploader' AND m.Label='Imaging Uploader';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_entry' AND m.Label='Statistics';

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_dict_view' AND m.Label='Data Dictionary';

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_dict_edit' AND m.Label='Data Dictionary';

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='document_repository_view' AND m.Label='Document Repository';


INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID
    FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_integrity_flag' AND m.Label='Data Integrity Flag';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='quality_control' AND m.Label='Behavioural Quality Control';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='instrument_builder' AND m.Label='Instrument Builder';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='genomic_browser_view_site' AND m.Label='Genomic Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='genomic_browser_view_allsites' AND m.Label='Genomic Browser';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='user_accounts' AND m.Label='User Accounts';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='user_accounts' AND m.Label='Survey Module';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='context_help' AND m.Label='Help Editor';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='instrument_manager_read' AND m.Label='Instrument Manager';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='instrument_manager_write' AND m.Label='Instrument Manager';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='config' AND m.Label='Configuration';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='server_processes_manager' AND m.Label='Server Processes Manager';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='acknowledgements_view' AND m.Label='Acknowledgements';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='acknowledgements_edit' AND m.Label='Acknowledgements';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='dataquery_view' AND m.Label='Data Query Tool';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='issue_tracker_reporter' AND m.Label='Issue Tracker';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='issue_tracker_developer' AND m.Label='Issue Tracker';

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_release_view' AND m.Label='Data Release';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_release_upload' AND m.Label='Data Release';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_release_edit_file_access' AND m.Label='Data Release';

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='quality_control' AND m.Label='Imaging Quality Control';

INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='media_read' AND m.Label='Media';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='media_write' AND m.Label='Media';


INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='publication_view' AND m.Label='Publications';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='publication_propose' AND m.Label='Publications';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='publication_approve' AND m.Label='Publications';
