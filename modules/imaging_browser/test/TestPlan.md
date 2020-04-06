## Imaging Browser test plan
	
### Imaging Browser main page
1. User can access Imaging Browser module front page IFF has permission imaging_browser_view_site, imaging_browser_view_allsites, imaging_browser_phantom_allsites or imaging_browser_phantom_ownsite [Partial Automation Testing; To ADD phantom permissions automated tests]
2. User can see other sites Imaging datasets IFF has permission imaging_browser_view_allsites. User can see only own site Imaging datasets IFF has permission imaging_browser_view_site. User can see phantom data only from across all sites with the imaging_browser_phantom_allsites, and from own sites with imaging_browser_phantom_ownsite [Partial Automation Testing; TO ADD phantom permissions automated tests]
3. Test that all filters work.
    - When the Site filter is empty, all sites with which the user is associated should be displayed. Every site should be displayed if the user has the `imaging_browser_view_allsites` permission.
4. Test Clear Filters button
5. Test column table is sortable by headers
6. Ensure that the hyperlinks in the Links column are active and load the correct dataset.
7. Add more modalities (from the Scan_type column of the `mri_scan_type` table) to the Configuration/Imaging Modules/Tabulated Scan Types field, and ensure that for each added modality, a new corresponding column shows up in the Imaging Browser table. (This requires back-end access.)

### View Session / Volume List

Sidebar:  all links work, including the Download DICOM option. Ensure that projects can customize (add/remove) their list of instruments that can be linked to from the Configuration/Imaging Modules/Imaging Browser Links to Insruments
Select an image using the checkbox above the volume previews. Click the "3D Only" and "3D + Overlay" buttons. These should load the Brain Browser module.
Visit level QC controls (Pass/Fail, Pending, Visit Level Caveat) viewable to all, editable IFF permission imaging_browser_qc
Save button appears IFF permission imaging_browser_qc
Test Save button works 
Verify Visit-level QC controls and comments can be deleted/unchecked/emptied and saved
Test Breadcrumb link back to Imaging Browser

### Main panel:  per acquisition:

Files can be downloaded (links clickable) only IFF has permission. Ensure that DICOM downloads are
prepended with the Patient Name.
Scan-level QC flags (Selected, pass/fail, Caveat emptor) viewable to all, modifiable IFF permission `imaging_browser_qc`. 
Caveat List link is viewable with the Violated Scans: View all-sites Violated Scans permission
Selected:  can be set back to Null (blank)
Clicking on an image should launch BrainBrowser
Clicking on the "QC Comments" button should open the QC comments window
Longitudinal View button launches BrainBrowser with images of the chosen modality for that specific candidate across visits/timepoints

### MRI-QC : Scan-level (QC Comments) dialog window

With the permission `imaging_browser_qc`, edit comments, checkboxes, and dropdown values. 
Clicking Save should update the values.
Data should not be editable without this permission.

### Visit-level QC feedback dialog window
On the view session page, click the button "Visit Level Feedback".
The entries in this dialog should be editable when a user has the permission `imaging_browser_qc`.
Try editing comments (adding new ones, deleting old ones). Click Save and ensure the data is saved.
