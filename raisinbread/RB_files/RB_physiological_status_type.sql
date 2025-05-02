SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `physiological_status_type`;
LOCK TABLES `physiological_status_type` WRITE;
INSERT INTO `physiological_status_type` (`PhysiologicalStatusTypeID`, `ChannelStatus`) VALUES (2,'bad');
INSERT INTO `physiological_status_type` (`PhysiologicalStatusTypeID`, `ChannelStatus`) VALUES (1,'good');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
