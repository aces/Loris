-- create new permissions to upload and to hide files
INSERT INTO permissions (code, description, categoryID) VALUES
    ('document_repository_categories', 'Add and edit categories in Document Repository', 2),
    ('document_repository_hidden', 'Document repository: see restricted files', 2);


-- change descrition of the doc repo view and update edit permission
UPDATE permissions
    SET description='View files in document repository' WHERE code='document_repository_view';

UPDATE permissions
    SET code='document_repository_upload_edit' WHERE code='document_repository_edit';


-- give categories and hide permissions to admin
INSERT INTO user_perm_rel (userID, permID) VALUES
	((SELECT ID FROM users WHERE UserID='admin'), (SELECT permID FROM permissions WHERE code='document_repository_categories')),
	((SELECT ID FROM users WHERE UserID='admin'), (SELECT permID FROM permissions WHERE code='document_repository_hidden'));


-- create column to hide files
ALTER TABLE document_repository
    ADD COLUMN hidden_file enum('yes','no') DEFAULT NULL;