SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `bids_scan_type_subcategory`;
LOCK TABLES `bids_scan_type_subcategory` WRITE;
INSERT INTO `bids_scan_type_subcategory` (`BIDSScanTypeSubCategoryID`, `BIDSScanTypeSubCategory`) VALUES (1,'task-rest');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
