# Subprojects

## Overview
**Subprojects** are defined in the front-end by the Configuration module, and are stored in the `subproject` table of the database.
The **Subproject** plays an important role in determining the instrument battery that will be assigned to a candidate at a timepoint.  The subproject can be used as a variable when determining which instruments are populated -- this allows for subproject-specific batteries to be defined in the `test_battery` table. 

## Adding Subproject Options

### Front End (Recommended)
Subprojects are defined in the Configuration module, which can be found in LORIS under the **Admin** menu tab.  Click on _To configure study subprojects click here_ link at the top of the page. Refer to the help section of the module for further instructions on how to add or modify subprojects.
   
### SQL
Subprojects can be added directly in SQL using the following command.

```sql
INSERT INTO subproject (title) VALUES('SCI');
```


### API
 _not yet available. See [API documentation](../../../API/) for latest additions_
 

## Interaction With LORIS

### Projects
**Subprojects** must be associated to Projects in order to be able to create timepoints for candidates. This association should be defined directly on the front end through the Configuration module.

1. Navigate to the Configuration module
2. In the upper left corner click on _To configure study projects click here._
3. Under each project, you should be able to define the associated subprojects.

> Note: If affiliation of subprojects to projects can not be done from the front-end, it could be done directly in SQL as follows. 

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
