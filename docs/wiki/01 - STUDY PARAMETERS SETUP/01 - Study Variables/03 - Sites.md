# Sites

## Overview Study

**Sites** or **centres** are terms used interchangeably in LORIS.
**Sites** are defined in the `psc` table of the database.

LORIS' default schema defines the first psc (CenterID=1) as the
Data Coordinating Center or #DCC#.  This site is generally used as
dummy data and is assumed by the codebase to store non-study data,
and so it not recommended to modify or use this site for registering
real study data.

>  Note: There cannot be more than one site with the same name.

## Adding Options

### Front End

_not yet available_

### SQL

The `psc` table in the database contains all the information stored
for sites. Populate additional sites using the following MySQL
command :

```
sql INSERT INTO psc (Name, Alias, MRI_alias, Study_site)
	VALUES ('Montreal','MTL','MTL','Y');
```

### API

 _not yet available. See [API documentation](../../../API/) for latest
additions_

## Interaction With LORIS

_none_
