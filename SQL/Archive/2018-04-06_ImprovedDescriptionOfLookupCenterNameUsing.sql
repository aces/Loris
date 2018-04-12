-- Change description and label of the ConfigSetting named lookupCenterNameUsing
UPDATE ConfigSettings SET
    Description = "DICOM field to use to get the patient and center name of the DICOM study, being either PatientID or PatientName",
    Label = "Patient and center name lookup variable"
    WHERE Name = "lookupCenterNameUsing";
