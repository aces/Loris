INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'MINCToolsPath', 'Path to the MINC tools', 1, 0, 'minctools_path', ID, 'Path to the MINC tools', 12 FROM ConfigSettings WHERE Name="paths";
INSERT INTO Config (ConfigID, Value) SELECT ID, "%MINCToolsPath%" FROM ConfigSettings WHERE Name="minctools_path";
