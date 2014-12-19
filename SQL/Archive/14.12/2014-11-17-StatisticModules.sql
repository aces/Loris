CREATE TABLE StatisticsTabs(
    ID INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    ModuleName varchar(255) NOT NULL,
    SubModuleName varchar(255) NOT NULL,
    Description varchar(255),
    OrderNo INTEGER DEFAULT NULL,
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Stores list of tabs for the statistics module';

INSERT INTO StatisticsTabs (ModuleName, SubModuleName, Description, OrderNo) VALUES
('statistics', 'stats_general', 'General Description', 1),
('statistics', 'stats_demographic', 'Demographic Statistics', 2),
('statistics', 'stats_behavioural', 'Behavioural Statistics', 3),
('statistics', 'stats_reliability', 'Reliability Statistics', 4),
('statistics', 'stats_MRI', 'Imaging Statistics', 5);
