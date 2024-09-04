-- Rename parameter_type name
UPDATE parameter_type
    SET Name="electrophysiology_chunked_dataset_path"
    WHERE Name="electrophyiology_chunked_dataset_path";
