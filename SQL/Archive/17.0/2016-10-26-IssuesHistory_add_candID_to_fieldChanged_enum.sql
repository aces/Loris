ALTER TABLE `issues_history`
  CHANGE COLUMN `fieldChanged` `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','candID') NOT NULL DEFAULT 'comment';
