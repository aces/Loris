MRI Violations Module Test Plan:

1.  Check user access. Permission – `violated_scans`
2.  Check Selection Filter results for each of Patient Name, File Name,
    Series Description or Scan Type, Time Run, Type of Problem, SeriesUID
3.  Filter for scans that violate MRI Protocol violation (Type of Problem : Could not identify scan type)
    Ensure link under Problem column goes to MRI Protocol Violations page with correct scan information
    set in the filters
4.  MRI Protocol Violations page - check user access, Permission - `view_final_radiological_review`
5.  MRI Protocol Violations page check Selection Filter results for each of DCCID, PSCID, PatientName, SeriesUID,
    Time Run, Series Description
6.  MRI Protocol Violations page - ensure first table displays all valid protocols
    for the study
7.  MRI Protocol Violations page - displays header information of violated scan
8.  MRI Protocol Violations page - allows editing of protocol table with permission `violated_scans_modifications`
9.  Filter for scans that violate MRI check  (Type of Problem : MRI Protocol Check violation). Ensure link
    under Problem column goes to MRI Protocol Check Violations page with correct scan information
10. MRI Protocol Check violation page- check user access, Permission - `view_final_radiological_review`
11. MRI Protocol Check violation page check Selection Filter results for each of Tarchive ID, PatientName, CandID
    DICOM Series UID
12. MRI Protocol Check violation page - click on link under PatientName column, should go to Dicom Archive for the
    patient
13. Upload scan that violates protocol and ensure it shows up in the module
14. Upload scan that violates protocol check and ensure it shows up in the module
