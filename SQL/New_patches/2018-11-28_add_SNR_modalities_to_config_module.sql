INSERT INTO ConfigSettings
  (
    Name,
    Description,
    Visible,
    AllowMultiple,
    DataType,
    Parent,
    Label,
    OrderNumber
  )
  SELECT
    'compute_snr_modalities',
    'Modalities for which the SNR should be computed when running the insertion MRI scripts',
    1,
    1,
    'scan_type',
    ID,
    'Modalities on which SNR should be calculated',
    21
  FROM
    ConfigSettings
  WHERE
    Name="imaging_pipeline";

/*INSERT scan type=flair, t1, t2 and pd (a.k.a. 41, 44, 45 and 46 respectively)*/
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, GROUP_CONCAT(mst.Scan_Type) FROM ConfigSettings cs JOIN mri_scan_type mst WHERE cs.Name="tblScanTypes" AND mst.ID=41;
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, GROUP_CONCAT(mst.Scan_Type) FROM ConfigSettings cs JOIN mri_scan_type mst WHERE cs.Name="tblScanTypes" AND mst.ID=44;
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, GROUP_CONCAT(mst.Scan_Type) FROM ConfigSettings cs JOIN mri_scan_type mst WHERE cs.Name="tblScanTypes" AND mst.ID=45;
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, GROUP_CONCAT(mst.Scan_Type) FROM ConfigSettings cs JOIN mri_scan_type mst WHERE cs.Name="tblScanTypes" AND mst.ID=46;
