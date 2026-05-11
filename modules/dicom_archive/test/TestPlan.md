# DICOM Archive - Test Plan

## Testing Access
*For every step below, make sure the user has access to the 'View Details' page for any row returned, the permissions to 'View details' shoudld reflect the data table entries access. Note also that it is preferable to use a user that doesn not own the data in the DICOM Archive module s ownership of the DICOMS influences their access (see value in CreatingUser column in the database)*
1. Remove All DICOM Archive permissions from user and make sure user is not a superuser
   [Manual Testing]
2. Disable the `useAdvancedPermissions` (Use Advanced Site Project Permissions) configuration under the Imaging Modules tab of the Configuration module.
   [Manual Testing]
3. Check to see that the user can not access the module (403 Forbidden).
4. Give the user the `dicom_archive_view_allsites` (DICOM Archive: View DICOMs - All Sites) permission alone.
    a. Make sure user can access the DICOM archive module
    b. Make sure user sees ALL entries from the database (including entries at sites the user is not affiliated with and entries with no site/no session affiliated).
   [Manual Testing]
5. Give the user the `dicom_archive_view_ownsites` (DICOM Archive: View DICOMs - Own Sites) permission alone.
    a. Make sure user can access the DICOM archive module
    b. Make sure user sees only entries from the database at the user's sites (user should not be able to see entries with no site/no session affiliated).
   [Manual Testing]
6. Give the user the `dicom_archive_view_ownsites` (DICOM Archive: View DICOMs - Own Sites) and `dicom_archive_nosessionid` (DICOM Archive: View DICOMs with no session ID) permissions together.
    a. Make sure user can access the DICOM archive module
    b. Make sure user sees entries from the database at the user's sites and entries with no site/no session affiliated.
   [Manual Testing]
7. Reset the users permissions to no DICOM Archive permission and enable the `useAdvancedPermissions` (Use Advanced Site Project Permissions) Configuration option
8. Give the user the `dicom_archive_view_allsites` (DICOM Archive: View DICOMs - All Sites) permission alone.
    a. Make sure user can access the DICOM archive module
    b. Make sure user sees entries from all sites but only from the user's projects (user should not be able to see entries with no site/no session affiliated as they are not affiliated to a project either).
   [Manual Testing]
9. Give the user the `dicom_archive_view_ownsites` (DICOM Archive: View DICOMs - Own Sites) permission alone.
    a. Make sure user can access the DICOM archive module
    b. Make sure user sees only entries from the database at the user's sites and projects (user should not be able to see entries with no site/no session affiliated as they are not affiliated to a project either).
   [Manual Testing]
10. Give the user the `dicom_archive_view_ownsites` (DICOM Archive: View DICOMs - Own Sites) and `dicom_archive_nosessionid` (DICOM Archive: View DICOMs with no session ID) permissions together.
    a. Make sure user can access the DICOM archive module
    b. Make sure user sees entries from the database at the user's sites and projects as well as entries with no site/no session/no project affiliated.
   [Manual Testing]
11. Make sure the user is the creator of at least one of the file entries in the tarchive table.
    - Make sure that regardless of the permissions, as long as the user has access to the module, they can see their own DICOMs
   [Manual Testing]

## Testing Functionality
1.  Access the 'DICOM Archive' under 'Imaging' Tab
    [Automation Testing]
2.  Under 'Selection Filter' section, verfiy that the following Filter options exist: Patient ID, Patient Name, Sex, Date of Birth, Acquisition Date, Archive Location, Series UID, Site.
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
7.  Under 'View Details' Click on 'Acquisition ID' to view the violated scans (if there are any) if the
    'MRI Violated Scans: View Violated Scans - All Sites' or 'MRI Violated Scans: View Violated Scans - Own Sites' is set.
    [Manual Testing]
8.  Under 'View Details' Click on 'Show/Hide Series' and 'Show/Hide Files' to view a list of all DICOM Series/Files,
    respectively, for the given DICOM study
    [Manual Testing]
9.  Make sure that the value of 'Patient ID' column is 'INVALID-HIDDEN' if the PatientID does not match the
    regex set in the Configuration module under the 'Imaging Modules' submenu. Repeat the same operation for
    'Patient Name' [Manual Testing]
10. Click on 'View Images' to acess the Imaging-Browser for the given subject if 'Imaging Browser: View Imaging Scans - All Sites' or
    'Imaging Browser: View Imaging Scans - Own Sites' permission is set, and the user has the corresponding project affiliation.
    [Manual Testing]
11. Ensure that clicking on any row in the 'Archive Location' column triggers a download of the corresponding 
    archived DICOM study. Make sure that the copy of the file downloaded to
    your system is prepended with the Patient Name field.
    [Manual Testing]