DELETE FROM LorisMenuPermissions WHERE MenuID=(SELECT ID FROM LorisMenu WHERE Label='Access Profile' AND Parent=1) AND PermID=(SELECT PermID FROM permissions WHERE code='data_entry');

