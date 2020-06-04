-- Add user & menu permissions for Reliability.  These should be granted/populated in user_perm_rel on a per-user basis
INSERT INTO permissions (code, description, categoryID) VALUES ("reliability_edit_all",     "Access and Edit all Reliability profiles",  2);
INSERT INTO permissions (code, description, categoryID) VALUES ("reliability_swap_candidates", "Swap Reliability candidates across all sites", 2);

-- Add permissions for Instrument Builder.  These should be granted/populated in user_perm_rel on a per-user basis
INSERT INTO permissions (code, description, categoryID) VALUES ("instrument_builder", "Instrument Builder: Create and Edit instrument forms", 2);

-- update Menu permissions for Instrument Builder, first removing any previous menu permissions for this module
DELETE FROM LorisMenuPermissions lmp WHERE lmp.MenuID IN (SELECT m.ID FROM LorisMenu m WHERE m.Label='Instrument Builder'); 
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='instrument_builder' AND m.Label='Instrument Builder'; 

-- update Data Dictionary view permission
UPDATE permissions SET code="data_dict_view", description="View Data Dictionary (Parameter type descriptions)" WHERE  code="data_dict" ; 

-- data_dict_edit --> add for all users w 'unsend to dcc' permission  
INSERT INTO permissions (code, description, categoryID) VALUES ("data_dict_edit", "Edit Data Dictionary", 2);
INSERT INTO user_perm_rel (userID, permID) SELECT upr.userID, p2.permID from permissions p, user_perm_rel upr, permissions p2 WHERE p2.code="data_dict_edit" AND  p.code='data_dict_view' and p.permID=upr.permID; 

-- update Menu permissions for Data Dictionary, first removing any previous menu permissions for this module 
DELETE FROM LorisMenuPermissions lmp WHERE lmp.MenuID IN (SELECT m.ID FROM LorisMenu m WHERE m.Label='Data Dictionary'); 
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_dict_view' AND m.Label='Data Dictionary'; 

-- data_team_helper --> add for all users w 'data entry' permission  
INSERT INTO permissions (code, description, categoryID) VALUES ("data_team_helper", "Data Team Helper", 2);
INSERT INTO user_perm_rel (userID, permID) SELECT upr.userID, p2.permID from permissions p, user_perm_rel upr, permissions p2 WHERE p2.code="data_team_helper" AND  p.code='data_entry' and p.permID=upr.permID; 

-- update menu permissions for Data Team Helper 
DELETE FROM LorisMenuPermissions lmp WHERE lmp.MenuID IN (SELECT m.ID FROM LorisMenu m WHERE m.Label='Data Team Helper'); 
INSERT INTO LorisMenuPermissions (MenuID, PermID) SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_team_helper' AND m.Label='Data Team Helper'; 

-- candidate_parameter_view : add for all users w 'data_entry' permission
INSERT INTO permissions (code, description, categoryID) VALUES ("candidate_parameter_view", "View Candidate Parameters", 2);
INSERT INTO user_perm_rel (userID, permID) SELECT upr.userID, p2.permID from permissions p, user_perm_rel upr, permissions p2 WHERE p2.code="candidate_parameter_view" AND  p.code='data_entry' and p.permID=upr.permID; 

-- candidate_parameter_edit : add for all users w 'unsend to dcc' permission
INSERT INTO permissions (code, description, categoryID) VALUES ("candidate_parameter_edit", "Edit Candidate Parameters", 2);
INSERT INTO user_perm_rel (userID, permID) SELECT upr.userID, p2.permID from permissions p, user_perm_rel upr, permissions p2 WHERE p2.code="candidate_parameter_edit" AND  p.code='unsend_to_dcc' and p.permID=upr.permID; 

-- update all permissions for Admin user 
INSERT IGNORE INTO `user_perm_rel` (userID, permID) SELECT DISTINCT 1, permID FROM permissions;

