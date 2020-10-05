# Web configuration

## Create front-end Users  

The installation script adds admin user/password, associated with a dummy email address which should be changed. Additional users and permissions are added in the User Accounts page. For clarity and uniqueness, it is recommended to use an email address as username.  

* To set/reset a user password, use the script [tools/resetpassword.php](https://github.com/aces/Loris/blob/master/tools/resetpassword.php)  


## Create back-end accounts  

Two types of back-end accounts are useful for administering Loris: MySQL accounts and Unix account.  

It is good practice to create a new MySQL user for developer purposes (e.g. lorisDBadmin) to execute all back-end transactions, both in configuration and in day-to-day operations (i.e. not MySQL root). This account should be distinct from the MySQL root user as well as distinct from the lorisuser account which the install script created with limited permissions for executing all transactions coming from Loris' PHP code (i.e. from front-end users' activity).  

```SQL
GRANT ALTER, DROP, CREATE, UPDATE, INSERT, SELECT, DELETE, CREATE TEMPORARY TABLES, LOCK TABLES  on $dbname.* to 'lorisDBadmin'@'$dbhost' IDENTIFIED BY '$newpassword' WITH GRANT OPTION ;
```  

lorisadmin is the Loris administrator Unix account. Developers may wish to have their own individual accounts.  

## Define Study Site

Study sites or centres are defined in the psc table, with one row per Project Study Centre (PSC). LORIS' default schema defines the first psc (CenterID=1) as the Data Coordinating Center or #DCC#. This site is used for testing database features using dummy data and is assumed by the codebase to store non-study data, and so it not recommended to modify or use this site for registering real study data.  

Populate additional sites using the following MySQL command-line :  
``` SQL
INSERT INTO psc (Name, Alias, MRI_alias, Study_site) VALUES ('Montreal','MTL','MTL','Y');
```
* The first study site will have its CenterID = 2  
* There cannot be more than one site with the same name  

## Useful Apache configuration options  
Session timeout, file upload maximum size, and other parameters can be configured in Apache by adding the following lines to your php.ini file:  

```
+session.gc_maxlifetime 10800
+max_execution_time     10800
+upload_max_filesize    1024M
+post_max_size          1024M
```  

## Security: Enabling SSL  

*Note: SSL is not fully supported for the Data Querying Tool. Individual Loris instances should set up their own SSL for their DQT couchapp hosting.*  

### Enable SSL module in apache  
`sudo a2enmod ssl`  

### Edit `/etc/apache2/sites-available/<project-name>`  
VirtualHost port: change to *:443 (ssl) instead of *:80 (http)  
Verify: SSL Engine On  
SSL certificate: ensure that you have an SSL certificate (contact us if you have questions)  

### Restart Apache  
`sudo /etc/init.d/apache2 restart`  