SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `certification_training`;
LOCK TABLES `certification_training` WRITE;
INSERT INTO `certification_training` (`ID`, `TestID`, `Title`, `Content`, `TrainingType`, `OrderNumber`) VALUES (1,2,'Description','<p>Participants are asked to enter BMI data.</p>','text',1);
INSERT INTO `certification_training` (`ID`, `TestID`, `Title`, `Content`, `TrainingType`, `OrderNumber`) VALUES (2,2,'Test and Score Sheets','<object data=\"AjaxHelper.php?Module=training&script=getTrainingDoc.php&file=bmi.pdf\" type=\"application/pdf\" width=\"100%\" height=\"500\">alt : <a href=\"AjaxHelper.php?Module=training&script=GetTrainingDoc.php&file=bmi.pdf\">bmi.pdf</a></object>','pdf',2);
INSERT INTO `certification_training` (`ID`, `TestID`, `Title`, `Content`, `TrainingType`, `OrderNumber`) VALUES (3,2,'Quiz',NULL,'quiz',3);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
