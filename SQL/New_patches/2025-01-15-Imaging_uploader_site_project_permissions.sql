UPDATE permissions SET code = 'imaging_uploader_allsites', description='Imaging Scans - All Sites' WHERE code='imaging_uploader';
INSERT INTO permissions (code, description, moduleID, `action`, categoryID)
SELECT 'imaging_uploader_ownsites', 'Imaging Scans - Own Sites', ID, 'View/Upload', 2 FROM modules WHERE Name='imaging_uploader';
INSERT INTO permissions (code, description, moduleID, `action`, categoryID)
SELECT 'imaging_uploader_nosessionid', 'Uploads with No Session Information', ID, 'View', 2 FROM modules WHERE Name='imaging_uploader';

INSERT IGNORE INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) 
SELECT 'useImagingSiteProjectPermissions', 'Restricts access to data based on both sites and project. Allows access to data with no session affiliated using a special permission only', 1, 0, 'boolean', ID, 'Use Advanced Site Project Permissions', 6 FROM ConfigSettings WHERE Name='imaging_modules';