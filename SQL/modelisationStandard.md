### Overview

This document details the modeling convention to use for tables, fields and constraints in the Loris SQL database. These guidelines should be followed when submitting a Pull Request to the Loris repository as well as when reviewing the PR of a peer developer.

***Disclosure:** Due to the previous lack of standard in modeling, we acknowledge that existing tables do not abide by the rules described below. As the codebase and database are being cleaned-up, the existing infrastructure will be re-designed to follow this guideline.*

### Table

*Casing:* **snake_case** 1 clear vote
*Casing:* **UpperCamelCase** 1 clear vote

*Singular:* **Yes**
*Language:* **English** 

*Conventions*:
- Start with an upper case letter.
- Do not use underscore.
- The table name should be in English in order to be understanded by most. 
- Do not use abreviation unless the length would be more than 30 characters.
- When choosing the name of a table containing data for a **single entity in Loris** such as a *Candidate*, *Session*, *User*, ... 
  - *The name of the table should be a noun, as concise as possible and singular. Recommended names for these entities are `candidate`, `session` and `user`.*
  - When a single word is not sufficient to describe a table, the ordering of the words in the name should reveal the concern of the table in a broad-to-specific manner. 
     - *i.e. A table containing the consent information of a candidate would be named `candidate_consent`, candidate being the broader concern and just `consent` is not sufficiently informative to rule out user consents and examiner consents . A table containing the consent types would be called as such `consent_type`.*
     - When creating a table representing a **relation between two or more tables**. Regardless of the relation type (one-to-many, many-to-one or one-to-one), the table should have a composite name as such `table1_table2_rel`.
        - *i.e. the table mapping users to their permissions would be named `user_permission_rel` where `user` is the name of the Users' entity table and `permission` is the name of the Permissions' entity table*

### Field

*Casing:* **snake_case** 1 clear vote
*Casing:* **lowerCamelCase** 1 clear vote

*Singular:* **Yes**

*Conventions*:
- Start with a lower case letter.
- Do not use underscore.
- The attribute name should be in English in order to be understanded by most. 
- Do not use abreviation unless the length would be more than 30 characters.
- Do not use ENUM fields. Instead use a lookup table to refer to possible choices.
- When naming the **primary identifier field** of a table, the name should be id --- composed as such `table_name_id`.
   - *i.e. the name of the primary identifier of the `candidate` table should be `candidate_id`.*
   - When adding a field which serves as a **foreign key to another table** in the database, the field should follow the same convention as above `reference_table_name_id`. This allows for simpler joining in SQL queries and for easier readability.
      - *i.e. The session table would have a primary identifier field named `session_id` and a foreign key reference to the `candidate` table with a field named `candidate_id`.*
      - Date fields should not be name `date` but be more consise like `dateStart`. `Date` should be at the beginning of the name. 
       



## Field Ordering

- Primary key attribute is always the first field.
- Fix size attributes are to be positioned before variable size attributes.
     1 Numeric, Date, Char
     2 Varchar (indexed field first)
     3 Text, Json
     4 Blob
- Mandatory attributes should be place before optional attributes of the same type.


### Constraints

*Casing:* **snake_case**
*Casing:* **lowerCamelCase**

*Singular:* **Yes**

*Conventions*:
- All constraint should be specificaly named, do not rely on default naming.
- All name are to be of that format:
 - **Primary key** `<tableName>idPK`
 - **Unique key** `<tableName><ColumnNameUK>
 - **Foreign key** `<tableName><ColemnName><RefTableName><refTableName>FK`  `<tableName><ColemnName>_<RefTableName><refTableName>FK`
 - **Check constraint** `<tableName><ColumnName><check>CK`
- All foreign key constraint definition should contain `ON DELETE` and `ON UPDATE` clause. Do not rely on default.

### Other parameters
- Be explicit over implicit. 
- Engine should be InnoDB for all tables unless specific requirement demand. `ENGINE=InnoDB`.
- Charater set is UTF-8 `CHARSET=utf8`.


