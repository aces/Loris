INSERT INTO permissions (code, description, ModuleID, action, categoryID)
VALUES ('view_instrument_data', 'Data', 
(SELECT ID FROM modules WHERE Name = 'instruments'), 'View', 2);
INSERT IGNORE INTO user_perm_rel (userID, permID) 
SELECT users.ID, permissions.permID FROM users 
CROSS JOIN permissions WHERE users.userID='admin';