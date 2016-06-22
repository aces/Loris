-- Create a permission for Genomic file upload
INSERT INTO permissions (code, description, categoryID) VALUE ('genomic_data_manager', 'Manage the genomic files', 2);
-- Give the permission to the admin user
INSERT INTO user_perm_rel (userID, permID) VALUES (1, (select permID from permissions where lower(code) = 'genomic_data_manager'));
