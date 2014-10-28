DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name="columnThreshold");

DELETE FROM ConfigSettings WHERE Name="columnThreshold";