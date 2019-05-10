SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `certification_training_quiz_answers`;
LOCK TABLES `certification_training_quiz_answers` WRITE;
INSERT INTO `certification_training_quiz_answers` (`ID`, `QuestionID`, `Answer`, `Correct`, `OrderNumber`) VALUES (1,1,'Body Mass Index',1,1);
INSERT INTO `certification_training_quiz_answers` (`ID`, `QuestionID`, `Answer`, `Correct`, `OrderNumber`) VALUES (2,1,'Boots Mice Igloos',0,2);
INSERT INTO `certification_training_quiz_answers` (`ID`, `QuestionID`, `Answer`, `Correct`, `OrderNumber`) VALUES (3,1,'Bagel Moose Icecube',0,3);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
