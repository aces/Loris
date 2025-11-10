-- Publication Lead Investigators do not need to be collaborators
ALTER TABLE publication
ADD COLUMN LeadInvestigatorEmail VARCHAR(255) NULL,
ADD COLUMN LeadInvestigator VARCHAR(255) NULL;

UPDATE publication
SET LeadInvestigator = (SELECT Name FROM publication_collaborator WHERE PublicationCollaboratorID = LeadInvestigatorID),
    LeadInvestigatorEmail = (SELECT Email FROM publication_collaborator WHERE PublicationCollaboratorID = LeadInvestigatorID)
WHERE LeadInvestigatorID IS NOT NULL;

ALTER TABLE publication
DROP FOREIGN KEY `FK_publication_LeadInvestigatorID`;

ALTER TABLE publication_collaborator
DROP INDEX `UK_publication_collaborator_Email`;

-- Remove the LeadInvestigatorID column from publication
ALTER TABLE publication
DROP COLUMN LeadInvestigatorID;

DELETE FROM publication_collaborator
WHERE PublicationCollaboratorID NOT IN (SELECT PublicationCollaboratorID FROM publication_collaborator_rel);