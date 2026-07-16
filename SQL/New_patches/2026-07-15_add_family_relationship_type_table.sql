CREATE TABLE `family_relationship_type` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Label` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Extract the values from the existing enum for each project (limitation: every relationship_type present in code, hardcoded in js is assumed to present in the enum).
SET @enum_list = (
    SELECT SUBSTRING(
        COLUMN_TYPE,
        6,
        CHAR_LENGTH(COLUMN_TYPE) - 6
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'family'
      AND COLUMN_NAME = 'Relationship_type'
);

SET @s = CONCAT(
    'INSERT INTO family_relationship_type (`Name`) VALUES (',
    REPLACE(@enum_list, ',', '),('),
    ');'
);

PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Populate labels
UPDATE family_relationship_type
SET Label = CONCAT(
    UPPER(LEFT(REPLACE(Name, '_', ' '), 1)),
    SUBSTRING(REPLACE(Name, '_', ' '), 2)
);

ALTER TABLE `family`
ADD COLUMN `Relationship_type_id` int(10) unsigned DEFAULT NULL;

-- Convert existing enum values to the new corresponding integer values (ID of the family_relationship_type table).
UPDATE `family` f
INNER JOIN `family_relationship_type` frt
    ON frt.`Name` = f.`Relationship_type`
SET f.`Relationship_type_id` = frt.`ID`;

ALTER TABLE `family`
DROP COLUMN `Relationship_type`;

ALTER TABLE `family`
ADD CONSTRAINT `FK_family_relationship_type_1`
FOREIGN KEY (`Relationship_type_id`)
REFERENCES `family_relationship_type`(`ID`);
