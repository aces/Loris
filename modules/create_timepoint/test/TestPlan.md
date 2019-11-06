Create Timepoint Test Plan:

1. Access a candidate that does not have all timepoints from project created
from Access Profile and click "Create time point"
  [Automation Testing]
2. Ensure that clicking on all elements of the breadcrums takes you to the 
appropriate page.
  [Manual Testing]
3. Ensure that the DCCID field displays the correct candidate's identifier.
  [Manual Testing]
4. Choose a subproject from dropdown and ensure that the page reloads with 
subproject selected and also a list of visitlabels if <labelSet> is set in the config.xml.
  [Manual Testing]
   - Ensure that if the `config.xml` file contains a `<visitLabel subprojectID="X">` 
   matching the subproject ID selected, a list of visits ()defined in the same file 
   under the `<labelSet>` tag) should be displayed.
   - Ensure that if the `config.xml` file does not contain a matching `<visitLabel>` entry, an 
   error message should be displayed to the user. 
   - Ensure that if the logged in user has only 1 site affiliation, the site dropdown
   is not displayed on the page and the form can be submitted without any errors.
   - Ensure that if the logged in user has only 1 project affiliation, the project 
   dropdown is not displayed on the page and the form can be submitted without any 
   errors.
   - Ensure that if the logged in user has multiple site affiliations, the site 
   dropdown appears on the page and only displays the sites with which the user is 
   affiliated and the form can be submitted without any errors.
   - Ensure that if the logged in user has multiple project affiliations, the project 
   dropdown appears on the page and only displays the projects with which the user is 
   affiliated and the form can be submitted without any errors.
5. Ensure that submitting the page with any of the site, project or visit label 
options empty gives an error.
  [Manual Testing]
6. choose a site and project (if dropdowns are displayed) and make sure to select a 
visit which the candidate already has. Ensure that an error appears stating that the 
visit label already exists for the candidate.
  [Manual Testing]
7. Choose visit label to be created and click "Create Time Point".
Ensure that you get a page saying creation was successful.
Click on "Click here to continue" link and ensure that it brings you back
to timepoint list page for that candidate (with new timepoint created)
  [Manual Testing]
8. Check that page is inaccessible if either the user does not have data_entry
permission or the user and candidate are not the same site.
  [Manual Testing]
