#Final Radiological Review Test Plan

1. Try to access the Final Radiological Review menu item. You should only be able to see the menu item if you have the edit_final_radiological_review or the view_final_radiological_review permission.
2. Clicking on the menu item should bring you to the radiological review menu filter page. You should only be able to access this page if you have view_final_radiological_review permission.
3. Test the filter. Try each filter separately (by clicking the 'Show Data' button) and ensure the table is filtered properly.
	* Site
	* Conflict between final and extra reviews
	* Review Done
	* SAS (Subarachnoid Spaces)
	* Results
	* Finalized
	* Conflict between any reviews
	* Visit Label
	* Project
	* PVS (Perivascular Spaces)
	* Exclusionary Status
4. Try the search keyword filters and ensure they are working.
	* Search keyword in Comments
	* PSCID
	* DCCID
5. Fill out some of the filters and click the "Clear Form" button. It should reset the form.
6. Click on the arrow in the top right corner of the filter form and make sure the filter form area collapses.
7. For each column header in the table, check that it is clickable, and sorts the table on that column.
8. Look at the data in the table and check that it is consistent with the data stored in the database.
9. The values in the PSCID column should be hyperlinks. Try clicking on the links. Make sure that it takes you to the appropriate final radiological review page (right candidate and right visit). You should only be able to access these pages if you have the view_final_radiological_review permission.
10. On one of these final radiological review pages, check that the Imaging Browser and Original Radiology Review links are working.
11. In the form area, try filling out each of the form boxes and pressing the "Save" button. The page should refresh. Ensure that the values were saved. You should only be able to save values if you have the edit_final_radiological_review permission.
  a) Check that the Site Review column data matches what is in the database.
  b) Input test conflicting data and Check that a conflict message appears if there is a difference between the Final and Extra reviews after click 'Save' button.
  c) Input test conflicting data and Check that a conflict message appears if there is a difference between the Site and Final reviews after click 'Save' button.
12. Alter one of the form fields and save the form. Check that a new row is added to the change log, documenting the change.
