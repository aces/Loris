ALTER TABLE `permissions` DROP FOREIGN KEY `fk_permissions_1`;
ALTER TABLE `permissions` DROP INDEX `fk_permissions_1_idx`;
ALTER TABLE `permissions` DROP COLUMN `categoryID`;

DROP TABLE `permissions_category`;