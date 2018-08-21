-- Add ComputeDeepQC as a configurable option
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'ComputeDeepQC', 'Determines whether a call is made from LORIS-MRI to the DeepQC app for automatic QC prediction', 1, 0, 'boolean', ID, 'Compute automatic QC', 18 FROM ConfigSettings WHERE Name="imaging_pipeline";

-- default imaging_pipeline settings
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings cs WHERE cs.Name="ComputeDeepQC";