-- Change description and label of the ConfigSetting named lookupCenterNameUsing
UPDATE ConfigSettings SET
    Description = "DICOM field to use to get the patient identifiers (being stored either in PatientName or PatientID) and the center name of the DICOM study",
    Label = "Patient identifiers and center name lookup variable"
    WHERE Name = "lookupCenterNameUsing";
