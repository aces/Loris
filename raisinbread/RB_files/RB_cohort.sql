SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `cohort`;
LOCK TABLES `cohort` WRITE;
INSERT INTO `cohort` (`CohortID`, `title`, `useEDC`, `WindowDifference`, `RecruitmentTarget`) VALUES (1,'Stale',0,'optimal',100);
INSERT INTO `cohort` (`CohortID`, `title`, `useEDC`, `WindowDifference`, `RecruitmentTarget`) VALUES (2,'Fresh',0,'optimal',100);
INSERT INTO `cohort` (`CohortID`, `title`, `useEDC`, `WindowDifference`, `RecruitmentTarget`) VALUES (3,'Low Yeast',1,'battery',100);
INSERT INTO `cohort` (`CohortID`, `title`, `useEDC`, `WindowDifference`, `RecruitmentTarget`) VALUES (4,'High Yeast',1,'battery',25);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
