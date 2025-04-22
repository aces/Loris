INSERT INTO permissions (code, description, ModuleID, action, category) 
'view_instrument_data', 'Data Query Tool - View Instrument Data', 
(SELECT ID FROM modules WHERE Name = 'instruments'), 'View', 2;