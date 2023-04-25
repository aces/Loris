-- delete from issues_history any orphaned module IDs
DELETE FROM issues_history WHERE fieldChanged='module' AND issueID IN (SELECT issueID FROM issues WHERE module IS NULL);
-- set issues history module ID to correct moduleID, replacing old LorisMenu ID
UPDATE issues_history ih SET newValue=(SELECT i.module FROM issues i WHERE i.issueID=ih.issueID) WHERE fieldChanged='module';
