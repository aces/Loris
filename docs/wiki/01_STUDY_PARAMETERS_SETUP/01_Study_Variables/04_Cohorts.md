# Cohorts

## Overview
**Cohorts** are defined in the front-end by the Configuration module, and are 
stored in the `cohort` table of the database.
The **Cohort** plays an important role in determining the instrument battery 
that will be assigned to a candidate at a timepoint.  The cohort can be used as 
a variable when determining which instruments are populated -- this allows for 
cohort-specific batteries to be defined in the `test_battery` table. 

## Adding Cohort Options

### Front End (Recommended)
Cohorts are defined in the Configuration module, which can be found in LORIS 
under the **Admin** menu tab.  Click on _To configure study cohorts click here_ 
link at the top of the page. Refer to the help section of the module for further 
instructions on how to add or modify cohorts.
   
### SQL
Cohorts can be added directly in SQL using the following command.

```sql
INSERT INTO cohort (title) VALUES('SCI');
```

### API
_not yet available. See [API documentation](../../99_Developers/LORIS-REST-API-0.0.3-dev.md) for latest additions_
 
## Interaction With LORIS

### Projects
**Cohorts** must be associated to at least one Project in order to be able to 
create timepoints for candidates. This association should be defined directly on the 
front end through the Configuration module.

> Note: the only way to view a list of all the projects affiliated to a cohort 
is via the MySQL back-end. 

Sometimes it's useful to add project-cohort affiliations directly in the MySQL 
back-end, for example when adding datasets to your LORIS.  The following MySQL 
statement is provided as an example for linking already-defined cohorts with an 
existing project:  

  ```sql 
  INSERT INTO project_cohort_rel
  SELECT
	p.ProjectID,
	s.CohortID
  FROM
	Project p,
	cohort s
  WHERE
	p.Name = "%PROJECT_NAME%"
	AND s.title IN("%COHORT_1%", "%COHORT_2%", "%COHORT_3%");
  ```
