CREATE TEMPORARY TABLE tmp_lmp AS 
  SELECT DISTINCT MenuId, PermID FROM LorisMenuPermissions;

DELETE FROM LorisMenuPermissions;

ALTER TABLE `LORIS`.`LorisMenuPermissions` 
CHANGE COLUMN `MenuID` `MenuID` INT(10) UNSIGNED NOT NULL ,
CHANGE COLUMN `PermID` `PermID` INT(10) UNSIGNED NOT NULL ,
ADD PRIMARY KEY (`MenuID`, `PermID`);

ALTER TABLE `LORIS`.`LorisMenuPermissions` 
ADD CONSTRAINT `fk_LorisMenuPermissions_1`
  FOREIGN KEY (`MenuID`)
  REFERENCES `LORIS`.`LorisMenu` (`ID`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_LorisMenuPermissions_2`
  FOREIGN KEY (`PermID`)
  REFERENCES `LORIS`.`permissions` (`permID`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

INSERT INTO LorisMenuPermissions SELECT MenuID, PermID FROM tmp_lmp;
DROP tmp_lmp;

ALTER TABLE `LORIS`.`LorisMenu` 
ADD INDEX `fk_LorisMenu_1_idx` (`Parent` ASC),
ADD UNIQUE INDEX `index3` (`Parent` ASC, `Label` ASC);
ALTER TABLE `LORIS`.`LorisMenu` 
ADD CONSTRAINT `fk_LorisMenu_1`
  FOREIGN KEY (`Parent`)
  REFERENCES `LORIS`.`LorisMenu` (`ID`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

