#Data Integrity Flag Test Plan

1. Check permissions. You should not be able to access the page without permission 'data_integrity_flag'.
2. Check that tab exists on a default install (Tools > Data Integrity Flag).
3. Check that results are being shown/populated in the bottom table.
4. Ensure that clicking on the instrument link takes you to the Data Team Helper with the correct instrument and visit label.

### Selection Filter
5. Check that the filters in the Selection Filter work:
 * Visit_labels
 * Instruments (should re-populate with visit_label choice)
 * Users
 
### Set Flag
6. Once "Show Data" has been clicked, make sure 'Set Flag' values populate and are correct:
 * Visit
 * Instrument
7. Ensure that the right users show up for the dropdown
8. Try saving 'Set Flag' without specifying a date. "Date is required" error message should appear and prevent you from saving.
9. Try saving 'Set Flag' without setting the Flag Status. "The validation flag is not set' error message should appear and prevent you from saving.
10. Try updating the parameters and click "Save". Ensure the values are saved in the back-end table 'data_integrity_flag'.
11. Press the 'Show Updated Data' button. Updated data should show in the front-end table.