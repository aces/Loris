SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `appointment_type`;
LOCK TABLES `appointment_type` WRITE;
INSERT INTO `appointment_type` (`AppointmentTypeID`, `Name`) VALUES
(3, 'Behavioral'),
(2, 'Blood Collection'),
(1, 'MRI');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
