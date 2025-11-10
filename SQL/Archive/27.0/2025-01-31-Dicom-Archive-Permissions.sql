INSERT IGNORE INTO permissions (code, description, moduleID, `action`, categoryID)
SELECT 'dicom_archive_nosessionid', 'DICOMs with no session ID', ID, 'View', 2 FROM modules WHERE Name='dicom_archive';

INSERT IGNORE INTO permissions (code, description, moduleID, `action`, categoryID)
SELECT 'dicom_archive_view_ownsites', 'DICOMs - Own Sites', ID, 'View', 2 FROM modules WHERE Name='dicom_archive';