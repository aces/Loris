ALTER TABLE users ADD COLUMN Doc_Repo_Notifications enum('N','Y') DEFAULT 'N';

ALTER TABLE document_repository MODIFY COLUMN File_category int(3);

CREATE TABLE `document_repository_categories` (
  `id` int(3) unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) DEFAULT NULL,
  `parent_id` int(3) DEFAULT '0',
  `comments` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
