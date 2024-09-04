INSERT INTO modules (Name, Active) VALUES ('schedule_module', 'Y');
INSERT INTO permissions (code, description, categoryID) VALUES ('schedule_module', 'Schedule Module: edit and delete the appointment', 2);
INSERT INTO user_perm_rel(UserID,PermID) VALUES (
    (SELECT ID FROM users WHERE UserID='admin'),
    (SELECT permID FROM permissions WHERE code='schedule_module')
);
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
