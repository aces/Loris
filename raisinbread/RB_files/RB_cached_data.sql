SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `cached_data`;
LOCK TABLES `cached_data` WRITE;
INSERT INTO `cached_data` (`CachedDataID`, `CachedDataTypeID`, `Value`, `LastUpdate`) VALUES (1,1,'{&quot;Pumpernickel&quot;:{&quot;total&quot;:0.8}}','2025-09-10 11:12:13');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
