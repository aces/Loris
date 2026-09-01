UPDATE modules SET Active='Y' WHERE Name='policy_tracker';

INSERT IGNORE INTO permissions (code, description, moduleID, categoryID)
SELECT 'view_policy_decisions', 'Policy Decisions', ID, 2
FROM modules WHERE Name='policy_tracker';

INSERT IGNORE INTO permissions (code, description, moduleID, categoryID)
SELECT 'edit_policies', 'Policies', ID, 2
FROM modules WHERE Name='policy_tracker';

INSERT IGNORE INTO perm_perm_action_rel (permID, actionID)
SELECT permID, 1
FROM permissions
WHERE code='view_policy_decisions';

INSERT IGNORE INTO perm_perm_action_rel (permID, actionID)
SELECT permissions.permID, permissions_action.ID
FROM permissions
CROSS JOIN permissions_action
WHERE permissions.code='edit_policies'
    AND permissions_action.name IN ('Create', 'Edit');

INSERT IGNORE INTO user_perm_rel (userID, permID)
SELECT users.ID, permissions.permID
FROM users
JOIN permissions
    ON permissions.code IN ('view_policy_decisions', 'edit_policies')
WHERE users.UserID='admin';
