SELECT
   IFNULL(Project.Name, 'All Projects') as ProjectName,
   COUNT(PhysiologicalFileID) AS count
FROM physiological_parameter_file ppf
LEFT JOIN physiological_file USING (PhysiologicalFileID)
LEFT JOIN physiological_output_type USING (PhysiologicalOutputTypeID)
LEFT JOIN Project ON ppf.ProjectID = Project.ProjectID
WHERE (
   ParameterTypeID = (
       SELECT ParameterTypeID
       FROM parameter_type
       WHERE Name = 'RecordingDuration'
   )
) 
-- AND OutputTypeName = 'raw'
AND Project.showSummaryOnLogin = 1
GROUP BY Project.Name WITH ROLLUP