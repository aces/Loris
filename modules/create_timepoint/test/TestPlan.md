# Create Timepoint Test Plan:

1. Access a candidate that does not have all timepoints from project created
   from Access Profile and click "Create time point".
   [Automation Testing]

2. Ensure that clicking on all elements of the breadcrumbs takes you to the
   appropriate page.
   [Automation Testing]

3. Ensure the DCCID field displays the correct candidate's identifier.
   [Automation Testing]

4. Ensure the user can only choose from Projects and Sites they are affiliated with.
   [Automation Testing]

5. Ensure the Cohort dropdown is dynamically populated once a site and
   project are selected.
   [Automation Testing]

6. Ensure the Visit label dropdown is dynamically populated once the Cohort
   selection is done.
   [Automation Testing]

7. Confirm that options displayed for cohorts and visit labels fields match
   the content of the `project_cohort_rel` table and the
   `visit_project_cohort_rel` table respectively.
   [Automation Testing]

8. Ensure that a popup error is displayed when a project with no cohort
   associations is selected.
   [Automation Testing]

9. Ensure that a popup error is displayed when a cohort is selected, in
   combination with a project, where no visit labels are defined for that
   project-cohort combination.
   [Automation Testing]

10. Ensure that if the user is affiliated with a single project and/or a single
    site, the Project/Site dropdowns are auto-populated with the sole available option.
    [Automation Testing]

11. Ensure that if the cohort and/or visit label dropdowns contain a single
    option only, the option is auto-selected by default.
    [Automation Testing]

12. Choose a site, project, and cohort, and make sure to select a visit which
    the candidate already has. Ensure that an error appears stating that the
    visit label already exists for the candidate.
    [Automation Testing]

13. Ensure that you get an alert saying: "Success! Time Point Created" upon
    a successful form submission. Click on "Ok" button and ensure that it brings you back
    to the timepoint list page for that candidate and confirm that the new timepoint appears in the list.
    [Automation Testing]

14. Ensure that there is no empty option in the language select element, and
    a language is automatically selected when only one language exists in the `language` table.
    [Automation Testing]

15. Ensure that there is an empty option in the language select element and the field is required when more than one
    language exists in the `language` table.
    [Automation Testing]

16. Check that the page is inaccessible if either the user does not have data_entry
    permission or the user and candidate are not in the same site.
    [Automation Testing]

