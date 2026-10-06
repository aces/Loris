INSERT IGNORE INTO permissions (code, description, moduleID, categoryID)
SELECT 'data_release_download_all', 'All Release Files', ID, 2
FROM modules
WHERE Name = 'data_release';

INSERT IGNORE INTO perm_perm_action_rel (permID, actionID)
SELECT permID, permissions_action.ID
FROM permissions
JOIN permissions_action ON permissions_action.name IN ('View', 'Download')
WHERE permissions.code = 'data_release_download_all';
