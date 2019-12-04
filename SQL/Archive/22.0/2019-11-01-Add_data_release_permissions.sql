INSERT INTO permissions (code,description,categoryID) VALUES 
('data_release_view','Data Release: View releases',(SELECT ID FROM permissions_category WHERE Description='Permission'));

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_release_view' AND m.Label='Data Release';

INSERT IGNORE INTO user_perm_rel
SELECT upr.userID, p.permID FROM user_perm_rel upr JOIN permissions p WHERE upr.permID=1 AND p.code IN ('data_release_view');
