DROP TABLE IF EXISTS `radiology_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `radiology_review` (
  `CommentID` varchar(255) NOT NULL DEFAULT '',
  `UserID` varchar(255) DEFAULT NULL,
  `Examiner` varchar(255) DEFAULT NULL,
  `Data_entry_completion_status` enum('Incomplete','Complete') NOT NULL DEFAULT 'Incomplete',
  `Date_taken` date DEFAULT NULL,
  `Candidate_Age` varchar(255) DEFAULT NULL,
  `Window_Difference` int(11) DEFAULT NULL,
  `Scan_done` enum('no','yes','not_answered') DEFAULT NULL,
  `MRI_date` date DEFAULT NULL,
  `MRI_date_status` enum('not_answered') DEFAULT NULL,
  `Review_date` date DEFAULT NULL,
  `Review_date_status` enum('not_answered') DEFAULT NULL,
  `Review_results` enum('normal','abnormal','atypical','not_answered') DEFAULT NULL,
  `abnormal_atypical_exculsionary` enum('exclusionary','non_exclusionary','not_answered') DEFAULT NULL,
  `Incidental_findings` text,
  `Incidental_findings_status` enum('not_answered') DEFAULT NULL,
  PRIMARY KEY (`CommentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

