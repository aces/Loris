Issue Tracker Filter Form [Automation Testing]
1. User can access the page iff they have issue tracker reporter or developer permission
2. User can see data from other sites iff they have access_all_profiles permission
3. Test that all filters work. Nothing should be filtered at first loading.
4. Test that all tabs (with filters) work and redirect to the correct table. My issues should be missing assignee filter and closed issues should be missing status filter. 
5. Test that the watching checkbox works correctly (issues that your userID is watching in issues_watching table)
6. Check that links to issues in table are correct.
7. Check that table sorts and displays additional pages correctly 

Issue Tracker Create New Issue [Manual Testing]
1. User can access the page if they have reporter permission
2. Check that title and assignee are required. 
3. Should display message, and redirect after success. 
4. Submit invalid and valid PSCID and visit label pairs. Error messages should respond accordingly. Not that you cannot submit PSCIDs from other sites unless you have access all profiles permission
5. Submit just a visit label - this should give an error message.
6. Check that all values are propagated and saved correctly.
7. Check that watching logging is working - turn it off and on for your current user, and for other watchers on the issue

Issue Tracker Edit Existing Issue [Manual Testing]
1. User can access the page if they have (developer or reporter permission) and (they have either access_all_profiles or are a member of the site of the issue or the site has no issue).
2. Users who have reporter permission can edit all fields if it is their issue, but are blocked except for commenting for all other issues. Developers can make all changes on all issues that they can view. 
3. Users can only enter a PSCID for those candidate that are in their site.
4. Submit invalid and valid PSCID and visit label pairs. Error messages should respond accordingly. Not that you cannot submit PSCIDs from other sites unless you have access all profiles permission
5. Submit just a visit label - this should give an error message.
6. Check that all values are propagated and saved correctly.
7. Check that watching logging is working - turn it off and on for your current user, and for other watchers on the issue


Permissions [Automation Testing]
1. Remove access all profile permission.
2. Remove reporter permission
3. Remove developer permission
4. Test that the module behaves correctly as described above. 
