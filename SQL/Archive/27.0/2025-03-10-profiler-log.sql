INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'profiler_log_level', 'Verbosity of performance profiler logging', 1, 0, 'log_level', ID, 'Profiler Log Level', 3 FROM ConfigSettings WHERE Name='logs';

