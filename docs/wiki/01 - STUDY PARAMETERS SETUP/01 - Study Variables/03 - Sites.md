# Centers

## Overview Study

**Sites** or **Centers** are terms used interchangeably in LORIS.
**Centers** are defined in the `psc` table of the database 
(_psc_ stands for _Project Study Center_).

LORIS' default schema defines the first `psc` (`CenterID=1`) as the
Data Coordinating Center (DCC).  This center is generally used for
dummy data and it is assumed by the codebase to store exclusively 
non-study data. Therefore, it is not recommended to modify or use 
this center for registering real participants or study data.

>  Note: There cannot be more than one center with the same name.

## Adding Site Options

### Front End

_not yet available_

### SQL

The `psc` table in the database contains all the information stored
for centers. Populate additional centers using the following MySQL
command:

```sql 
INSERT INTO psc (Name, Alias, MRI_alias, Study_site) VALUES ('Montreal','MTL','MTL','Y');
```

> Please refer to the [SQL taxonomy]() for additional information about
> this table and its fields.

### API

 _not yet available. See [API documentation](../../../API/) for latest
additions_

## Interaction With LORIS

**Centers** have a direct impact on results returned in all LORIS modules. Users are only able to access data which has been collected by the centers they are affiliated with.

> note: Sessions are tagged with a specific center but are only accessible to users if and only if the candidate itself is affiliated with a center to which the user belongs.