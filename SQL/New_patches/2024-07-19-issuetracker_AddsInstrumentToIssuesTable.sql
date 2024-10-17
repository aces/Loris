ALTER TABLE `issues`
    ADD `instrument` varchar(255) DEFAULT NULL
    AFTER `category`;

ALTER TABLE `issues`
    ADD CONSTRAINT `fk_issues_instrument`
    FOREIGN KEY (`instrument`) REFERENCES `test_names` (`Test_name`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `issues_history`
    MODIFY `fieldChanged` enum('assignee','status','comment','sessionID','centerID','title','category','module','lastUpdatedBy','priority','candID', 'description','instrument') NOT NULL DEFAULT 'comment';
