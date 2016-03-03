DELETE FROM Config WHERE ConfigID = (SELECT ID FROM ConfigSettings WHERE Name = 'showPearErrors');
DELETE FROM ConfigSettings WHERE Name = 'showPearErrors';
