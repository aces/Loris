-- Insert necessary values into LorisMenuPermissions.

INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='media_read' AND m.Label='Media';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
   SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='media_write' AND m.Label='Media';
