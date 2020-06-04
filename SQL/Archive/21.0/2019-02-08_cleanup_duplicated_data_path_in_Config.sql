-- Remove entries for mincPath and data from the Config table
DELETE
FROM Config
WHERE ConfigID IN (
  SELECT ID
  FROM ConfigSettings
  WHERE Name IN ('mincPath', 'data')
);

-- Remove entries for mincPath and data from the ConfigSettings table
DELETE
FROM ConfigSettings
WHERE Name IN ('mincPath', 'data');
