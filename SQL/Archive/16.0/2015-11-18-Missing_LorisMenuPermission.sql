INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='dicom_archive_view_allsites' AND m.Label='DICOM Archive';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_view_site' AND m.Label='Imaging Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_view_allsites' AND m.Label='Imaging Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_entry' AND m.Label='Statistics';
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='document_repository_view' AND m.Label='Document Repository';
