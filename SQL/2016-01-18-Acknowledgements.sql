DROP TABLE IF EXISTS `acknowledgements`;
CREATE TABLE `acknowledgements` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ordering` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `citation_name` varchar(255) DEFAULT NULL,
  `title` enum(') DEFAULT NULL,
  `degrees` varchar(255) DEFAULT NULL,
  `start_date` date,
  `end_date` date,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO LorisMenu (Label, OrderNumber) VALUES ('Acknowledgements', 7);
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES ('Acknowledgements','main.php?test_name=acknowledgements', (SELECT ID FROM LorisMenu as L WHERE Label='Acknowledgements'), 1);

INSERT INTO permissions (permID,code,description,categoryID) VALUES (41,'acknowledgements_view','View Acknowledgements',2);
INSERT INTO permissions (permID,code,description,categoryID) VALUES (42,'acknowledgements_edit','Edit Acknowledgements',2);

INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='acknowledgements_view' AND m.Label='Acknowledgements';
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='acknowledgements_edit' AND m.Label='Acknowledgements';
