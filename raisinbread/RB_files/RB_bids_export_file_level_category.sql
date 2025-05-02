SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `bids_export_file_level_category`;
LOCK TABLES `bids_export_file_level_category` WRITE;
INSERT INTO `bids_export_file_level_category` (`BIDSExportFileLevelCategoryID`, `BIDSExportFileLevelCategoryName`) VALUES (1,'study');
INSERT INTO `bids_export_file_level_category` (`BIDSExportFileLevelCategoryID`, `BIDSExportFileLevelCategoryName`) VALUES (2,'image');
INSERT INTO `bids_export_file_level_category` (`BIDSExportFileLevelCategoryID`, `BIDSExportFileLevelCategoryName`) VALUES (3,'session');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
