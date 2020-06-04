UPDATE ConfigSettings
    SET Description='Enable generation of horizontal pictures'
    WHERE Name='horizontalPics';

UPDATE ConfigSettings
    SET Description='Enable creation of NIfTI files'
    WHERE Name="create_nii";

UPDATE ConfigSettings
    SET Description='Enable candidate creation in the imaging pipeline'
        WHERE Name='createCandidates';

UPDATE ConfigSettings
    SET Description='Enable use of batch management in the imaging pipeline'
        WHERE Name='is_qsub';

