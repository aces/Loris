DELETE FROM LorisMenuPermissions WHERE MenuID IN (SELECT ID FROM LorisMenu WHERE Label='Acknowledgements'); 
DELETE FROM LorisMenu WHERE Label='Acknowledgements'; -- deletes both top level and subitem
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES ('Acknowledgements','acknowledgements/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 8);

INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='acknowledgements_view' AND m.Label='Acknowledgements';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='acknowledgements_edit' AND m.Label='Acknowledgements';

