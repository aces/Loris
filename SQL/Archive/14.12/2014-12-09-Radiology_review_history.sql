CREATE TABLE `final_radiological_review_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `col` varchar(255) NOT NULL DEFAULT '',
  `old` text,
  `new` text,
  `CommentID` varchar(255),
  `changeDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userID` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO final_radiological_review_history (col, old, new, CommentID, changeDate, userID) SELECT col, old, new, primaryVals, changeDate, userID FROM history WHERE tbl='final_radiological_review';
DELETE FROM final_radiological_review_history WHERE col IN ('password', 'login','username');
