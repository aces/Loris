ALTER TABLE `ConfigSettings` MODIFY COLUMN `DataType` ENUM('text','boolean','email','instrument','textarea','scan_type','date_format','lookup_center','path','web_path', 'log_level');

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('logs', 'Settings related to logging', 1, 0, 'Log Settings', 12);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'database_log_level', 'Verbosity of database logging', 1, 0, 'log_level', ID, 'Database Log Level', 3 FROM ConfigSettings WHERE Name='logs';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'request_log_level', 'Verbosity of HTTP request logs', 1, 0, 'log_level', ID, 'HTTP Request Log Level', 3 FROM ConfigSettings WHERE Name='logs';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'exception_log_level', 'Verbosity of PHP exception logging', 1, 0, 'log_level', ID, 'Exception Log Level', 3 FROM ConfigSettings WHERE Name='logs';

