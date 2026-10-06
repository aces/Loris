CREATE TABLE `ConfigMappings` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ConfigID` int(11) NOT NULL,
  `Value` text,
  PRIMARY KEY (`ID`),
  KEY `fk_ConfigMappings_ConfigID_idx` (`ConfigID`),
  CONSTRAINT `fk_ConfigMappings_ConfigID`
  FOREIGN KEY (`ConfigID`)
    REFERENCES `Config` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `ConfigSettings`
  MODIFY COLUMN `DataType` ENUM('text','boolean','email','instrument','textarea','scan_type','date_format','lookup_center','path','web_path', 'log_level','mapping') DEFAULT NULL;
