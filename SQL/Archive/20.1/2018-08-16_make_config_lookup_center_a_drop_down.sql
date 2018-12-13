ALTER TABLE ConfigSettings
  MODIFY COLUMN DataType ENUM('text','boolean','email','instrument','textarea','scan_type', 'lookup_center');

UPDATE ConfigSettings
  SET DataType='lookup_center'
  WHERE Name='lookUpCenterNameUsing';