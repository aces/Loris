ALTER TABLE candidate ADD COLUMN `ProbandGender` enum('Male','Female') DEFAULT NULL;
ALTER TABLE candidate ADD COLUMN `ProbandDoB` date DEFAULT NULL;