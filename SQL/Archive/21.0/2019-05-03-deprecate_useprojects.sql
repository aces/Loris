DELETE cs, c FROM ConfigSettings cs JOIN Config c ON c.ConfigID=cs.ID WHERE cs.Name='useProjects';

-- if Project table is empty, add default 'loris' project
INSERT INTO Project (Name)
(SELECT 'loris' FROM DUAL
WHERE NOT EXISTS (SELECT * FROM Project));

-- associate all subprojects to the loris project by default if project table was empty
INSERT INTO project_rel (ProjectID,SubprojectID)
SELECT ProjectID, SubprojectID 
FROM Project JOIN subproject 
WHERE Project.Name='loris';

-- if the loris project was added, set all candidates to that default project
UPDATE candidate SET ProjectID=(SELECT ProjectID FROM Project WHERE Name='loris') WHERE ProjectID IS NULL;
