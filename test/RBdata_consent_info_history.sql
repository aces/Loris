CREATE TABLE `consent_info_history` (
        `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
        `CandID` int(6) NOT NULL DEFAULT '0',
        `entry_staff` varchar(255) DEFAULT NULL,
        `study_consent` enum('yes','no','not_answered') DEFAULT NULL,
        `study_consent_date` date DEFAULT NULL,
        `study_consent_withdrawal` date DEFAULT NULL,
        `data_entry_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`ID`),
        UNIQUE KEY `ID` (`ID`)
        ) ;
