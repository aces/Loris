SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `users`;
LOCK TABLES `users` WRITE;
INSERT INTO `users` (`ID`, `UserID`, `Password`, `Real_name`, `First_name`, `Last_name`, `Degree`, `Position_title`, `Institution`, `Department`, `Address`, `City`, `State`, `Zip_code`, `Country`, `Phone`, `Fax`, `Email`, `Privilege`, `PSCPI`, `DBAccess`, `Active`, `Password_hash`, `PasswordChangeRequired`, `TOTPSecret`, `Pending_approval`, `Doc_Repo_Notifications`, `language_preference`, `active_from`, `active_to`, `account_request_date`) VALUES (1,'admin',NULL,'Admin account','Admin','account',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'admin@example.com',0,'N','','Y','$2y$12$Kp6FRQNupQZuPiNWfofdDuxlEPNOLyCf55g0VCRrzJlN2bVEj3Bli',0,NULL,'N','N',NULL,NULL,NULL,NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
