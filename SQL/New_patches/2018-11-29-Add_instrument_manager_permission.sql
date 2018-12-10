INSERT INTO permissions (code,description,categoryID) VALUES ('instrument_manager_read','Instrument Manager: View module',(SELECT ID FROM permissions_category WHERE Description = 'Permission'));
INSERT INTO permissions (code,description,categoryID) VALUES ('instrument_manager_write','Instrument Manager: Install new instruments via file upload',(SELECT ID FROM permissions_category WHERE Description = 'Permission'));

INSERT IGNORE INTO user_perm_rel
SELECT upr.userID, p.permID FROM user_perm_rel upr JOIN permissions p WHERE upr.permID=1 AND p.code IN ('instrument_manager_read', 'instrument_manager_write');
