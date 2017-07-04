ALTER TABLE issues_categories CONVERT TO CHARACTER SET utf8;
ALTER TABLE issues_categories MODIFY COLUMN categoryName varchar(255);
