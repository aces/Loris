-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2.1
-- http://www.phpmyadmin.net
--
-- Host: ace-db-2.cbrain.mcgill.ca:3306
-- Generation Time: Oct 05, 2018 at 12:28 AM
-- Server version: 5.7.23
-- PHP Version: 7.0.32-1+ubuntu16.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Table structure for table `appointment_type`
--

CREATE TABLE `appointment_type` (
  `AppointmentTypeID` int(10) UNSIGNED NOT NULL,
  `Name` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `appointment_type`
--

INSERT INTO `appointment_type` (`AppointmentTypeID`, `Name`) VALUES
(3, 'Behavioral'),
(2, 'Blood Collection'),
(1, 'MRI');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointment_type`
--
ALTER TABLE `appointment_type`
  ADD PRIMARY KEY (`AppointmentTypeID`),
  ADD UNIQUE KEY `Name` (`Name`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2.1
-- http://www.phpmyadmin.net
--
-- Host: ace-db-2.cbrain.mcgill.ca:3306
-- Generation Time: Oct 05, 2018 at 12:27 AM
-- Server version: 5.7.23
-- PHP Version: 7.0.32-1+ubuntu16.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `AppointmentID` int(10) UNSIGNED NOT NULL,
  `SessionID` int(10) UNSIGNED NOT NULL,
  `AppointmentTypeID` int(10) UNSIGNED NOT NULL,
  `StartsAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`AppointmentID`),
  ADD KEY `AppointmentTypeID` (`AppointmentTypeID`),
  ADD KEY `SessionID` (`SessionID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `AppointmentID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `appointment_belongsToSession` FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`),
  ADD CONSTRAINT `appointment_hasAppointmentType` FOREIGN KEY (`AppointmentTypeID`) REFERENCES `appointment_type` (`AppointmentTypeID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

INSERT INTO `permissions` (`code`, `description`, `type`, `categoryID`) values ('schedule_module', 'Schedule Module', 'permission', 2);
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
('Schedule Module', 'schedule_module/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 11);
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='schedule_module' AND m.Label='Schedule Module';
