-- Add a permission to Imaging Broswer to give access to users to view phantoms data only
INSERT INTO permissions (code,description,categoryID) VALUES ('imaging_browser_phantom_data', 'Can access only phantom data in Imaging Browser', 2);
INSERT INTO user_perm_rel (userID,permID) SELECT u.ID, p.permID FROM users u JOIN permissions p WHERE u.UserID='admin' AND p.code = 'imaging_browser_phantom_data';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_phantom_data' AND m.Label='Imaging Browser';
