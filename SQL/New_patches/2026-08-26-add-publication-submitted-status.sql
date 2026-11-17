ALTER TABLE publication
MODIFY COLUMN publishingStatus enum('In Progress','Submitted','Published') DEFAULT NULL;
