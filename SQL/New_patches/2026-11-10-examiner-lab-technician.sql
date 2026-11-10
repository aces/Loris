ALTER TABLE examiners ADD COLUMN LabTechnician tinyint(1) NOT NULL DEFAULT 0 AFTER radiologist;
UPDATE examiners SET LabTechnician = 1 WHERE examinerID IN (SELECT ExaminerID FROM biobank_specimen_collection UNION SELECT ExaminerID FROM biobank_specimen_preparation UNION SELECT ExaminerID FROM biobank_specimen_analysis);
