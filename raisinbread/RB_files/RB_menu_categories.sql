/*M!999999\- enable the sandbox mode */ 
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `menu_categories`;
LOCK TABLES `menu_categories` WRITE;
INSERT INTO `menu_categories` (`name`, `orderby`) VALUES ('Admin',8);
INSERT INTO `menu_categories` (`name`, `orderby`) VALUES ('Candidate',1);
INSERT INTO `menu_categories` (`name`, `orderby`) VALUES ('Clinical',2);
INSERT INTO `menu_categories` (`name`, `orderby`) VALUES ('Biobank',98);
INSERT INTO `menu_categories` (`name`, `orderby`) VALUES ('Electrophysiology',99);
INSERT INTO `menu_categories` (`name`, `orderby`) VALUES ('foo',1);
INSERT INTO `menu_categories` (`name`, `orderby`) VALUES ('Genomics',4);
INSERT INTO `menu_categories` (`name`, `orderby`) VALUES ('Imaging',5);
INSERT INTO `menu_categories` (`name`, `orderby`) VALUES ('Reports',6);
INSERT INTO `menu_categories` (`name`, `orderby`) VALUES ('Tools',7);
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
