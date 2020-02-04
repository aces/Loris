DELETE FROM Config WHERE ConfigID IN (Select ID FROM ConfigSettings WHERE Name='url');
DELETE FROM ConfigSettings WHERE Name='url';
