INSERT INTO permissions (code, description, moduleID, `action`, categoryID)
SELECT 'dicom_archive_nosessionid', 'DICOMs with no session ID', ID, 'View', 2 FROM modules WHERE Name='dicom_archive';

INSERT INTO permissions (code, description, moduleID, `action`, categoryID)
SELECT 'dicom_archive_view_ownsites', 'DICOMs - Own Sites', ID, 'View', 2 FROM modules WHERE Name='dicom_archive';

INSERT IGNORE INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) 
SELECT 'useImagingSiteProjectPermissions', 'Restricts access to data based on both sites and project. Allows access to data with no session affiliated using a special permission only', 1, 0, 'boolean', ID, 'Use Advanced Site Project Permissions', 6 FROM ConfigSettings WHERE Name='imaging_modules';

