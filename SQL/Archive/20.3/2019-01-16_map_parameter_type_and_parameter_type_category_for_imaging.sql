INSERT INTO parameter_type_category_rel (ParameterTypeID, ParameterTypeCategoryID)
  SELECT DISTINCT ParameterTypeID, ParameterTypeCategoryID
  FROM   parameter_type, parameter_type_category ptc
  WHERE  SourceFrom="parameter_file" AND ptc.Name="MRI Variables";


INSERT INTO parameter_type_category (Name, Type)
  VALUES ('Electrophysiology Variables', 'Metavars');

INSERT INTO parameter_type_category_rel (ParameterTypeID, ParameterTypeCategoryID)
  SELECT DISTINCT ParameterTypeID, ParameterTypeCategoryID
  FROM   parameter_type, parameter_type_category ptc
  WHERE  SourceFrom="physiological_parameter_file" AND ptc.Name="Electrophysiology Variables";

