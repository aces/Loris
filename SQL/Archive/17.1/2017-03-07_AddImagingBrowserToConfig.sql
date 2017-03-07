-- Imaging Browser
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('imaging_browser', 'Imaging Browser settings', 1, 0, 'Imaging Browser', 6);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'tblScanTypes', 'List the imaging scan types, comma separated, to be displayed in Imaging Browser table', 1, 0, 'text', ID, 'Tabulated Scan Types', 1 FROM ConfigSettings WHERE Name="imaging_browser";

-- default imaging_browser settings
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, GROUP_CONCAT(mst.Scan_Type) FROM ConfigSettings cs JOIN mri_scan_type mst WHERE cs.Name="tblScanTypes" AND mst.ID IN (44,45);


