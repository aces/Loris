-- Add a permission to Imaging Broswer to give access to users to view phantoms data only
INSERT INTO permissions (code,description,categoryID) VALUES ('imaging_browser_phantom_allsites', 'Can access only phantom data from all sites in Imaging Browser', 2);
INSERT INTO permissions (code,description,categoryID) VALUES ('imaging_browser_phantom_ownsite', 'Can access only phantom data from own sites in Imaging Browser', 2);
INSERT INTO user_perm_rel (userID,permID) SELECT u.ID, p.permID FROM users u JOIN permissions p WHERE u.UserID='admin' AND p.code = 'imaging_browser_phantom_allsites';
INSERT INTO user_perm_rel (userID,permID) SELECT u.ID, p.permID FROM users u JOIN permissions p WHERE u.UserID='admin' AND p.code = 'imaging_browser_phantom_ownsite';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_phantom_allsites' AND m.Label='Imaging Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_phantom_ownsite' AND m.Label='Imaging Browser';


