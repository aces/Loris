-- Create cached_data_type table to track different types of cached data
CREATE TABLE `cached_data_type` (
    `CachedDataTypeID` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY  (`CachedDataTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create cached_data table to track cached data
CREATE TABLE `cached_data` (
   `CachedDataID` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
   `CachedDataTypeID` INT(10) UNSIGNED NOT NULL,
   `Value` TEXT NOT NULL,
   `LastUpdate` TIMESTAMP NOT NULL
       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY  (`CachedDataID`),
   CONSTRAINT `FK_cached_data_type` FOREIGN KEY (`CachedDataTypeID`)
       REFERENCES `cached_data_type` (`CachedDataTypeID`)
       ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `cached_data_type` (`Name`) SELECT 'projects_disk_space';
