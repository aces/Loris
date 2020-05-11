# Imaging Quality Control - Test Plan
1. Access Imaging Quality Control page, ensure that it renders.
2. Make sure this module can be viewed if and only if the user has “Quality Control access” permission.
3. Make sure this module only loads if the `mri_parameter_form` table exists and is properly configured.
4. Make sure this module only loads if there are `Scan_Done` columns in the `mri_parameter_form` table for each scan type.
5. Change maximum rows per page. Ensure that the number of rows displayed changes correspondingly each time.
6. Navigate through pages by selecting the page numbers at the top right of the result section and the bottom right of the result section.
7. Navigate from first to last page & vice versa using the double arrows at the top right of the result section and the bottom right of the result section.
8. Download the table as CSV. Make sure that the file downloads and that the contents of the file correspond exactly to the contents of the results table, including column and row order.
9. Select some filters to reduce the size of the data set. Click to download the table as CSV. Make sure that the file downloads and that the contents of the file correspond exactly to the filtered results displayed in the table, including column and row order.
10. Select filters in each category, make sure that the results change corresponding to what is selected.
11. Select combinations of various filters, make sure that the results change corresponding to what is selected.
12. Select several filters to reduce the size of the imaging data set, and then select clear filters. Make sure that it returns to the full data set and that each filter is cleared.
13. Click on the column header to make sure that the files re-organize to be ordered by the selected column. Click the same one again to make sure that it now organizes in reverse order. Try this with each of the columns.
14. For one or two candidates, verify that the results are accurate for key columns (`Scan type`, `Scan Done in MRI PF`, `Tarchive`, `Scan Location`, `QC Status`, `Selected`).
