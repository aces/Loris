-- Insert necessary values into configsettings and config
INSERT INTO ConfigSettings (Name,Description,Visible,AllowMultiple,DataType,Parent,Label,OrderNumber) Values ("dobFormat","Format of the Date of Birth", 1, 0, "text", 1, "DOB Format:", 8);
INSERT INTO Config (ConfigID,Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name='dobFormat'),"YMd");
