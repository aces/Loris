UPDATE permissions
SET moduleID = (select ID FROM modules WHERE Name = 'dictionary')
WHERE moduleID IN (SELECT ID FROM modules WHERE Name = 'datadict');
