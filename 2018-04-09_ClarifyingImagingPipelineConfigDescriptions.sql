UPDATE ConfigSettings
    SET Description='Enable to generate horizontal pictures'
    WHERE Name='horizontalPics';

UPDATE ConfigSettings
    SET Description='Enable to create NIfTI files'
    WHERE Name="create_nii";

UPDATE ConfigSettings
    SET Description='Enable to create candidates from the upload'
        WHERE Name='createCandidates';

UPDATE ConfigSettings
    SET Description='Enable to use batch management of the imaging pipeline'
        WHERE Name='is_qsub';

