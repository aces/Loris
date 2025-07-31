INSERT INTO notification_modules
(module_name, operation_type, as_admin, template_file, description)
VALUES
('media', 'digest', 'N', 'media_upload_digest.tpl', 'Media: Email Digest of Recently Uploaded Files');

INSERT INTO notification_modules_services_rel VALUES (
	LAST_INSERT_ID(), 
	(SELECT id FROM notification_services WHERE service='email_text')
	);

INSERT INTO permissions (code, description, moduleID, action) VALUES 
	('media_upload_digest',
	'Media files: Access to recently uploaded media notifications digest.',
	(SELECT ID FROM modules where Name = 'media'),
	'Edit'
	);

INSERT INTO user_perm_rel (userID, permID) VALUES 
(
    (SELECT ID FROM users WHERE UserID='admin'),
    (SELECT permID FROM permissions WHERE code='media_upload_digest')
);

INSERT INTO notification_modules_perm_rel (notification_module_id, perm_id) VALUES
(
    (SELECT id from notification_modules where description = 'Media: Email Digest of Recently Uploaded Files'),
    (SELECT permID FROM permissions WHERE code='media_upload_digest')
);