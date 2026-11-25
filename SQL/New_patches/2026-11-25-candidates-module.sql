INSERT INTO modules (Name, Active)
SELECT 'candidates', MAX(Active)
FROM modules
WHERE Name IN ('candidate_list', 'new_profile', 'candidate_profile', 'candidate_parameters');

UPDATE permissions
SET moduleID = (SELECT ID FROM modules WHERE Name = 'candidates')
WHERE moduleID IN (
    SELECT ID FROM modules
    WHERE Name IN ('candidate_list', 'new_profile', 'candidate_profile', 'candidate_parameters')
);

UPDATE issues
SET module = (SELECT ID FROM modules WHERE Name = 'candidates')
WHERE module IN (
    SELECT ID FROM modules
    WHERE Name IN ('candidate_list', 'new_profile', 'candidate_profile', 'candidate_parameters')
);

UPDATE policies
SET ModuleID = (SELECT ID FROM modules WHERE Name = 'candidates')
WHERE ModuleID IN (
    SELECT ID FROM modules
    WHERE Name IN ('candidate_list', 'new_profile', 'candidate_profile', 'candidate_parameters')
);

UPDATE dataquery_queries
SET Query = REPLACE(Query, '"module":"candidate_parameters"', '"module":"candidates"')
WHERE Query LIKE '%"module":"candidate_parameters"%';

DELETE FROM modules
WHERE Name IN ('candidate_list', 'new_profile', 'candidate_profile', 'candidate_parameters');
