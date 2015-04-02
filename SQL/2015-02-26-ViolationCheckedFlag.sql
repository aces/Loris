-- Add tables
--
-- Table structure for table `violations_resolved`
--
DROP TABLE IF EXISTS `violations_resolved`;
CREATE TABLE IF NOT EXISTS `violations_resolved` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `hash` varchar(255) NOT NULL,
  `ExtID` bigint(20) NOT NULL,
  `TypeTable` varchar(255),
  `User` varchar(255) DEFAULT NULL,
  `ChangeDate` date DEFAULT NULL,
  `Resolved` enum('0','1','2','3','4','5','6','7','8','9') DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
