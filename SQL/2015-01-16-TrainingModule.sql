CREATE TABLE `certification_training` (
    `ID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `TestID` int(10) unsigned NOT NULL,
    `Title` varchar(255) NOT NULL,
    `Content` text,
    `TrainingType` enum('text', 'video', 'quiz'),
    `OrderNumber` INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_certification_training` FOREIGN KEY (`TestID`) REFERENCES `test_names` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;