ALTER TABLE `Project` ADD COLUMN `Alias` char(4) DEFAULT NULL AFTER `Name`;
UPDATE Project SET Alias=UPPER(LEFT(Name,4)) WHERE Alias IS NULL;
ALTER TABLE `Project` CHANGE COLUMN `Alias` `Alias` char(4) NOT NULL;
