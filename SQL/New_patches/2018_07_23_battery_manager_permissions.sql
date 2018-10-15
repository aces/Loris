-- Add Battery Manager to LorisMenu
INSERT INTO LorisMenu (Parent, Label, Link, Visible, OrderNumber)
       VALUES (
           (SELECT ID FROM (SELECT * FROM LorisMenu) as lm WHERE Label = 'Admin'),
           'Battery Manager',
           'battery_manager/',
           null,
           7
       );

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
       VALUES (
           (SELECT ID FROM users WHERE UserID = 'admin'),
           (SELECT permID FROM permissions WHERE code = 'battery_manager_view')
       );

-- Give edit permission to admin
INSERT INTO user_perm_rel (userID, permID)
       VALUES (
           (SELECT ID FROM users WHERE UserID = 'admin'),
           (SELECT permID FROM permissions WHERE code = 'battery_manager_edit')
       );
