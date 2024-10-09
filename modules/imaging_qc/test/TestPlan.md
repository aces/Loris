# Imaging Quality Control - Test Plan
1. Access Imaging Quality Control page, ensure that it renders.
2. Make sure this module can be viewed if and only if the user has “Imaging Quality Control: View Flagged Imaging Entries” (DB name: imaging_quality_control_view) permission.
3. Change maximum rows per page. Ensure that the number of rows displayed changes correspondingly each time.
4. Navigate through pages by selecting the page numbers at the top right of the result section and the bottom right of the result section.
5. Navigate from first to last page & vice versa using the double arrows at the top right of the result section and the bottom right of the result section.
6. Download the table as CSV. Make sure that the file downloads and that the content of the file corresponds to the content of the results table, including column and row order. Note that the downloaded CSV file might contain some hidden columns such as CommentID and TarchiveID.  
7. Select some filters to reduce the size of the data set. Click to download the table as CSV. Make sure that the file downloads and that the contents of the file correspond exactly to the filtered results displayed in the table.
8. Select filters in each category, make sure that the results change corresponding to what is selected.
9. Select combinations of various filters, make sure that the results change corresponding to what is selected.
10. Select several filters to reduce the size of the imaging data set, and then select clear filters. Make sure that it returns to the full data set and that each filter is cleared.
11. Click on the column header to make sure that the rows re-organize to be ordered by the selected column. Click the same one again to make sure that it now organizes in reverse order. Try this with each of the columns.
12. For one or two candidates, verify that the results are accurate for key columns (`Scan type`, `Scan Done in MRI PF`, `Tarchive`, `Scan Location`, `QC Status`, `Selected`).
13. Find a scan for which the value of `Scan Done in MRI PF` is set to `Yes`. Click on the link. Make sure it leads to the appropriate MRI parameter form if and only if the user has permission `data_entry`: if not, the system should display `You do not have access to this page`.
14. Find a scan for which the value of `Tarchive` is not `Missing`. Click on the link. Make sure it leads to the appropriate DICOM archive page if and only if the user has permission `dicom_archive_view_allsites`: if not, the system should display `You do not have access to this page`.
15. Find a scan for which the value of `Scan Location` is not `Missing`. Click on the link. Make sure it leads to the appropriate imaging browser page if and only if the user has the appropriate permissions:
    * User can access Imaging Browser module front page if and only if they have permission `imaging_browser_view_site`, `imaging_browser_view_allsites`, `imaging_browser_phantom_allsites` or `imaging_browser_phantom_ownsite`.
    * User can see own site and other sites Imaging datasets if and only if has permission `imaging_browser_view_allsites`.
    * User can see only own site Imaging datasets if and only if has permission `imaging_browser_view_site`.
    * User can see phantom data only from across all sites with the `imaging_browser_phantom_allsites`, and from own sites with `imaging_browser_phantom_ownsite`.

    If the user does not have the appropriate permission to view the scan, the system should display `You do not have access to this page`.
