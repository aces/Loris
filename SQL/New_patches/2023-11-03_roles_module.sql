
-- ------------------------------------
-- REMOVE PERMISSION CATEGORY TABLE
-- ------------------------------------

-- Update the only 3 `roles` category permissions to `permissions` 
-- update bvl_feedback and data_entry to permission.
UPDATE `permissions`
    SET categoryID = '2'
    WHERE 'code' IN ('superuser', 'bvl_feedback', 'data_entry');

-- delete `permission_category` table
-- `permission_category` only gave the 'permission' or 'role' choice.
-- `role` becoming a new table, this is not needed anymore.
SET foreign_key_checks = 0;
DELETE FROM `permissions_category`;
DROP TABLE `permissions_category`;
ALTER TABLE `permissions` DROP FOREIGN KEY `fk_permissions_1`;
ALTER TABLE `permissions` DROP COLUMN categoryID;
SET foreign_key_checks = 1;
