UPDATE LorisMenuPermissions SET PermID = (SELECT permID FROM permissions WHERE code = 'conflict_resolver') 
  WHERE PermID = (SELECT permID FROM permissions where code = 'data_entry') 
  AND MenuId = (SELECT ID FROM LorisMenu WHERE Label = 'Conflict Resolver');
