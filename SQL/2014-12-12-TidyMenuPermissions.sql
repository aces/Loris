-- OPTIONAL patch : Corrects for errors in previous patch 2014-12-03-UpdatePermissions.sql

-- Update Menu permissions for Instrument Builder, to remove access granted by a permission other than the instrument_builder permission(s). 
DELETE FROM LorisMenuPermissions WHERE MenuID IN (SELECT m.ID FROM LorisMenu m WHERE m.Label="Instrument Builder") AND PermID NOT IN (SELECT p.PermID FROM permissions p WHERE p.code LIKE '%instrument_builder%');

-- Update Menu permissions for Data Team Helper, to remove access granted by a permission other than data_team_helper* permission(s). 
DELETE FROM LorisMenuPermissions WHERE MenuID IN (SELECT m.ID FROM LorisMenu m WHERE m.Label="Data Team Helper") AND PermID NOT IN (SELECT p.PermID FROM permissions p WHERE p.code LIKE 'data_team_helper%');

