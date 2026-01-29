SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `cached_data_type`;
LOCK TABLES `cached_data_type` WRITE;
INSERT INTO `cached_data_type` (`CachedDataTypeID`, `Name`) VALUES (1,'projects_disk_space');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
