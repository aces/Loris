CREATE TABLE LorisMenu (
    ID integer unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Parent integer unsigned REFERENCES LorisMenu(ID),
    Label varchar(255),
    Link varchar(255),
    Visible enum('true', 'false'),
    OrderNumber integer
);

INSERT INTO LorisMenu (Label, OrderNumber) VALUES ('Candidate', 1), ('Clinical', 2), ('Imaging', 3), ('Reports', 4), ('Tools', 5), ('Admin', 6);

INSERT INTO LorisMenu (Label, Link, Parent) VALUES 
    ('New Profile', 'main.php?test_name=new_profile', 1),
    ('Access Profile', 'main.php?test_name=candidate_list', 1);

INSERT INTO LorisMenu (Label, Link, Parent) VALUES 
    ('Reliability', 'main.php?test_name=reliability', 2),
    ('Conflicts Resolver', 'main.php?test_name=conflicts_resolve', 2),
    ('Certification', 'main.php?test_name=certification', 2);

INSERT INTO LorisMenu (Label, Link, Parent) VALUES 
    ('Radiological Reviews', 'main.php?test_name=final_radiological_review', 3),
    ('DICOM Archive', 'main.php?test_name=dicom_archive', 3),
    ('Imaging Browser', 'main.php?test_name=imaging_browser', 3);

INSERT INTO LorisMenu (Label, Link, Parent) VALUES 
    ('Statistics', 'main.php?test_name=statistics', 4),
    ('Data Query Tool', '/dqt/', 4);

INSERT INTO LorisMenu (Label, Link, Parent) VALUES
    ('Data Dictionary', 'main.php?test_name=datadict', 5),
    ('Document Repository', 'main.php?test_name=document_repository', 5),
    ('Data Team Helper', 'main.php?test_name=data_team_helper', 5),
    ('Instrument Builder', 'main.php?test_name=instrument_builder', 5);

INSERT INTO LorisMenu (Label, Link, Parent) VALUES 
    ('User Accounts', 'main.php?test_name=user_accounts', 6);

CREATE TABLE LorisMenuPermissions (
    MenuID integer unsigned REFERENCES LorisMenu(ID),
    PermID integer unsigned REFERENCES permissions(ID)
) COMMENT="If a user has ANY of the permissions for a module it will show up in their menu bar";

-- New Profile permission
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 7, PermID FROM permissions WHERE code='data_entry';

-- Access Profile 
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 8, PermID FROM permissions WHERE code='data_entry';

-- Reliability
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 9, PermID FROM permissions WHERE code='user_accounts';
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 9, PermID FROM permissions WHERE code='reliability_edit_all';
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 9, PermID FROM permissions WHERE code='access_all_profiles';

-- Conflicts Resolver
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 10, PermID FROM permissions WHERE code='data_entry';

-- Certification
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 11, PermID FROM permissions WHERE code='certification';
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 11, PermID FROM permissions WHERE code='certification_multisite';

-- Radiological Reviews
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 12, PermID FROM permissions WHERE code='edit_final_radiological_review';
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 12, PermID FROM permissions WHERE code='view_final_radiological_review';

-- DICOM Archive -- Config file currently does not require any permission
-- Imaging Browser -- Config file currently does not require any permission
-- Statistics -- Config file currently does not require any permission 

-- Data Query Tool
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 16, PermID FROM permissions WHERE code='data_dict';

-- Data Dictionary
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 17, PermID FROM permissions WHERE code='data_dict';
-- Document Repository
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 18, PermID FROM permissions WHERE code='file_upload';

-- Data Team Helper -- Config file currently does not require any permission
-- Instrument Builder -- Config file currently does not require any permission

-- User Accounts
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT 21, PermID FROM permissions WHERE code='user_accounts';
