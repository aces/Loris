# Help and Troubleshooting

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