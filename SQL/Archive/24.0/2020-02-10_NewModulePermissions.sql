INSERT INTO permissions (code,description,categoryID) VALUES
('imaging_quality_control_view','Imaging Quality Control: View module',(SELECT ID FROM permissions_category WHERE Description='Permission'));
INSERT INTO permissions (code,description,categoryID) VALUES
('behavioural_quality_control_view','Behavioural Quality Control: View module',(SELECT ID FROM permissions_category WHERE Description='Permission'));
INSERT INTO permissions (code,description,categoryID) VALUES
('survey_accounts_view','Survey Accounts: View module',(SELECT ID FROM permissions_category WHERE Description='Permission'));
-- Grant new permission codes to users who had the old ones.
INSERT INTO user_perm_rel SELECT userID, (SELECT permID FROM permissions WHERE code='survey_accounts_view') FROM user_perm_rel WHERE permID=(SELECT permID FROM permissions WHERE code='user_accounts');
INSERT INTO user_perm_rel SELECT userID, (SELECT permID FROM permissions WHERE code='behavioural_quality_control_view') FROM user_perm_rel WHERE permID=(SELECT permID FROM permissions WHERE code='quality_control');
INSERT INTO user_perm_rel SELECT userID, (SELECT permID FROM permissions WHERE code='imaging_quality_control_view') FROM user_perm_rel WHERE permID=(SELECT permID FROM permissions WHERE code='user_accounts');
