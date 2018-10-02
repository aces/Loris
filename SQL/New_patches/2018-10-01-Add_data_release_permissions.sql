INSERT INTO permissions (code,description,categoryID) VALUES ('data_release_upload','Data Release: Upload file',2), ('data_release_edit_file_access','Data Release: Grant other users view-file permissions',2);

INSERT IGNORE INTO user_perm_rel 
SELECT upr.userID, p.permID FROM user_perm_rel upr JOIN permissions p WHERE upr.permID=1 AND p.code IN ('data_release_upload', 'data_release_edit_permissions');


