--
-- Table structure for table `user_login_history`
--
DROP TABLE IF EXISTS `user_login_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_login_history` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `UserID` varchar(255) NOT NULL DEFAULT '',
  `Success` enum('Y','N') NOT NULL DEFAULT 'Y',
  `Failcode` varchar(2) DEFAULT NULL,
  `Fail_detail` varchar(255) DEFAULT NULL,
  `Login_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `IP_address` varchar(255) DEFAULT NULL,
  `Page_requested` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=92 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
