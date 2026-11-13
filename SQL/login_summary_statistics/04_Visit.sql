SELECT 
    IFNULL(Project.Name, 'All Projects') as ProjectName, 
    COUNT(s.ID) AS count
    FROM session s
    JOIN Project ON (s.ProjectID = Project.ProjectID)
WHERE Project.showSummaryOnLogin = 1
GROUP BY Project.Name WITH ROLLUP
