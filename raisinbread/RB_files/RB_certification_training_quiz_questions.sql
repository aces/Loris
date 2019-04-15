SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `certification_training_quiz_questions`;
LOCK TABLES `certification_training_quiz_questions` WRITE;
INSERT INTO `certification_training_quiz_questions` (`ID`, `TestID`, `Question`, `OrderNumber`) VALUES (1,2,'What does BMI stand for?',1);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
