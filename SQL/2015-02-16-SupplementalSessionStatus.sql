INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'SupplementalSessionStatus', 'Display supplemental session status information on Timepoint List page', 1, 0, 'boolean', ID, 'Use Supplemental Session Status', 18 FROM ConfigSettings WHERE Name="study";

INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="SupplementalSessionStatus";
