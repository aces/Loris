CREATE TABLE `help_link` (
  `helpID` int(10) unsigned NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`helpID`,`url`),
  CONSTRAINT `FK_help_link` FOREIGN KEY (`helpID`) REFERENCES `help` (`helpID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

