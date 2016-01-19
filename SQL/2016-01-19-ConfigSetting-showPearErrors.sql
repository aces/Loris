DELETE FROM LORIS.Config where ConfigID = (SELECT ID FROM LORIS.ConfigSettings where name = 'showPearErrors');
DELETE FROM LORIS.ConfigSettings where name = 'showPearErrors';
