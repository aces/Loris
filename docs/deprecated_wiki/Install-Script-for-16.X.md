**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[INSTALL SCRIPT|Install Script]]**

***

For ***Loris 17+*** please see the [Readme](https://github.com/aces/Loris/tree/master) and new [Wiki Install](https://github.com/aces/Loris/wiki/Installing-Loris) page for more details. 

> ***Caveat:*** The following notes reflect the ***Loris 16.0*** release (spring 2016)

***

1. [Notes on Operating systems and Dependencies](#Notes-on-Operating-systems-and-Dependencies)
2. [Running the Install Script](#Running-the-InstallScript)
3. [Troubleshooting](#troubleshooting)

***

## Notes on Operating systems and Dependencies 

### Ubuntu 
* The main [[Loris Readme|https://github.com/aces/Loris/blob/master/README.md]] will cover most Ubuntu installations.
* The install script should install Composer and dependencies including smarty3.  There is no need to install these dependencies before running the install script.  
* Note that PHP 7 and MySQL 5.7 are recommended for LORIS 17.0 (Fall 2016);  for Loris 16.* (Spring 2016) PHP *5.6* and MySQL *5.6* are the highest supported versions.

### CentOS 
For CentOS 6 systems a separate [[CentOS Readme|https://github.com/aces/Loris/blob/master/README.CentOS6.md]] is available.

### Mac OSX
* _Mac is not actively supported as of release 15.10_

For Mac OSX installations, a [[Mac Readme|https://raw.githubusercontent.com/aces/Loris/master/README.Mac.md]] was developed for release 15.04. It has not been updated for subsequent releases, e.g. for newer dependencies such as Composer.  Users attempting Mac install may also find Apache setup changes for El Capitan. 

## Running the Install Script 
The Install script and web-based installer is designed to be run on Ubuntu (14+) or CentOS systems. 

**_Before continuing further --_**  
Please ensure you have already completed the preceding steps 1 and 2 in the [Readme](https://github.com/aces/Loris). 

The install script will ask for the following input and will offer the following choices: 

  1) Your project directory name.   
     (Will be used to modify the paths for Imaging data in the generated
     config.xml file for LORIS, and may also be used to automatically
     create/install apache config files.)

This should be the directory name created in Step 1 of the main Readme, e.g. "loris" from /var/www/_loris_

  2) MySQL Database name. 
     If an empty database has not already been created for your project, 
     choose a simple name such as "LORIS" or "Abc_Def"

  3) Hostname for the machine running MySQL server where the database
     is or will be located.

  4) A new MySQL username that the LORIS system will use to connect
     to this server and database to perform frontend-backend transactions.  
     This script will ask to create this user. 
     Recommended: "lorisuser"

  5) Host address of this machine - from which LORIS system will be connecting 
     (Where Apache is installed)
This should not end in a slash.  e.g. "http://localhost" _not_ "http://localhost/"

  6) A new password for the "lorisuser" MySQL username

  7) Another new password for the 'admin' frontend Loris user account.
     This 'admin' account will be the superuser Loris' web-accessible platform.

  8) Credentials of an existing MySQL account with root or superuser privileges, 
     capable of creating the database, or installing the schema, 
     or creating users on the given database. 
     This will only be used to create the database, install the schema, 
     and/or create and grant privileges to the "lorisuser" MySQL user. 

If you have mysql root access, provide that root account credential.  If you have another account that can create databases, create/drop tables. 

## Troubleshooting 

If re-running the Install script, remove (rename) the config.xml file stored in the project/ directory.  If this file exists, the install script will abort. 

For Ubuntu installations, if any difficulties are encountered in the install script, [[Composer|https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx]] can be manually installed thus: 
To manually install [[Composer|https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx]]
```bash
  curl -sS https://getcomposer.org/installer | php;
  sudo mv composer.phar /usr/local/bin/composer
  composer install
```

Running _composer install_ may fail if you do not have a project/libraries directory created: 
```
   cd /var/www/loris/
   mkdir -p project/libraries
   composer install # try again
```

``` 
NOTE: Smarty 3 is installed by Composer. For Ubuntu the recommended smarty3 package can be manually installed using: 
> apt-get install smarty3
```

Once your install script has finished running, **if your Loris does not load**:
* Check your apache logs.  e.g. Ubuntu: /var/log/apache2/_$project_-error.log and _$project_-access.log

* If you see a PHP Fatal error about DateTime -- set your timezone in your php.ini file.  The error usually looks like this:

> PHP Fatal error:  Uncaught exception 'Exception' with message 'DateTime::__construct() ...

* Verify your Loris Configuration settings in the database -- see [[Troubleshooting Configuration|Project-Customization#troubleshooting-configuration-settings]] notes

**[[NEXT: (2) Project Customization|Project Customization]]**