ALTER TABLE `issues`
    ADD `description` longtext DEFAULT NULL
    AFTER `category`;

ALTER TABLE `issues_history`
    MODIFY `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','candID', 'description') NOT NULL DEFAULT 'comment';
