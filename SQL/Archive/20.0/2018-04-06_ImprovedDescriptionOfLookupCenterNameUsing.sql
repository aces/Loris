-- Change description and label of the ConfigSetting named lookupCenterNameUsing
UPDATE ConfigSettings SET
    Description = "DICOM field (either PatientName or PatientID) to use to get the patient identifiers and the center name of the DICOM study",
    Label = "Patient identifiers and center name lookup variable"
    WHERE Name = "lookupCenterNameUsing";
