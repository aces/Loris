DELETE FROM LorisMenuPermissions WHERE PermID=(SELECT PermID FROM permissions WHERE code='data_release_upload');
DELETE FROM LorisMenuPermissions WHERE PermID=(SELECT PermID FROM permissions WHERE code='data_release_edit_file_access');

