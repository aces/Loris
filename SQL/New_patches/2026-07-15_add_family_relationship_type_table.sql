CREATE TABLE `family_relationship_type` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Label` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
)

ALTER TABLE family
MODIFY COLUMN Relationship_type int(10) unsigned DEFAULT NULL;

ALTER TABLE family
ADD CONSTRAINT `FK_family_relationship_type_1`
FOREIGN KEY (`Relationship_type`)
REFERENCES `family_relationship_type`(`ID`);
