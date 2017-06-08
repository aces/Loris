INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'usePHPErrorLogForSQLQueries', 'Use PHP`s error_log() to show SQL Queries when Show Database Queries is set to Yes', 1, 0, 'boolean', ID, 'Use error_log for SQL', 4 FROM ConfigSettings WHERE Name="gui";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'showDatabaseQueries', 'Show Database Queries', 1, 0, 'boolean', ID, 'Show Database Queries', 5 FROM ConfigSettings WHERE Name="gui";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="usePHPErrorLogForSQLQueries";
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="showDatabaseQueries";
