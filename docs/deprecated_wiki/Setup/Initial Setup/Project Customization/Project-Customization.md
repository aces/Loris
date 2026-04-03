**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[PROJECT CUSTOMIZATION|Project Customization]]**

***

1. [Database Configuration settings](#1-database-configuration-settings)
2. [Create front-end Users](#2-create-front-end-users)
3. [Create back-end accounts](#3-create-back-end-accounts)
4. [Define study Sites](#4-define-study-sites)
5. [Configure study Variables](#5-configure-study-variables)
6. [Useful Apache configuration options](#useful-apache-configuration-options)

***

This page covers how to set up Loris with basic parameters for research data.  

_Note for Developers:_ Modifying Loris code and overriding modules? See [[Code Customization]] page

### 1. Database Configuration settings

   Most configuration settings are managed via LORIS' front-end [Configuration Module](https://github.com/aces/Loris/wiki/Configuration-module-14.10) (Admin menu).  
Additional configuration settings are also found in the file _project/config.xml_  

  > Note: Settings found in _config.xml_ take precedence over the Configuration Module.  Older projects should ensure there is no overlap in settings between this file and the ConfigSettings table. 

#### Troubleshooting Configuration settings

   If Loris is having trouble with critical path settings impacting the front-end (e.g. finding the main codebase or the css), it may be difficult to use the front-end Configuration module to correct these path settings.  These path variables can also be accessed and updated via the back-end, where they are stored in the Config database table.  

   To view all configuration settings from the back-end, the following query can be run in the MySQL command line: 
   ```sql
    SELECT c.ConfigID, cs.Name, cs.Label, c.Value, cs.Description FROM Config c LEFT JOIN ConfigSettings cs ON (cs.ID=c.ConfigID);
   ```

> For setup troubleshooting, ConfigSettings under the `Paths` and `WWW` sections are important

View **path** settings (subset of configuration settings), the following query can be run in the MySQL command line: 

   ```sql
      SELECT c.ConfigID, cs.Name, cs.Label, c.Value, cs.Description FROM Config c LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) JOIN ConfigSettings csp ON (cs.Parent = csp.ID) WHERE csp.Name = 'paths';
   ```

View all **www** settings (subset of configuration settings), using the following query: 
   ```sql
      SELECT c.ConfigID, cs.Name, cs.Label, c.Value, cs.Description FROM Config c LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) JOIN ConfigSettings csp ON (cs.Parent = csp.ID) WHERE csp.Name = 'www';
   ```

   You may also need to change your URL and HOST settings, which you can do with these commands:
   ```sql
      UPDATE Config SET Value='$yourURL' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url');
      UPDATE Config SET Value='$yourHostName' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');
   ```

Tips: 
* ConfigSetting ***host*** value should not terminate in a slash.  E.g. "http://localhost" not "http://localhost/". To fix, run: (for http) `UPDATE Config SET Value='http://localhost' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');`
* If you get an error after clicking "Submit" or "Save data" on a form, check that ***url*** Config setting is set for your host. (Previous iterations of LORIS recommended setting this to the empty string)  Run: `UPDATE Config SET Value='_$yourhost_' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url');`
* If your dashboard loads but no other modules load, ensure that your apache config file (e.. centos: `/var/apache2/apache2.conf`) is set to `AllowOverride All` in the section `<Directory /var/www/>` to enable re-write rules (based on `htdocs/.htaccess`)
* ensure your `smarty/templates_c` directory is writable by apache
* run `composer update` to ensure your dependencies (including smarty) are up-to-date

### 2. Create front-end Users

   The installation script adds admin user/password, associated with a dummy email address which should be changed. Additional users and permissions are added in the User Accounts page. For clarity and uniqueness, it is recommended to use an email address as username. 
* To set/reset a user password, use the script [tools/resetpassword.php](https://github.com/aces/Loris/blob/master/tools/resetpassword.php)

   #### Troubleshooting user login
For any user to be able to log in to LORIS, their account record in the _users_ table must contain: 
* _Active_ = 'Y'
* _Pending_approval_ = 'N'
* _Password_expiry_ column value is later than today's date

### 3. Create back-end accounts 

   Two types of back-end accounts are useful for administering Loris: MySQL accounts and Unix account.

   It is good practice to create a new MySQL user for developer purposes (e.g. lorisDBadmin) to execute all back-end transactions, both in configuration and in day-to-day operations (i.e. not MySQL root).  This account should be distinct from the MySQL root user as well as distinct from the _lorisuser_ account which the install script created with limited permissions for executing all transactions coming from Loris' PHP code (i.e. from front-end users' activity). 

   ```sql
   GRANT ALTER, DROP, CREATE, UPDATE, INSERT, SELECT, DELETE, CREATE TEMPORARY TABLES, LOCK TABLES  on $dbname.* to 'lorisDBadmin'@'$dbhost' IDENTIFIED BY '$newpassword' WITH GRANT OPTION ;
   ```

_lorisadmin_ is the Loris administrator Unix account.  Developers may wish to have their own individual accounts.

### 4. Define study Sites

   Study sites or centres are defined in the **psc** table, with one row per Project Study Centre (PSC). 
   LORIS' default schema defines the first psc (CenterID=1) as the Data Coordinating Center or #DCC#.  This site is used for testing database features using dummy data and is assumed by the codebase to store non-study data, and so it not recommended to modify or use this site for registering real study data. 

   Populate additional sites using the following MySQL command-line :

   ```sql
   INSERT INTO psc (Name, Alias, MRI_alias, Study_site) VALUES ('Montreal','MTL','MTL','Y');
   ```

* The first study site will have its CenterID = **2**
* There cannot be more than one site with the same name

### 5. Configure study Variables

#### i. Subprojects or cohorts
   A project's **subprojects or cohorts** are defined in the Configuration module, which can be found in LORIS under the Admin menu.  Click on "To configure study subprojects click here."
  
   You then click on "New SubprojectID", fill in the fields on the right, click save.  Immediately refresh the page to view your new subproject.  Clicking save more than once will register a duplicate subproject ID. If you create an extra ID, you will have to delete it from the database manually with an sql command.  The process for adding a new project is identical.

   Note that **[[Visit labels|Project-Customization#iii-visit-labels]]** must be defined separately for each subproject in the file _project/config.xml_

> Do Not use underscore in any Visit label - the Imaging insertion pipeline will not be able to process your scans.

   If subjects are **pre-natal**, use the **Estimated Date of Confinement** (EDC) features (i.e. due date) instead of Date of Birth.  This should enabled within the Configuration module in two places: first under the Study variables section set "Use EDC" to true for the entire Loris database, and second, "Use EDC" should be enabled in the subproject settings for each applicable subproject.

#### ii. If multiple Projects are involved in a study

1. Enable multi-project support: In the Configuration module under the "Study variables" section, set the field "Use Projects" to true.  After changing this setting, be sure to refresh the Configuration module page.

2. To define Project labels and recruitment targets, within the Configuration module click on the link at the top of the page indicating "To configure study projects click here." 
For each project, enter the Project label and (optional) recruitment target, and click Save.  Note that if your current page is titled "New Project", you cannot edit an existing project's settings, as you will instead be creating a new project. Deleting a defined project can be done through the project table in the MySQL back end. 

3. Define all projectID-subprojectID relationships by populating the project_rel table, e.g.

         INSERT INTO `project_rel` VALUES (1,1),(1,2),(2,3);

#### iii. Visit labels

Visit labels or **timepoints** are defined in the file _project/config.xml_:

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

**Note:** `<generation>` can be set to either 'sequence' to show a drop-down select box of visit labels in the front end, or 'user' for manual entry into a text box. However, it is recommended to use 'sequence', and populate `<labelSet>` with one `<item>` per visit label, replacing %value% with {V1, V2, etc} per example above.

#### iv. Visit Windows

This table must be populated with visit labels - the Imaging Pipeline critically depends on this.  To populate with visit labels, run tools/populate_visit_windows.php - or manually insert study-specific information:

      INSERT INTO Visit_Windows (Visit_label,  WindowMinDays, WindowMaxDays, OptimumMinDays, OptimumMaxDays, WindowMidpointDays) VALUES ('V1', '0', '100', '40', '60', '50');

If age is a not critical factor in study visit scheduling, define Min value as 0, and Max value as 2147483647 (this is the maximum integer size).

#### v. Customizable Participant Identifiers

By default LORIS provides 2 different identifiers for each participant or subject: 
* **CandID** also known as the **DCCID** : is a unique randomized 6-digit numeric ID (e.g. '436792').  It is completely anonymous, and is assigned automatically by Loris upon participant registration. 
* **PSCID** (Project Study Centre ID) is configurable, can be manually entered when registering a participant, and may contain the site abbreviation, followed by sequential or randomized digits (e.g. 'MTL0006')

The format of the **PSCID** must be configured in _project/config.xml_ 
Also configure how PSCIDs are created for new subjects, in one of 3 ways: manually entered, sequentially generated, or randomly generated

1: (default) <generation> _sequential_ to generate PSCID sequentially for each new participant registered

      <PSCID> <!-- Ex 1: generation type is sequential-->
          <generation>sequential</generation> 
          <structure>
              <seq type="siteAbbrev"/><!-- will draw from Alias field, in psc table-->
              <seq type="numeric" minLength="4"/> <!-- Ex: AAA1111 note (siteAbbrev concatenated with a sequentially generated number) -->
          </structure>
      </PSCID>


2: To enable **manual entry** of the PSCID when registering a new participant,
set the <generation> tag can be set to _user_:

      <PSCID> <!-- Ex 2: generation type is user-defined -->
          <generation>user</generation> 
          <structure>
              <seq type="alphanumeric" minLength="4"/> <!-- Ex: AAA1-->
          </structure>
      </PSCID>


Example 3: <generation> _random_ to generate PSCID with random numerical for each new participant registered

      <PSCID> <!-- Ex 3: generation type is random-->
          <generation>random</generation> 
          <structure>
              <seq type="siteAbbrev"/>
              <seq type="numeric" minLength="4"/> <!-- Ex: AAA7623 -->
          </structure>
      </PSCID>

### 6. Useful Apache configuration options

   Session timeout, file upload maximum size, and other parameters can be configured in Apache by adding the following lines to your _php.ini_ file:

   ```
+session.gc_maxlifetime 10800
+max_execution_time     10800
+upload_max_filesize    1024M
+post_max_size          1024M
   ```

**[[NEXT: (3) Behavioural Database|Behavioural-Database]]**