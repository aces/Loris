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
