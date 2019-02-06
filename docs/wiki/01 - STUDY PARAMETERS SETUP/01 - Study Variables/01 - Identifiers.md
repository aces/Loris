# Identifiers

## Overview
By default LORIS provides 2 different identifiers for each participant or subject: 

- **CandID** also known as the **DCCID** : is a unique randomized 6-digit numeric ID (e.g. '436792').  It is completely anonymous, and is assigned automatically by Loris upon participant registration. 
- **PSCID** (Project Study Centre ID) is configurable, can be manually entered when registering a participant, and may contain the site abbreviation, followed by sequential or randomized characters (e.g. 'MTL0006')

The format and the generation of the **PSCID** must be configured by an admin at the setup stage.

## Configuration

### Front End
_not yet available_

### SQL
_not yet available_

### Adding identifiers from the config.xml file

Both the format and the generation of PSCIDs can be configured by the project in the `config.xml` file of the `%LORIS_ROOT%/project/` directory.

PSCIDs can be created for new subjects in one of 3 ways: *sequentially generated*, *manually entered*, or *randomly generated*.

1. ***sequential*** generates PSCIDs sequentially for each new participant registered. **(default)**

 ```xml
 <PSCID>
     <generation>sequential</generation> 
     <structure>
         <seq type="siteAbbrev"/>
         <seq type="numeric" minLength="4"/>
     </structure>
 </PSCID>
 ```

2. ***manual*** asks the user to enter the PSCID when registering a new participant.

 ```xml
 <PSCID> 
     <generation>user</generation> 
     <structure>
         <seq type="alphanumeric" minLength="4"/> <!-- Ex: AAA1-->
     </structure>
 </PSCID>
 ```

3. ***random*** generates PSCIDs with random numerical for each new participant registered.

 ```xml
 <PSCID>
     <generation>random</generation> 
     <structure>
         <seq type="static">PROJ</seq>
         <seq type="siteAbbrev"/>
         <seq type="numeric" minLength="4"/>
     </structure>
 </PSCID>
 ```
 
 Options for the `type` element of the `<seq>` tag are:
  - `siteAbbrev`: will draw from Alias field, in the `psc` table
  - `static`: will draw from the value defined in the `config.xml` file.
  - `numeric`: defines an integer, must be associated with a `minLength` element. 
  - `alphanumeric`: defines a string with letters and digits, must be associated with a `minLength` element.
  - `alpha`: defines a string with letters only, must be associated with a `minLength` element.
         
### Adding subprojects from the API
 _not yet available. See [API documentation](../../../API/) for latest additions_
