SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `publication_collaborator`;
LOCK TABLES `publication_collaborator` WRITE;
INSERT INTO `publication_collaborator` (`PublicationCollaboratorID`, `Name`, `Email`) VALUES (1,'test_collaborator2','test_collaborator2@test.com');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
