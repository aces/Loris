# DICOM Archive - Test Plan

1.  Access the 'DICOM Archive' under 'Imaging' Tab and check to see if the user has permission
    [Automation Testing]
2.  Click on 'Selection Filter' to show and hide the Filter options
    [Manual Testing]
3.  Choose a parameter from the 'Selection Filter' that applies: [Automation Testing]
     - Select the right 'Site'
     - Input the right 'Patient ID'
     - Input the right 'Patient Name'
     - Input the right 'Date of Birth'
     - Input the right 'Archive Location'
     - Input the right 'Sex'
     - Input the right 'Acquisition Date'
     - Input the right 'Series UID'
     - Check the results in the table
4.  Click on 'Clear Filters' to make sure the previously entered data can be erased
    [Automation Testing]
5.  Click on 'View Details' under Metadata to view the Details of MRI Scan
    [Manual Testing]
6.  Under 'View Details' Check to make sure all the specific parameters are Populated
    [Manual Testing]
7.  Under 'View Details' Click on 'Acquisition ID' to view the violated scans (if there are any) if permission 
    'Violated Scans: View all-sites Violated Scans' is granted
    [Manual Testing]
8.  Under 'View Details' Click on 'Show/Hide Series' and 'Show/Hide Files' to view a list of all DICOM Series/Files,
    respectively, for the given DICOM study
    [Manual Testing]
9.  Make sure that the value of 'Patient ID' column is 'INVALID-HIDDEN' if the PatientID does not match the
    regex set in the Configuration module under the 'Imaging Modules' submenu. Repeat the same operation for
    'Patient Name' [Manual Testing]
10. Click on 'View Images' to acess the Imaging-Browser for the given subject if 'View all-sites Imaging Browser 
    pages' or 'View own-site Imaging Browser pages' permission is set
    [Manual Testing]
11. Ensure that clicking on any row in the 'Archive Location' column triggers a download of the corresponding 
    archived DICOM study. Make sure that the copy of the file downloaded to
    your system is prepended with the Patient Name field.
    [Manual Testing]
