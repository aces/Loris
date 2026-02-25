CREATE TABLE `flag_editors` (
  `userID` int(10) unsigned NOT NULL default '0',
  `CommentID` VARCHAR(255) NOT NULL default '',
  `editDate` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`userID`,`CommentID`),
  KEY `FK_flag_editors_2` (`CommentID`),
  CONSTRAINT `FK_flag_editors_2`
  FOREIGN KEY (`CommentID`)
    REFERENCES `flag` (`CommentID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_flag_editors_1`
  FOREIGN KEY (`userID`)
    REFERENCES `users` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO flag_editors (userID, CommentID)
SELECT users.ID, CommentID from flag JOIN users ON flag.UserID = users.UserID;

ALTER TABLE flag DROP COLUMN UserID;