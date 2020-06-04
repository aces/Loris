SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `subproject`;
LOCK TABLES `subproject` WRITE;
INSERT INTO `subproject` (`SubprojectID`, `title`, `useEDC`, `WindowDifference`, `RecruitmentTarget`) VALUES (1,'Stale',0,'optimal',100);
INSERT INTO `subproject` (`SubprojectID`, `title`, `useEDC`, `WindowDifference`, `RecruitmentTarget`) VALUES (2,'Fresh',0,'optimal',100);
INSERT INTO `subproject` (`SubprojectID`, `title`, `useEDC`, `WindowDifference`, `RecruitmentTarget`) VALUES (3,'Low Yeast',1,'battery',100);
INSERT INTO `subproject` (`SubprojectID`, `title`, `useEDC`, `WindowDifference`, `RecruitmentTarget`) VALUES (4,'High Yeast',1,'battery',25);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
