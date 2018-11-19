-- A table to store the hashed value of passwords that were mistakenly recored
-- in the `history` table. These passwords will not be allowed to be used as
-- LORIS user passwords as they have potentially been compromised.
CREATE TABLE `password_blacklist` (
    `ID` integer unsigned NOT NULL AUTO_INCREMENT,
    `password_hash` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
