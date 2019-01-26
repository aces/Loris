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
    'reference_scan_type_for_defacing',
    'Scan type to use as a reference for registration when defacing anatomical images (typically a T1W image)',
    1,
    0,
    'scan_type',
    ID,
    'Scan type to use as a reference for defacing (typically a T1W image)',
    22
  FROM
    ConfigSettings
  WHERE
    Name="imaging_pipeline";
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
    'modalities_to_deface',
    'Modalities for which defacing should be run and defaced image inserted in the database',
    1,
    1,
    'scan_type',
    ID,
    'Modalities on which to run the defacing pipeline',
    23
  FROM
    ConfigSettings
  WHERE
    Name="imaging_pipeline";

INSERT INTO Config (ConfigID, Value) SELECT ID, 't1'    FROM ConfigSettings WHERE Name="reference_scan_type_for_defacing";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'flair' FROM ConfigSettings WHERE Name="modalities_to_deface";
INSERT INTO Config (ConfigID, Value) SELECT ID, 't1'    FROM ConfigSettings WHERE Name="modalities_to_deface";
INSERT INTO Config (ConfigID, Value) SELECT ID, 't2'    FROM ConfigSettings WHERE Name="modalities_to_deface";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'pd'    FROM ConfigSettings WHERE Name="modalities_to_deface";
