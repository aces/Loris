SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE electrophysiology_uploader
    DROP FOREIGN KEY FK_eegupload_UploadedBy;
ALTER TABLE server_processes
    DROP FOREIGN KEY FK_task_1;
ALTER TABLE issues
    DROP FOREIGN KEY fk_issues_1,
    DROP FOREIGN KEY fk_issues_2,
    DROP FOREIGN KEY fk_issues_6,
    DROP FOREIGN KEY fk_issues_8;
ALTER TABLE issues_watching
    DROP FOREIGN KEY fk_issues_watching_1;

ALTER TABLE history CONVERT TO CHARACTER SET utf8mb4;
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4;
ALTER TABLE electrophysiology_uploader CONVERT TO CHARACTER SET utf8mb4;
ALTER TABLE server_processes CONVERT TO CHARACTER SET utf8mb4;
ALTER TABLE issues CONVERT TO CHARACTER SET utf8mb4;
ALTER TABLE issues_watching CONVERT TO CHARACTER SET utf8mb4;
ALTER TABLE issues_categories CONVERT TO CHARACTER SET utf8mb4;

ALTER TABLE electrophysiology_uploader
    ADD CONSTRAINT `FK_eegupload_UploadedBy` FOREIGN KEY (`UploadedBy`) REFERENCES `users` (`UserID`);
ALTER TABLE server_processes
    ADD CONSTRAINT `FK_task_1` FOREIGN KEY (`userid`) REFERENCES `users` (`UserID`);
ALTER TABLE issues
    ADD CONSTRAINT `fk_issues_1` FOREIGN KEY (`reporter`) REFERENCES `users` (`UserID`),
    ADD CONSTRAINT `fk_issues_2` FOREIGN KEY (`assignee`) REFERENCES `users` (`UserID`),
    ADD CONSTRAINT `fk_issues_6` FOREIGN KEY (`lastUpdatedBy`) REFERENCES `users` (`UserID`),
    ADD CONSTRAINT `fk_issues_8` FOREIGN KEY (`category`) REFERENCES `issues_categories` (`categoryName`);
ALTER TABLE issues_watching
    ADD CONSTRAINT `fk_issues_watching_1` FOREIGN KEY (`userID`) REFERENCES `users` (`UserID`);

SET FOREIGN_KEY_CHECKS = 1;