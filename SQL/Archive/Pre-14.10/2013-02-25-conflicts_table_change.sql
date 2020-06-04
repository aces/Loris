ALTER TABLE conflicts_unresolved DROP PRIMARY KEY;
ALTER TABLE conflicts_unresolved ADD COLUMN `ConflictID` INT(10) NOT NULL primary KEY AUTO_INCREMENT FIRST;

ALTER TABLE conflicts_resolved DROP PRIMARY KEY;
ALTER TABLE conflicts_resolved ADD COLUMN `ResolvedID` INT(10) NOT NULL primary KEY AUTO_INCREMENT FIRST;
ALTER TABLE conflicts_resolved ADD COLUMN `ConflictID` INT(10) DEFAULT NULL;
