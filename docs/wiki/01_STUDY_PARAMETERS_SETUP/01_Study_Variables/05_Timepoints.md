# Timepoints

## Overview
**Timepoints** are a list of possible instances in time where a candidate can visit or contact a site with the purpose of undergoing any form of data collection.

**Timepoint** and **Visit** are terms used interchangeably in LORIS (the preferred term is **Timepoint**). **Timepoints** are defined in the `Visit_Windows` and `visit` tables of the database as well as the `<visitLabel>` tags in the `config.xml`.

## Adding Timepoint Options

### Front End
 _not yet available_

### SQL

The `Visit_Windows` table lists the timepoints in the study and adds some study-specific age ranges defined for each timepoint. This table must be populated with visit labels for the proper functioning of LORIS. To populate the table with visit labels insert study-specific information as follows:

```sql
INSERT INTO Visit_Windows (Visit_label,  WindowMinDays, WindowMaxDays, OptimumMinDays, OptimumMaxDays, WindowMidpointDays) VALUES ('V1', 0, 100, 40, 60, 50);
```

If age is not a critical factor in study timepoint scheduling, define `Min` and `Max` values as `NULL`.

> In event where the timepoints are already defined in the `config.xml` (see *Interaction With Loris* section below), run `tools/single_use/populate_visit_windows.php` to automatically import the visit labels into the `Visit_Windows` table.

The `visit` table lists all the timepoints. This table must be populated with visit labels for the proper functioning of LORIS. To populate with timepoints insert information as follows:

```sql
INSERT INTO visit (VisitName) VALUES ('V1');
```

### API
 _not yet available. See [API documentation](../../../API/) for latest additions_
 
## Interaction With LORIS

### Subprojects
 **Timepoints** should be assigned to subprojects in order to be able to create timepoints for candidates. This association should be defined in the `config.xml` file of the `%LORIS_ROOT%/project/` directory as follows:
 
 ```xml
 <visitLabel subprojectID="1">
   <labelSet>
     <item value="V1">V1 label description</item>   
     <item value="V2">V2 label description</item>   
   </labelSet>
 </visitLabel>
 <visitLabel subprojectID="2">
   <labelSet>
     <item value="V1">V1 label description</item>   
     <item value="V3">V3 label description</item>   
   </labelSet>
 </visitLabel>
 ```
