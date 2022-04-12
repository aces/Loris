INSERT INTO
  ConfigSettings (
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
  'labelPrintingPath',
  'Path to print barcode.zpl',
  1,
  0,
  'text',
  ID,
  'Path to label text file',
  10 FROM ConfigSettings WHERE Name='paths';
