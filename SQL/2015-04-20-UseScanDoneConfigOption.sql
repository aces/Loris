INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'useScanDone', 'Determines whether or not "Scan Done" should be used in Loris', 1, 0, 'boolean', ID, 'Use Scan Done', 19 FROM ConfigSettings WHERE Name="study";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'true' FROM ConfigSettings WHERE Name='useScanDone';
