SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `test_names_multilingual`;
LOCK TABLES `test_names_multilingual` WRITE;
INSERT INTO `test_names_multilingual` (`ID`, `Test_name`, `Full_name`, `LanguageID`) VALUES (1,'radiology_review','Formulaire d\'examen radiologique',2);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
