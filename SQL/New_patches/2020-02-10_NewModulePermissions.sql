INSERT INTO permissions (code,description,categoryID) VALUES
('imaging_quality_control_view','Imaging Quality Control: View module',(SELECT ID FROM permissions_category WHERE Description='Permission'));
INSERT INTO permissions (code,description,categoryID) VALUES
('behavioural_quality_control_view','Behavioural Quality Control: View module',(SELECT ID FROM permissions_category WHERE Description='Permission'));
INSERT INTO permissions (code,description,categoryID) VALUES
('survey_accounts_view','Survey Accounts: View module',(SELECT ID FROM permissions_category WHERE Description='Permission'));
