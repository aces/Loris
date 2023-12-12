INSERT INTO modules (Name, Active) VALUES ('module_manager', 'Y');
INSERT INTO permissions (code, description, categoryID) VALUES('module_manager_view', 'Module Manager: access the module', 2);
INSERT INTO permissions (code, description, categoryID) VALUES('module_manager_edit', 'Module Manager: edit installed modules', 2);
INSERT INTO user_perm_rel(UserID,PermID) VALUES (
    (SELECT ID FROM users WHERE UserID='admin'),
    (SELECT permID FROM permissions WHERE code='module_manager_view')
);
INSERT INTO user_perm_rel(UserID,PermID) VALUES (
    (SELECT ID FROM users WHERE UserID='admin'),
    (SELECT permID FROM permissions WHERE code='module_manager_edit')
);
