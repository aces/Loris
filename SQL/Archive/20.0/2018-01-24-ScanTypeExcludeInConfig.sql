-- Insert into ConfigSettings scan_type_exclude
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple,
DataType, Parent, Label, OrderNumber) SELECT 'excluded_series_description', 'Series description to be excluded from insertion into the database (typically localizers and scouts)', 1, 1, 'text', ID, 'Series description to exclude from imaging insertion', 18 FROM ConfigSettings WHERE Name="imaging_pipeline";

-- Insert into Config default values for scan_type_exclude
INSERT INTO Config (ConfigID, Value) SELECT ID, "localizer" FROM ConfigSettings cs WHERE cs.Name="excluded_series_description";
INSERT INTO Config (ConfigID, Value) SELECT ID, "scout" FROM ConfigSettings cs WHERE cs.Name="excluded_series_description";
