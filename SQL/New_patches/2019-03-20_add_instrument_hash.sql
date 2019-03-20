CREATE TABLE `instrument_schema` (
  `InstrumentSchemaID` int(10) unsigned NOT NULL auto_increment,
  `PreviousVersion` int(10) unsigned default NULL,
  `UsersID` int(10) unsigned NOT NULL,
  `SchemaHash` char(64) NOT NULL,
  `DateUpdated` datetime NOT NULL DEFAULT NOW(),
  `SchemaURI` TEXT NOT NULL,
  `SchemaJSON` TEXT NOT NULL,
  CONSTRAINT `PK_instrument_schema` PRIMARY KEY (`InstrumentSchemaID`),
  CONSTRAINT `UK_instrument_schema_SchemaHash` UNIQUE KEY (`SchemaHash`),
  CONSTRAINT `FK_instrument_Schema_PreviousVersion` FOREIGN KEY (`PreviousVersion`) REFERENCES `instrument_schema` (`InstrumentSchemaID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_instrument_schema_UsersID` FOREIGN KEY (`UsersID`) REFERENCES `users` (`ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `test_names`
  ADD COLUMN `InstrumentSchemaID` int(10) unsigned default NULL after Sub_group,
  ADD CONSTRAINT `FK_test_names_InstrumentSchemaID` FOREIGN KEY (`InstrumentSchemaID`) REFERENCES `instrument_schema` (`InstrumentSchemaID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `flag`
  ADD COLUMN `InstrumentSchemaID` int(10) unsigned default NULL after Data,
  ADD CONSTRAINT `FK_flag_InstrumentSchemaID` FOREIGN KEY (`InstrumentSchemaID`) REFERENCES `instrument_schema` (`InstrumentSchemaID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
