-- Add issues tab to the Loris Menu
INSERT INTO `LorisMenu` (`ID`, `Parent`, `Label`, `Link`, `Visible`, `OrderNumber`)
VALUES (61, 5, 'Issue Tracker', 'issue_tracker/', NULL, 8);

-- Add user permissions
-- Reporter
INSERT INTO `permissions` (`code`, `description`, `categoryID`)
VALUES ('issue_tracker_reporter', 'Can add a new issue, edit own issue, comment on all', 2);
INSERT IGNORE INTO user_perm_rel (`userID`, `permID`) VALUES (
  (SELECT ID FROM users WHERE UserID = 'admin'), (SELECT permID FROM permissions WHERE code = 'issue_tracker_reporter')
);

-- Developer
INSERT INTO `permissions` (`code`, `description`, `categoryID`)
VALUES ('issue_tracker_developer', 'Can re-assign issues, mark issues as closed, comment on all, edit issues.', 2);
INSERT IGNORE INTO user_perm_rel (`userID`, `permID`) VALUES (
  (SELECT ID FROM users WHERE UserID = 'admin'), (SELECT permID FROM permissions WHERE code = 'issue_tracker_developer')
);

-- Issues Table
CREATE TABLE `issues` (
  `issueID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `reporter` varchar(255) NOT NULL DEFAULT '',
  `assignee` varchar(255) DEFAULT NULL,
  `status` enum('new','acknowledged','feedback','assigned','resolved','closed') NOT NULL DEFAULT 'new',
  `priority` enum('low','normal','high','urgent','immediate') NOT NULL DEFAULT 'low',
  `module` int(10) unsigned DEFAULT NULL,
  `category` enum('Behavioural Instruments','Behavioural Battery','Data Entry','Database Problems','Examiners','SubprojectID/Project/Plan Changes') DEFAULT NULL,
  `dateCreated` datetime DEFAULT NULL,
  `lastUpdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastUpdatedBy` varchar(255) DEFAULT NULL,
  `sessionID` int(10) unsigned DEFAULT NULL,
  `centerID` tinyint(2) unsigned DEFAULT NULL,
  `candID` int(6) DEFAULT NULL,
  PRIMARY KEY (`issueID`),
  KEY `fk_issues_1` (`reporter`),
  KEY `fk_issues_2` (`assignee`),
  KEY `fk_issues_3` (`candID`),
  KEY `fk_issues_4` (`sessionID`),
  KEY `fk_issues_5` (`centerID`),
  KEY `fk_issues_6` (`lastUpdatedBy`),
  KEY `fk_issues_7` (`module`),
  CONSTRAINT `fk_issues_1` FOREIGN KEY (`reporter`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_issues_2` FOREIGN KEY (`assignee`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_issues_3` FOREIGN KEY (`candID`) REFERENCES `candidate` (`CandID`),
  CONSTRAINT `fk_issues_4` FOREIGN KEY (`sessionID`) REFERENCES `session` (`ID`),
  CONSTRAINT `fk_issues_5` FOREIGN KEY (`CenterID`) REFERENCES `psc` (`CenterID`),
  CONSTRAINT `fk_issues_6` FOREIGN KEY (`lastUpdatedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_issues_7` FOREIGN KEY (`module`) REFERENCES `LorisMenu` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--issues_watching table
CREATE TABLE `issues_watching` (
  `userID` varchar(255) NOT NULL DEFAULT '',
  `issueID` int(11) unsigned NOT NULL,
  PRIMARY KEY (`userID`,`issueID`),
  KEY `fk_issues_watching_2` (`issueID`),
  CONSTRAINT `fk_issues_watching_1` FOREIGN KEY (`userID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--issues_history table
CREATE TABLE `issues_history` (
  `issueHistoryID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `newValue` longtext NOT NULL,
  `dateAdded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority') NOT NULL DEFAULT 'comment',
  `issueID` int(11) unsigned NOT NULL,
  `addedBy` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`issueHistoryID`),
  KEY `fk_issues_comments_1` (`issueID`),
  CONSTRAINT `fk_issues_comments_1` FOREIGN KEY (`issueID`) REFERENCES `issues` (`issueID`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

--issues_comments table
CREATE TABLE `issues_comments` (
  `issueCommentID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `issueID` int(11) unsigned NOT NULL,
  `dateAdded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `addedBy` varchar(255) NOT NULL DEFAULT '',
  `issueComment` text NOT NULL,
  PRIMARY KEY (`issueCommentID`),
  KEY `fk_issue_comments_1` (`issueID`),
  CONSTRAINT `fk_issue_comments_1` FOREIGN KEY (`issueID`) REFERENCES `issues` (`issueID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- issues_comments_history
CREATE TABLE `issues_comments_history` (
  `issueCommentHistoryID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `issueCommentID` int(11) unsigned NOT NULL,
  `dateEdited` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `newValue` longtext NOT NULL,
  `editedBy` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`issueCommentHistoryID`),
  KEY `fk_issues_comments_history` (`issueCommentID`),
  CONSTRAINT `fk_issues_comments_history` FOREIGN KEY (`issueCommentID`) REFERENCES `issues_comments` (`issueCommentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- issues_watching
CREATE TABLE `issues_watching` (
  `userID` varchar(255) NOT NULL DEFAULT '',
  `issueID` int(11) unsigned NOT NULL,
  PRIMARY KEY (`userID`,`issueID`),
  KEY `fk_issues_watching_2` (`issueID`),
  CONSTRAINT `fk_issues_watching_1` FOREIGN KEY (`userID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
