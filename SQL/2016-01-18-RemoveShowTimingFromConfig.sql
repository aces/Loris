DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='showTiming');

DELETE FROM ConfigSettings WHERE Name='showTiming';