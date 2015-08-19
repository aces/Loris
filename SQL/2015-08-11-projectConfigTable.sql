DROP TABLE IF EXISTS `Project`;
CREATE TABLE `Project` (
    `ProjectID` INT(2) Default NULL,
    `Name` VARCHAR(255) NULL,
    `recruitmentTarget` INT(6) Default NULL,
    PRIMARY KEY (`ProjectID`)
)ENGINE = InnoDB  DEFAULT CHARSET=utf8;
