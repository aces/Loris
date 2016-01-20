DELETE FROM Config where ConfigID = (SELECT ID FROM ConfigSettings where name = 'showPearErrors');
DELETE FROM ConfigSettings where name = 'showPearErrors';
