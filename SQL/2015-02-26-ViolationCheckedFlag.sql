-- Add tables
--
-- Table structure for table `violations_resolved`
--
CREATE TABLE `violations_resolved` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `ExtID` bigint(20) NOT NULL,
  `TypeTable` varchar(255) DEFAULT NULL,
  `User` varchar(255) DEFAULT NULL,
  `ChangeDate` date DEFAULT NULL,
  `Resolved` enum('0','1') DEFAULT '1',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
