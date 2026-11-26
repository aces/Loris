ALTER TABLE issues_history CHANGE `fieldChanged` `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','CandidateID','candID','description','watching','instrument') NOT NULL DEFAULT 'comment';

UPDATE issues_history SET `fieldChanged` = 'CandidateID' WHERE `fieldChanged` = 'candID';

ALTER TABLE issues_history CHANGE `fieldChanged` `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','CandidateID', 'description','watching','instrument') NOT NULL DEFAULT 'comment';

UPDATE issues_history
JOIN candidate ON issues_history.newValue = candidate.CandID
SET issues_history.newValue = candidate.ID WHERE issues_history.fieldChanged = 'CandidateID';
