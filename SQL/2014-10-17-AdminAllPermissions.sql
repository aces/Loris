INSERT INTO `user_perm_rel` (userID, permID) SELECT DISTINCT 1, permID from permissions;
