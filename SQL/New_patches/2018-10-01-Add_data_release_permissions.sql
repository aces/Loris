INSERT INTO permissions (code,description,categoryID) VALUES 
('data_release_upload','Data Release: Upload file',(SELECT ID FROM permissions_category WHERE Description='Permission')), 
('data_release_edit_file_access','Data Release: Grant other users view-file permissions',(SELECT ID FROM permissions_category WHERE Description='Permission'));
                                                                                          
INSERT IGNORE INTO user_perm_rel 
SELECT upr.userID, p.permID FROM user_perm_rel upr JOIN permissions p WHERE upr.permID=1 AND p.code IN ('data_release_upload', 'data_release_edit_permissions');


