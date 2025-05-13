INSERT INTO permissions (code, description, ModuleID, action, categoryID)
VALUES ('view_instrument_data', 'Data', 
(SELECT ID FROM modules WHERE Name = 'instruments'), 'View', 2);