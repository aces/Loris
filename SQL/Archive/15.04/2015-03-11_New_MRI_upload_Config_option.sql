INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'MRIUploadIncomingPath', '"Path to the Directory of Uploaded Scans', 1, 0, 'text', ID, 'MRI-Upload Directory', 7 FROM ConfigSettings WHERE Name="paths";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/MRI-Upload/" FROM ConfigSettings WHERE Name="MRIUploadIncomingPath";
