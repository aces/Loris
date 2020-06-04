-- Update the Dataquery Menu Link
UPDATE LorisMenu SET Link='/dataquery/' WHERE Label='Data Query Tool';

-- Add Dataquery permission
INSERT INTO permissions (code, description, categoryID) VALUES ('dataquery_view','View Data Query Tool','2');

-- Add menu permission
-- Data Query Tool
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='dataquery_view' AND m.Label='Data Query Tool';