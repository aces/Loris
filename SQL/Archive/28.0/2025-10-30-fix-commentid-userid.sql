SET FOREIGN_KEY_CHECKS = 0;

-- ======================================================
-- Fix `CommentID` in `flag` table
-- ======================================================
ALTER TABLE `flag`
MODIFY `CommentID` VARCHAR(255) NOT NULL;

-- ======================================================
-- Fix `CommentID` and `userID` in `flag_editors` table
-- ======================================================
ALTER TABLE `flag_editors`
MODIFY `CommentID` VARCHAR(255) NOT NULL,
MODIFY `userID` INT(10) UNSIGNED NOT NULL;

SET FOREIGN_KEY_CHECKS = 1;
