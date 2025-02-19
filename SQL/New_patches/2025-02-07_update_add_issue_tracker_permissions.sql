ALTER TABLE permissions CHANGE `action` `action` enum (
      'Close',
      'Create',
      'Create/Edit',
      'Delete',
      'Download',
      'Edit',
      'Edit/Upload',
      'Edit/Upload/Delete',
      'Edit/Upload/Hide',
      'Upload',
      'View', 
      'View/Create',
      'View/Create/Edit',
      'View/Download',
      'View/Edit',
      'View/Edit/Comment',
      'View/Edit/Comment/Close',
      'View/Upload' 
      );

UPDATE permissions SET code = 'issue_tracker_own_issue', description = 'Issues - Own', action = 'View/Edit/Comment/Close'
WHERE code = 'issue_tracker_reporter';
UPDATE permissions SET code = 'issue_tracker_all_issue', description = 'Issues - All Sites', action = 'View/Edit/Comment'
WHERE code = 'issue_tracker_developer';

INSERT INTO permissions (code, description, moduleID, action, categoryID) VALUES
('issue_tracker_site_issue','Issues - Own Sites',(SELECT ID FROM modules WHERE Name = 'issue_tracker'),'View/Edit/Comment',2),
('issue_tracker_close_site_issue','Issues - Own Sites',(SELECT ID FROM modules WHERE Name = 'issue_tracker'),'Close',2),
('issue_tracker_close_all_issue','Issues - All Sites',(SELECT ID FROM modules WHERE Name = 'issue_tracker'),'Close',2);
