# Examiner module - Test Plan 
1. Access Examiner module page, ensure that it renders.
   [Automation Testing]
2. Access Examiner module page with examiner view permission, ensure that it renders.
   [Automation Testing]
3. Check that filtering of the data table works well after inputting selection into filter fields.
   [Automation Testing]
4. Check "Clear Filters" button works well.
   [Automation Testing]
5. Test Add a new examiner.
   [Automation Testing]  
    a. Check that if you try to add an examiner with no name or no site, a warning message appears.  
    b. A success message should appear when the examiner is created.  
    c. Check that the new examiner appears on the examiner list. 
6. Test Edit Examiner.
   [Manual Testing]  
    a. Click on an existing examiner's name and check that it takes you to the "Edit Examiner" page.    
    b. Fill out the BMI and Radiology Review sections, as well as the dates, and press "Save". There
    should be no error.  
    c. Press the "Reset" button and check that the information you filled out in step B appears in the Change Log.    
    d. Try to change either the BMI or Radiology Review back to the "N/A" option and check that an error message appears.     
    e. Change the status of either BMI or Radiology Review to "Certified" and return to the examiner list page. Check
    that the examiner now has that certification listed.   
