CREATE TABLE `sex` (
  `Name` varchar(255) NOT NULL,
  PRIMARY KEY `Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Stores sex options available for candidates in LORIS';

INSERT INTO sex (Name) VALUES ('Male'), ('Female'), ('Other');

ALTER TABLE candidate
  MODIFY COLUMN sex varchar(255) DEFAULT NULL,
  MODIFY COLUMN ProbandSex varchar(255) DEFAULT NULL,
  ADD KEY `FK_candidate_sex_1` (`Sex`),
  ADD KEY `FK_candidate_sex_2` (`ProbandSex`),
  ADD CONSTRAINT `FK_candidate_sex_1` FOREIGN KEY (`Sex`) REFERENCES `sex` (`Name`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_candidate_sex_2` FOREIGN KEY (`ProbandSex`) REFERENCES `sex` (`Name`) ON DELETE RESTRICT ON UPDATE CASCADE;
