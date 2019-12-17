SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `users`;
LOCK TABLES `users` WRITE;
INSERT INTO `users` (`ID`, `UserID`, `Password`, `Real_name`, `First_name`, `Last_name`, `Degree`, `Position_title`, `Institution`, `Department`, `Address`, `City`, `State`, `Zip_code`, `Country`, `Phone`, `Fax`, `Email`, `Privilege`, `PSCPI`, `DBAccess`, `Active`, `Password_hash`, `Password_expired`, `Pending_approval`, `Doc_Repo_Notifications`, `language_preference`, `active_from`, `active_to`) VALUES (1,'admin',NULL,'Admin account','Admin','account',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'admin@example.com',0,'N','','Y','$2y$10$Rk0KgzjXv1c.6uix3/Wm4esr1CL3SH3Sfve/jSDn1cIBcjsXYC.4m',0,'N','N',NULL,NULL,NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
