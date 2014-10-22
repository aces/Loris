-- This table needs to be MyISAM because InnoDB doesn't
-- support full text indexes
CREATE TABLE `help` (
    `helpID` int(10) unsigned NOT NULL AUTO_INCREMENT, 
    `parentID` int(11) NOT NULL DEFAULT '-1',
    `hash` varchar(32) DEFAULT NULL,
    `topic` varchar(100) NOT NULL DEFAULT '',
    `content` text NOT NULL,
    `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
    `updated` datetime DEFAULT NULL, PRIMARY KEY (`helpID`), 
    UNIQUE KEY `hash` (`hash`), 
    FULLTEXT KEY `topic` (`topic`), 
    FULLTEXT KEY `content` (`content`)
) ENGINE=MYISAM DEFAULT CHARSET=utf8;

CREATE TABLE `help_related_links` (
    `helpID` int(10) unsigned NOT NULL DEFAULT '0',
    `relatedID` int(10) unsigned NOT NULL DEFAULT '0', 
    PRIMARY KEY (`helpID`,`relatedID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO help (helpID, topic, content) VALUES ('1','LORIS HELP: Using the Database','Welcome to LORIS database. The help section provides you with guidelines for adding and updating information in the database');
INSERT INTO help (helpID, topic, content) VALUES ('2','HOW TO - Guide','Under Construction.Please visit us later');
INSERT INTO help (helpID, topic, content) VALUES ('3','Guidelines','Under Construction.Please visit us later');
INSERT INTO help (helpID, topic, content) VALUES ('5','Instruments - Guide','Under Construction.Please visit us later');
