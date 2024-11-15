ALTER TABLE data_release
ADD COLUMN hidden_by_id int(10) unsigned NULL DEFAULT NULL,
ADD CONSTRAINT FK_hidden_by_id
FOREIGN KEY (hidden_by_id) REFERENCES users (ID);

INSERT INTO permissions (moduleID, code, action, description, categoryID)
    SELECT ID, 'data_release_hide', 'Edit', 'Hidden Releases', 2 FROM modules WHERE Name = 'data_release';
INSERT INTO permissions (moduleID, code, action, description, categoryID)
    SELECT ID, 'data_release_delete', 'Delete', 'Releases', 2 FROM modules WHERE Name = 'data_release';