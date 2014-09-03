CREATE TABLE `conflicts_resolved` (
      `ResolvedID` int(10) NOT NULL AUTO_INCREMENT,
      `UserID` varchar(255) NOT NULL,
      `ResolutionTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      `User1` varchar(255) DEFAULT NULL,
      `User2` varchar(255) DEFAULT NULL,
      `TableName` varchar(255) NOT NULL,
      `ExtraKeyColumn` varchar(255) DEFAULT NULL,
      `ExtraKey1` varchar(255) NOT NULL DEFAULT '',
      `ExtraKey2` varchar(255) NOT NULL DEFAULT '',
      `FieldName` varchar(255) NOT NULL,
      `CommentId1` varchar(255) NOT NULL,
      `CommentId2` varchar(255) NOT NULL,
      `OldValue1` varchar(255) DEFAULT NULL,
      `OldValue2` varchar(255) DEFAULT NULL,
      `NewValue` varchar(255) DEFAULT NULL,
      `ConflictID` int(10) DEFAULT NULL,
      PRIMARY KEY (`ResolvedID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
