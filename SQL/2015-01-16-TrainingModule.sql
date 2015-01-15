CREATE TABLE `certification_training` (
    `ID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `TestID` int(10) UNSIGNED NOT NULL,
    `Title` varchar(255) NOT NULL,
    `Content` text,
    `TrainingType` enum('text', 'video', 'quiz') NOT NULL,
    `OrderNumber` INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_certification_training` FOREIGN KEY (`TestID`) REFERENCES `test_names` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `certification_training_quiz_questions` (
    `ID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `TestID` int(10) unsigned NOT NULL,
    `Question` varchar(255) NOT NULL,
    `OrderNumber` INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_certification_training_quiz_questions` FOREIGN KEY (`TestID`) REFERENCES `test_names` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `certification_training_quiz_answers` (
    `ID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `QuestionID` INTEGER UNSIGNED NOT NULL,
    `Answer` varchar(255) NOT NULL,
    `Correct` boolean NOT NULL,
    `OrderNumber` INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_certification_training_quiz_answers` FOREIGN KEY (`QuestionID`) REFERENCES `certification_training_quiz_questions` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;