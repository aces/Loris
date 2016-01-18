DELETE FROM Config WHERE ConfigID=(SELECT FROM ConfigSettings WHERE Name='showTiming');

DELETE FROM ConfigSettings WHERE Name='showTiming';