WARNINGS;
SET AUTOCOMMIT=0;
SET SQL_NOTES=0;
START TRANSACTION;

SELECT 'Removing unused indexes' as 'Step #1';
ALTER TABLE `help` 
DROP INDEX `content`,
DROP INDEX `topic`;

SELECT 'Droping unused table help_related_links' as 'Step #2';
DROP TABLE help_related_links;

SELECT 'Adding foreign key between Config and ConfigSettings' as 'Step #3';
ALTER TABLE `Config` 
  ADD INDEX `fk_Config_1_idx` (`ConfigID` ASC);
ALTER TABLE `Config` 
  ADD CONSTRAINT `fk_Config_1`
  FOREIGN KEY (`ConfigID`)
    REFERENCES `ConfigSettings` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

SELECT 'Adding foreign key between permissions and permissions_category' as 'Step #4';
ALTER TABLE `permissions` 
  CHANGE COLUMN `categoryID` `categoryID` INT(10) NOT NULL DEFAULT 2;
ALTER TABLE `permissions` 
  ADD INDEX `fk_permissions_1_idx` (`categoryID` ASC);
ALTER TABLE `permissions` 
  ADD CONSTRAINT `fk_permissions_1`
  FOREIGN KEY (`categoryID`)
    REFERENCES `permissions_category` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

SELECT 'COMMIT' as 'Ending with';
COMMIT;
