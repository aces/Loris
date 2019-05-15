DELETE cs, c FROM ConfigSettings cs JOIN Config c ON c.ConfigID=cs.ID WHERE cs.Name='useProjects';

-- if Project table is empty, add default 'loris' project
INSERT INTO Project (Name)
SELECT 'loris'
WHERE NOT EXISTS (SELECT * FROM Project);

-- associate all subprojects to the loris project by default if project table was empty
INSERT IGNORE INTO Project (ProjectID, Name)
  (SELECT * FROM
     (SELECT min(ProjectID), 'loris' FROM Project AS q1)
  AS q2);

-- if the loris project was added, set all candidates to that default project
UPDATE candidate SET ProjectID=(SELECT ProjectID FROM Project WHERE Name='loris') WHERE ProjectID IS NULL AND Entity_type='Human';
