SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `appointment`;
LOCK TABLES `appointment` WRITE;
INSERT INTO `appointment` (`AppointmentID`,`SessionID`,`AppointmentTypeID`,`StartsAt`) VALUES ('2','1','1','2025-01-01 01:00:00');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
