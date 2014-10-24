DELETE FROM config WHERE ConfigID=(SELECT ID FROM configSettings WHERE Name="columnThreshold");

DELETE FROM configSettings WHERE Name="columnThreshold";