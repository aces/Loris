# Database Configuration

## Creating the Database
MySQL or MariaDB must be installed and a `root` or admin-level user 
credential must be created before continuing. (This is not the same as a unix 
        `root` credential.) 

After running the install script, you will be prompted to visit the 
`installdb.php` page at the canonical domain of your LORIS instance.

Completing the form on this page will create a new database and user account
that will be used to execute transactions coming from LORIS's PHP code.

## Administrative Account

We recommend creating a separate administrative database account for sensitive
transactions. In practice, this means creating and deleting new tables in the
database. You'll need to do this when installing an instrument, for example.

After creating this account, you can run the command below to give
the administrative user the correct privileges.

e.g. For a user named `lorisDBadmin` with password `newpassword`:

```SQL
GRANT ALTER, DROP, CREATE, UPDATE, INSERT, SELECT, DELETE, CREATE TEMPORARY TABLES, LOCK TABLES  on $dbname.* to 'lorisDBadmin'@'$dbhost' IDENTIFIED BY 'newpassword' WITH GRANT OPTION;
```

This user's credentials should now be entered into your project's configuration file, `config.xml`
within the `adminUser` and `adminPassword` tags.
