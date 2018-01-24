-- Insert into ConfigSettings scan_type_exclude
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'scan_type_exclude', 'Series description to to be excluded from insertion into the database (typically localizers and scouts)', 1, 0, 'text', ID, 'Scan types to exclude from imaging insertion', 18 FROM ConfigSettings WHERE Name="imaging_pipeline";

-- Insert into Config default values for scan_type_exclude
INSERT INTO Config (ConfigID, Value) SELECT ID, "localizer, scout" FROM ConfigSettings cs WHERE cs.Name="scan_type_exclude";