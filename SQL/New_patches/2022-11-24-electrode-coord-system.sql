-- SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
-- SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
-- SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Table `physiological_coord_system_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_type` (
  `PhysiologicalCoordSystemTypeID`  INT(10)     UNSIGNED  NOT NULL AUTO_INCREMENT,
  `Name`                            VARCHAR(50)           NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalCoordSystemTypeID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- -----------------------------------------------------
-- Table `physiological_coord_system_name`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_name` (
  `PhysiologicalCoordSystemNameID`  INT(10)     UNSIGNED  NOT NULL AUTO_INCREMENT,
  `Name`                            VARCHAR(50)           NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalCoordSystemNameID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- -----------------------------------------------------
-- Table `physiological_coord_unit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_unit` (
  `PhysiologicalCoordSystemUnitID`  INT(10)     UNSIGNED  NOT NULL AUTO_INCREMENT,
  `Name`                            VARCHAR(50)           NOT NULL UNIQUE,
  `Symbol`                          VARCHAR(10)           NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalCoordSystemUnitID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- -----------------------------------------------------
-- Table `physiological_coord_system`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system` (
  `PhysiologicalCoordSystemID`  INT(10)     UNSIGNED  NOT NULL AUTO_INCREMENT,
  `Name`                        INT(10)               NOT NULL,
  `Type`                        INT(10)               NOT NULL,
  `Unit`                        INT(10)               NOT NULL,
  `FilePath`                    VARCHAR(255)          NOT NULL,
  `CoordNASX`                   DECIMAL(12,6)         NOT NULL,
  `CoordNASY`                   DECIMAL(12,6)         NOT NULL,
  `CoordNASZ`                   DECIMAL(12,6)         NOT NULL,
  `CoordLPAX`                   DECIMAL(12,6)         NOT NULL,
  `CoordLPAY`                   DECIMAL(12,6)         NOT NULL,
  `CoordLPAZ`                   DECIMAL(12,6)         NOT NULL,
  `CoordRPAX`                   DECIMAL(12,6)         NOT NULL,
  `CoordRPAY`                   DECIMAL(12,6)         NOT NULL,
  `CoordRPAZ`                   DECIMAL(12,6)         NOT NULL,
  PRIMARY KEY (`PhysiologicalCoordSystemID`),
  CONSTRAINT `FK_PhysCoordSystemType_type`
    FOREIGN KEY (`Type`)
    REFERENCES `physiological_coord_system_type` (`PhysiologicalCoordSystemTypeID`),
  CONSTRAINT `FK_PhysCoordSystemName_name`
    FOREIGN KEY (`Name`)
    REFERENCES `physiological_coord_system_name` (`PhysiologicalCoordSystemNameID`),
  CONSTRAINT `FK_PhysCoordSystemUnit_unit`
    FOREIGN KEY (`Unit`)
    REFERENCES `physiological_coord_system_unit` (`PhysiologicalCoordSystemUnitID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- -----------------------------------------------------
-- Table `physiological_electrode`
-- -----------------------------------------------------

-- need to move data before

ALTER TABLE `physiological_electrode`
  DROP COLUMN `PhysiologicalFileID`, `InsertTime`;

-- -----------------------------------------------------
-- Table `physiological_coord_system_electrode_rel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_electrode_rel` (
  `PhysiologicalCoordSystemID`  INT(10)       NOT NULL,
  `PhysiologicalElectrodeID`    INT(10)       NOT NULL,
  `PhysiologicalFileID`         INT(10)       NOT NULL,
  `InsertTime`                  TIMESTAMP     NOT NULL   DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (
    `PhysiologicalCoordSystemID`,
    `PhysiologicalElectrodeID`
  ),
  CONSTRAINT `FK_phys_coord_system_electrode_rel_coord_system`
    FOREIGN KEY (`PhysiologicalCoordSystemID`)
    REFERENCES `physiological_coord_system` (`PhysiologicalCoordSystemID`) ,
  CONSTRAINT `FK_phys_coord_system_electrode_rel_phys_file`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`),
  CONSTRAINT `FK_phys_coord_system_electrode_rel_electrode`
    FOREIGN KEY (`PhysiologicalElectrodeID`)
    REFERENCES `physiological_electrode` (`PhysiologicalElectrodeID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- SET SQL_MODE=@OLD_SQL_MODE;
-- SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
-- SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;