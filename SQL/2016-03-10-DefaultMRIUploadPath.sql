INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/incoming/" FROM ConfigSettings WHERE Name="MRIUploadIncomingPath"
