CREATE TABLE `ConfigCategories` (
    `ID` int(11) NOT NULL AUTO_INCREMENT,
    `Name` varchar(255) NOT NULL,
    `Description` varchar(255) DEFAULT NULL,
    `Visible` tinyint(1) DEFAULT '0',
    `Label` varchar(255) DEFAULT NULL,
    `OrderNumber` int(11) DEFAULT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO ConfigCategories (Name, Description, Visible, Label, OrderNumber)
SELECT Name, Description, Visible, Label, OrderNumber
FROM ConfigSettings
WHERE Parent IS NULL AND DataType IS NULL;

ALTER TABLE ConfigSettings
    ADD COLUMN CategoryID int(11) DEFAULT NULL AFTER Parent;

UPDATE ConfigSettings child
JOIN ConfigSettings category_setting ON child.Parent=category_setting.ID
JOIN ConfigCategories category ON category.Name=category_setting.Name
SET child.CategoryID=category.ID,
    child.Parent=NULL
WHERE category_setting.Parent IS NULL AND category_setting.DataType IS NULL;

DELETE FROM ConfigSettings
WHERE Parent IS NULL AND DataType IS NULL;

ALTER TABLE ConfigSettings
    ADD KEY `fk_ConfigSettings_CategoryID_idx` (`CategoryID`),
    ADD CONSTRAINT `fk_ConfigSettings_CategoryID`
        FOREIGN KEY (`CategoryID`)
        REFERENCES `ConfigCategories` (`ID`)
        ON DELETE SET NULL
        ON UPDATE CASCADE;
