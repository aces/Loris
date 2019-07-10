--
-- Table structure for table `help`
--

CREATE TABLE `help` (
    `helpID` int(10) unsigned NOT NULL AUTO_INCREMENT, 
    `parentID` int(11) NOT NULL DEFAULT '-1',
    `hash` varchar(32) DEFAULT NULL,
    `topic` varchar(100) NOT NULL DEFAULT '',
    `content` text NOT NULL,
    `created` datetime DEFAULT NULL,
    `updated` datetime DEFAULT NULL, 
    PRIMARY KEY (`helpID`), 
    UNIQUE KEY `hash` (`hash`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
