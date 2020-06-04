ALTER TABLE `session` 
CHANGE COLUMN `CenterID` `CenterID` INTEGER UNSIGNED NOT NULL,
CHANGE COLUMN `Visit_label` `Visit_label` varchar(255) NOT NULL;