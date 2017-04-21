DROP TABLE IF EXISTS `monitoring`;
CREATE TABLE `monitoring` (
  `CandID` int(6) NOT NULL,
  `visit_label` varchar(255) DEFAULT NULL,
  `monitored` enum('Y','N') NOT NULL DEFAULT 'N',
  `date_monitored` date DEFAULT NULL,
  `monitor_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`CandID`,`Visit_label`),
  CONSTRAINT `FK_monitoring_1` FOREIGN KEY (`monitor_id`) REFERENCES `examiners` (`examinerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `monitoring_history`;
CREATE TABLE `monitoring_history` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `CandID` int(6) NOT NULL,
  `visit_label` varchar(255) DEFAULT NULL,
  `flag` enum('Y','N') NOT NULL DEFAULT 'N',
  `monitored` enum('Y','N') NOT NULL DEFAULT 'N',
  `date_monitored` date DEFAULT NULL,
  `monitor_id` int(10) unsigned DEFAULT NULL,
  `data_entry_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `entry_staff` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_monitoring_history_1` FOREIGN KEY (`entry_staff`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useMonitoring', 'Enable for visual data monitoring by examiner', 1, 0, 'boolean', ID, 'Use Monitoring', 14 FROM ConfigSettings WHERE Name="study";

INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useMonitoring";

