-- INSERT THE 2 NEW CONFIGs INTO ConfigSettings TABLE
INSERT INTO ConfigSettings
  (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
  SELECT
    'MriConfigFile',
    'Name of the MRI config file (stored in dicom-archive/.loris_mri/)',
    1,
    0,
    'text',
    ID,
    'Name of the MRI config file',
    19
  FROM ConfigSettings
  WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings
  (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
  SELECT
    'EnvironmentFile',
    'Name of the environment file that need to be sourced for the imaging pipeline',
    1,
    0,
    'text',
    ID,
    'Name of the environment file',
    20
  FROM ConfigSettings
  WHERE Name="imaging_pipeline";

-- INSERT DEFAULT NAME FOR THE CONFIG AND ENVIRONMENT FILE
INSERT INTO Config
  (ConfigID, Value)
  SELECT ID, 'prod' FROM ConfigSettings cs WHERE cs.Name="MriConfigFile";
INSERT INTO Config
  (ConfigID, Value)
  SELECT ID, 'environment' FROM ConfigSettings cs WHERE cs.Name="EnvironmentFile";
