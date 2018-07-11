ALTER TABLE parameter_session DROP FOREIGN KEY `FK_parameter_session_1`;
ALTER TABLE parameter_session ADD CONSTRAINT `FK_parameter_session_1` FOREIGN KEY (`SessionID`) REFERENCES `session` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

