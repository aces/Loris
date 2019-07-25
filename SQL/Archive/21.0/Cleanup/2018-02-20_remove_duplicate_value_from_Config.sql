/*  delete duplicate ConfigID-value pairs */
DELETE FROM Config USING Config, Config c1 
       WHERE Config.ID > c1.ID AND Config.ConfigID = c1.ConfigID AND Config.Value = c1.Value;
