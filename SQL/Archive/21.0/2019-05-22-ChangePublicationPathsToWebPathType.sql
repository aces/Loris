-- The publication paths were set to text in earlier versions of LORIS. They
-- should have the 'web_path' type so that they are properly validated in LORIS.
UPDATE ConfigSettings SET DataType="web_path" WHERE Name LIKE "publication%";
