# Projects

## Overview
The **Project** represents a study in LORIS and can have different subprojects (see [Subproject setup](04 - Subprojects.md) page) which, in turn, can be affiliated with different visits (see [Timepoints setup](05 - Timepoints.md) page).

**Projects** are defined in the `Project` table of the database.
         
## Adding Project Options

### Front End (Recommended)
Projects are defined in the Configuration module, which can be found in LORIS under the **Admin** menu tab. Follow the steps below to create your own study projects.

1. Enable multi-project support. In the Configuration module under the ***Study variables*** section, set the field ***Use Projects*** to true and click the ***Submit*** button at the bottom of the page.  After changing this setting, be sure to refresh the Configuration module page to see the changes.

2. To define project labels and recruitment targets, within the Configuration module click on the link at the top of the page indicating ***To configure study projects click here***.

3. For each project, enter the _project label_ and _recruitment target (optional)_, and click ***save***. 

> Deleting a defined project can only be done through the project table in the MySQL back end. 

### SQL
Projects can be added directly in SQL using the following command. The `recruitmentTarget` field is optional but should be set when the information is available.

```sql
INSERT INTO Project (Name, recruitmentTarget) VALUES('%PROJECT_NAME%', NULL);
```


### API
 _not yet available. See [API documentation](../../../API/) for latest additions_
 
## Interaction With LORIS
**Projects** can have a direct effect on some LORIS modules where users will only be able to access data affiliated with their own projects.
