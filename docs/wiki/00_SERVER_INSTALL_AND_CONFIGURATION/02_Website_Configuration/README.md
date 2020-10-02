Web configuration.

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

## Configure study Variables  

### i. Subprojects or cohorts  

A project's subprojects or cohorts are defined in the Configuration module, which can be found in LORIS under the Admin menu. Click on "To configure study subprojects click here."  

You then click on "New SubprojectID", fill in the fields on the right, click save. Immediately refresh the page to view your new subproject. Clicking save more than once will register a duplicate subproject ID. If you create an extra ID, you will have to delete it from the database manually with an sql command. The process for adding a new project is identical.  

Note that [Visit labels](https://github.com/aces/Loris/wiki/Project-Customization#iii-visit-labels) must be defined separately for each subproject in the file project/config.xml  

> Do Not use underscore in any Visit label - the Imaging insertion pipeline will not be able to process your scans.  

If subjects are pre-natal, use the Estimated Date of Confinement (EDC) features (i.e. due date) instead of Date of Birth. This should enabled within the Configuration module in two places: first under the Study variables section set "Use EDC" to true for the entire Loris database, and second, "Use EDC" should be enabled in the subproject settings for each applicable subproject.  

### ii. If multiple Projects are involved in a study  

1. Enable multi-project support: In the Configuration module under the "Study variables" section, set the field "Use Projects" to true. After changing this setting, be sure to refresh the Configuration module page.  

2. To define Project labels and recruitment targets, within the Configuration module click on the link at the top of the page indicating "To configure study projects click here." For each project, enter the Project label and (optional) recruitment target, and click Save. Note that if your current page is titled "New Project", you cannot edit an existing project's settings, as you will instead be creating a new project. Deleting a defined project can be done through the project table in the MySQL back end.  

3. Define all projectID-subprojectID relationships by populating the project_rel table, e.g.  
```
INSERT INTO `project_rel` VALUES (1,1),(1,2),(2,3);
```  

### iii. Visit labels  
Visit labels or timepoints are defined in the file project/config.xml:  

```
  <visitLabel subprojectID="1">
      <generation>sequence</generation> 
      <regex>/^[A-Z0-9]{2}$/i</regex>
      <length>2</length>
      <suggest>V%value%</suggest>       <!--  %value% will be substituted for the next unique number  -->
      <labelSet>
          <item value="V1">V1 label description</item>   
          <item value="V2">V2 label description</tem>   
      </labelSet>
   </visitLabel>
```  

**Note:** <generation> can be set to either 'sequence' to show a drop-down select box of visit labels in the front end, or 'user' for manual entry into a text box. However, it is recommended to use 'sequence', and populate <labelSet> with one <item> per visit label, replacing %value% with {V1, V2, etc} per example above.  

### iv. Visit Windows
This table must be populated with visit labels - the Imaging Pipeline critically depends on this. To populate with visit labels, run tools/populate_visit_windows.php - or manually insert study-specific information:  

```SQL
  INSERT INTO Visit_Windows (Visit_label,  WindowMinDays, WindowMaxDays, OptimumMinDays, OptimumMaxDays, WindowMidpointDays) VALUES ('V1', '0', '100', '40', '60', '50');
```
If age is a not critical factor in study visit scheduling, define Min value as 0, and Max value as 2147483647 (this is the maximum integer size).  

### v. Customizable Participant Identifiers  
By default LORIS provides 2 different identifiers for each participant or subject:  

* CandID also known as the DCCID : is a unique randomized 6-digit numeric ID (e.g. '436792'). It is completely anonymous, and is assigned automatically by Loris upon participant registration.
* PSCID (Project Study Centre ID) is configurable, can be manually entered when registering a participant, and may contain the site abbreviation, followed by sequential or randomized digits (e.g. 'MTL0006')
The format of the PSCID must be configured in project/config.xml Also configure how PSCIDs are created for new subjects, in one of 3 ways: manually entered, sequentially generated, or randomly generated

1: (default) sequential to generate PSCID sequentially for each new participant registered  
```
  <PSCID> <!-- Ex 1: generation type is sequential-->
      <generation>sequential</generation> 
      <structure>
          <seq type="siteAbbrev"/><!-- will draw from Alias field, in psc table-->
          <seq type="numeric" minLength="4"/> <!-- Ex: AAA1111 note (siteAbbrev concatenated with a sequentially generated number) -->
      </structure>
  </PSCID>
```
2: To enable manual entry of the PSCID when registering a new participant, set the tag can be set to user:  
```
  <PSCID> <!-- Ex 2: generation type is user-defined -->
      <generation>user</generation> 
      <structure>
          <seq type="alphanumeric" minLength="4"/> <!-- Ex: AAA1-->
      </structure>
  </PSCID>
```
Example 3: random to generate PSCID with random numerical for each new participant registered  

  <PSCID> <!-- Ex 3: generation type is random-->
      <generation>random</generation> 
      <structure>
          <seq type="siteAbbrev"/>
          <seq type="numeric" minLength="4"/> <!-- Ex: AAA7623 -->
      </structure>
  </PSCID>
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