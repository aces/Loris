INSERT IGNORE INTO `user_perm_rel` (userID, permID) SELECT DISTINCT 1, permID FROM permissions;
