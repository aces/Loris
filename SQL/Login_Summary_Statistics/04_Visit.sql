SELECT 
    IFNULL(Project.Name, 'All Projects') as ProjectName, 
    COUNT(c.CandID) AS count
    FROM candidate c
    JOIN session s ON (c.ID=s.CandidateID)
    JOIN Project ON s.ProjectID = Project.ProjectID
WHERE Project.showSummaryOnLogin = 1
GROUP BY Project.Name WITH ROLLUP
