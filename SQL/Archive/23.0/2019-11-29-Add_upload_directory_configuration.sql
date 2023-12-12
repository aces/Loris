INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'documentRepositoryPath', 'Path to uploaded document repository files', 1, 0, 'text', cs1.ID, 'Document Repository Upload Path', MAX(cs2.OrderNumber)+1 FROM ConfigSettings cs1 JOIN ConfigSettings cs2 WHERE cs1.Name="paths" AND cs2.parent=cs1.ID;
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'dataReleasePath', 'Path to uploaded data release files', 1, 0, 'text', cs1.ID, 'Data Release Upload Path', MAX(cs2.OrderNumber)+1 FROM ConfigSettings cs1 JOIN ConfigSettings cs2 WHERE cs1.Name="paths" AND cs2.parent=cs1.ID;

-- For backwards compatibility, check the previous base and default to same folder as previous setting
SELECT Value INTO @base FROM Config c JOIN ConfigSettings cs ON cs.ID=c.ConfigID WHERE cs.Name="base";

INSERT INTO Config (ConfigID, Value) SELECT ID, CONCAT(@base,"modules/document_repository/user_uploads/") FROM ConfigSettings WHERE Name="documentRepositoryPath";
INSERT INTO Config (ConfigID, Value) SELECT ID, CONCAT(@base,"modules/data_release/user_uploads/") FROM ConfigSettings WHERE Name="dataReleasePath";

