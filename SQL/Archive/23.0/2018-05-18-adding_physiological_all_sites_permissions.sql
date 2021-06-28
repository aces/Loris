INSERT INTO permissions 
    (
        code, 
        description, 
        categoryID
    ) VALUES (
        'electrophysiology_browser_view_allsites',
        'View all-sites Electrophysiology Browser pages',
        (SELECT ID FROM permissions_category WHERE Description='Permission')
    );

INSERT INTO permissions
    (
        code,
        description,
        categoryID
    ) VALUES (
        'electrophysiology_browser_view_site',
        'View own site Electrophysiology Browser pages',
        (SELECT ID FROM permissions_category WHERE Description='Permission')
    );

INSERT INTO user_perm_rel
    (
      UserID,
      PermID
    ) VALUES (
      (SELECT ID FROM users WHERE UserID='admin'),
      (SELECT permID FROM permissions WHERE code='electrophysiology_browser_view_allsites')
    );

INSERT INTO user_perm_rel
    (
      UserID,
      PermID
    ) VALUES (
      (SELECT ID FROM users WHERE UserID='admin'),
      (SELECT permID FROM permissions WHERE code='electrophysiology_browser_view_site')
    );
