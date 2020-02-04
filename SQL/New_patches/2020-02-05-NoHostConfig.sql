DELETE FROM Config WHERE ConfigID IN (Select ID FROM ConfigSettings WHERE Name IN ('host', 'url'));
DELETE FROM ConfigSettings WHERE Name IN ('host', 'url');
