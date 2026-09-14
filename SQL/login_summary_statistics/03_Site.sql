SELECT 
    IFNULL(Project.Name, 'All Projects') as ProjectName, 
    COUNT(DISTINCT psc.CenterID) AS count
    FROM psc
    JOIN session s ON s.CenterID = psc.CenterID
    JOIN Project ON s.ProjectID = Project.ProjectID
WHERE Project.showSummaryOnLogin = 1
GROUP BY Project.Name WITH ROLLUP