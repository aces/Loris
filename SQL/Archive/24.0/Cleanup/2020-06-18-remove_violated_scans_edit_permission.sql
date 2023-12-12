DELETE FROM user_perm_rel WHERE permID IN (SELECT permID from permissions where code='violated_scans_edit');

DELETE FROM permissions where code='violated_scans_edit';
