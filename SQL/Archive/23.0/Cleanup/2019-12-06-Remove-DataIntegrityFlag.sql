DROP TABLE IF EXISTS `data_integrity_flag`;

DELETE FROM LorisMenuPermissions WHERE PermID IN (SELECT permID FROM permissions WHERE code='data_integrity_flag');
DELETE FROM permissions where code='data_integrity_flag';
DELETE FROM LorisMenu WHERE Link='data_integrity_flag/';
