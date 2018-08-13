ALTER TABLE issues_history DROP FOREIGN KEY `fk_issues_comments_1`;
ALTER TABLE issues_history ADD CONSTRAINT `fk_issues_comments_1` FOREIGN KEY (`issueID`) REFERENCES `issues` (`issueID`) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE issues_comments DROP FOREIGN KEY `fk_issue_comments_1`;
ALTER TABLE issues_comments ADD CONSTRAINT `fk_issue_comments_1` FOREIGN KEY (`issueID`) REFERENCES `issues` (`issueID`) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE issues_comments_history DROP FOREIGN KEY `fk_issues_comments_history`;
ALTER TABLE issues_comments_history ADD CONSTRAINT `fk_issues_comments_history` FOREIGN KEY (`issueCommentID`) REFERENCES `issues_comments` (`issueCommentID`) ON DELETE CASCADE ON UPDATE RESTRICT;
