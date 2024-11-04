ALTER TABLE data_release
ADD COLUMN hidden_by_id int(10) unsigned NULL DEFAULT NULL,
ADD CONSTRAINT FK_hidden_by_id
FOREIGN KEY (hidden_by_id) REFERENCES users (ID);