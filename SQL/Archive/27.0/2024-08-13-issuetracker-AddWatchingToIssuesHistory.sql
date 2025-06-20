ALTER TABLE `issues_history`
    MODIFY `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','candID', 'description', 'watching') NOT NULL DEFAULT 'comment';
