-- Create `physiological_task_event_opt` table
-- tracks additional events from bids archives
CREATE TABLE `physiological_task_event_opt` (
    `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `PhysiologicalTaskEventID` int(10) unsigned NOT NULL,
    `TaskName` varchar(50) NOT NULL,
    `TaskValue` varchar(255) NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_event_task_opt`
        FOREIGN KEY (`PhysiologicalTaskEventID`)
        REFERENCES `physiological_task_event` (`PhysiologicalTaskEventID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;