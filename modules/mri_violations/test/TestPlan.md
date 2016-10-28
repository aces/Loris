MRI Violations Module Test Plan:

1.  Check user access. Permission – `Violated Scans: View all-sites Violated Scans`
2.  Check Selection Filter results for each of Patient Name, File Name,
    Series Description or Scan Type, Time Run, Type of Problem, SeriesUID
3.  Filter for scans that violate MRI Protocol violation (For each type of Problem : Could not identify scan type, Visit Label does not exist, MRI Protocol Check Violation, Candidate mismatch)
    Ensure link under Problem column goes to MRI Protocol Violations page with correct scan information 
    set in the filters, and parameters showing when could not identify scan type, or MRI Protocol Check Violation are the type of problem
4.  MRI Protocol Violations page check Selection Filter results for each of DCCID, PSCID, PatientName, SeriesUID,
    Time Run, Series Description
5.  MRI Protocol Violations page - ensure first table displays all valid protocols
    for the study
6.  MRI Protocol Violations page - displays header information of violated scan
7.  MRI Protocol Violations page - allows editing of protocol table with permission 'Violated Scans: Edit MRI protocol table'.
    Edit values in the protocol table and verify it is saved in the database.
8.  Verify one or two of the scans in the second table and ensure it indeed violates mri protocol.
9.  Filter for scans that violate MRI check  (Type of Problem : MRI Protocol Check violation). Ensure link
    under Problem column goes to MRI Protocol Check Violations page with correct scan information
10. MRI Protocol Check violation page check Selection Filter results for each of Tarchive ID, PatientName, CandID
    DICOM Series UID
11. MRI Protocol Check violation page - click on link under PatientName column, should go to Dicom Archive for the
    patient if permission 'Across all sites view Dicom Archive modile and pages' is granted
12. Upload scan that violates protocol and ensure it shows up in the module
13. Upload scan that violates protocol check and ensure it shows up in the module
14. Resolve issues with each of the different types of resolutions, and ensure that they show up in the resolved tab, and are no longer in the unresolved tab
15. Ensure that the link to the protocol violation works within the resolved tab 
16. Ensure all filters and sorting work in the unresolved tab
17. Change user access to: Take away permission for - `Violated Scans: View all-sites Violated Scans`
18. Ensure that now you can not see this module
