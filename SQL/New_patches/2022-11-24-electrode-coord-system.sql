-- SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
-- SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
-- SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
-- -----------------------------------------------------
-- Table `physiological_coord_system_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_type` (
  `PhysiologicalCoordSystemTypeID` INT(10) NOT NULL,
  `Name` VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalCoordSystemTypeID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- -----------------------------------------------------
-- Table `physiological_coord_system_name`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_name` (
  `PhysiologicalCoordSystemNameID` INT(10) NOT NULL,
  `Name` VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalCoordSystemNameID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- -----------------------------------------------------
-- Table `physiological_coord_unit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_unit` (
  `PhysiologicalCoordSystemUnitID` INT(10) NOT NULL,
  `Name` VARCHAR(50) NOT NULL UNIQUE,
  `Symbol` VARCHAR(5) NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalCoordSystemUnitID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- -----------------------------------------------------
-- Table `physiological_coord_system`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system` (
  `PhysiologicalCoordSystemID` INT NOT NULL,
  `Name` INT(10) NULL,
  `Type` INT(10) NULL,
  `Unit` INT(10) NULL,
  `FilePath` VARCHAR(255) NOT NULL,
  `CoordNASX` DOUBLE NOT NULL,
  `CoordNASY` DOUBLE NOT NULL,
  `CoordNASZ` DOUBLE NOT NULL,
  `CoordLPAX` DOUBLE NOT NULL,
  `CoordLPAY` DOUBLE NOT NULL,
  `CoordLPAZ` DOUBLE NOT NULL,
  `CoordRPAX` DOUBLE NOT NULL,
  `CoordRPAY` DOUBLE NOT NULL,
  `CoordRPAZ` DOUBLE NOT NULL,
  PRIMARY KEY (`PhysiologicalCoordSystemID`),
  CONSTRAINT `FK_PhysCoordSystemType_type` FOREIGN KEY (`Type`) REFERENCES `physiological_coord_system_type` (`PhysiologicalCoordSystemTypeID`),
  CONSTRAINT `FK_PhysCoordSystemName_name` FOREIGN KEY (`Name`) REFERENCES `physiological_coord_system_name` (`PhysiologicalCoordSystemNameID`),
  CONSTRAINT `FK_PhysCoordSystemUnit_unit` FOREIGN KEY (`Unit`) REFERENCES `physiological_coord_system_unit` (`PhysiologicalCoordSystemUnitID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- -----------------------------------------------------
-- Table `physiological_electrode`
-- -----------------------------------------------------
ALTER TABLE `physiological_electrode`
  DROP COLUMN `PhysiologicalFileID`, `InsertTime`;

-- -----------------------------------------------------
-- Table `physiological_coord_system_electrode_rel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `physiological_coord_system_electrode_rel` (
  `PhysiologicalCoordSystemID` INT NOT NULL,
  `PhysiologicalElectrodeID` INT NOT NULL,
  `PhysiologicalFileID` INT NULL,
  `InsertTime` DATE NULL,
  PRIMARY KEY (
    `PhysiologicalCoordSystemID`,
    `PhysiologicalElectrodeID`
  ),
  CONSTRAINT `FK_phys_coord_system_electrode_rel_coord_system` FOREIGN KEY (`PhysiologicalCoordSystemID`) REFERENCES `physiological_coord_system` (`PhysiologicalCoordSystemID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_phys_coord_system_electrode_rel_phys_file` FOREIGN KEY (`PhysiologicalFileID`) REFERENCES `physiological_file` (`PhysiologicalFileID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_phys_coord_system_electrode_rel_electrode` FOREIGN KEY (`PhysiologicalElectrodeID`) REFERENCES `physiological_electrode` (`PhysiologicalElectrodeID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- SET SQL_MODE=@OLD_SQL_MODE;
-- SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
-- SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;