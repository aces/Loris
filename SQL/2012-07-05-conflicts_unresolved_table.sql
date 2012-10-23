CREATE TABLE `conflicts_unresolved` (
      `TableName` varchar(255) NOT NULL,
      `ExtraKeyColumn` varchar(255) DEFAULT NULL,
      `ExtraKey1` varchar(255) NOT NULL,
      `ExtraKey2` varchar(255) NOT NULL,
      `FieldName` varchar(255) NOT NULL,
      `CommentId1` varchar(255) NOT NULL,
      `Value1` varchar(255) DEFAULT NULL,
      `CommentId2` varchar(255) NOT NULL,
      `Value2` varchar(255) DEFAULT NULL,
      PRIMARY KEY (`TableName`,`CommentId1`,`CommentId2`,`ExtraKey1`,`ExtraKey2`,`FieldName`)
);
CREATE TABLE `conflicts_resolved` (
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
      PRIMARY KEY (`TableName`,`CommentId1`,`CommentId2`,`ExtraKey1`,`ExtraKey2`,`FieldName`)
);
