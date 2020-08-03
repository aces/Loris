-- Add view permission for battery manager
INSERT INTO permissions (code, description, categoryID)
       VALUES (
           'battery_manager_view',
           'View Battery Manager',
           (SELECT ID FROM permissions_category WHERE Description = 'Permission')
       );

-- Add edit permission for battery manager
INSERT INTO permissions (code, description, categoryID)
       VALUES (
           'battery_manager_edit',
           'Add, activate, and deactivate entries in Test Battery',
           (SELECT ID FROM permissions_category WHERE Description = 'Permission')
       );

-- Give view permission to admin
INSERT INTO user_perm_rel (userID, permID)
SELECT ID, permID FROM users u JOIN permissions p
WHERE UserID='admin' AND code = 'battery_manager_view';

-- Give edit permission to admin
INSERT INTO user_perm_rel (userID, permID)
SELECT ID, permID FROM users u JOIN permissions p
WHERE UserID='admin' AND code = 'battery_manager_edit';

INSERT INTO modules (Name, Active) VALUES ('battery_manager', 'Y');
