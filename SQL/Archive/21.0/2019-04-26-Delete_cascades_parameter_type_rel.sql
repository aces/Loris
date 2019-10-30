ALTER TABLE parameter_type_category_rel DROP FOREIGN KEY `FK_parameter_type_category_rel_1`;
ALTER TABLE parameter_type_category_rel DROP FOREIGN KEY `FK_parameter_type_category_rel_2`;

ALTER TABLE parameter_type_category_rel ADD CONSTRAINT `FK_parameter_type_category_rel_1` FOREIGN KEY (`ParameterTypeID`) REFERENCES `parameter_type` (`ParameterTypeID`) ON DELETE CASCADE;
ALTER TABLE parameter_type_category_rel ADD CONSTRAINT `FK_parameter_type_category_rel_2` FOREIGN KEY (`ParameterTypeCategoryID`) REFERENCES `parameter_type_category` (`ParameterTypeCategoryID`) ON DELETE CASCADE;
