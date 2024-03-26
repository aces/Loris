-- NOTE: This SQL patch follows up the running of single use tool `tools/single_use/Convert_LorisMenuID_to_ModuleID.php`
-- that was necessary to upgrade the `issues` table from LORIS version 22 to version 23. The tool forgot
-- to include an upgrade of the `issues_history` table, which is now tackled by this SQL patch.

-- delete from issues_history any orphaned module IDs
DELETE FROM issues_history WHERE fieldChanged='module' AND issueID IN (SELECT issueID FROM issues WHERE module IS NULL);
-- set issues history module ID to correct moduleID, replacing old LorisMenu ID
UPDATE issues_history ih SET newValue=(SELECT i.module FROM issues i WHERE i.issueID=ih.issueID) WHERE fieldChanged='module';
