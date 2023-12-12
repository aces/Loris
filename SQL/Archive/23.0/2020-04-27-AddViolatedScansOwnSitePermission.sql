INSERT INTO permissions (code, description, categoryID) VALUES
    ('violated_scans_view_ownsite','Violated Scans: View Violated Scans from own site','2');
    
INSERT INTO user_perm_rel VALUES
    (
     (SELECT ID FROM users WHERE UserID='admin'),
     (SELECT permID FROM permissions WHERE code='violated_scans_view_ownsite')
    );
