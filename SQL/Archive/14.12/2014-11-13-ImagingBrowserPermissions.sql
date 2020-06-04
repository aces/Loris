UPDATE permissions SET code="imaging_browser_qc", description="Edit imaging browser QC status" WHERE code="mri_feedback";
INSERT INTO permissions (code, description, categoryID) VALUES ("imaging_browser_view_site",     "View own-site Imaging Browser pages",  2);
INSERT INTO permissions (code, description, categoryID) VALUES ("imaging_browser_view_allsites", "View all-sites Imaging Browser pages", 2);
INSERT INTO user_perm_rel (userID, permID) SELECT 1, permID FROM permissions WHERE code="imaging_browser_view_site";
INSERT INTO user_perm_rel (userID, permID) SELECT 1, permID FROM permissions WHERE code="imaging_browser_view_allsites";
