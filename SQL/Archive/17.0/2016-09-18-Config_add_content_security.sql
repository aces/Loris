-- Insert necessary values into configsettings and config

INSERT INTO ConfigSettings (Name,Description,Visible,AllowMultiple,DataType,Parent,Label,OrderNumber) Values ("CSPAdditionalHeaders","Extensions to the Content-security policy allow only for self-hosted content", 1, 0, "text", 1, "Content-Security Extensions", 23);
INSERT INTO Config (ConfigID,Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name='CSPAdditionalHeaders'),"");
