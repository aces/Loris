ALTER TABLE `issues`
    ADD `instrument` varchar(255) DEFAULT NULL
    AFTER `category`;

ALTER TABLE `issues_history`
    MODIFY `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','candID', 'description','instrument') NOT NULL DEFAULT 'comment';
