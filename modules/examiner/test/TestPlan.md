# Certification module - Test Plan 

1. User can view certification module IFF has permission (12) "certification"

2. All Filters work; sorting by column headers works

3. Use "Add Certification" button to add a certification, with and without specifying examiner name, measure

4. Edit/update/remove existing examiner certification

5. User can View certifications from other sites IFF has permission (13) "certification_multisite"

6. User can Add certifications for other sites IFF has permission (13) "certification_multisite"

7. User can Edit examiner certifications for other sites IFF has permission (13) "certification_multisite"

8. Add Examiner dialog works properly: drop-downs populated appropriately, data saves

9. Saving and resetting form works

10. For projects with certification enabled, on instruments requiring certification, check that Instrument form(s) are populating examiner field only with certified examiners.  

11. Modify examiner certifications, re-load instrument form, and check that the examiner fields are re-populating appropriately.

12. Test cross-project "Enable Certification" config option  - e.g. turn it off and check that non-certified examiners get populated on certification-marked projects

13. Test "Project Certification" config option

14. Test Certification instruments list

15. Check for examiners over multiple projects
