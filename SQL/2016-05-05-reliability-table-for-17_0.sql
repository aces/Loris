CREATE TABLE `reliability_instruments` (
  `Rel_instID` int(11) NOT NULL AUTO_INCREMENT,
  `TestID` int(11) NOT NULL,
  `Visit_label` varchar(255) DEFAULT NULL,
  `Target_scope` enum('Cross','Within') NOT NULL,
  `Target_siteID` int(11) DEFAULT NULL,
  `Threshold` float(4,2) NOT NULL,
  `Reliability_portion` float (2,2) NOT NULL,
  `ProjectID`  int(11) DEFAULT NULL,
  PRIMARY KEY (`rel_instID`)
);
