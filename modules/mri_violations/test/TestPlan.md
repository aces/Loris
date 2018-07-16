MRI Violations Module Test Plan:

1.  Check user access. Permission – `Violated Scans: View all-sites Violated 
    Scans`
    [Automation Testing]
2.  Check Selection Filter results for each of Patient Name, File Name,
    Series Description or Scan Type, Time Run, Type of Problem, SeriesUID
    [Manual Testing]
3.  Filter for scans that violate MRI Protocol violation (For each type of 
    Problem : 'Could not identify scan type', 'Visit Label does not exist',  
    'Protocol Violation', 'CandID and PSCID do not match' and 'CandID 
    does not exist').
    Ensure that the link under the 'Problem' column bring you to:
     - the 'MRI Protocol Check Violations' page listing all violations when 
     the link is 'Protocol Violation' (check that correct scan information 
     are set in the filters of that page)
     - the 'MRI Protocol Violations' page listing all protocol violations 
     with the MRI protocol parameters showing as a first table (check that 
     correct scan information are set in the filters of that page) 
    [Manual Testing]
4.  MRI Protocol Violations page check Selection Filter results for each of 
    DCCID, PSCID, PatientName, SeriesUID, Time Run, Series Description
    [Automation Testing]
5.  MRI Protocol Violations page - ensure first table displays all valid 
    protocols for the study
    [Manual Testing]
6.  MRI Protocol Violations page - displays header information of violated scan
    [Manual Testing]
7.  MRI Protocol Violations page - allows editing of protocol table with 
    permission 'Violated Scans: Edit MRI protocol table'.
    Edit values in the protocol table and verify it is saved in the database.
    [Manual Testing]
8.  Verify one or two of the scans in the second table and ensure it indeed 
    violates the MRI protocol.
    [Manual Testing]
9.  Filter for scans that violate MRI checks  ('Type of Problem' = 'Protocol 
    Violation'). Ensure link under the 'Problem' column goes to the MRI 
    Protocol Check Violations page with correct scan information
    [Manual Testing]
10. MRI Protocol Check Violations page - check Selection Filter results for 
    each of Tarchive ID, PatientName, CandID and DICOM Series UID
    [Manual Testing]
11. MRI Protocol Check Violations page - click on link under PatientName 
    column, should go to DICOM Archive for the patient if permission 'Across 
    all sites view DICOM Archive module and pages' is granted
    [Manual Testing]
12. Upload scan that violates protocol and ensure it shows up in the module
    [Manual Testing]
13. Upload scan that violates protocol checks and ensure it shows up in the 
    module
    [Manual Testing]
14. Resolve issues with each of the different types of resolutions, and ensure 
    that they show up in the resolved tab, and are no longer in the unresolved
    tab
    [Manual Testing]
15. Ensure that the link to the protocol violation works within the resolved tab 
    [Manual Testing]
16. Ensure all filters and sorting work in the resolved tab
    [Manual Testing]
17. Change user access to: Take away permission for - `Violated Scans: View 
    all-sites Violated Scans`
    [Automation Testing]
18. Ensure that now you can not see this module
    [Manual Testing]
