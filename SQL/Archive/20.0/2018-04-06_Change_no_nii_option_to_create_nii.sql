UPDATE ConfigSettings 
    SET Name="create_nii", 
        Description="Create NIfTI files if set to 1", 
        Label="NIfTI file creation" 
    WHERE Name="no_nii";
UPDATE Config
    SET Value=IF(
        (SELECT Value FROM ConfigSettings cs WHERE cs.Name="create_nii")=0, 1, 0
    )
    WHERE ConfigID=(
        SELECT ID FROM ConfigSettings cs WHERE cs.Name="create_nii"
    );
