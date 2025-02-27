CREATE TABLE `test_names_multilingual` (
	`ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
	`Test_name` varchar(255) NOT NULL,
	`Full_name` varchar(255) NOT NULL,
	`LanguageID` int(10) unsigned NOT NULL,
	PRIMARY KEY (`ID`),
	KEY `FK_test_names_multilingual_1` (`Test_name`),
	CONSTRAINT `FK_test_names_multilingual_1` FOREIGN KEY (`Test_name`) REFERENCES `test_names` (`Test_name`),
	KEY `FK_test_names_multilingual_2` (`LanguageID`),
	CONSTRAINT `FK_test_names_multilingual_2` FOREIGN KEY (`LanguageID`) REFERENCES `language` (`language_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

UPDATE session SET LanguageID='1' WHERE LanguageID IS NULL;
