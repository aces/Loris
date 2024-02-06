CREATE TABLE `sex` (
  `SexID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Sex` varchar(255) NOT NULL,
  PRIMARY KEY (`SexID`),
  UNIQUE KEY `Sex` (`Sex`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='Stores sex options available for candidates in LORIS';

INSERT INTO sex (Sex) VALUES ('Male'), ('Female'), ('Other');

ALTER TABLE candidate
  MODIFY COLUMN sex varchar(255) DEFAULT NULL,
  MODIFY COLUMN ProbandSex varchar(255) DEFAULT NULL,
  ADD KEY `FK_candidate_sex_1` (`Sex`),
  ADD KEY `FK_candidate_sex_2` (`ProbandSex`),
  ADD CONSTRAINT `FK_candidate_sex_1` FOREIGN KEY (`Sex`) REFERENCES `sex` (`Sex`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_candidate_sex_2` FOREIGN KEY (`ProbandSex`) REFERENCES `sex` (`Sex`) ON DELETE RESTRICT ON UPDATE CASCADE;