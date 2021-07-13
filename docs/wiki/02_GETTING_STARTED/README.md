Information required to get a project started after having configured it's LORIS entities. These are data collection elements (what we currently find in project MOPs)

- creating a candidate
- creating users
- starting a timepoint
- ...

## Create Front-end users

The installation script adds admin user/password, associated with a dummy email address which should be changed. Additional users and permissions are added in the User Accounts page. For clarity and uniqueness, it is recommended to use an email address as username.  

* To set/reset a user password, use the script [tools/resetpassword.php](https://github.com/aces/Loris/blob/main/tools/resetpassword.php)  

```SQL
GRANT ALTER, DROP, CREATE, UPDATE, INSERT, SELECT, DELETE, CREATE TEMPORARY TABLES, LOCK TABLES  on $dbname.* to 'lorisDBadmin'@'$dbhost' IDENTIFIED BY '$newpassword' WITH GRANT OPTION ;
```

lorisadmin is the Loris administrator Unix account. Developers may wish to have their own individual accounts.