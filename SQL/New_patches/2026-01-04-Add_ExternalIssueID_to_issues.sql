ALTER TABLE `issues` ADD COLUMN `externalIssueID` varchar(255) DEFAULT NULL AFTER `description`;

INSERT INTO `permissions` (code, description, moduleID, categoryID)
SELECT 'issue_tracker_external_id', 'Issues - External Issue ID', ID, 2
FROM modules WHERE Name = 'issue_tracker';

INSERT INTO user_perm_rel (userID, permID)
SELECT u.ID, p.permID
FROM users u
JOIN permissions p ON p.code = 'issue_tracker_external_id'
WHERE u.UserID = 'admin';

ALTER TABLE `issues_history`
MODIFY COLUMN `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','candidateID','description','watching','instrument','externalIssueID') NOT NULL DEFAULT 'comment';
