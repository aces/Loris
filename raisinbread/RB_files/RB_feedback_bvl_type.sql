SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `feedback_bvl_type`;
LOCK TABLES `feedback_bvl_type` WRITE;
INSERT INTO `feedback_bvl_type` (`Feedback_type`, `Name`, `Description`) VALUES (3,'Input','Input Errors');
INSERT INTO `feedback_bvl_type` (`Feedback_type`, `Name`, `Description`) VALUES (4,'Scoring','Scoring Errors');
INSERT INTO `feedback_bvl_type` (`Feedback_type`, `Name`, `Description`) VALUES (5,'Other','Other');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
