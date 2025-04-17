UPDATE permissions SET code = 'imaging_uploader_allsites', description='Imaging Scans - All Sites' WHERE code='imaging_uploader';

INSERT IGNORE INTO permissions (code, description, moduleID, `action`, categoryID)
SELECT 'imaging_uploader_ownsites', 'Imaging Scans - Own Sites', ID, 'View/Upload', 2 FROM modules WHERE Name='imaging_uploader';
INSERT IGNORE INTO permissions (code, description, moduleID, `action`, categoryID)
SELECT 'imaging_uploader_nosessionid', 'Uploads with No Session Information', ID, 'View', 2 FROM modules WHERE Name='imaging_uploader';

INSERT IGNORE INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) 
SELECT 'useAdvancedPermissions', 'Restricts access to data based on both sites and projects and require a special permission to access data not affiliated to a session (SessionID null). Keeping this setting to NO should ensure backwards compatibility (access to all data when module loads)', 1, 0, 'boolean', ID, 'Use Advanced Permissions', 6 FROM ConfigSettings WHERE Name='imaging_modules';
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useAdvancedPermissions";
