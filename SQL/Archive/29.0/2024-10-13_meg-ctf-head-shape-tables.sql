CREATE TABLE `meg_ctf_head_shape_file` (
    `ID`          INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `Path`        VARCHAR(255)     NOT NULL,
    `Blake2bHash` VARCHAR(128)     NOT NULL,
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `meg_ctf_head_shape_point` (
    `ID`     INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `FileID` INT(10) UNSIGNED NOT NULL,
    `Name`   VARCHAR(255)     NOT NULL,
    `X`      DECIMAL(10, 6)   NOT NULL,
    `Y`      DECIMAL(10, 6)   NOT NULL,
    `Z`      DECIMAL(10, 6)   NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_meg_ctf_head_shape_FileID`
      FOREIGN KEY (`FileID`)
      REFERENCES `meg_ctf_head_shape_file`(`ID`)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `physiological_file`
ADD COLUMN `HeadShapeFileID` INT(10) UNSIGNED DEFAULT NULL,
ADD CONSTRAINT `FK_head_shape_HeadShapeFileID`
  FOREIGN KEY (`HeadShapeFileID`)
  REFERENCES `meg_ctf_head_shape_file` (`ID`);
