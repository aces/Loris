
UPDATE ConfigSettings SET Description='Name of the Perl MRI config file (stored in dicom-archive/.loris_mri/)', Label='Name of the Perl MRI config file' WHERE Name="MriConfigFile";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'MriPythonConfigFile', 'Name of the Python MRI config file (stored in dicom-archive/.loris_mri/)', 1, 0, 'text', ID, 'Name of the Python MRI config file', 25 FROM ConfigSettings WHERE Name="imaging_pipeline";

INSERT INTO Config (ConfigID, Value) SELECT ID, 'database_config.py' FROM ConfigSettings cs WHERE cs.Name="mriPythonConfigFile";
