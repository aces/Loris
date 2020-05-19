# Troubleshooting Common Installation Errors

This guide assumes installation on any supported OS.  

This guide offers support for common issues faced when first installing LORIS. It is assumed that all installation steps provided have been 
correctly followed and that all required dependencies have been installed.

## Frontend Does Not Load/JavaScript changes not visible
The first thing to try is to run:

```bash
make
```

Alternatively, on development instances:

```bash
make dev
```

If that does not solve your issue, this could be because the Config table in the database is not pointing to the correct values. In this case, follow the following steps. 

1. Check the following values in the Config table via the MySQL backend.

   | Name | Label          | Value          |  
   | ---- | ----------- | ---------- |
   | base | Base           | $lorisRootDirectory |
   | host | Host           | $yourHostName  | 
    
   These values can be viewed by running the following commands:
    
   ```sql
    SELECT c.configID, cs.Name, cs.Label, c.value, cs.Description FROM Config c LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base');
    SELECT c.configID, cs.Name, cs.Label, c.value, cs.Description FROM Config c LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');
   ```

2. If they do not match the above format, update these values with the following commands on the MySQL command-line.

   ```sql
   UPDATE Config SET Value='$yourBasePath' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base');
   UPDATE Config SET Value='$yourHostName' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');
   ```

3. Check the base path does not have a trailing slash at the end. If it does, update its value to remove it.


## Frontend Stylesheets Issues
* Check/fix config paths via the mysql back-end


## Admin login issues
If have troubles to log in to LORIS with your admin user after an installation or upgrade, make sure your admin account record in the users table contains:                                                       
```  
Active = 'Y'
Pending_approval = 'N'
Password_expiry column value is later than today's date
```

You can also reset your admin password with the script [tools/resetpassword.php](https://github.com/aces/Loris/blob/master/tools/resetpassword.php).

```bash
php tools/resetpassword.php admin
```
