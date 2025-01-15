INSERT INTO permissions (code, description, moduleID, `action`, categoryID)
SELECT 'imaging_uploader_nosessionid', 'uploads with no session ID', ID, 'View', 2 FROM modules WHERE Name='imaging_uploader';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) 
SELECT 'useSiteProjectPermissions', 'Only allow users access to data with a sessionID (for site and project access restrictions). Bypassed by module `nosessionid` permissions for admins', 1, 0, 'boolean', ID, 'Use Site Project Permissions', 6 FROM ConfigSettings WHERE Name='imaging_modules';
