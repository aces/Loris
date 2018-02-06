CREATE TABLE `mri_protocol_TE` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Scan_type` int(10) unsigned NOT NULL default '0',
  `TE_min` int(11) NOT NULL default '0',
  `TE_max` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `mri_protocol_TR` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Scan_type` int(10) unsigned NOT NULL default '0',
  `TR_min` int(11) NOT NULL default '0',
  `TR_max` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
