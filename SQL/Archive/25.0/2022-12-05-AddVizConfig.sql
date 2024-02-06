-- Adds the option to toggle the EEG Browser visualization components (disabled by default).
INSERT INTO ConfigSettings
  (
    Name,
    Description,
    Visible,
    AllowMultiple,
    DataType,
    Parent,
    Label,
    OrderNumber
  )
  SELECT
    'useEEGBrowserVisualizationComponents',
    'Whether to enable the visualization components on the EEG Browser module',
    1,
    0,
    'boolean',
    ID,
    'Enable the EEG Browser components',
    4
  FROM
    ConfigSettings
  WHERE
    Name="gui";

INSERT INTO Config (ConfigID, Value) SELECT ID, 'false' FROM ConfigSettings WHERE Name="useEEGBrowserVisualizationComponents";
