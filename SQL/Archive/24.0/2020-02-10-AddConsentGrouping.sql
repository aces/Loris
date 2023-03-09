CREATE TABLE `consent_group` (
  `ConsentGroupID` integer unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Label` varchar(255) NOT NULL,
  CONSTRAINT `PK_consent_group` PRIMARY KEY (`ConsentGroupID`),
  CONSTRAINT `UK_consent_group_Name` UNIQUE KEY `Name` (`Name`),
  CONSTRAINT `UK_consent_group_Label` UNIQUE KEY `Label` (`Label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `consent_group` (`ConsentGroupID`, `Name`, `Label`) VALUES ('1', 'main_consent', 'Main consent');

ALTER TABLE `consent` ADD `ConsentGroupID` integer unsigned NOT NULL DEFAULT 1;
ALTER TABLE `consent` ADD CONSTRAINT `FK_consent_ConsentGroupID` FOREIGN KEY (`ConsentGroupID`) REFERENCES `consent_group` (`ConsentGroupID`) ON DELETE RESTRICT ON UPDATE CASCADE;
