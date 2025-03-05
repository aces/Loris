# Login Statistics Test Plan

1. Create a query in the dataquery module, including the Project column.
2. Pin the query to the login page by pressing the Pin icon, then entering a name, 
and checking "Pin to Login Page". If a query returns more than one row, the name will be appended with an 's'. Note that the query will not be pinned if it returns 0 rows, and will not be pinned if it does not include the Project column.
3. Run `tools/update_login_summary_statistics.php` and confirm the output matches the count of the rows
from the dqt.
4. Log out of LORIS and confirm you can see the Login Statistics widget along with the pinned DQT query.
5. If `project/tools/Login_Summary_Statistics` is non-existant, confirm that the queries from `SQL/Login_Summary_Statistics` were run and added to the widget. If it is not non-existent, confirm that those queries were added instead.
6. Set a Project in SQL to have `showSummaryOnLogin = False`. Then run the script again and confirm 
that the project is no longer displayed in the Login Statistics widget, and the numbers are not included in the All project.