-- This script put all unique records from LorisMenuPermissions in a 
-- temporary table before adding foreign keys and unique constraint 
-- to the table.
-- It also remove duplicates from LorisMenu table and add unique
-- constraint on Parent and Label column

CREATE TEMPORARY TABLE tmp_lmp AS 
  SELECT DISTINCT MenuId, PermID FROM LorisMenuPermissions;

DELETE FROM LorisMenuPermissions;

ALTER TABLE `LorisMenuPermissions` 
CHANGE COLUMN `MenuID` `MenuID` INT(10) UNSIGNED NOT NULL,
CHANGE COLUMN `PermID` `PermID` INT(10) UNSIGNED NOT NULL,
ADD PRIMARY KEY (`MenuID`, `PermID`);

ALTER TABLE `LorisMenuPermissions` 
ADD CONSTRAINT `fk_LorisMenuPermissions_1`
  FOREIGN KEY (`MenuID`)
  REFERENCES `LorisMenu` (`ID`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_LorisMenuPermissions_2`
  FOREIGN KEY (`PermID`)
  REFERENCES `permissions` (`permID`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

INSERT IGNORE INTO LorisMenuPermissions SELECT MenuID, PermID FROM tmp_lmp;
DROP TABLE tmp_lmp;

-- Remove duplicates in the LorisMenu
DELETE FROM LorisMenu USING LorisMenu, LorisMenu lm1 
  WHERE LorisMenu.ID < lm1.ID AND LorisMenu.Parent = lm1.Parent AND LorisMenu.Label = lm1.Label;

ALTER TABLE `LorisMenu` 
ADD INDEX `fk_LorisMenu_1_idx` (`Parent` ASC),
ADD UNIQUE INDEX `index3` (`Parent` ASC, `Label` ASC);
ALTER TABLE `LorisMenu` 
ADD CONSTRAINT `fk_LorisMenu_1`
  FOREIGN KEY (`Parent`)
  REFERENCES `LorisMenu` (`ID`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

