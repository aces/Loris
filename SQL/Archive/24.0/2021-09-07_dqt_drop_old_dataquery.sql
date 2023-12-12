-- Store the modules.ID of the dqt module into @dqt
SELECT `ID` FROM `modules` where modules.Name = 'dqt' INTO @dqt;
-- Update moduleID of dataquery_view to be @dqt
UPDATE permissions SET moduleID = @dqt WHERE permissions.code = 'dataquery_view';
-- Delete the old dataquery from modules
DELETE FROM `modules` where modules.Name = 'dataquery';
