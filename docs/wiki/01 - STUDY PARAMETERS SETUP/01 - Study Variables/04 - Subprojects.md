# Subprojects

## Overview
The **Subproject** plays an important role in determining the instrument battery that will be assigned to a candidate at a timepoint.

**Subprojects** and **Cohorts** are terms used interchangeably in LORIS. **Subprojects** are defined in the `subproject` table of the database.


## Adding Subproject Options

### Front End (Recommended)
Subprojects are defined in the Configuration module, which can be found in LORIS under the **Admin** menu tab.  Click on _To configure study subprojects click here_ link at the top of the page.
  
   You will then need to click click on _New SubprojectID_, fill in the fields on the right, click _save_. Refresh the page to view your new subproject. If you accidentally create an extra entry, you will have to delete it from the database manually with an SQL command.  This process is similar to adding new projects.
   
### SQL
Subprojects can be added directly in SQL using the following command.

```sql
INSERT INTO subproject (title) VALUES('SCI');
```


### API
 _not yet available. See [API documentation](../../../API/) for latest additions_
 

## Interaction With LORIS

### Projects
**Subprojects** must be associated to Projects (when enabled, see [Projects setup](02 - Projects.md) for more details) in order to be able to create timepoints for candidates. This association should be defined directly on the front end through the configuration module.

1. Navigate to the Configuration module
2. In the upper left corner click on _To configure study projects click here._
3. Under each project, you should be able to defined the associated subprojects.

> Note: If affiliation of subprojects to projectscan not be done from the front-end, it could be done directly in SQL as follows. 

  ```sql 
  INSERT INTO project_subproject_rel
  SELECT
	p.ProjectID,
	s.SubprojectID
  FROM
	Project p,
	subproject s
  WHERE
	p.Name = "%PROJECT_NAME%"
	AND s.title IN("%SUBPROJECT_1%", "%SUBPROJECT_2%", "%SUBPROJECT_3%");
   ```
