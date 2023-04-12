INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'DownloadPath', 'Where files are downloaded', 1, 0, 'text', ID, 'Downloads', 4 FROM ConfigSettings WHERE Name="paths";

INSERT INTO Config (ConfigID, Value) SELECT ID, "/var/www/loris" FROM ConfigSettings WHERE Name="DownloadPath";
