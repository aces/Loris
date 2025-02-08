UPDATE permissions SET code = 'issue_tracker_own_issue', description = 'See/Edit/Comment and Close on Own Issues' 
WHERE code = 'issue_tracker_reporter';
UPDATE permissions SET code = 'issue_tracker_all_issue', description = 'See/Edit/Comment on all Issues' 
WHERE code = 'issue_tracker_developer';

INSERT INTO permissions (code, description, moduleID, categoryID) VALUES
('issue_tracker_site_issue','See/Edit/Comment on Own Site Issues',(SELECT ID FROM modules WHERE Name = 'issue_tracker'),2),
('issue_tracker_close_site_issue','Close Own Site Issues',(SELECT ID FROM modules WHERE Name = 'issue_tracker'),2),
('issue_tracker_close_all_issue','Close all Issues',(SELECT ID FROM modules WHERE Name = 'issue_tracker'),2);
