INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'docRepoPath', 'File path to folder where document repository files will be uploaded to and downloaded from.', 1, 0, 'web_path', ID, 'Document Repository file folder.', 27 FROM ConfigSettings WHERE Name="paths";
INSERT INTO Config (ConfigID, Value) SELECT ID, '/data/document_repository_uploads/'  FROM ConfigSettings WHERE Name="docRepoPath";


INSERT INTO `permissions` VALUES (56,'document_repository_edit','Upload and edit files in Document Repository','2');
