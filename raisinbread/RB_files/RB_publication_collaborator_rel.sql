SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `publication_collaborator_rel`;
LOCK TABLES `publication_collaborator_rel` WRITE;
INSERT INTO `publication_collaborator_rel` (`PublicationID`, `PublicationCollaboratorID`) VALUES (1, 1);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
