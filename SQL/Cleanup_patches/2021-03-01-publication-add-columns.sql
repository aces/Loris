ALTER TABLE publication
    ADD COLUMN journal varchar(255) DEFAULT NULL,
    ADD COLUMN doi text DEFAULT NULL,
    ADD COLUMN datePublication date DEFAULT NULL,
    ADD COLUMN link varchar(255) DEFAULT NULL,
    ADD COLUMN publishingStatus enum('In Progress','Published') DEFAULT NULL;
