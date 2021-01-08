CREATE TABLE temp SELECT DISTINCT * FROM publication_users_edit_perm_rel;
DROP TABLE publication_users_edit_perm_rel;
ALTER TABLE temp RENAME publication_users_edit_perm_rel;

ALTER TABLE `publication_users_edit_perm_rel` ADD PRIMARY KEY(`PublicationID`, `UserID`);
