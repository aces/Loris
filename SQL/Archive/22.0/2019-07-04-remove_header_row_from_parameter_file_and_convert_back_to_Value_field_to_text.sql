DELETE FROM parameter_file WHERE ParameterTypeID=(SELECT ParameterTypeID FROM parameter_type WHERE Name='header' AND SourceFrom='parameter_file');
DELETE FROM parameter_type WHERE Name='header' AND SourceFrom='parameter_file';
ALTER TABLE parameter_file MODIFY Value TEXT;
