SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `bids_category`;
LOCK TABLES `bids_category` WRITE;
INSERT INTO `bids_category` (`BIDSCategoryID`, `BIDSCategoryName`) VALUES (1,'anat');
INSERT INTO `bids_category` (`BIDSCategoryID`, `BIDSCategoryName`) VALUES (3,'dwi');
INSERT INTO `bids_category` (`BIDSCategoryID`, `BIDSCategoryName`) VALUES (4,'fmap');
INSERT INTO `bids_category` (`BIDSCategoryID`, `BIDSCategoryName`) VALUES (2,'func');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
