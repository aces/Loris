CREATE TABLE LorisMenu (
    ID integer unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Parent integer unsigned REFERENCES LorisMenu(ID),
    Label varchar(255),
    Link varchar(255),
    Visible enum('true', 'false'),
    OrderNumber integer
);

INSERT INTO LorisMenu (Label, OrderNumber) VALUES ('Candidate', 1), ('Clinical', 2), ('Imaging', 3), ('Reports', 4), ('Admin', 5);

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
    ('User Accounts', 'main.php?test_name=user_accounts', 5),
    ('Instrument Builder', 'main.php?test_name=instrument_builder', 5);
