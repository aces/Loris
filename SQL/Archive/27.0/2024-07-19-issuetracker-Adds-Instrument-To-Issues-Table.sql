ALTER TABLE `issues`
    ADD `instrument` int(10) unsigned DEFAULT NULL
    AFTER `description`;

ALTER TABLE `issues`
    ADD CONSTRAINT `fk_issues_instrument`
    FOREIGN KEY (`instrument`) REFERENCES `test_names` (`ID`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `issues_history`
    MODIFY `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','candID', 'description','watching','instrument') NOT NULL DEFAULT 'comment';
