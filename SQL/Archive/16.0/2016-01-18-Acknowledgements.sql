DROP TABLE IF EXISTS `acknowledgements`;
CREATE TABLE `acknowledgements` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ordering` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `citation_name` varchar(255) DEFAULT NULL,
  `title` enum('') DEFAULT NULL,
  `affiliations` varchar(255) DEFAULT NULL,
  `degrees` varchar(255) DEFAULT NULL,
  `roles` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `present` enum('Yes', 'No') DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO LorisMenu (Label, OrderNumber) VALUES ('Acknowledgements', 7);
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES ('Acknowledgements','/acknowledgements/', (SELECT ID FROM LorisMenu as L WHERE Label='Acknowledgements'), 1);

INSERT INTO permissions (code,description,categoryID) VALUES ('acknowledgements_view','View Acknowledgements',2);
INSERT INTO permissions (code,description,categoryID) VALUES ('acknowledgements_edit','Edit Acknowledgements',2);

INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='acknowledgements_view' AND m.Label='Acknowledgements';
INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='acknowledgements_edit' AND m.Label='Acknowledgements';

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'citation_policy', 'Citation Policy for Acknowledgements module', 1, 0, 'textarea', ID, 'Citation Policy', 22 FROM ConfigSettings WHERE Name="study";

INSERT INTO Config (ConfigID, Value) SELECT ID, "Modify this to your project's citation policy" FROM ConfigSettings WHERE Name="citation_policy";

