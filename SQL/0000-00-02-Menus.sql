DROP TABLE IF EXISTS `LorisMenu`;

CREATE TABLE LorisMenu (
    ID integer unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Parent integer unsigned REFERENCES LorisMenu(ID),
    Label varchar(255),
    Link varchar(255),
    Visible enum('true', 'false'),
    OrderNumber integer
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO LorisMenu (Label, OrderNumber) VALUES
     ('Candidate', 1),
     ('Clinical', 2),
     ('Imaging', 3),
     ('Reports', 4),
     ('Tools', 5),
     ('Admin', 6);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('New Profile', 'new_profile/', (SELECT ID FROM LorisMenu as L WHERE Label='Candidate'), 1),
    ('Access Profile', 'candidate_list/', (SELECT ID FROM LorisMenu as L WHERE Label='Candidate'), 2);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('Reliability', 'reliability/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 1),
    ('Conflict Resolver', 'conflict_resolver/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 2),
    ('Examiner', 'examiner/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 3),
    ('Training', 'training/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 4),
    ('Media', 'media/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 5);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('Radiological Reviews', 'final_radiological_review/', (SELECT ID FROM LorisMenu as L WHERE Label='Imaging'), 1),
    ('DICOM Archive', 'dicom_archive/', (SELECT ID FROM LorisMenu as L WHERE Label='Imaging'), 2),
    ('Imaging Browser', 'imaging_browser/', (SELECT ID FROM LorisMenu as L WHERE Label='Imaging'), 3),
    ('MRI Violated Scans', 'mri_violations/', (SELECT ID FROM LorisMenu as L WHERE Label='Imaging'), 4),
    ('Imaging Uploader', 'imaging_uploader/', (SELECT ID FROM LorisMenu as L WHERE Label='Imaging'), 5);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('Statistics', 'statistics/', (SELECT ID FROM LorisMenu as L WHERE Label='Reports'), 1),
    ('Data Query Tool', 'dataquery/', (SELECT ID FROM LorisMenu as L WHERE Label='Reports'), 2);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('Data Dictionary', 'datadict/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 1),
    ('Document Repository', 'document_repository/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 2),
    ('Data Integrity Flag', 'data_integrity_flag/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 3),
    ('Data Team Helper', 'data_team_helper/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 4),
    ('Instrument Builder', 'instrument_builder/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 5),
    ('Genomic Browser', 'genomic_browser/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 6),
    ('Data Release', 'data_release/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 7),
    ('Acknowledgements', 'acknowledgements/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 8);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    ('User Accounts', 'user_accounts/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 1),
    ('Survey Module', 'survey_accounts/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 2),
    ('Help Editor', 'help_editor/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 3),
    ('Instrument Manager', 'instrument_manager/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 4),
    ('Configuration', 'configuration/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 5),
    ('Server Processes Manager', 'server_processes_manager/', (SELECT ID FROM LorisMenu as L WHERE Label='Admin'), 6);


CREATE TABLE LorisMenuPermissions (
    MenuID integer unsigned REFERENCES LorisMenu(ID),
    PermID integer unsigned REFERENCES permissions(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT="If a user has ANY of the permissions for a module it will show up in their menu bar";

-- New Profile permission
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_entry' AND m.Label='New Profile';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='access_all_profiles' AND m.Label='New Profile';

-- Access Profile
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_entry' AND m.Label='Access Profile';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='access_all_profiles' AND m.Label='Access Profile';

-- Reliability
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='user_accounts' AND m.Label='Reliability';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='reliability_edit_all' AND m.Label='Reliability';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='access_all_profiles' AND m.Label='Reliability';

-- Conflict Resolver
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='conflict_resolver' AND m.Label='Conflict Resolver';

-- Examiner
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='examiner_site' AND m.Label='Examiner';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='examiner_multisite' AND m.Label='Examiner';

-- Training
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='training' AND m.Label='Training';

-- Radiological Reviews
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='edit_final_radiological_review' AND m.Label='Radiological Reviews';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='view_final_radiological_review' AND m.Label='Radiological Reviews';

-- DICOM Archive
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='dicom_archive_view_allsites' AND m.Label='DICOM Archive';

-- Imaging Browser
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_view_site' AND m.Label='Imaging Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_view_allsites' AND m.Label='Imaging Browser';

-- MRI Violated Scans
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='violated_scans_view_allsites' AND m.Label='MRI Violated Scans';

-- MRI Upload
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_uploader' AND m.Label='Imaging Uploader';

-- Statistics
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_entry' AND m.Label='Statistics';

-- Data Query Tool
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_dict_view' AND m.Label='Data Query Tool';

-- Data Dictionary
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_dict_view' AND m.Label='Data Dictionary';

-- Document Repository
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='document_repository_view' AND m.Label='Document Repository';

-- Data Integrity Flag
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID
    FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_integrity_flag' AND m.Label='Data Integrity Flag';

-- Data Team Helper
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_team_helper' AND m.Label='Data Team Helper';

-- Instrument Builder
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='instrument_builder' AND m.Label='Instrument Builder';

-- Genomic Browser
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='genomic_browser_view_site' AND m.Label='Genomic Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='genomic_browser_view_allsites' AND m.Label='Genomic Browser';

-- User Accounts
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='user_accounts' AND m.Label='User Accounts';

-- Survey Module
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='user_accounts' AND m.Label='Survey Module';

-- Help Editor
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='context_help' AND m.Label='Help Editor';

-- Instrument Manager
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='superuser' AND m.Label='Instrument Manager';

-- Configuration
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='config' AND m.Label='Configuration';

-- Server Processes Manager
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='server_processes_manager' AND m.Label='Server Processes Manager';

-- Acknowledgement Generator
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='acknowledgements_view' AND m.Label='Acknowledgements';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='acknowledgements_edit' AND m.Label='Acknowledgements';

-- Data Query Tool
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='dataquery_view' AND m.Label='Data Query Tool';
