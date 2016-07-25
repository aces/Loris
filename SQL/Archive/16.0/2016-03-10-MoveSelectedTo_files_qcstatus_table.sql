-- ALTER files_qcstatus table to add a Selected column
ALTER TABLE files_qcstatus ADD COLUMN Selected VARCHAR(255);

-- UPDATE the Selected column of the files_qcstatus table with values stored in the parameter_file table for the Selected
UPDATE files_qcstatus AS fq, parameter_file AS pf, parameter_type AS pt SET fq.Selected=pf.Value WHERE fq.FileID=pf.FileID AND pf.ParameterTypeID=pt.ParameterTypeID AND Name="Selected";

-- WARNING: be sure the two queries above worked before running the delete statement 
-- Remove all Selected values from parameter_file
-- DELETE FROM parameter_file WHERE ParameterTypeID=(SELECT ParameterTypeID FROM parameter_type WHERE Name='Selected');
-- DELETE FROM parameter_type WHERE Name="Selected";
