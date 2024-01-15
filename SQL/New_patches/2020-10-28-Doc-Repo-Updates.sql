-- create new permissions to upload and to hide files
INSERT INTO permissions (code, description, moduleID, action, categoryID) VALUES
    (
        'document_repository_categories', 
        'Categories', 
        (SELECT ID FROM modules WHERE Name='document_repository'),
        'Edit/Upload/Delete',
        2
    ),
    (
        'document_repository_hidden', 
        'Restricted files', 
        (SELECT ID FROM modules WHERE Name='document_repository'), 
        'View',
        2
    );

UPDATE permissions
    SET code='document_repository_upload_edit' WHERE code='document_repository_edit';

-- give categories and hide permissions to admin
INSERT INTO user_perm_rel (userID, permID) VALUES
	((SELECT ID FROM users WHERE UserID='admin'), (SELECT permID FROM permissions WHERE code='document_repository_categories')),
	((SELECT ID FROM users WHERE UserID='admin'), (SELECT permID FROM permissions WHERE code='document_repository_hidden'));


-- create column to hide files
ALTER TABLE document_repository
    ADD COLUMN hidden_file enum('yes','no') DEFAULT NULL;