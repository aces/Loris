CREATE TABLE `certification_training_quiz_popups` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `QuestionID` int(10) unsigned NOT NULL,
  `PopupID` int(2) unsigned NOT NULL,
  `Popup` text NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_certification_training_quiz_popups` (`QuestionID`),
  CONSTRAINT `FK_certification_training_quiz_popups` FOREIGN KEY (`QuestionID`) REFERENCES `certification_training_quiz_questions` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE certification_training_quiz_answers ADD PopupID int(2) unsigned;