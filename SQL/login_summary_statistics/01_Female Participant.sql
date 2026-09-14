SELECT 
    IFNULL(Project.Name, 'All Projects') as ProjectName, 
    COUNT(DISTINCT c.CandID) AS count
    FROM candidate c
    JOIN Project ON c.RegistrationProjectID = Project.ProjectID
WHERE Project.showSummaryOnLogin = 1
    AND c.Sex = 'Female'
    AND Entity_type = 'Human'
GROUP BY Project.Name WITH ROLLUP