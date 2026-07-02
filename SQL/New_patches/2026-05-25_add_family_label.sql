ALTER TABLE family ADD COLUMN RelationshipLabel VARCHAR(255);
-- handles all cases for existing projects
UPDATE family SET RelationshipLabel = REPLACE(Relationship_type, '_', ' ');

-- LORIS specific labels (can be modified for projects)
UPDATE family SET RelationshipLabel = 'Full Sibling' WHERE Relationship_type = 'full_sibling';
UPDATE family SET RelationshipLabel = 'Half Sibling' WHERE Relationship_type = 'half_sibling';
UPDATE family SET RelationshipLabel = '1st Cousin' WHERE Relationship_type = '1st_cousin';
