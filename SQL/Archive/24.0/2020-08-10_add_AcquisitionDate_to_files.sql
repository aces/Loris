
ALTER TABLE files ADD COLUMN `AcquisitionDate` date DEFAULT NULL;

UPDATE 
  files f, 
  parameter_file pf, 
  parameter_type pt
SET 
  f.AcquisitionDate=pf.Value
WHERE
  f.FileID=pf.FileID 
  AND pf.ParameterTypeID=pt.ParameterTypeID 
  AND pt.Name='acquisition_date';
