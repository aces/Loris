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

Tips:

* ConfigSetting host value should not terminate in a slash. E.g. "http://localhost" not "http://localhost/". To fix, run: (for http) UPDATE Config SET Value='http://localhost' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');  
* If you get an error after clicking "Submit" or "Save data" on a form, check that url Config setting is set for your host. (Previous iterations of LORIS recommended setting this to the empty string) Run: UPDATE Config SET Value='_$yourhost_' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url');
* If your dashboard loads but no other modules load, ensure that your apache config file (e.. centos: /var/apache2/apache2.conf) is set to AllowOverride All in the section <Directory /var/www/> to enable re-write rules (based on htdocs/.htaccess)
* ensure your smarty/templates_c directory is writable by apache
* run composer update to ensure your dependencies (including smarty) are up-to-date  

## Backups  

Database backups are imperative. There are many ways to automate the creation of backsup, using bash tools such as rsync and taking advantage of cronjobs.  

One example set-up is to perform a `mysqldump` once every week. To do this, open `/etc/crontab` with a text editor and add the following line:  

```
0 0 0 0 sun mysqldump --user=USER --host=DBHOSTURL --password=PASSWORD DBNAME > /home/lorisadmin/backups/`date +%Y-%m-%d.sql`;
```

This will create a weekly backup in `~/backups`. This should be copied over to `/data/$project/data` to preserve hard disk space.  