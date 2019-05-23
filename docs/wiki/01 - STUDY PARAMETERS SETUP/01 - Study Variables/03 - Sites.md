# Sites

## Overview Study

**Sites** (preferred) or **Centers** are terms used interchangeably 
in LORIS. **Sites** are defined in the `psc` table of the database 
(_psc_ stands for _Project Study Center_).

LORIS' default schema defines the first `psc` (`CenterID=1`) as the
Data Coordinating Center (DCC).  This site is generally used for
dummy data and it is assumed by the codebase to store exclusively 
non-study data. Therefore, it is recommended not to modify or use 
this site for registering real participants or study data.

>  Note: There cannot be more than one site with the same name.

## Adding Site Options

### Front End

_not yet available_

### SQL

The `psc` table in the database contains all the information stored
for sites. Populate additional sites using the following MySQL
command:

```sql 
INSERT INTO psc (Name, Alias, MRI_alias, Study_site) VALUES ('Montreal','MTL','MTL','Y');
```

> Please refer to the [SQL Dictionary](SQL Dictionary.md) for additional information about
> this table and its fields.

### API

 _not yet available. See [API documentation](../../../API/) for latest
additions_

## Interaction With LORIS

**Sites** have a direct impact on results returned in all LORIS modules. Users are only able to access data which has been collected by the sites they are affiliated with in most modules.

> note: Sessions are tagged with a specific site but are only accessible to users if and only if the candidate itself is affiliated with a site to which the user belongs.
