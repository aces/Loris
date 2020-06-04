INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('APIKeys', 'Specify any API keys required for LORIS', 1, 0, 'API Keys', 10);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'JWTKey', 'Secret key for signing JWT tokens on this server. This should be unique and never shared with anyone. ', 1, 0, 'text', ID, 'JWT Secret Key', 9 FROM ConfigSettings WHERE Name="APIKeys";

INSERT INTO Config (ConfigID, Value) SELECT ID, "S3cret" FROM ConfigSettings WHERE Name="JWTKey";
