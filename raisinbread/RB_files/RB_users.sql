SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `users`;
LOCK TABLES `users` WRITE;
INSERT INTO `users` (`ID`, `UserID`, `Password`, `Real_name`, `First_name`, `Last_name`, `Degree`, `Position_title`, `Institution`, `Department`, `Address`, `City`, `State`, `Zip_code`, `Country`, `Phone`, `Fax`, `Email`, `Privilege`, `PSCPI`, `DBAccess`, `Active`, `Password_hash`, `PasswordChangeRequired`, `Pending_approval`, `Doc_Repo_Notifications`, `language_preference`, `active_from`, `active_to`, `account_request_date`) VALUES (1,'admin',NULL,'Admin account','Admin','account',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'admin@example.com',0,'N','','Y','$2y$10$6pjQ.x5rPY7voNFs2w/eI.pzLL8H/9wPZ98nabvBOEwDBClhK0l1S',0,'N','N',NULL,NULL,NULL,NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
