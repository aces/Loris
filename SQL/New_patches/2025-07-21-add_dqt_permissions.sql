-- Get module IDs
SELECT `ID` FROM `modules` WHERE modules.Name = 'dqt' INTO @dqtID;
SELECT `ID` FROM `modules` WHERE modules.Name = 'dataquery' INTO @dataqueryID;

-- Duplicate current dataquery_view permission to dqt_view (for legacy)
INSERT INTO `permissions` (code, description, moduleID, categoryID)
SELECT 'dqt_view', CONCAT(`description`, ' (legacy)'), @dqtID, `categoryID`
FROM `permissions`
WHERE permissions.code = 'dataquery_view';

-- Update moduleID for previous permission
UPDATE `permissions` SET moduleID = @dataqueryID
WHERE permissions.code = 'dataquery_view';

-- Get permission IDs
SELECT `permID` FROM `permissions` WHERE permissions.code = 'dqt_view' INTO @dqtPermID;
SELECT `permID` FROM `permissions` WHERE permissions.code = 'dataquery_view' INTO @dataqueryPermID;

-- Duplicate existing perm_perm_action_rel
INSERT INTO `perm_perm_action_rel` (permID, actionID)
SELECT @dqtPermID, actionID
FROM perm_perm_action_rel
WHERE permID = @dataqueryPermID;

-- Duplicate existing user_perm_rel
INSERT INTO `user_perm_rel` (userID, permID)
SELECT userID, @dqtPermID
FROM user_perm_rel
WHERE permID = @dataqueryPermID;


