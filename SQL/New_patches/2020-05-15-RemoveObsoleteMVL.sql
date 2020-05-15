-- -----------------------------------------------------------------------------------
-- When you set the Caveat flag of a scan to true in the imaging browser, a record
-- is created in table mri_violations_log to indicate that there is a manual caveat 
-- for that scan. If you subsequently set the Caveat back to false, this record is not
-- delete. This PR deletes those obsolete entries in table mri_violations_log
-- -----------------------------------------------------------------------------------

DELETE mvl
FROM mri_violations_log AS mvl
WHERE mvl.Header LIKE 'Manual Caveat Set by%'
AND (
    SELECT f.Caveat
    FROM files f
    WHERE f.File = mvl.MincFile
    AND f.SeriesUID = mvl.SeriesUID
) = 0;

-- ----------------------------------------------------------------------------------
-- The Caveat column of table files is used to indicate whether a file (scan) has
-- a manual caveat or a caveat that was created by the MRI pipeline. When a scan has
-- both types of caveat and you set the manual caveat to false in the imaging browser,
-- the value of the Caveat column will be set to 0. This is a bug, since the scan still
-- has a caveat set by the MRI pipeline associated to it.
-- This patch will correct those Caveat values that are set to 0 when they should have
-- a value of 1.
-- ---------------------------------------------------------------------------------------
UPDATE files f
SET f.Caveat=1
WHERE f.Caveat=0
AND EXISTS (
    SELECT 1
    FROM mri_violations_log mvl
    JOIN parameter_type pt
      ON (pt.Name=mvl.Header)
    JOIN parameter_file pf
      ON (pf.ParameterTypeID=pt.ParameterTypeID)
    WHERE mvl.SeriesUID = f.SeriesUID
    AND pf.FileID = f.FileID
    AND pf.Value = mvl.Value
);
