UPDATE `session` set Current_stage = 'Not Started' WHERE Current_stage IS NULL;
ALTER TABLE `session` MODIFY Current_stage enum('Not Started','Screening','Visit','Approval','Subject','Recycling Bin') NOT NULL DEFAULT 'Not Started';
