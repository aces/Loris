SELECT 
    IFNULL(Project.Name, 'All Projects') as ProjectName, 
    COUNT(DISTINCT TestID) AS count
    FROM flag f
    JOIN session s ON s.ID = f.SessionID
    JOIN Project ON s.ProjectID = Project.ProjectID
WHERE Project.showSummaryOnLogin = 1
GROUP BY Project.Name WITH ROLLUP;