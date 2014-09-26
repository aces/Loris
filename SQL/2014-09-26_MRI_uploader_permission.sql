INSERT INTO permissions (code, description, categoryID) VALUES ('mri_upload','MRI Uploader',2);
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID 
FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='mri_upload' AND m.Label='MRI Upload';
