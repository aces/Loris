SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `document_repository_categories`;
LOCK TABLES `document_repository_categories` WRITE;
INSERT INTO `document_repository_categories` (`id`, `category_name`, `parent_id`, `comments`) VALUES (1,'text',0,NULL);
INSERT INTO `document_repository_categories` (`id`, `category_name`, `parent_id`, `comments`) VALUES (2,'photo',0,NULL);
INSERT INTO `document_repository_categories` (`id`, `category_name`, `parent_id`, `comments`) VALUES (3,'pdf',0,NULL);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
