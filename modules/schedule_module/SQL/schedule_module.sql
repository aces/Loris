-- Create appointment_type table
CREATE TABLE `appointment_type` (
  `AppointmentTypeID` int(10) UNSIGNED NOT NULL,
  `Name` varchar(32) NOT NULL,
  PRIMARY KEY (`AppointmentTypeID`),
  UNIQUE KEY (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Insert initial data
INSERT INTO `appointment_type` (`AppointmentTypeID`, `Name`) VALUES
(3, 'Behavioral'),
(2, 'Blood Collection'),
(1, 'MRI'); 

-- Create appointment table
CREATE TABLE `appointment` (
  `AppointmentID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `SessionID` int(10) UNSIGNED NOT NULL,
  `AppointmentTypeID` int(10) UNSIGNED NOT NULL,
  `StartsAt` datetime NOT NULL,
  PRIMARY KEY (`AppointmentID`),
  KEY `AppointmentTypeID` (`AppointmentTypeID`),
  KEY `SessionID` (`SessionID`),
  CONSTRAINT `appointment_belongsToSession` FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`),
  CONSTRAINT `appointment_hasAppointmentType` FOREIGN KEY (`AppointmentTypeID`) REFERENCES `appointment_type` (`AppointmentTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Insert data for schedule_module
INSERT INTO `permissions` (`code`, `description`, `categoryID`) values ('schedule_module', 'Schedule Module', 2);
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
('Schedule Module', 'schedule_module/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 11);
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='schedule_module' AND m.Label='Schedule Module';

-- Insert schedule_module id into user_perm_rel table
INSERT INTO `user_perm_rel` (userID, permID)
  SELECT u.ID, p.permID 
  FROM users u JOIN permissions p 
  WHERE u.userid = 'admin' and p.code = 'schedule_module';
