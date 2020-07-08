A few things to know about Superuser privileges in Loris. 

* By default, every Loris has a front-end superuser called (userID:) **`admin`** (ID: `1`) who possesses all roles/permissions.

* The superuser "Role" is called "There can only be one Highlander" in the User Accounts module.
As with all user permissions, this permission is only visible to those who have it, and so that only users who have it can grant it to others. 


* When new permissions are added to your Loris, run this statement in MySQL to update _admin_'s permissions: 
```mysql
    INSERT IGNORE INTO `user_perm_rel` (userID, permID) SELECT DISTINCT 1, permID FROM permissions;
```

* `admin` is assigned to **site `DCC`** by default, and should be associated with each additional site via the User Accounts module. 
* Site `DCC` is the Data Coordinating Center, stored in the `psc` table with CenterID: `1`. _Do Not change this setting_.

As of LORIS 18.0, _admin_ can:
* register a candidate from any site (given _admin_ has been associated to the site)
* create a timepoint for a candidate from any site. 
* data entry in an instrument form, on a candidate/visit from any site 
