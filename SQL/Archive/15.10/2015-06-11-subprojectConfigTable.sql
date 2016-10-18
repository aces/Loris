CREATE TABLE subproject (
    SubprojectID int(10) unsigned NOT NULL auto_increment,
    title varchar(255) NOT NULL,
    useEDC boolean,
    WindowDifference enum('optimal', 'battery'),
    PRIMARY KEY (SubprojectID)
);

