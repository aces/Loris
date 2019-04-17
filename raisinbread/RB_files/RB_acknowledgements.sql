SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `acknowledgements`;
LOCK TABLES `acknowledgements` WRITE;
INSERT INTO `acknowledgements` (`ID`, `ordering`, `full_name`, `citation_name`, `affiliations`, `degrees`, `roles`, `start_date`, `end_date`, `present`) VALUES (1,'1','Stella Lee','Stella\'s Citation','mcgill','bachelors','investigators','2016-12-31',NULL,'Yes');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
