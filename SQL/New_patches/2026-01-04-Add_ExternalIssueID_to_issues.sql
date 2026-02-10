-- Add ExternalIssueID column to issues table
-- See: https://github.com/aces/Loris/issues/9795
-- This allows administrators to link internal LORIS issues to external issue trackers (e.g., GitHub, Jira)

ALTER TABLE `issues` ADD COLUMN `externalIssueID` varchar(255) DEFAULT NULL AFTER `description`;

-- Add permission to view/edit external issue ID
INSERT INTO `permissions` (code, description, moduleID, categoryID)
SELECT 'issue_tracker_external_id', 'Issues - View External Issue ID', ID, 2
FROM modules WHERE Name = 'issue_tracker';

-- Grant permission to admin user
INSERT INTO user_perm_rel (userID, permID)
SELECT u.ID, p.permID
FROM users u
JOIN permissions p ON p.code = 'issue_tracker_external_id'
WHERE u.UserID = 'admin';

-- Add externalIssueID to issues_history fieldChanged enum
ALTER TABLE `issues_history` 
MODIFY COLUMN `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','candidateID','description','watching','instrument','externalIssueID') NOT NULL DEFAULT 'comment';
