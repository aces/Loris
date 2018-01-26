
alter table help drop column projectContent;

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='data_dict_edit' AND m.Label='Data Dictionary';

