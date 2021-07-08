# Troubleshooting Common Installation Errors

This guide assumes installation on any supported OS, and was primarily written based on an Ubuntu 18 stack.  

This guide offers support for common issues faced when first installing LORIS. It is assumed that all installation steps provided have been 
correctly followed and that all required dependencies have been installed.

## MySQL 8 and PHP 7.3

If you are running into issues when setting up your MySQL or MySQL user account and you are using MySQL 8 and PHP 7.3 
(instead of PHP 7.4), please read [this link](https://www.php.net/manual/en/mysqli.requirements.php) and also [this](https://dev.mysql.com/doc/refman/8.0/en/upgrading-from-previous-series.html#upgrade-caching-sha2-password-compatible-connectors)

## Frontend Does Not Load/JavaScript changes not visible
The first command to try to run (under the _loris root_ directory):

```bash
make clean
```

Next, run one of the following commands depending on your environment:

```bash
make        # For production environments
make dev    # For development environments
```

If that does not solve your issue, this could be because the Config table in the database is not pointing to the correct values. In this case, follow the following steps. 

1. Check that the following values in the Config table are correct via the SQL backend.

   | Name | Label          | Value          |  
   | ---- | ----------- | ---------- |
   | base | Base           | $lorisRootDirectory |
   | host | Host           | $hostName  | 
    
   These values can be viewed by running the following commands:
    
   ```sql
    SELECT c.configID, cs.Name, cs.Label, c.value, cs.Description FROM Config c LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base');
    SELECT c.configID, cs.Name, cs.Label, c.value, cs.Description FROM Config c LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');
   ```

2. If the values displayed by these 2 commands do not match your _$lorisRootDirectory_ and _$hostName_, update them with the following commands on the SQL command-line.

   ```sql
   UPDATE Config SET Value='$lorisRootDirectory' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base');
   UPDATE Config SET Value='$hostName' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');
   ```

3. Check the base path does not have a trailing slash at the end. If it does, update its value to remove it.
4. Once the necessary changes have been made to your database, exit the MySQL backend and restart Apache before re-loading the frontend.


## Admin login issues
If you are unable to log in to LORIS with your admin user after an installation or upgrade, make sure your admin account record in the users table contains:                                                       
```  
Active = 'Y'
Pending_approval = 'N'
Password_expiry column value is later than today's date
```

You can also reset your admin password with the script [tools/resetpassword.php](https://github.com/aces/Loris/blob/main/tools/resetpassword.php).

```bash
php tools/resetpassword.php admin
```

## Troubleshooting Configuration settings  

If Loris is having trouble with critical path settings impacting the front-end (e.g. finding the main codebase or the css), it may be difficult to use the front-end Configuration module to correct these path settings. These path variables can also be accessed and updated via the back-end, where they are stored in the Config database table.  

To view all configuration settings from the back-end, the following query can be run in the MySQL command line:  

```SQL
SELECT c.ConfigID, cs.Name, cs.Label, c.Value, cs.Description FROM Config c LEFT JOIN ConfigSettings cs ON (cs.ID=c.ConfigID);
```

For setup troubleshooting, ConfigSettings under the Paths and WWW sections are important

View path settings (subset of configuration settings), the following query can be run in the MySQL command line:  

```SQL
SELECT c.ConfigID, cs.Name, cs.Label, c.Value, cs.Description FROM Config c LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) JOIN ConfigSettings csp ON (cs.Parent = csp.ID) WHERE csp.Name = 'paths';
```

View all www settings (subset of configuration settings), using the following query:  
```SQL
SELECT c.ConfigID, cs.Name, cs.Label, c.Value, cs.Description FROM Config c LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) JOIN ConfigSettings csp ON (cs.Parent = csp.ID) WHERE csp.Name = 'www';
```

You may also need to change your URL and HOST settings, which you can do with these commands:  

```SQL
UPDATE Config SET Value='$yourURL' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url');  
UPDATE Config SET Value='$yourHostName' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');
``` 

## Troubleshooting user login
For any user to be able to log in to LORIS, their account record in the users table must contain:  

* Active = 'Y'
* Pending_approval = 'N'
* Password_expiry column value is later than today's date  

## Tips:

* ConfigSetting host value should not terminate in a slash. E.g. "http://localhost" not "http://localhost/". To fix, run: (for http) UPDATE Config SET Value='http://localhost' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');
* If you get an error after clicking "Submit" or "Save data" on a form, check that url Config setting is set for your host. (Previous iterations of LORIS recommended setting this to the empty string) Run: UPDATE Config SET Value='_$yourhost_' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url');
* If your dashboard loads but no other modules load, ensure that your apache config file (in CentOS: /var/apache2/apache2.conf) is set to AllowOverride All in the section <Directory /var/www/> to enable re-write rules (based on htdocs/.htaccess)
* ensure your smarty/templates_c directory is writable by apache
* run composer update to ensure your dependencies (including smarty) are up-to-date