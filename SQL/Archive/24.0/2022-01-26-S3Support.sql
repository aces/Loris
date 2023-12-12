INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('aws', 'Settings related to AWS services', 1, 0, 'AWS Settings', 13);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'AWS_S3_Endpoint', 'Endpoint to use for accessing files stored in S3. Endpoint or region are required for S3 support.', 1, 0, 'text', ID, 'AWS S3 Endpoint', 3 FROM ConfigSettings WHERE Name='aws';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'AWS_S3_Region', 'AWS Region to use for accessing files stored in S3. Endpoint or region are required for S3 support.', 1, 0, 'text', ID, 'AWS S3 Region', 3 FROM ConfigSettings WHERE Name='aws';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'AWS_S3_Default_Bucket', 'Default bucket for LORIS to use for accessing files in S3.', 1, 0, 'text', ID, 'AWS S3 Default Bucket', 3 FROM ConfigSettings WHERE Name='aws';


