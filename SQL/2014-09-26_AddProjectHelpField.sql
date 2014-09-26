ALTER TABLE help ADD COLUMN project_content text DEFAULT NULL;
UPDATE TABLE help project_content=content;
