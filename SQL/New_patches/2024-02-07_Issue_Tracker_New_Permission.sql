INSERT INTO `permissions` (`code`, `description`, `moduleID`, `categoryID`) VALUES ('issue_tracker_all_issue', 'See/Comment/Edit/Close All issues', '27', '2');
INSERT INTO `permissions` (`code`, `description`, `moduleID`, `categoryID`) VALUES ('issue_tracker_site_issue', 'See/Comment/Edit/Close Site Issue', '27', '2');
UPDATE `permissions` SET `description` = 'Create/Edit/Close Own Issues and Comment on All Issues' WHERE (`code` = 'issue_tracker_reporter');

